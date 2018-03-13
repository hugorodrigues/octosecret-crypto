const { promisify } = require("util")
const md5File = promisify(require("md5-file"))

const appRoot = require("app-root-path")
const example = `${appRoot}/test/fixtures`

const octosecret = require("../../..")

describe("file.js", () => {
  test("Encrypt and decrypt file using 1 key", async () => {
    // Get Md5 hash of the file we going to encrypt
    const hashOriginal = await md5File(`${example}/data/octocat.gif`)

    // Encrypt the file
    await octosecret.file.encrypt(`${example}/data/octocat.gif`, `${example}/data/octocat.octosecret`, [`${example}/id_rsa.pub`])

    // Decrypt the file
    await octosecret.file.decrypt(`${example}/data/octocat.octosecret`, `${example}/data/octocat_new.gif`, `${example}/id_rsa`)

    // Get Md5 hash of the final file
    const hashDecrypted = await md5File(`${example}/data/octocat_new.gif`)

    // Compare the "before and after" hash
    expect(hashOriginal).toBe(hashDecrypted)
  })

  test("Encrypt and decrypt file using multiple keys", async () => {
    // Get Md5 hash of the file we going to encrypt
    const hashOriginal = await md5File(`${example}/data/octocat.gif`)

    // Encrypt the file
    await octosecret.file.encrypt(`${example}/data/octocat.gif`, `${example}/data/octocat.multiple.octosecret`, [`${example}/id_rsa2.pub`, `${example}/id_rsa.pub`])

    // Decrypt the file
    await octosecret.file.decrypt(`${example}/data/octocat.multiple.octosecret`, `${example}/data/octocat_new_multiple.gif`, `${example}/id_rsa`)

    // Get Md5 hash of the final file
    const hashDecrypted = await md5File(`${example}/data/octocat_new_multiple.gif`)

    // Compare the "before and after" hash
    expect(hashOriginal).toBe(hashDecrypted)
  })

})
