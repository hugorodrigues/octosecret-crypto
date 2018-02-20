# octosecret-crypto

Encrypt and decrypt data using RSA keys

[![CircleCI](https://circleci.com/gh/hugorodrigues/octosecret-crypto/tree/master.svg?style=shield)](https://circleci.com/gh/hugorodrigues/octosecret-crypto/tree/master)
[![Known Vulnerabilities](https://snyk.io/test/github/hugorodrigues/octosecret-crypto/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hugorodrigues/octosecret-crypto?targetFile=package.json)
[![NSP Status](https://nodesecurity.io/orgs/hr/projects/0063ce22-5c84-4499-b89f-a4866183a4b1/badge)](https://nodesecurity.io/orgs/hr/projects/0063ce22-5c84-4499-b89f-a4866183a4b1)

## Install
```shell
npm install octosecret-crypto --save
```

## Usage

```js
const octo = require('octosecret-crypto')
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Buffer](#buffer)
    -   [encrypt](#encrypt)
    -   [decrypt](#decrypt)
-   [Crypto](#crypto)
    -   [randomSymmetricKey](#randomsymmetrickey)
    -   [rsa2pkcs8](#rsa2pkcs8)
    -   [rsaEncrypt](#rsaencrypt)
    -   [rsaDecrypt](#rsadecrypt)
    -   [base64Encode](#base64encode)
    -   [base64Decode](#base64decode)
    -   [fileEncrypt](#fileencrypt)
    -   [fileDecrypt](#filedecrypt)
    -   [bufferEncrypt](#bufferencrypt)
    -   [bufferDecrypt](#bufferdecrypt)
-   [decrypt](#decrypt-1)
-   [encrypt](#encrypt-1)
-   [Process](#process)
    -   [spawn](#spawn)
    -   [openssl](#openssl)
    -   [sshKeygen](#sshkeygen)

### Buffer

Encrypt and decrypt buffers

#### encrypt

Encrypt buffer

**Parameters**

-   `input`  
-   `key` **Path** 

#### decrypt

Decrypt buffer

**Parameters**

-   `input`  
-   `key` **Path** 

### Crypto

Crypto utils

#### randomSymmetricKey

Generate a random symmetric key to be used for encryption
Default to 32 bytes key, which gives us the 256 bit key

**Parameters**

-   `bytes` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**  (optional, default `32`)

Returns **any** Promise

#### rsa2pkcs8

Converts a RSA key into a PKCS8

**Parameters**

-   `origin` **Path** 
-   `destination` **Path** 

#### rsaEncrypt

RSA Encrypt (using a PKCS8 key)

**Parameters**

-   `data` **[Buffer](#buffer)** 
-   `pkcs8_file` **Path** 

Returns **any** Promise

#### rsaDecrypt

RSA Decrypt

**Parameters**

-   `data` **[Buffer](#buffer)** 
-   `privateKey` **Path**  (optional, default `` `${process.env.HOME}/.ssh/id_rsa` ``)

Returns **any** Promise

#### base64Encode

Base64 encode via openssl

**Parameters**

-   `data`  

#### base64Decode

Base64 decode via openssl

**Parameters**

-   `data`  

#### fileEncrypt

Encrypt a file using the provided key

**Parameters**

-   `origin` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Path location
-   `destination` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Path location
-   `key` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

#### fileDecrypt

Decrypt a file using the provided key

**Parameters**

-   `origin` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Path location
-   `destination` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Path location
-   `key` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

#### bufferEncrypt

Decrypt a Buffer using the provided key

**Parameters**

-   `buffer`  
-   `key` **Path** 

#### bufferDecrypt

Decrypt a Buffer using the provided key

**Parameters**

-   `buffer`  
-   `key` **Path** 

### decrypt

Decrypt a file using a private key

**Parameters**

-   `origin` **Path** 
-   `destination` **Path** 
-   `key` **Path** 

### encrypt

Encrypt file using a public key

**Parameters**

-   `origin` **Path** 
-   `destination` **Path** 
-   `key` **Path** 

### Process

External process utilities

#### spawn

Spawn a new process

**Parameters**

-   `cmd` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Command to execute
-   `arg` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Command arguments
-   `stdin`  
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Optional process options (check node docs)

#### openssl

Wrapper around openssl command

**Parameters**

-   `arg` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Arguments
-   `stdin`  
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Optional process options (check node docs)

#### sshKeygen

Wrapper around ssh-keygen command

**Parameters**

-   `arg` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Arguments
-   `stdin`  
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Optional process options (check node docs)

## Examples

Check `__test__` and `src/example.js`

## License

MIT © [Hugo Rodrigues](https://hugorodrigues.com)
