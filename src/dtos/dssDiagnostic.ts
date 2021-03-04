export interface DiagnosticData {
  DocumentName: string;
  ValidationDate: Date;
  ContainerInfo: null;
  Signature: Signature[];
  Certificate: any[];
  Revocation: any[];
  Timestamp: any[];
  OrphanTokens: null;
  SignerData: any[];
  TrustedList: any[];
}

export interface Signature {
  Id: string;
  DAIdentifier: null;
  SignatureFilename: string;
  ErrorMessage: null;
  ClaimedSigningTime: Date;
  SignatureFormat: string;
  StructuralValidation: StructuralValidation;
  DigestMatcher: DigestMatcher[];
  BasicSignature: BasicSignature;
  SigningCertificate: SigningCertificate;
  ChainItem: ChainItem[];
  ContentType: string;
  MimeType: null;
  ContentIdentifier: null;
  ContentHints: null;
  SignatureProductionPlace: null;
  CommitmentTypeIndication: any[];
  SignerRole: any[];
  Policy: null;
  SignaturePolicyStore: null;
  SignerInfo: SignerInfo[];
  PDFRevision: null;
  SignerDocumentRepresentations: SignerDocumentRepresentations;
  FoundCertificates: FoundCertificates;
  FoundRevocations: FoundRevocations;
  FoundTimestamp: any[];
  SignatureScope: SignatureScope[];
  SignatureDigestReference: SignatureDigestReference;
  DataToBeSignedRepresentation: DataToBeSignedRepresentation;
  SignatureValue: string;
  CounterSignature: null;
  Parent: null;
  Duplicated: null;
}

export interface BasicSignature {
  EncryptionAlgoUsedToSignThisToken: string;
  KeyLengthUsedToSignThisToken: string;
  DigestAlgoUsedToSignThisToken: string;
  MaskGenerationFunctionUsedToSignThisToken: null;
  SignatureIntact: boolean;
  SignatureValid: boolean;
}

export interface ChainItem {
  Certificate: string;
}

export interface DataToBeSignedRepresentation {
  DigestMethod: string;
  DigestValue: string;
  match: boolean | null;
}

export interface DigestMatcher {
  DataFound: boolean;
  DataIntact: boolean;
  DigestMethod: string;
  DigestValue: string;
  match: null;
  type: string;
  name: null;
  duplicated: null;
}

export interface FoundCertificates {
  RelatedCertificate: RelatedCertificate[];
  OrphanCertificate: any[];
}

export interface RelatedCertificate {
  Origin: string[];
  CertificateRef: CertificateRef[];
  Certificate: string;
}

export interface CertificateRef {
  Origin: string;
  IssuerSerial: IssuerSerial;
  DigestAlgoAndValue: DataToBeSignedRepresentation;
  SerialInfo: null;
}

export interface IssuerSerial {
  value: string;
  match: boolean;
}

export interface FoundRevocations {
  RelatedRevocation: any[];
  OrphanRevocation: any[];
}

export interface SignatureDigestReference {
  CanonicalizationMethod: null;
  DigestMethod: string;
  DigestValue: string;
}

export interface SignatureScope {
  Scope: string;
  Name: string;
  Description: string;
  Transformation: null;
  SignerData: string;
}

export interface SignerDocumentRepresentations {
  HashOnly: boolean;
  DocHashOnly: boolean;
}

export interface SignerInfo {
  IssuerName: string;
  SerialNumber: number;
  Ski: null;
  Current: boolean;
}

export interface SigningCertificate {
  PublicKey: null;
  Certificate: string;
}

export interface StructuralValidation {
  Message: any[];
  valid: boolean;
}
