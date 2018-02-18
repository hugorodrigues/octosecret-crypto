const { promisify } = require("util")
const md5File = promisify(require("md5-file"))

const appRoot = require("app-root-path")
const example = `${appRoot}/test/fixtures`

const octosecret = require("../..")

describe("File.js", () => {
  test("Encrypt and decrypt file", async () => {
    // Get Md5 hash of the file we going to encrypt
    const hashOriginal = await md5File(`${example}/data/octocat.gif`)

    // Encrypt the file
    await octosecret.file.encrypt(`${example}/id_rsa.pub`, `${example}/data/octocat.gif`, `${example}/data/octocat.octosecret`)

    // Decrypt the file
    await octosecret.file.decrypt(`${example}/id_rsa`, `${example}/data/octocat.octosecret`, `${example}/data/octocat_new.gif`)

    // Get Md5 hash of the final file
    const hashDecrypted = await md5File(`${example}/data/octocat_new.gif`)

    // Compare the "before and after" hash
    expect(hashOriginal).toBe(hashDecrypted)
  })
})
