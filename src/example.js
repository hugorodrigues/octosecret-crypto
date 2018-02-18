const octosecret = require("./index")
const example = `../test/fixtures`

async function encryptAndDecryptFile() {
  try {
    // Encrypt
    await octosecret.file.encrypt(`${example}/data/octocat.gif`, `${example}/data/octocat.octosecret`, `${example}/id_rsa.pub`)
    // Decrypt    
    await octosecret.file.decrypt(`${example}/data/octocat.octosecret`, `${example}/data/octocat_new.gif`, `${example}/id_rsa`)
  } catch (e) {
    console.log("Error while encrypting/decrypting", e)
  }
}

encryptAndDecryptFile()
