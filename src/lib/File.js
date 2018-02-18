const Crypto = require("./crypto")
const Tmp = require("tmp")
const fs = require("fs-extra")
const tar = require("tar")

class File {
  /**
   * Decrypt a file using a private key
   * @param {Path} key
   * @param {Path} origin
   * @param {Path} destination
   */
  async decrypt(origin, destination, key) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null
    }

    // Extract the the file into the temp folder
    try {
      await tar.x({ file: origin, cwd: tempFolder.name })
    } catch (e) {
      throw `${origin} is not a valid octosecret file`
    }

    try {
      // Read encrypted key
      data.encryptionKeyEnc = await fs.readFile(`${data.temp}/key`)
      // Decrypt key using the provided key
      data.encryptionKey = await Crypto.rsaDecrypt(data.encryptionKeyEnc, key)
    } catch (e) {
      throw "Invalid private key provided!"
    }

    try {
      // Start decrypting the data file
      await Crypto.fileDecrypt(`${data.temp}/data`, destination, data.encryptionKey)
    } catch (e) {
      throw `Error decrypting ${origin}`
    }

    // Remove temp folder
    tempFolder.removeCallback()
  }

  /**
   * Encrypt file using a public key
   * @param {Path} key
   * @param {Path} origin
   * @param {Path} destination
   */
  async encrypt(origin, destination, key) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null
    }

    try {
      // Convert public key to PKCS8
      await Crypto.rsa2pkcs8(key, `${data.temp}/id_rsa.pub.pkcs8`)
      // Generate new random key for this encryption
      data.encryptionKey = await Crypto.randomSymmetricKey()
      // Encrypt the encryption keyusing the PKCS8 key
      data.encryptionKeyEnc = await Crypto.rsaEncrypt(data.encryptionKey, `${data.temp}/id_rsa.pub.pkcs8`)
    } catch (e) {
      throw "Invalid RSA public key provided"
    }

    try {
      // Encrypt the file to the temp folder
      await Crypto.fileEncrypt(origin, `${tempFolder.name}/data`, data.encryptionKey)
    } catch (e) {
      throw `Error encrypting ${origin}`
    }

    // Create a file in with the (encrypted) encryption key
    await fs.outputFile(`${tempFolder.name}/key`, data.encryptionKeyEnc)
    // Create a tar with the data and key file. This is the final bundle
    await tar.c({ file: `${tempFolder.name}/bundle.tar`, cwd: tempFolder.name }, [`data`, `key`])
    // Move the bundle to the final location
    await fs.move(`${tempFolder.name}/bundle.tar`, destination, { overwrite: true })
    // Remove temp folder
    tempFolder.removeCallback()
  }
}

module.exports = new File()
