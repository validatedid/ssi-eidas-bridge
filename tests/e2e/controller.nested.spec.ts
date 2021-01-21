import Redis from "ioredis";
import fs from "fs";
import path from "path";
import Controller from "../../src/api/eidas/controller";
import { SignPayload } from "../../src/dtos/secureEnclave";
import * as mockedData from "../data/credentials";
import { Proof } from "../../src/dtos/eidas";
import redis from "../../src/libs/storage/redis";

describe("controller tests should", () => {
  afterAll(async () => {
    await redis.quit();
  });

  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";
  const signPayload: SignPayload = {
    issuer: mockDid,
    payload: mockedData.mockCredential,
    password: "vidchain",
  };
  const fileDataHex = Buffer.from(
    fs.readFileSync(path.join(__dirname, `${testFilePathSelfSigned}${p12File}`))
  ).toString("hex");

  it("create a proof from a given credential", async () => {
    expect.assertions(2);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
      });
    });
    const response = await Controller.EIDASsignature(signPayload);
    expect(response).toBeDefined();
    expect(response.proof).toBeDefined();
    jest.resetAllMocks();
  });
  it("create a proof from a given credential with proof", async () => {
    expect.assertions(3);
    const proof: Proof = {
      type: "EcdsaSecp256k1Signature2019",
      created: "1970-01-19T13:56:26.946Z",
      proofPurpose: "assertionMethod",
      verificationMethod:
        "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
      jws:
        "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODY5NDYsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4QTUxMzVhYTA3ODg2MzVFZTQ5NTJERWFCRmEzZGE5OGJGNTk5OUJFMSJ9.CcIAc7C1Z1BsvjLO7y5XpSNqhvrcVXxSxpkRY0-o2mfSCebKhMK4f4g2lP-4Yf_fVzL_SmWKO05jeLAJnE6BBwA",
    };
    signPayload.payload.proof = proof;
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
      });
    });
    const response = await Controller.EIDASsignature(signPayload);
    expect(response).toBeDefined();
    expect(response.proof).toBeDefined();
    expect(response.proof).toHaveLength(2);
    jest.resetAllMocks();
  });
  it("create a proof from a given credential with multiple proofs", async () => {
    expect.assertions(3);
    const proofs: Proof[] = [
      {
        type: "EcdsaSecp256k1Signature2019",
        created: "1970-01-19T13:56:26.946Z",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
        jws:
          "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODY5NDYsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4QTUxMzVhYTA3ODg2MzVFZTQ5NTJERWFCRmEzZGE5OGJGNTk5OUJFMSJ9.CcIAc7C1Z1BsvjLO7y5XpSNqhvrcVXxSxpkRY0-o2mfSCebKhMK4f4g2lP-4Yf_fVzL_SmWKO05jeLAJnE6BBwA",
      },
      {
        type: "EcdsaSecp256k1Signature2019",
        created: "1970-01-19T13:56:27.203Z",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
        jws:
          "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODcyMDMsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4YUQ5NzEwMzQ3Y0NFYzkyQ2EwYTU3NGQwOTk4NEViMjVGQTk5QTE4ZCJ9.cYH6GtDusTbdrU_rrIUiiL5gBiPcKOc7g4Sq1J4-cACAWhu-UjuincJS35bTseylK5f0_XRYWuSpeKFAddndjwA",
      },
    ];
    signPayload.payload.proof = proofs;
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
      });
    });
    const response = await Controller.EIDASsignature(signPayload);
    expect(response).toBeDefined();
    expect(response.proof).toBeDefined();
    expect(response.proof).toHaveLength(3);
    jest.resetAllMocks();
  });
});
