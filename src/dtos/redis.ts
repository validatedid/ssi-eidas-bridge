import * as keys from "./keys";

export interface RedisInsertion {
  eidasKey: string;
  firstInsertion: boolean;
}

export interface EidasKeysData {
  p12: Buffer;
  keyType: keys.KeyType;
  keyCurve?: keys.Curves;
}
