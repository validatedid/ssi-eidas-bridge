import constants from "../@types";

export interface RedisInsertion {
  eidasKeysData: EidasKeysData;
  firstInsertion: boolean;
}

export interface EidasKeysData {
  p12: string; // hexadecimal string
  keyType: constants.KeyType;
  keyCurve?: constants.Curves;
  did?: string;
}
