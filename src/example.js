const octosecret = require("./index")
const example = `../test/fixtures`

async function encryptAndDecryptFile() {
  try {
    // Encrypt
    await octosecret.file.encrypt(`${example}/id_rsa.pub`, `${example}/data/octocat.gif`, `${example}/data/octocat.octosecret`)
    // Decrypt    
    await octosecret.file.decrypt(`${example}/id_rsa`, `${example}/data/octocat.octosecret`, `${example}/data/octocat_new.gif`)
  } catch (e) {
    console.log("Error while encrypting/decrypting", e)
  }
}

encryptAndDecryptFile()
