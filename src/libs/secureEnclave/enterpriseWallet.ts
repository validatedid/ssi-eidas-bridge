import redis from "../storage/redis";
import { EidasKeysData } from "../../dtos/redis";
import { ApiErrorMessages, BadRequestError, InternalError } from "../../errors";
import { eidasCrypto } from "../../utils";
import { signCadesRsa } from "./cades";
import { CadesSignatureInput, CadesSignatureOutput } from "../../dtos/cades";
import constants from "../../@types";
import { WalletBuilderOptions } from "../../dtos/wallet";
import { canonizeCredential } from "../../utils/ssi";

export default class EnterpriseWallet {
  private constructor(
    private issuerPemCert: string[],
    private issuerPemPrivateKey: string,
    private issuerKeyType: constants.KeyType,
    private issuerKeyCurve?: constants.Curves
  ) {}

  static async createInstance(
    options: WalletBuilderOptions
  ): Promise<EnterpriseWallet> {
    if (!options || !options.did || !options.password)
      throw new BadRequestError(ApiErrorMessages.WALLET_BUILDER_BAD_PARAMS);

    let storedData: EidasKeysData;
    try {
      const data = await redis.get(options.did);
      storedData = JSON.parse(data) as EidasKeysData;
    } catch (error) {
      throw new InternalError(
        `${ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA} : ${
          (error as Error).message
        }`
      );
    }

    if (
      !storedData.p12 ||
      !storedData.keyType ||
      (storedData.keyType === constants.KeyTypes.EC && !storedData.keyCurve) ||
      (storedData.keyType === constants.KeyTypes.OKP && !storedData.keyCurve)
    )
      throw new InternalError(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);

    const parsedData = eidasCrypto.parseP12File(
      Buffer.from(storedData.p12).toString("binary"),
      options.password
    );
    if (!parsedData || !parsedData.pemCert || !parsedData.pemPrivateKey)
      throw new InternalError(ApiErrorMessages.ERROR_PARSING_P12_DATA);
    return new this(
      parsedData.pemCert,
      parsedData.pemPrivateKey,
      storedData.keyType,
      storedData.keyCurve
    );
  }

  async eSeal(payload: Record<string, unknown>): Promise<CadesSignatureOutput> {
    if (this.issuerKeyType !== constants.KeyTypes.RSA)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.KEY_TYPE_NOT_SUPPORTED,
      });

    // TODO: sign with all certificate list
    const inputCades: CadesSignatureInput = {
      data: await canonizeCredential(payload),
      pemCert: this.issuerPemCert[0],
      pemPrivKey: this.issuerPemPrivateKey,
    };
    return signCadesRsa(inputCades);
  }
}
