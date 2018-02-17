const Process = require("./Process")

/**
 * Encrypts and decrypts files
 * 
 * @class File
 */
class File {

  /**
   * Encrypt a single file using the provided key
   * @param {String} origin Path location
   * @param {String} destination Path location
   * @param {String} key
   */
  encrypt(origin, destination, key) {
    // Encrypt origin to destination passing the secret via env (use FS as less as possible)
    return Process.openssl(`aes-256-cbc -in ${origin} -out ${destination} -pass env:secretKey`, null, {
      env: { secretKey: key }
    })
  }

  /**
   * Decrypt a single file using the provided key
   * @param {String} origin Path location
   * @param {String} destination Path location
   * @param {String} key
   */
  decrypt(origin, destination, key) {
    // Decrypt origin to destination passing the secret via env (use FS as less as possible)
    return Process.openssl(`aes-256-cbc -d -in ${origin} -out ${destination} -pass env:secretKey`, null, {
      env: { secretKey: key }
    })
  }

}

module.exports = new File()
