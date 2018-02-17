const fs = require("fs-extra")
const tmp = require("tmp")

const appRoot = require("app-root-path")
const fixturesPath = `${appRoot}/test/fixtures`

const File = require("../File")
const Crypto = require("../Crypto")

describe("File.js", () => {
  test("Encrypt and decrypt file", async () => {
    // Create temp folder
    const tempFolder = tmp.dirSync({ unsafeCleanup: true })
    // console.log("tempFolder", tempFolder.name)

    // Generate new random key for this encryption
    const encryptionKey = await Crypto.randomSymmetricKey()

    // Sample data to be encrypted
    const exampleSecret = "Hello world!"

    // Create a temporary file with data
    await fs.outputFile(`${tempFolder.name}/example.txt`, exampleSecret)

    // Encrypt
    await File.encrypt(`${tempFolder.name}/example.txt`, `${tempFolder.name}/example.txt.enc`, encryptionKey)

    // Read encrypted version
    const encryptedVersion = await fs.readFile(`${tempFolder.name}/example.txt.enc`, "utf8")

    // Test if its really encrypted
    expect(encryptedVersion).not.toBe(exampleSecret)

    // Decrypt
    await File.decrypt(`${tempFolder.name}/example.txt.enc`, `${tempFolder.name}/example.txt.dec`, encryptionKey)

    // Read decrypted version
    const decryptedVersion = await fs.readFile(`${tempFolder.name}/example.txt.dec`, "utf8")

    // Test if its really encrypted
    expect(decryptedVersion).toBe(exampleSecret)

    tempFolder.removeCallback()
  })
})
