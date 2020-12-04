import fs from "fs";
import path from "path";
import { parseP12File } from "../../src/utils";

describe("eidas crypto tests should", () => {
  const testFilePathWithCa = "../data/test2/";
  const testFilePathSelfSigned = "../data/test0/";
  const p12File = "keyStore.p12";
  it("parse a P12 file", () => {
    expect.assertions(3);

    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`),
      { encoding: "binary" }
    );
    const expectedKey = `-----BEGIN RSA PRIVATE KEY-----MIIJKQIBAAKCAgEAozBgrSHFrezwbDULQCFPnlY+JRvjA+2EzKzEkYrk1O5PUQNNxVg9TphCWHtgFjn4+LUF1JLCzLPUAlj2dIBX3gvo5Ul392OHMVuwvFiwDgLdjn0F1S1GOic72TQDezvC7eenus++jm2jX7GCh368t4uPVJVjue6s4Dy1aZ/2KtN6DUX22lC6BGF9OqHMHQgSStQsyUS1stbx/OcMNPscQofEWCrli0qZoxv5VzMGPEHWDL0O6SX+Ivo7E8eEqnVQ3/TYDWTtwLTTE5O5G4gLG6i5lDlxg+a4e8FR3nFHKiWn/oDUR7AWxLOSCZ6h02+iAcvVA6MDFJiJmuVgw5WzhlIxCEbNw0yHemujL0rpQHugHtgJHdKqmUjrbgpuhjzaG7KbYe5KI2+rnJkkKW+hMoVpCWkuC86MmQpmnhFhfqIz3pb1I5KFqfo3RIxFyu6PouyuNvPJYbBxlnP71gbePnZ5jeY7nQwLbXk1REBnm4Q/ct6ODgouCkcGqROSsTzqVzLsVTZSsY7Zk/XqiQqe7DNgdjWsaajvjRjdjrk1jCzLRJXdVF6OcwtdK6Rg+1KvPq6XGt0Y0uzOU5IOZafPhb+mZl+C0bJ1wEtd6kZkZ9GMtHBYkcVOr/5Lili93jbrjDHd9JENY/4T9Wp/vPlNja23PNpBMMC69GrIF1ozI6MCAwEAAQKCAgB3w0xgI3XxU/+KWk98bDYDbSXElDfCLTGWCIFmkvmnr5G0UelkmIK9yI6AY2M8TKWE2U2DGYYvNxaz9lhBXeOeiT0N8SJDA983ASSuxaPHVKEHLof2UHjGuv54RGz9pvlDIgz90/L0klAhLaQvDnsvdRPmrpB250wmcUduUkAWZAeh8CPfSvmJt4ZxXkbvU3ohQp/vwiZbLtZ/lY1m4Jd32C3nyuuVk1U32JLgRQkhdevCg4mK4CAnyV9L/9REST7mbcmV4ul90PdL2dEy/F+yl9xChPnjJJNl95W+24Gv09z7sc6ZIglDqMnXl30KMFZEXTRiq+LZ3ay3afne8GHEWNNiK0X/CySinwJg4g5kg8t8fqQglIrG9SBWqFeGFxRwMUMrg1LwDhQKKqtB5psnPJo9wN5tzCAeOWpFL6teFmgGWk+WWPu+aTYqONBJ6eDu3rnAqPZ3s6/0mBLz9G8ZZsRI8U28VROJGjPwX+bPRbRriBr05A5YHCH15V8/wLTddbeAYz3hNc9g1dO2sHKOUxeVVHboAaSfOfSTEL/XvhPwlL2mHtAvtdJXHBXbiBOYGxDiUZGqbkVmnqGvrRk/v6REyNCcrfp18oNAz30PXil0T5iFr+05kRPI1apDT5hOiVOzm8an+Ujs7LpfrLaDW+NnXb6JAmexCvn/RhjtiQKCAQEA2HL0z4Dgq6ucljXeK9pJ3Vl09Hkdd1O0jqxMXhcqfWgzDgpcAqq/Bz+JSb5h0XiSrPhRvnxy4lGVNlRsHeQMmXKbAXyMHnktBmuMFW/DWZ0+Qjbhfzkv/5HkB+bGBPDDZTOdSLOquUkOh80PsGdW16wSqlTZ6zFtRhPZFbzK8LlPNq6EiS85/MfnYkCFJYXKrUGQT4Jx8vgBYW+m+WPmhPe52lOPchL02wYiFZL3hWbWt19FSUHlR7VmKb9VqhUAi612Z0+gyuKfCuP39y9g39cOot8OTzyS3o9g9mL+eSJBEjp8PChuIswFPD9l9KGIA+q0/3dDlXAWWPmErzzBfQKCAQEAwQIGKq5S8dPeMpEZ5FabhtR/hUD3G6BTj2CCtJsymeF2lOO7WpHA9kzfiJ5ME4FY5vJ1bT0AtGseWRRj4JIVFlUNTWzLFEuNn3Tb7xjS954bMeE9iuFROfKuXGTLadWwj2H4W0hat0r1ONdVFDfclUOyD/wYWQc5wv+mfrXYrAxAVRSv4UWSXbfmbUOd4ayodVxCgZ/gTJeyjr/6s4Y2gS5IdSFAIjZRY365C9fIqGLU7Q1SIPOqNqj9JAzsJ8Wj1yFvQi6Che5pmLJu7aPA4yHIsR3qcKcgmRaAkiluxTlWnJW0ycmTuXpUzO6GQXMQmVp7gsO3X8esl7epyISDnwKCAQEAq8KdbkSRBOmLus9IXHg+gT5Jxu6NaXGtKEKl30x21Uloqk2iMiOYr4HFyhUfvn/1tPjgtU5AREQFKjXYDeg371S4mHdjIZN7HUsewKwN0wEqtJSkYLba1e3JjFOe87Cy/Y311AlvAtVsiGs7dfqrOT49GZl3zGFOm3uImu1UBa6no3bdiZdGZsejX55fiiUfbllG0TFshygywEU/tUuHVCDZBN2mSRmt4Fh/l6smbF/tJ1qcusNl1H+ocJx6uBsucajW+qh/qkAngRbiYO7h6v7XiHuE+W/SBHa2tQ5dbXa3OGXczEgxDb/kr6iHmZbNPn5z3v2fTejCcxyeJAkMaQKCAQEAvWx/IOR2A2EscfR2tONLQMjNXrqjyzlOySivHxIyV1QwTXA0MG9cMl7ABBVYFMydtAvBs7RrPKbk4ghg/cZha8mNhK+BoCmGlTjboY17gApsJkgpXmREk9rZxVQnT3eqEQ7V8MDSR5IJmf+8QFuS4evOlmGUg8vTpM3DWhiezjw350imVTEytUgHnrT9/r61lnk1zIJcYM+BLxi7s/XFCIOkGVDI4MrulfeJJVZiWOCmmQC52h1KsNqplvgXzfDrG/h0eT+sWkXi3TpCJHjSlhhSH4J81JMyKw0qokiHrojXuFY1WNW9ZgvprjdrDFEhuWBUV8I99oLBoSVgPKvRgQKCAQBcakzdWoJyyHApvV0PVRl2jmFYjgT6N5Du/9L/POSTLMbv8vih5sjfsuquRyy4o91hKhLhDXbmcxMVIn31j+y+rUjFV3g4X2pRYvDBOKLSko4z6KpBoKEoXX0l/3MSOSQcO4jWqQOrfZMhFdnDrN5CIIdMHx7Gi1ZT5H64VSNitpA84SBF87W6pLOgrF3EaCNu/3ArapsZrUxtHmeVnMUFbfIEAYjgVIaSvyuslSQHdTQl/LCH2AuQCv+lqEMneeD59rSuwqIAGfJ8aaG6oDyofIU8Ke7tDXdeo4WvtElRkRp8fJPPM18dFhNX1O8M9tMqIpqCWpLtkyjW6/n+dQjn-----END RSA PRIVATE KEY-----`;
    const expectedCerts = [
      `-----BEGIN CERTIFICATE-----MIIE0DCCA7gCFB5BQOH1HckOeCWWWW7pOEVhSrN9MA0GCSqGSIb3DQEBCwUAMIGgMQswCQYDVQQGEwJFUzESMBAGA1UECAwJQ2F0YWxvbmlhMRIwEAYDVQQHDAlCYXJjZWxvbmExGzAZBgNVBAoMElZhbGlkYXRlZCBJZCBDQSBzbDEeMBwGA1UECwwVQ2VydGlmaWNhdGUgQXV0aG9yaXR5MSwwKgYJKoZIhvcNAQkBFh12aWRjaGFpbit0ZXN0QHZhbGlkYXRlZGlkLmNvbTAeFw0yMDEyMDMwNzM3NThaFw0yMTEyMDMwNzM3NThaMIGnMQswCQYDVQQGEwJFUzESMBAGA1UECAwJQ2F0YWxvbmlhMRIwEAYDVQQHDAlCYXJjZWxvbmExGDAWBgNVBAoMD1ZhbGlkYXRlZCBJZCBzbDERMA8GA1UECwwIVklEY2hhaW4xFTATBgNVBAMMDFZhbGlkYXRlZCBJZDEsMCoGCSqGSIb3DQEJARYddmlkY2hhaW4rdGVzdEB2YWxpZGF0ZWRpZC5jb20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCjMGCtIcWt7PBsNQtAIU+eVj4lG+MD7YTMrMSRiuTU7k9RA03FWD1OmEJYe2AWOfj4tQXUksLMs9QCWPZ0gFfeC+jlSXf3Y4cxW7C8WLAOAt2OfQXVLUY6JzvZNAN7O8Lt56e6z76ObaNfsYKHfry3i49UlWO57qzgPLVpn/Yq03oNRfbaULoEYX06ocwdCBJK1CzJRLWy1vH85ww0+xxCh8RYKuWLSpmjG/lXMwY8QdYMvQ7pJf4i+jsTx4SqdVDf9NgNZO3AtNMTk7kbiAsbqLmUOXGD5rh7wVHecUcqJaf+gNRHsBbEs5IJnqHTb6IBy9UDowMUmIma5WDDlbOGUjEIRs3DTId6a6MvSulAe6Ae2Akd0qqZSOtuCm6GPNobspth7kojb6ucmSQpb6EyhWkJaS4LzoyZCmaeEWF+ojPelvUjkoWp+jdEjEXK7o+i7K4288lhsHGWc/vWBt4+dnmN5judDAtteTVEQGebhD9y3o4OCi4KRwapE5KxPOpXMuxVNlKxjtmT9eqJCp7sM2B2NaxpqO+NGN2OuTWMLMtEld1UXo5zC10rpGD7Uq8+rpca3RjS7M5Tkg5lp8+Fv6ZmX4LRsnXAS13qRmRn0Yy0cFiRxU6v/kuKWL3eNuuMMd30kQ1j/hP1an+8+U2Nrbc82kEwwLr0asgXWjMjowIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAniWQbPVMjPvUajJMXEH80AUJKq/3woKfnrdZXjepwUjrPm0f7J00UYWTIa/wfAstP0gk//R8dOuYQAPo7QGEp9Qb4OytSX72gRhJi8L01lp1x5KD8yfrlKH3vkzU2jxjVV5GYVBGZ7I24VbCXnXiw36ETb9F651AFA3KYESOSFQ46iuTAhU6wAci3me4Rb2aya+7mOv8dFuL/NCqnZq1viXxFioaHZvcTdRIHXSlETPS/fK3IQTB3BaxiZObsH2g+YDFEpkf5Lg9FGZw1fa1/6MJOFiech4yTMeiXrfnJ+Tt+LCFtXlGRiMiVSMnKWdbl2yKcZNFGccYhV7sDDPJ/-----END CERTIFICATE-----`,
      `-----BEGIN CERTIFICATE-----MIIEIzCCAwugAwIBAgIUUFkcd9qak/B78N2eMY16NivxTtkwDQYJKoZIhvcNAQELBQAwgaAxCzAJBgNVBAYTAkVTMRIwEAYDVQQIDAlDYXRhbG9uaWExEjAQBgNVBAcMCUJhcmNlbG9uYTEbMBkGA1UECgwSVmFsaWRhdGVkIElkIENBIHNsMR4wHAYDVQQLDBVDZXJ0aWZpY2F0ZSBBdXRob3JpdHkxLDAqBgkqhkiG9w0BCQEWHXZpZGNoYWluK3Rlc3RAdmFsaWRhdGVkaWQuY29tMB4XDTIwMTIwMzA2NDQwOVoXDTIxMTIwMzA2NDQwOVowgaAxCzAJBgNVBAYTAkVTMRIwEAYDVQQIDAlDYXRhbG9uaWExEjAQBgNVBAcMCUJhcmNlbG9uYTEbMBkGA1UECgwSVmFsaWRhdGVkIElkIENBIHNsMR4wHAYDVQQLDBVDZXJ0aWZpY2F0ZSBBdXRob3JpdHkxLDAqBgkqhkiG9w0BCQEWHXZpZGNoYWluK3Rlc3RAdmFsaWRhdGVkaWQuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmEQ0Zc1kvgs3oeT8/RTrurbQalCZgmxu9oh7GgCc6KPClVmsuDq7VjNgS1ndbyb8wHVqIEm4Fzm28DJuyKdHk1OpwnepHcjVO3aeb13qvRUsCwLhj+Y62inyq3Y/om0qhRz4EcvjvAD2yHU2b0a9eXIvuCcD/3nJRL188OHVbtPaxRdE+kQ7zKD9BQSFoLNfPhnfUZVUuT+/eloAX2YLac7gDNVXxVt9eGPu0Xer/mN5iC3e2LdsvAZSN1nbfm78gsgXIWZUIekbEWscxDtgh63+tDbNnwS6GzLB3Djx8WMV08XswQLUaixhmOTk/63vVnrpmPIg2fgAmagh0ySjQwIDAQABo1MwUTAdBgNVHQ4EFgQUl8RIV/7ezqmQxfgn6HnCgD32+OUwHwYDVR0jBBgwFoAUl8RIV/7ezqmQxfgn6HnCgD32+OUwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAZVpbzEgQktnxhIsh+cAwwcyjlVoFqZRdeXQ7NeUleZeE7Tuib0qPRpYnZ5mHe+fey4BbOsXnbxF6p8THRqYn6r5vy9d6w+LyjwLdBkn2c9Sc/A6P/OH2nJ4XPeM/EFcREBGgOedbRQPwFIztcB40241LvIJJ/qinhiWhbVI4hn471dx35s95+3+GCpJsBDLVMdfrWHNbIdAT/EE0efxhOOS/CSjZ/sgiYcpWWGjzZMpfq0i37qOopRvBsirP9ijpIJ+axZqsRoXzUThSwItxWBsVpkV67N0CbBnYHTY/LWcjMmwyJCSUYrso7coXDXg9zWk/FIw+R27SzJW8g1Pn2A==-----END CERTIFICATE-----`,
    ];
    const result = parseP12File(fileData, "vidchain");
    expect(result).toBeDefined();
    expect(result.pemPrivateKey).toStrictEqual(expectedKey);
    expect(
      (result.pemCert as string[]).every((cert) => expectedCerts.includes(cert))
    ).toBe(true);
  });
});
