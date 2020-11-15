import Controller from "../../../src/api/eidas/controller";
import { SignPayload } from "../../../src/dtos/secureEnclave";

describe("controller tests should", () => {
  it("create a proof from a given credential", async () => {
    expect.assertions(3);
    const signPayload: SignPayload = {
      issuer: "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D",
      type: "EidasSeal2019",
      payload: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://api.vidchain.net/credentials/verifiableId/v1",
        ],
        id: "vid:type-version-of-the-credential",
        type: ["VerifiableCredential", "VerifiableID"],
        issuer: "did:vid:0x5208431C6EC2ec4097aeA7182bB92d018766498c",
        issuanceDate: "2019-06-22T14:11:44Z",
        expirationDate: "2019-06-22T14:11:44Z",
        credentialSubject: {
          id: "did:vid:0x8707CCa835C961334D3F6450C6a61a0AD6592460",
          firstName: "Eva",
          lastName: "Monroe",
          gender: "Female",
          dateOfBirth: "12/11/1970",
          placeOfBirth: "Madrid",
          currentAddress: "Arago 179 4a",
          city: "Barcelona",
          state: "Catalunya",
          zip: "08011",
        },
      },
    };
    const response = await Controller.EIDASsignature(signPayload);
    expect(response).toBeDefined();
    expect(response.vc).toBeDefined();
    expect(response.vc.proof).toBeDefined();
  });
  it("create a proof from a given credential with proof", async () => {
    expect.assertions(4);
    const signPayload: SignPayload = {
      issuer: "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D",
      type: "EidasSeal2019",
      payload: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://api.vidchain.net/credentials/verifiableId/v1",
        ],
        id: "vid:type-version-of-the-credential",
        type: ["VerifiableCredential", "VerifiableID"],
        issuer: "did:vid:0x5208431C6EC2ec4097aeA7182bB92d018766498c",
        issuanceDate: "2019-06-22T14:11:44Z",
        expirationDate: "2019-06-22T14:11:44Z",
        credentialSubject: {
          id: "did:vid:0x8707CCa835C961334D3F6450C6a61a0AD6592460",
          firstName: "Eva",
          lastName: "Monroe",
          gender: "Female",
          dateOfBirth: "12/11/1970",
          placeOfBirth: "Madrid",
          currentAddress: "Arago 179 4a",
          city: "Barcelona",
          state: "Catalunya",
          zip: "08011",
        },
        proof: {
          type: "EidasSeal2019",
          created: "1970-01-19T13:56:26.946Z",
          proofPurpose: "assertionMethod",
          verificationMethod:
            "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
          jws:
            "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODY5NDYsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4QTUxMzVhYTA3ODg2MzVFZTQ5NTJERWFCRmEzZGE5OGJGNTk5OUJFMSJ9.CcIAc7C1Z1BsvjLO7y5XpSNqhvrcVXxSxpkRY0-o2mfSCebKhMK4f4g2lP-4Yf_fVzL_SmWKO05jeLAJnE6BBwA",
        },
      },
    };
    const response = await Controller.EIDASsignature(signPayload);
    expect(response).toBeDefined();
    expect(response.vc).toBeDefined();
    expect(response.vc.proof).toBeDefined();
    expect(response.vc.proof).toHaveLength(2);
  });
  it("create a proof from a given credential with multiple proofs", async () => {
    expect.assertions(4);
    const signPayload: SignPayload = {
      issuer: "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D",
      type: "EidasSeal2019",
      payload: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://api.vidchain.net/credentials/verifiableId/v1",
        ],
        id: "vid:type-version-of-the-credential",
        type: ["VerifiableCredential", "VerifiableID"],
        issuer: "did:vid:0x5208431C6EC2ec4097aeA7182bB92d018766498c",
        issuanceDate: "2019-06-22T14:11:44Z",
        expirationDate: "2019-06-22T14:11:44Z",
        credentialSubject: {
          id: "did:vid:0x8707CCa835C961334D3F6450C6a61a0AD6592460",
          firstName: "Eva",
          lastName: "Monroe",
          gender: "Female",
          dateOfBirth: "12/11/1970",
          placeOfBirth: "Madrid",
          currentAddress: "Arago 179 4a",
          city: "Barcelona",
          state: "Catalunya",
          zip: "08011",
        },
        proof: [
          {
            type: "EidasSeal2019",
            created: "1970-01-19T13:56:26.946Z",
            proofPurpose: "assertionMethod",
            verificationMethod:
              "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
            jws:
              "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODY5NDYsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4QTUxMzVhYTA3ODg2MzVFZTQ5NTJERWFCRmEzZGE5OGJGNTk5OUJFMSJ9.CcIAc7C1Z1BsvjLO7y5XpSNqhvrcVXxSxpkRY0-o2mfSCebKhMK4f4g2lP-4Yf_fVzL_SmWKO05jeLAJnE6BBwA",
          },
          {
            type: "EidasSeal2019",
            created: "1970-01-19T13:56:27.203Z",
            proofPurpose: "assertionMethod",
            verificationMethod:
              "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D#eidasKey",
            jws:
              "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp2aWQ6MHhCNTUxYjcwZDY1MDg5MmQyM2RFM0JlMjAxQTk1YzFGY0JlYTk4QTNEI2VpZGFzS2V5In0.eyJpYXQiOjE2MDUzODcyMDMsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9hcGkudmlkY2hhaW4ubmV0L2NyZWRlbnRpYWxzL3ZlcmlmaWFibGVJZC92MSJdLCJpZCI6InZpZDp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUlEIl0sImlzc3VlciI6ImRpZDp2aWQ6MHg1MjA4NDMxQzZFQzJlYzQwOTdhZUE3MTgyYkI5MmQwMTg3NjY0OThjIiwiaXNzdWFuY2VEYXRlIjoiMjAxOS0wNi0yMlQxNDoxMTo0NFoiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMTktMDYtMjJUMTQ6MTE6NDRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6dmlkOjB4ODcwN0NDYTgzNUM5NjEzMzREM0Y2NDUwQzZhNjFhMEFENjU5MjQ2MCIsImZpcnN0TmFtZSI6IkV2YSIsImxhc3ROYW1lIjoiTW9ucm9lIiwiZ2VuZGVyIjoiRmVtYWxlIiwiZGF0ZU9mQmlydGgiOiIxMi8xMS8xOTcwIiwicGxhY2VPZkJpcnRoIjoiTWFkcmlkIiwiY3VycmVudEFkZHJlc3MiOiJBcmFnbyAxNzkgNGEiLCJjaXR5IjoiQmFyY2Vsb25hIiwic3RhdGUiOiJDYXRhbHVueWEiLCJ6aXAiOiIwODAxMSJ9LCJpc3MiOiJkaWQ6dmlkOjB4YUQ5NzEwMzQ3Y0NFYzkyQ2EwYTU3NGQwOTk4NEViMjVGQTk5QTE4ZCJ9.cYH6GtDusTbdrU_rrIUiiL5gBiPcKOc7g4Sq1J4-cACAWhu-UjuincJS35bTseylK5f0_XRYWuSpeKFAddndjwA",
          },
        ],
      },
    };
    const response = await Controller.EIDASsignature(signPayload);
    console.log(response.vc);
    expect(response).toBeDefined();
    expect(response.vc).toBeDefined();
    expect(response.vc.proof).toBeDefined();
    expect(response.vc.proof).toHaveLength(3);
  });
});
