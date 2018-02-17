const fs = require("fs-extra")
const tmp = require("tmp")

const appRoot = require("app-root-path")
const fixturesPath = `${appRoot}/test/fixtures`

const Crypto = require("../Crypto")

describe("Crypto.js", () => {

  test("randomSymmetricKey", async () => {
    // Generate random key
    const randomKey = await Crypto.randomSymmetricKey()
    // We need better than this
    expect(randomKey).not.toBe("")
  })

  test("rsa2pkcs8", async () => {
    // Create temp folder
    const tempFolder = tmp.dirSync({ unsafeCleanup: true })

    // Convert key
    await Crypto.rsa2pkcs8(`${fixturesPath}/id_rsa.pub`, `${tempFolder.name}/id_rsa.pub.pkcs8`)

    // Get control sample
    const sample = await fs.readFile(`${fixturesPath}/id_rsa.pub.PKCS8`, "utf8")

    // Get converted key
    const converted = await fs.readFile(`${tempFolder.name}/id_rsa.pub.pkcs8`, "utf8")

    // Compare
    expect(sample).toBe(converted)
  })

  test("pkcs8 encrypt and decrypt", async () => {
    // Something to encrypt
    const exampleSecret = "This should be encrypted"

    // Encrypt
    let encrypted = await Crypto.rsaEncrypt(exampleSecret, `${fixturesPath}/id_rsa.pub.PKCS8`)
    expect(encrypted.toString()).not.toBe(exampleSecret)

    // Decrypt
    let decrypted = await Crypto.rsaDecrypt(encrypted, `${fixturesPath}/id_rsa`)
    expect(decrypted.toString()).toBe(exampleSecret)
  })

})
