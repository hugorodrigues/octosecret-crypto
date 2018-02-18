const fs = require("fs-extra")
const tmp = require("tmp")

const appRoot = require("app-root-path")
const fixturesPath = `${appRoot}/test/fixtures`

const Crypto = require("../crypto")

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

  test("Encrypt and decrypt file", async () => {
    // Create temp folder
    const tempFolder = tmp.dirSync({ unsafeCleanup: true })

    // Generate new random key for this encryption
    const encryptionKey = await Crypto.randomSymmetricKey()

    // Sample data to be encrypted
    const exampleSecret = "Hello world!"

    // Create a temporary file with data
    await fs.outputFile(`${tempFolder.name}/example.txt`, exampleSecret)

    // Encrypt
    await Crypto.fileEncrypt(`${tempFolder.name}/example.txt`, `${tempFolder.name}/example.txt.enc`, encryptionKey)

    // Read encrypted version
    const encryptedVersion = await fs.readFile(`${tempFolder.name}/example.txt.enc`, "utf8")

    // Test if its really encrypted
    expect(encryptedVersion).not.toBe(exampleSecret)

    // Decrypt
    await Crypto.fileDecrypt(`${tempFolder.name}/example.txt.enc`, `${tempFolder.name}/example.txt.dec`, encryptionKey)

    // Read decrypted version
    const decryptedVersion = await fs.readFile(`${tempFolder.name}/example.txt.dec`, "utf8")

    // Test if its really encrypted
    expect(decryptedVersion).toBe(exampleSecret)

    // Remove temp folder
    tempFolder.removeCallback()
  })

})
