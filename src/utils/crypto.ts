import * as forge from "node-forge";

export function convertToPem(p12base64: string, password: string) {
  const p12Asn1 = forge.asn1.fromDer(p12base64);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

  const pemKey = getKeyFromP12(p12, password);
  const { pemCertificate } = getCertificateFromP12(p12);

  return { pemKey, pemCertificate };
}

function getKeyFromP12(p12: any, password: string) {
  const keyData = p12.getBags(
    { bagType: forge.pki.oids.pkcs8ShroudedKeyBag },
    password
  );
  let pkcs8Key = keyData[forge.pki.oids.pkcs8ShroudedKeyBag][0];

  if (typeof pkcs8Key === "undefined") {
    pkcs8Key = keyData[forge.pki.oids.keyBag][0];
  }

  if (typeof pkcs8Key === "undefined") {
    throw new Error("Unable to get private key.");
  }

  let pemKey = forge.pki.privateKeyToPem(pkcs8Key.key);
  pemKey = pemKey.replace(/\r\n/g, "");

  return pemKey;
}

function getCertificateFromP12(p12: any) {
  const certData = p12.getBags({ bagType: forge.pki.oids.certBag });

  const pemCertificate = certData[forge.pki.oids.certBag].map((certificate) =>
    forge.pki.certificateToPem(certificate.cert).replace(/\r\n/g, "")
  );

  return { pemCertificate };
}

const parseP12File = (
  p12File: string,
  password: string
): { pemCert: string | string[]; pemPrivateKey: string } => {
  const result = convertToPem(p12File, password);
  console.warn(result);
  return { pemCert: result.pemCertificate, pemPrivateKey: result.pemKey };
};

export default parseP12File;
