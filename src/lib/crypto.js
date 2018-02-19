const fs = require("fs-extra")
const Process = require("./process")

/**
 * Crypto utils
 *
 * @class Crypto
 */
class Crypto {
  /**
   * Generate a random symmetric key to be used for encryption
   * Default to 32 bytes key, which gives us the 256 bit key
   *
   * @param {number} bytes
   * @returns Promise
   */
  randomSymmetricKey(bytes = 32) {
    return Process.openssl(`rand ${bytes}`)
  }

  /**
   * Converts a RSA key into a PKCS8
   *
   * @param {Path} origin
   * @param {Path} destination
   */
  async rsa2pkcs8(origin, destination) {
    // Get PKCS8 version of the key
    const PKCS8 = await Process.sshKeygen(`-e -f ${origin} -m PKCS8`)
    // Write PKCS8 version to disk
    await fs.outputFile(destination, PKCS8)
  }

  /**
   * RSA Encrypt (using a PKCS8 key)
   *
   * @param {Buffer} data
   * @param {Path} pkcs8_file
   * @returns Promise
   */
  rsaEncrypt(data, pkcs8_file) {
    return Process.openssl(`rsautl -encrypt -oaep -pubin -inkey ${pkcs8_file}`, data)
  }

  /**
   * RSA Decrypt
   *
   * @param {Buffer} data
   * @param {Path} privateKey
   * @returns Promise
   */
  rsaDecrypt(data, privateKey = `${process.env.HOME}/.ssh/id_rsa`) {
    return Process.openssl(`rsautl -decrypt -oaep -inkey ${privateKey} `, data)
  }

  /**
   * Base64 encode via openssl
   *
   * @param {String or Buffer} data
   */
  base64Encode(data) {
    return Process.openssl(`enc -base64 -A`, data)
  }

  /**
   * Base64 decode via openssl
   *
   * @param {String or Buffer} data
   */
  base64Decode(data) {
    return Process.openssl(`enc -base64 -d  -A`, data)
  }

  /**
   * Encrypt a file using the provided key
   * @param {String} origin Path location
   * @param {String} destination Path location
   * @param {String} key
   */
  fileEncrypt(origin, destination, key) {
    // Encrypt origin to destination passing the secret via env (use FS as less as possible)
    return Process.openssl(`aes-256-cbc -in ${origin} -out ${destination} -pass env:secretKey`, null, {
      env: { secretKey: key }
    })
  }

  /**
   * Decrypt a file using the provided key
   * @param {String} origin Path location
   * @param {String} destination Path location
   * @param {String} key
   */
  fileDecrypt(origin, destination, key) {
    // Decrypt origin to destination passing the secret via env (use FS as less as possible)
    return Process.openssl(`aes-256-cbc -d -in ${origin} -out ${destination} -pass env:secretKey`, null, {
      env: { secretKey: key }
    })
  }

  /**
   * Decrypt a Buffer using the provided key
   *
   * @param {Buffer or String} buffer
   * @param {Path} key
   */
  bufferEncrypt(buffer, key) {
    return Process.openssl(`aes-256-cbc -pass env:secretKey`, buffer, {
      env: { secretKey: key }
    })
  }

  /**
   * Decrypt a Buffer using the provided key
   *
   * @param {Buffer or String} buffer
   * @param {Path} key
   */
  bufferDecrypt(buffer, key) {
    return Process.openssl(`aes-256-cbc -d -pass env:secretKey`, buffer, {
      env: { secretKey: key }
    })
  }
}

module.exports = new Crypto()
