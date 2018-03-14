const Crypto = require('../crypto')
const Tmp = require('tmp')
const fs = require('fs-extra')
const tar = require('tar')

class File {
  /**
   * Decrypt a file using a private key
   * @param {Path} key
   * @param {Path} origin
   * @param {Path} destination
   */
  async decrypt (origin, destination, key) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null
    }

    // Extract the file into the temp folder
    try {
      await tar.x({ file: origin, cwd: tempFolder.name })
    } catch (e) {
      throw `${origin} is not a valid octosecret file`
    }

    // List what is inside the bundle
    const filesInBundle = await fs.readdir(tempFolder.name)

    // A bundle can have one or many keys. Find them
    const keysFound = []
    for (const fileName of filesInBundle) {
      if (fileName.substr(0, 4) === 'key_') {
        keysFound.push(fileName)
      }
    }
    const totalKeysFound = keysFound.length

    // Tell the user we going to try multiple times
    if (totalKeysFound > 1) {
      console.log(`This file was encrypted with ${totalKeysFound} different public-keys...`)
    }

    // Try to decrypt each key until we have a valid one
    let keysTried = 0
    for (const keyName of keysFound) {
      try {
        keysTried++
        if (totalKeysFound > 1) console.log(`Trying to decrypt key ${keysTried}/${totalKeysFound}`)
        // Read encrypted key
        data.encryptionKeyEnc = await fs.readFile(`${data.temp}/${keyName}`)
        // Decrypt key using the provided key
        data.encryptionKey = await Crypto.rsaDecrypt(data.encryptionKeyEnc, key)
        // If the last instruction is successful we can break
        break
      } catch (e) {
        // throw "Invalid private key provided!"
      }
    }

    // No valid key found?
    if (!data.encryptionKey) {
      throw new Error('Invalid private key provided!')
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
   * @param {Array} key
   * @param {Path} origin
   * @param {Path} destination
   */
  async encrypt (origin, destination, keys) {
    // Create temp folder
    const tempFolder = Tmp.dirSync({ unsafeCleanup: true })

    // Keep track of state
    const data = {
      temp: tempFolder.name,
      encryptionKey: null,
      encryptionKeyEnc: null,
      bundleFiles: []
    }

    try {
      // Generate all the necessary keys
      const finalKeys = await Crypto.createEncryptionKey(keys)
      data.encryptionKey = finalKeys.encryptionKey
      data.encryptionKeyEnc = finalKeys.encryptionKeyEnc
    } catch (e) {
      throw 'Invalid RSA public key provided'
    }

    try {
      // Encrypt the file to the temp folder (this will be out data file)
      await Crypto.fileEncrypt(origin, `${tempFolder.name}/data`, data.encryptionKey)
      // Add the data filename to the bundle
      data.bundleFiles.push('data')
    } catch (e) {
      throw `Error encrypting ${origin}`
    }

    // Save all keys to the temp folder
    let keyIndex = 0
    for (let key of data.encryptionKeyEnc) {
      // Save key and save the name in the bundle
      await fs.outputFile(`${tempFolder.name}/key_${keyIndex}`, key)
      // Add key to the bundle
      data.bundleFiles.push(`key_${keyIndex}`)
      keyIndex++
    }

    // Create a tar with the bundle (data and key files). This is the final bundle
    await tar.c({ file: `${tempFolder.name}/bundle.tar`, cwd: tempFolder.name }, data.bundleFiles)
    // Move the bundle to the final location
    await fs.move(`${tempFolder.name}/bundle.tar`, destination, { overwrite: true })
    // Remove temp folder
    tempFolder.removeCallback()
  }
}

module.exports = new File()
