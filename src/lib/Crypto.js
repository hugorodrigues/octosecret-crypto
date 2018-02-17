const fs = require("fs-extra")
const Process = require("./Process")

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
    // Write it to disk
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

}

module.exports = new Crypto()
