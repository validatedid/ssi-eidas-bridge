/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as forge from "node-forge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getKeyFromP12 = (p12: any, password: string): string => {
  const keyData = p12.getBags(
    { bagType: forge.pki.oids.pkcs8ShroudedKeyBag },
    password
  );
  let pkcs8Key = keyData[forge.pki.oids.pkcs8ShroudedKeyBag][0];

  if (typeof pkcs8Key === "undefined") {
    // eslint-disable-next-line prefer-destructuring
    pkcs8Key = keyData[forge.pki.oids.keyBag][0];
  }

  if (typeof pkcs8Key === "undefined") {
    throw new Error("Unable to get private key.");
  }

  let pemKey = forge.pki.privateKeyToPem(pkcs8Key.key);
  pemKey = pemKey.replace(/\r\n/g, "");

  return pemKey;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCertificateFromP12 = (p12: any): { pemCertificate: string[] } => {
  const certData = p12.getBags({ bagType: forge.pki.oids.certBag });

  const pemCertificate = certData[forge.pki.oids.certBag].map((certificate) =>
    forge.pki.certificateToPem(certificate.cert).replace(/\r\n/g, "")
  );

  return { pemCertificate };
};

const convertToPem = (
  p12base64: string,
  password: string
): { pemKey: string; pemCertificate: string[] } => {
  const p12Asn1 = forge.asn1.fromDer(p12base64);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

  const pemKey = getKeyFromP12(p12, password);
  const { pemCertificate } = getCertificateFromP12(p12);

  return { pemKey, pemCertificate };
};

const parseP12File = (
  p12File: string,
  password: string
): { pemCert: string[]; pemPrivateKey: string } => {
  const result = convertToPem(p12File, password);
  return { pemCert: result.pemCertificate, pemPrivateKey: result.pemKey };
};

const getPemPublicKeyfromPemCert = (pemCert: string): string => {
  const cert = forge.pki.certificateFromPem(pemCert);
  return forge.pki.publicKeyToPem(cert.publicKey);
};

export { parseP12File, getPemPublicKeyfromPemCert };
