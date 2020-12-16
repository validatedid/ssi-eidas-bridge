import constants from "../@types";

export interface RedisInsertion {
  eidasKeysData: EidasKeysData;
  firstInsertion: boolean;
}

export interface EidasKeysData {
  did: string; // As soon as auth is implemented this info can be retrieved from token
  p12: Buffer;
  keyType: constants.KeyType;
  keyCurve?: constants.Curves;
}
