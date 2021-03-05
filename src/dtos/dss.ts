import { DiagnosticData } from "./dssDiagnostic";

export interface DssVerificationInput {
  signedDocument: SignedDocument;
  originalDocuments: null | string;
  policy: null | string;
  tokenExtractionStrategy: string;
  signatureId: null | string;
}

export interface SignedDocument {
  bytes: string;
  digestAlgorithm: null | string;
  name: string;
}

export interface DssVerificationOutput {
  validationReportDataHandler: string;
  DiagnosticData: DiagnosticData;
  SimpleReport: SimpleReport;
  DetailedReport: Record<string, unknown>;
}

export interface SimpleReport {
  ValidationPolicy: ValidationPolicy;
  DocumentName: string;
  ValidSignaturesCount: number;
  ContainerType: null | string;
  signatureOrTimestamp: SignatureOrTimestamp[];
  Semantic: null | string;
  ValidationTime: string;
}

export interface ValidationPolicy {
  PolicyName: string;
  PolicyDescription: string;
}

interface Timestamp {
  [key: string]: Record<string, unknown>;
}
export interface SignatureOrTimestamp {
  Signature?: Signature;
  Timestamp?: Timestamp;
}

export interface Signature {
  SigningTime: Date;
  BestSignatureTime: Date;
  SignedBy: string;
  SignatureLevel: SignatureLevel;
  SignatureScope: SignatureScope[];
  Filename: null;
  CertificateChain: CertificateChain;
  Indication: string;
  SubIndication: null;
  Errors: any[];
  Warnings: string[];
  Infos: any[];
  Id: string;
  CounterSignature: null;
  ParentId: null;
  SignatureFormat: string;
  ExtensionPeriodMin: Date;
  ExtensionPeriodMax: Date;
}

export interface CertificateChain {
  Certificate: Certificate[];
}

export interface Certificate {
  id: string;
  qualifiedName: string;
}

export interface SignatureLevel {
  value: string;
  description: string;
}

export interface SignatureScope {
  value: string;
  name: string;
  scope: string;
}
