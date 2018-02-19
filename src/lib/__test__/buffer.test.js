const appRoot = require("app-root-path")
const example = `${appRoot}/test/fixtures`

const octosecret = require("../..")

describe("buffer.js", () => {
  test("Encrypt and decrypt buffers", async () => {
    // Example data
    const dataToEncrypt = "Will this work?"
    // Encrypt
    const encrypted = await octosecret.buffer.encrypt(dataToEncrypt, `${example}/id_rsa.pub`)
    // Decrypt
    const decrypted = await octosecret.buffer.decrypt(encrypted, `${example}/id_rsa`)
    // Convert Buffer to String
    const decryptedText = decrypted.toString()
    // Compare the "before and after" hash
    expect(decryptedText).toBe(dataToEncrypt)
  })
})
