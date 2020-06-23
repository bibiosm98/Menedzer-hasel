const forge = require('node-forge');
const RSA = require('node-rsa')
const { session } = require('passport')

const request = require('request')


module.exports = {
    decryptAES: function(body){

        console.log("decryptAES")
        console.log(body)
        const serverAesKey = new RSA(session.key).decrypt(body.encryptedKey, 'base64')

        console.log("serverAesKey")
        console.log(serverAesKey)
        console.log('Buffer.from(serverAesKey, "base64")')
        console.log(Buffer.from(serverAesKey, 'base64'))
        console.log('forge.util.createBuffer(session.key2)')
        console.log(forge.util.createBuffer(Buffer.from(serverAesKey, 'base64')))



        session.serverAESkey = serverAesKey
        session.key2 = Buffer.from(serverAesKey, 'base64');
        console.log(session.key2)
        session.iv = Buffer.from(body.nonce, 'base64');
        tag = Buffer.from(body.tag, 'base64');
        encrypted = Buffer.from(body.cipherText, 'base64');

        session.AESKey = session.key2

        var decipher = forge.cipher.createDecipher('AES-GCM', forge.util.createBuffer(session.key2));
        decipher.start({
            iv: session.iv,
            tagLength: 128,
            tag: forge.util.createBuffer(tag)
        });
        temp = decipher.update(forge.util.createBuffer(encrypted));
        // console.log(temp);
        pass = decipher.finish();
        // console.log(pass);
        if(pass) {
            let response = decipher.output.toString('utf-8')
            console.log(response);
            // console.log(JSON.parse(response).response)
            return (response);
            // return (JSON.parse(response).response);
        }else{
            return "ERROR Decrypt AES"
        }
    },
    encryptAES: function(body){
        return new Promise((resolve, reject)=>{
            console.log("ENCRYPT AES ")
            console.log(JSON.stringify(body))
            encrypted = Buffer.from(JSON.stringify(body), 'base64');

            let key = forge.random.getBytesSync(16);
            let iv = forge.random.getBytesSync(16);
            console.log('key = ')
            // console.log(forge.util.createBuffer(key)) automatycznie na base64, domyślnie
            console.log(forge.util.createBuffer(key), 'base64')
            // console.log(Buffer.from(key, 'base64'))
            // console.log(forge.util.decode64(key))
            var cipher = forge.cipher.createCipher('AES-GCM', key) //forge.util.createBuffer(key), 'base64') //forge.util.createBuffer(key));


            console.log('forge.util.createBuffer(key)')
            console.log(forge.util.createBuffer(key))
            console.log('Buffer.from(forge.util.createBuffer(key)), "base64"')
            // console.log(forge.util.decode64(forge.util.createBuffer(key)))
            // console.log(iv)
            // console.log(forge.util.createBuffer(iv))
            // console.log(Buffer.from(iv, 'base64'))
            // console.log(forge.util.encode64(forge.util.createBuffer(iv)))

            cipher.start({
                iv: iv,  
                additionalData: 'binary-encoded string', // optional
                tagLength: 128,
            });
            cipher.update(forge.util.createBuffer(JSON.stringify(body)))//forge.util.createBuffer(encrypted));
            pass = cipher.finish();
            // session.tag = cipher.mode.tag
            console.log("Finish? = ");
            console.log(pass);
            if(pass) {
                let rsakey
                const publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
                request.get(publicKeyLink,(error, response, RSAkey) => {
                    if (!error && response.statusCode == 200) {
                        rsakey = RSAkey
                        console.log('RSAkey = ')
                        console.log(RSAkey)
                    }
                    // const serverAesKey1 = new RSA(session.key).decrypt(body.encryptedKey, 'base64')
                    // forge.util.createBuffer(Buffer.from(serverAesKey1, 'base64'))

                    console.log('key')
                    console.log(key)
                    // console.log('forge.util.createBuffer(key), "base64"')
                    // console.log(forge.util.createBuffer(key), 'base64')
                    // console.log('forge.util.encode64(key)')
                    // console.log(forge.util.encode64(key))
                    // console.log("NOWY BUFFER = ")
                    // console.log(new Buffer(forge.util.encode64(key), 'base64').toString('ascii'))
                    console.log()
                    const rSa = new RSA()
                    rSa.importKey(rsakey)
                    rSa.setOptions('pkcs1_oaep')
                    serverAesKey1 = rSa.encrypt(forge.util.encode64(key), 'utf-8')
                    console.log(key.toString('base64').toString('utf-8'))
                    console.log(key.toString('base64'))
                    console.log("TO BEDZIE TO")
                    console.log(forge.util.encode64(serverAesKey1))
                    console.log(forge.util.encode64(key))
                    // console.log(forge.util.encode64(serverAesKey1))
                    // console.log(forge.util.encode64(serverAesKey1), 'base64')


                    let mess = {
                        'nonce': forge.util.encode64(iv),
                        'cipherText': Buffer.from(cipher.output.toHex(), 'hex').toString('base64'),//forge.util.encode64(Buffer.from(cipher.output.toHex(), 'hex').toString('utf-8')),
                        'tag': forge.util.encode64(cipher.mode.tag.data),
                        'encryptedKey': forge.util.encode64(serverAesKey1)
                    }
                    console.log('mess = ')
                    console.log(mess)
                    

                                            var decipher = forge.cipher.createDecipher('AES-GCM', key);
                                            decipher.start({
                                                iv: iv,//Buffer.from(mess.nonce, 'base64'),
                                                additionalData: 'binary-encoded string', // optional
                                                tagLength: 128, // optional, defaults to 128 bits
                                                tag: cipher.mode.tag // authentication tag from encryption
                                            });
                                            decipher.update(cipher.output);
                                            var pass2 = decipher.finish();
                                            // pass is false if there was a failure (eg: authentication tag didn't match)
                                            if(pass2) {
                                                // outputs decrypted hex
                                                console.log("DESZYFROWANE??? = ")
                                                console.log(decipher.output.toHex());
                                                console.log(Buffer.from(decipher.output.toHex(), 'hex').toString('base64'));
                                                console.log(Buffer.from(decipher.output.toHex(), 'hex').toString('utf-8'));
                                            }


                    resolve(mess);
                })
            }else{
                reject("ERROR Decrypt AES")
            }
        }
    )}
}