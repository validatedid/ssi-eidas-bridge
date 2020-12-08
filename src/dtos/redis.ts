import constants from "../@types";

export interface RedisInsertion {
  eidasKey: string;
  firstInsertion: boolean;
}

export interface EidasKeysData {
  p12: Buffer;
  keyType: constants.KeyType;
  keyCurve?: constants.Curves;
}
