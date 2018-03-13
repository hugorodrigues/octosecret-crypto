# octosecret-crypto

[![CircleCI](https://circleci.com/gh/hugorodrigues/octosecret-crypto/tree/master.svg?style=shield)](https://circleci.com/gh/hugorodrigues/octosecret-crypto/tree/master)
[![Known Vulnerabilities](https://snyk.io/test/github/hugorodrigues/octosecret-crypto/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hugorodrigues/octosecret-crypto?targetFile=package.json)
[![NSP Status](https://nodesecurity.io/orgs/hr/projects/0063ce22-5c84-4499-b89f-a4866183a4b1/badge)](https://nodesecurity.io/orgs/hr/projects/0063ce22-5c84-4499-b89f-a4866183a4b1)

> Encrypt and decrypt data using RSA keys

## What
Nodejs library that wraps openSSL to provide encryption and decryption of files and buffers. 
This was originally created to provide the crypto layer of [octosecret](https://github.com/hugorodrigues/octosecret), a CLI that allows easy data encryption and decryption between github users. 

## Features
- Encrypt and decrypt files
- Encrypt and decrypt streams (eg: text, buffer..)
- Encryption support multiple keys 

## Install
```sh
npm install octosecret-crypto --save
```

## API
File operations:
- **file.encrypt(origin, destination, keys)**
- **file.decrypt(origin, destination, [key])**

Stream operations:
- **stream.encrypt(data, keys)**
- **stream.decrypt(data, [key])**

Utils:
- **util.randomSymmetricKey(bytes)**
- **util.createEncryptionKey(keys)**
- **util.rsa2pkcs8(origin, destination)**
- **util.rsaEncrypt(data, pkcs8_file)**
- **util.rsaDecrypt(data, privateKey)**
- **util.base64Encode(data)**
- **util.base64Decode(data)**
- **util.fileEncrypt(origin, destination, key)**
- **util.fileDecrypt(origin, destination, key)**
- **util.bufferEncrypt(buffer, key)**
- **util.bufferDecrypt(buffer, key)**


## Examples
Encrypt and decrypt files
```js
const octo = require('octosecret-crypto')

// Encrypt "octocat.gif" to "octocat.gif.octosecret" using "public.key"
await octosecret.file.encrypt(`octocat.gif`, `octocat.gif.octosecret`, ['public.key'])

// Decrypt "octocat.gif.octosecret" to "octocat.gif" using "id_rsa" key
await octosecret.file.decrypt(`octocat.gif.octosecret`, `octocat.gif`, `~/.ssh/id_rsa`)
```

Encrypt and decrypt streams
```js
const octo = require('octosecret-crypto')

// Example data
const dataToEncrypt = "Super secret message"

// Encrypt
const encrypted = await octosecret.stream.encrypt(dataToEncrypt, ['public.key'])

// Decrypt
const decrypted = await octosecret.stream.decrypt(encrypted, `~/.ssh/id_rsa`)

// Convert Buffer to String
const decryptedText = decrypted.toString()
// "Super secret message"
```

Check `__test__` and `src/example.js` for more examples

## License

MIT © [Hugo Rodrigues](https://hugorodrigues.com)
