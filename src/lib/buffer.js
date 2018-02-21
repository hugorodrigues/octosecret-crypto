const Tmp = require("tmp")
const Crypto = require("./crypto")

/**
 * Encrypt and decrypt buffers
 * 
 * @class Buffer
 */
class Buffer {
  
  /**
   * Encrypt buffer
   * @param {String or Buffer} input 
   * @param {Path} key 
   */
  async encrypt(input, key) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null,
      encryptionKeyEnc64: null,
      encryptedData: null,
      encryptedData64: null
    }

    try {
      // Convert public key to PKCS8
      await Crypto.rsa2pkcs8(key, `${data.temp}/id_rsa.pub.pkcs8`)
      // Generate new random key for this encryption
      data.encryptionKey = await Crypto.randomSymmetricKey()
      // Encrypt the encryption key using the PKCS8 key
      data.encryptionKeyEnc = await Crypto.rsaEncrypt(data.encryptionKey, `${data.temp}/id_rsa.pub.pkcs8`)
    } catch (e) {
      throw "Invalid RSA public key provided"
    }

    // Encrypt the data    
    try {
      data.encryptedData = await Crypto.bufferEncrypt(input, data.encryptionKey)
    } catch (e) {
      throw `Error encrypting the buffer`
    }

    // Convert data and key to base64 for portability
    data.encryptionKeyEnc64 = await Crypto.base64Encode(data.encryptionKeyEnc)
    data.encryptedData64 = await Crypto.base64Encode(data.encryptedData)

    // Convert to string and trim
    data.encryptionKeyEnc64 = data.encryptionKeyEnc64.toString().trim()
    data.encryptedData64 = data.encryptedData64.toString().trim()

    // Remove temp folder
    tempFolder.removeCallback()

    return `${data.encryptionKeyEnc64}${data.encryptedData64}`
  }

  /**
   * Decrypt buffer
   * @param {String or Buffer} input 
   * @param {Path} key 
   */
  async decrypt(input, key) {
    // All keys will have 684 chars after base64, we use this to split the key from the data
    const bundle = {
      key64: input.substr(0, 684),
      data64: input.substr(684)
    }

    // Check if we have what we need
    if (!bundle.key64 || !bundle.data64){
      throw "The input is not a valid octosecret encryption"
    }

    // Base64 decode for key and data
    try {
      bundle.keyEnc = await Crypto.base64Decode(bundle.key64)
      bundle.dataEnc = await Crypto.base64Decode(bundle.data64)
    } catch (e) {
      throw "Data is corrupted"
    }

    // Decrypt key using the provided key    
    try {
      bundle.key = await Crypto.rsaDecrypt(bundle.keyEnc, key)
    } catch (e) {
      throw "Invalid private key provided!"
    }

    // Decrypt data
    try {
      bundle.data = await Crypto.bufferDecrypt(bundle.dataEnc, bundle.key)
    } catch (e) {
      throw `Error while decrypting`
    }

    // Return only the final data
    return bundle.data
  }
}

module.exports = new Buffer()
