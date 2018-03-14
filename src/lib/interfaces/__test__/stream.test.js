const appRoot = require('app-root-path')
const example = `${appRoot}/test/fixtures`

const octosecret = require('../../..')

describe('stream.js', () => {
  test('Encrypt and decrypt streams - One key', async () => {
    // Example data
    const dataToEncrypt = 'Will this work?'
    // Encrypt
    const encrypted = await octosecret.stream.encrypt(dataToEncrypt, [`${example}/id_rsa.pub`])
    // Decrypt
    const decrypted = await octosecret.stream.decrypt(encrypted, `${example}/id_rsa`)
    // Convert Buffer to String
    const decryptedText = decrypted.toString()
    // Compare the "before and after" hash
    expect(decryptedText).toBe(dataToEncrypt)
  })

  test('Encrypt and decrypt streams - Multiple keys', async () => {
    // Example data
    const dataToEncrypt = 'Will this work!!!?'
    // Encrypt
    const encrypted = await octosecret.stream.encrypt(dataToEncrypt, [`${example}/id_rsa2.pub`, `${example}/id_rsa.pub`])
    // Decrypt
    const decrypted = await octosecret.stream.decrypt(encrypted, `${example}/id_rsa`)
    // Convert Buffer to String
    const decryptedText = decrypted.toString()
    // Compare the "before and after" hash
    expect(decryptedText).toBe(dataToEncrypt)
  })
})
