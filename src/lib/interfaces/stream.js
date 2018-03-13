const Tmp = require("tmp")
const Crypto = require("../crypto")

/**
 * Encrypt and decrypt buffers
 * 
 * @class Buffer
 */
class Stream {
  
  /**
   * Encrypt buffer
   * 
   * @param {String|Buffer} input 
   * @param {String} keys
   */
  async encrypt(input, keys) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null,
    }

    try {
      // Generate all the necessary keys
      const finalKeys = await Crypto.createEncryptionKey(keys)
      data.encryptionKey = finalKeys.encryptionKey
      data.encryptionKeyEnc = finalKeys.encryptionKeyEnc
    } catch (e) {
      throw "Invalid RSA public key provided!"
    }

    // Encrypt the data
    try {
      data.encryptedData = await Crypto.bufferEncrypt(input, data.encryptionKey)
    } catch (e) {
      throw `Error encrypting the buffer`
    }

    // Start building the bundle
    const bundle = []

    // Add Encrypted data to the bundle. Should be the first array element
    bundle.push(data.encryptedData)

    // Add all keys
    for (const key of data.encryptionKeyEnc) {
      bundle.push(key)
    }

    // base64 all items in the bundle
    const bundle64 = bundle.map(item => Buffer.from(item).toString('base64'))

    // Final bundle
    // const bundle64Final = bundle64.join('####')
    const bundle64Final = bundle64.join('|')
    

    // Remove temp folder
    tempFolder.removeCallback()

    return bundle64Final
  }

  /**
   * Decrypt buffer
   * @param {String or Buffer} input 
   * @param {Path} privateKey 
   */
  async decrypt(input, privateKey) {

    const bundle = {
      keys: [],
      data: null
    }
    
    // Trim the input
    let bundleInput = input.trim()

    // Split at the base64 end
    bundleInput = bundleInput.split('|')
    
    // Base64 decode for key and data
    try {
      // First element is the data
      const dataFinal = bundleInput.shift()
      bundle.data = await Crypto.base64Decode( dataFinal )

      // Keep iterating for all keys
      for (const key of bundleInput){
        if (key) {
          bundle.keys.push(await Crypto.base64Decode(key))
        }
      }
    } catch (e) {
      throw "Data is corrupted"
    }

    // Check if we have what we need
    if (!bundle.data || bundle.keys.length === 0){
      throw "The input is not a valid octosecret encryption"
    }

    const totalKeysFound = bundle.keys.length
    let keysTried = 0
    for (const key of bundle.keys) {
      try {
        keysTried++
        if (totalKeysFound > 1) console.log(`Trying to decrypts key ${keysTried}/${totalKeysFound}`);
        // Decrypt key using the provided key
        bundle.key = await Crypto.rsaDecrypt(key, privateKey)
        // If the last instruction is successful we can break
        break
      } catch (e) {
        // throw "Invalid private key provided!"
      }
    }
    
    // No valid key found?
    if (!bundle.key){
      throw new Error("Invalid private key provided!")
    }

    // Decrypt data
    try {
      bundle.data = await Crypto.bufferDecrypt(bundle.data, bundle.key)
    } catch (e) {
      throw `Error while decrypting`
    }

    // Return only the final data
    return bundle.data
  }
}

module.exports = new Stream()
