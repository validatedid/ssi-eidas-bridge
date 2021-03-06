import redis from "../storage/redis";
import { EidasKeysData } from "../../dtos/redis";
import { ApiErrorMessages, BadRequestError } from "../../errors";
import { eidasCrypto } from "../../utils";
import { signCadesRsa } from "./cades";
import { CadesSignatureInput, CadesSignatureOutput } from "../../dtos/cades";
import { WalletBuilderOptions } from "../../dtos/wallet";
import { calculateLdProofHashforVerification } from "../../utils/ssi";
import { EidasProof, Credential } from "../../dtos/eidas";

export default class EnterpriseWallet {
  private constructor(
    private issuerPemCert: string[],
    private issuerPemPrivateKey: string
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
      throw new BadRequestError(
        `${ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA} : ${
          (error as Error).message
        }`
      );
    }

    if (!storedData || !storedData.eidasQec)
      throw new BadRequestError(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);

    try {
      const parsedData = eidasCrypto.parseP12File(
        Buffer.from(storedData.eidasQec, "hex"),
        options.password
      );
      if (!parsedData || !parsedData.pemCert || !parsedData.pemPrivateKey)
        throw new BadRequestError(ApiErrorMessages.ERROR_PARSING_P12_DATA);
      return new this(parsedData.pemCert, parsedData.pemPrivateKey);
    } catch (error) {
      throw new BadRequestError(
        `${ApiErrorMessages.ERROR_PARSING_P12_DATA} : ${
          (error as Error).message
        }`
      );
    }
  }

  getIssuerPemCert(): string {
    return this.issuerPemCert[0];
  }

  async eSeal(
    payload: Credential,
    proofOptions: EidasProof
  ): Promise<CadesSignatureOutput> {
    // TODO: sign with all certificate list
    const dataToBeSigned: Buffer = await calculateLdProofHashforVerification(
      payload,
      proofOptions
    );
    const dataToBeSignedHex = dataToBeSigned.toString("hex");
    const inputCades: CadesSignatureInput = {
      created: proofOptions.created,
      data: dataToBeSignedHex,
      pemCert: this.issuerPemCert[0],
      pemPrivKey: this.issuerPemPrivateKey,
    };
    return signCadesRsa(inputCades);
  }
}
