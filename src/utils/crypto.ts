const parseP12File = (
  p12File: Buffer
): { pemCert: string; pemPrivateKey: string } => {
  return { pemCert: "", pemPrivateKey: "" };
};

export default parseP12File;
