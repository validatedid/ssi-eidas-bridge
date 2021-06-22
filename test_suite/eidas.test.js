const fetch = require('node-fetch');
const {assert} = require('chai');
const {v4: uuid} = require('uuid');
const didKeyDriver = require('did-method-key').driver();
const participants = require('./participants');

const _executeCall = (url, body, method = 'POST') => {
    return fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
};

describe('eIDAS Bridge Test Suite', () => {
    participants.forEach(participant => {
        const certificateId = uuid();
        const certificate = participant.certificates[0];
        let didDocument, did;
        before(async () => {
            return didKeyDriver.generate()
                .then(result => {
                    didDocument = result;
                    did = result.id;
                });
        });
        describe(`Import Certificate for ${participant.name}`, () => {
            describe(`Import succeeds`,() => {
                it('should return 201 on first successful certificate import and return an id with the did passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys/${certificateId}`;
                    const body = {
                        did,
                        eidasQec: certificate.eidasQec
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 201);
                            return res;
                        }).then(res => res.json())
                        .then(res => {
                            assert.exists(res.id);
                            assert.equal(res.id, did);
                            done();
                        })
                        .catch(done);
                });
                it('should return 200 on successful update certificate and return an id with the did passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys/${certificateId}`;
                    const body = {
                        did,
                        eidasQec: certificate.eidasQec
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 200);
                            return res;
                        }).then(res => res.json())
                        .then(res => {
                            assert.exists(res.id);
                            assert.equal(res.id, did);
                            done();
                        })
                        .catch(done);
                });
            });
            describe(`Import fails`, () => {
                it('should return 404 when no id is passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys`;
                    const body = {
                        did,
                        eidasQec: certificate.eidasQec
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 404);
                            done()
                        }).catch(done);
                });
                it('should return 400 when did is not passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys/${certificateId}`;
                    const body = {
                        eidasQec: certificate.eidasQec
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it('should return 400 when a not valid did is passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys/${certificateId}`;
                    const body = {
                        did: "test",
                        eidasQec: certificate.eidasQec
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        })
                        .catch(done);
                });
                it('should return 400 when eidasQec is not passed', done => {
                    const url = `${participant.eidas_api_base_url}/v1/eidas-keys/${certificateId}`;
                    const body = {
                        did
                    };
                    _executeCall(url, body, 'PUT')
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        })
                        .catch(done);
                });
            });
        });
        describe(`eSeal creation for ${participant.name}`, () => {
            describe(`Signature succeeds`,() => {
                it("should return 201 when eSealing a Credential payload with proof.type CAdESRSASignature2020, proof.created with a valid date (from current time, not in the future), proof.proofPurpose assertionMethod, proof.verificationMethod exists and proof.cades exists", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        issuer: did,
                        password: certificate.password,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 201);
                            return res.json();
                        })
                        .then(result => {
                            assert.exists(result.proof);
                            assert.exists(result.proof.type);
                            assert.equal(result.proof.type, 'CAdESRSASignature2020');
                            assert.exists(result.proof.created);
                            assert.isTrue(Date.parse(result.proof.created) < Date.now());
                            assert.equal(result.proof.proofPurpose, 'assertionMethod');
                            assert.exists(result.proof.verificationMethod);
                            assert.exists(result.proof.cades);
                            done()
                        }).catch(done);
                });
                it("should return 201 when eSealing a Verifiable Credential (with a proof) returning an array of proofs, with the eSeal proof.type CAdESRSASignature2020, proof.created with a valid date (from current time, not in the future), proof.proofPurpose assertionMethod, proof.verificationMethod exists and proof.cades exists", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[1];
                    assert.exists(credential.proof);
                    const body = {
                        issuer: did,
                        password: certificate.password,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 201);
                            return res.json();
                        })
                        .then(result => {
                            assert.exists(result.proof);
                            assert.isArray(result.proof);
                            const newProof = result.proof[result.proof.length - 1];
                            assert.exists(newProof.type);
                            assert.equal(newProof.type, 'CAdESRSASignature2020');
                            assert.exists(newProof.created);
                            assert.isTrue(Date.parse(newProof.created) < Date.now());
                            assert.equal(newProof.proofPurpose, 'assertionMethod');
                            assert.exists(newProof.verificationMethod);
                            assert.exists(newProof.cades);
                            done()
                        }).catch(done);

                });
            });
            describe(`Signature fails`, () => {
                it("should return 400 when passed an invalid issuer did", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        issuer: "test",
                        password: certificate.password,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it("should return 400 when passed password that does not match the stored certificate", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        issuer: did,
                        password: `${certificate.password}test`,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it("should return 400 when no issuer is passed", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        password: certificate.password,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it("should return 400 when no payload is passed", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        issuer: did,
                        password: certificate.password
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it("should return 400 when no password is passed", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const body = {
                        issuer: did,
                        payload: credential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
                it("should return 400 when payload is not a valid credential: a JSON-ld structure with at least @context and type, and it is canonizable", done => {
                    const url = `${participant.eidas_api_base_url}/v1/signatures`;
                    const credential = participant.credentials[0];
                    assert.notExists(credential.proof);
                    const invalidCredential = (({ type, ...o }) => o)(credential);
                    const body = {
                        issuer: did,
                        password: certificate.password,
                        payload: invalidCredential
                    }
                    _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 400);
                            done()
                        }).catch(done);
                });
            });

        });
        describe(`eSeal verification for ${participant.name}`,() =>{
            const url = `${participant.eidas_api_base_url}/v1/signature-validations`;
            describe("when verification is performed returns 200", () => {
                describe("TOTAL_PASSED", () => {
                    it("should return 200 when verifying a valid Verifiable Credential eSealed (with just one proof)", done => {
                        const credential = participant.sealed_credentials[0];
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_PASSED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                done()
                            }).catch(done);
                    });
                    it("should return 200 when verifying a valid Verifiable Credential eSealed (with more than one proof)", done => {
                        const credential = participant.sealed_credentials[1];
                        const body = credential;
                        _executeCall(url, body)
                        .then(res => {
                            assert.equal(res.status, 200);
                            return res.json();
                        })
                        .then(result => {
                            assert.exists(result.indication);
                            assert.equal(result.indication, 'TOTAL_PASSED');
                            assert.exists(result.checks);
                            assert.isArray(result.checks);
                            assert.include(result.checks, "credential");
                            assert.include(result.checks, "proof");
                            done()
                        }).catch(done);
                    });
                });
                describe("TOTAL_FAILED", () => {
                    it("should fail to verify when Verifiable Credential has a mutated signature value", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof.cades = `test`;
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with created property removed from the proof ", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof =  (({ created, ...o }) => o)(credential.proof);
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verify Credential with a mutated proofPurpose in the proof", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof.proofPurpose = "test";
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with an added property to the credential", done => {
                        let credential = participant.sealed_credentials[0];
                        credential = {
                            test: "dummy",
                            ...credential,
                        }
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it('should fail to verify when Verifiable Credential with a removed property from the credential', done => {
                        let credential = JSON.parse(JSON.stringify(participant.sealed_credentials[0]));
                        delete credential.credentialSubject[Object.keys(credential.credentialSubject)[0]];
                        _executeCall(url, credential)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with a mutated property to the credential", done => {
                        let credential = participant.sealed_credentials[0];
                        const body = {
                            ...credential,
                            credentialSubject: {
                                ...credential.credentialSubject,
                                [Object.keys(credential.credentialSubject)[0]]: "test",
                            }
                        };
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with an added property to the proof", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof = {
                            test: "dummy",
                            ...credential.proof
                        }
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with a removed property to the proof", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof =  (({ type, ...o }) => o)(credential.proof);
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when Verifiable Credential with a mutated property to the proof", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof.issuer =  "test";
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    // TODO
                    // it("should fail to verify when Verifiable Credential with at least 2 different DID methods set as the issuer property for a credential", done => {});
                    // it("should fail to verify adhere to the proof verification format", done => {});
                    // it("should fail to verify  when support the verification of, JSON-LD Proof, Ed25519Signature2018.", done => {});
                    it("should fail to verify when Verifiable Credential with no eSeal Proof type CAdESRSASignature2020", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof.type =  "Ed25519Signature2018";
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                    it("should fail to verify when eSeal Proof contains a date different from CADES SigningTime", done => {
                        let credential = participant.sealed_credentials[0];
                        credential.proof.created = "2000-01-01T19:73:24Z";
                        const body = credential;
                        _executeCall(url, body)
                            .then(res => {
                                assert.equal(res.status, 200);
                                return res.json();
                            })
                            .then(result => {
                                assert.exists(result.indication);
                                assert.equal(result.indication, 'TOTAL_FAILED');
                                assert.exists(result.checks);
                                assert.isArray(result.checks);
                                assert.include(result.checks, "credential");
                                assert.include(result.checks, "proof");
                                assert.exists(result.errors);
                                assert.isArray(result.errors);
                                assert.isNotEmpty(result.errors);
                                done()
                            }).catch(done);
                    });
                });
                //TODO: Merge indeterminate-test-suite branch for INDETERMINATE cases when trust chain verification is ready
            });
            describe("otherwise", () =>{
                describe("Bad request returns 400", () => {
                    it("should inform when the request is rejected", done => {
                        _executeCall(url)
                            .then(res => {
                                assert.equal(res.status, 400);
                                done()
                            }).catch(done);
                    });
                });
            });
        });
    });
});
