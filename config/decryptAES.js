const forge = require('node-forge');
const RSA = require('node-rsa')
const { session } = require('passport')

const request = require('request')


module.exports = {
    decryptAES: function(body){

        console.log("decryptAES")
        console.log(body)
        const encryptedKey = Buffer.from(body.encryptedKey).toString();
        const serverAesKey = new RSA(session.key).decrypt(encryptedKey, 'base64')

        session.serverAESkey = serverAesKey
        session.key2 = Buffer.from(serverAesKey, 'base64');
        session.iv = Buffer.from(body.nonce, 'base64');
        tag = Buffer.from(body.tag, 'base64');
        encrypted = Buffer.from(body.cipherText, 'base64');

        session.AESKey = session.key2
        // console.log(key);
        // console.log(iv);
        // console.log(tag);
        // console.log(encrypted);

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
            // const encryptedKey = Buffer.from(body.encryptedKey).toString();
            // const serverAesKey = new RSA(session.key).decrypt(encryptedKey, 'base64')

            // key = Buffer.from(serverAesKey, 'base64');
            // iv = Buffer.from(body.nonce, 'base64');
            // tag = Buffer.from(body.tag, 'base64');
            encrypted = Buffer.from(JSON.stringify(body), 'base64');

            // console.log('body = ');
            // console.log(body);
            // console.log("encrypted = ");
            // console.log(encrypted);

            let key = forge.random.getBytesSync(16);
            let iv = forge.random.getBytesSync(16);


            //console.log("Session = ")
            //console.log(session)

            // console.log(session.publicRSAserverKey);
            // console.log(session.iv);
            // console.log(session.tag);
            var cipher = forge.cipher.createCipher('AES-GCM', key) //forge.util.createBuffer(key));
            cipher.start({
                iv: iv,  
                additionalData: 'binary-encoded string', // optional
                tagLength: 128,
            });
            cipher.update(forge.util.createBuffer(encrypted));
            pass = cipher.finish();
            // session.tag = cipher.mode.tag
            console.log("Finish? = ");
            console.log(pass);
            if(pass) {
                // console.log(cipher.output.toHex().toString('base64'));
                // console.log(Buffer.from(cipher.output.toHex()).toString('base64'));
                // console.log('2 = ')
                // console.log(Buffer.from(cipher.output.toHex()).toString('base64'));
                // console.log('3 = ')
                // console.log(Buffer.from(iv).toString('base64'));
                // console.log('4 = ')
                // console.log(Buffer.from(cipher.mode.tag.toHex()).toString('base64'));
                // console.log('5 = ')
                // console.log(cipher.output.toHex());
                // console.log('6 = ')
                // console.log(Buffer.from(key).toString('base64'));
                // console.log('6 = ')
                // console.log(forge.util.encode64(iv))
                // // let response = cipher.output
                // // let mess = {
                // //     'nonce': iv.toHex(),
                // //     'cipherText': response.toHex(),
                // //     'tag': cipher.mode.tag.toHex(),
                // //     'encryptedKey': iv.toHex()
                // // }


                
                console.log('11 = ')
                console.log(cipher.mode.tag);
                console.log('12 = ')
                console.log(cipher.mode.tag.toHex());
                console.log('13 = ')
                console.log(Buffer.from(cipher.mode.tag.toHex()).toString('base64'));
                console.log('14 = ')
                console.log(forge.util.encode64(cipher.mode.tag));
                console.log('15 = ')
                console.log(forge.util.encode64(cipher.mode.tag.toHex()));
                console.log('16 = ')
                console.log(Buffer.from(forge.util.encode64(cipher.mode.tag)).toString('base64'));
                console.log('17 = ')
                console.log(Buffer.from(forge.util.encode64(cipher.mode.tag.toHex())).toString('base64'));
                
                let rsakey
                const publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
                request.get(publicKeyLink,(error, response, RSAkey) => {
                    if (!error && response.statusCode == 200) {
                        rsakey = RSAkey
                        // console.log('RSAkey = ')
                        console.log(RSAkey)
                    }
                    // // const decryptedKey = Buffer.from(rsakey).toString();
                    // const serverAesKey = new RSA(rsakey).encrypt(key)

                    
                    const decryptedKey = Buffer.from(rsakey).toString();
                    const serverAesKey = new RSA(rsakey).encrypt(Buffer.from(key).toString('base64'), 'base64')
                    console.log(serverAesKey)
                    console.log(forge.util.encode64(serverAesKey))
                    let mess = {
                        'nonce': forge.util.encode64(iv),
                        'cipherText': forge.util.encode64(cipher.output.toHex()),
                        'tag': forge.util.encode64(cipher.mode.tag.data),
                        'encryptedKey': forge.util.encode64(serverAesKey)
                    }
                    // let mess = {
                    //     'nonce': Buffer.from(iv).toString('base64'),
                    //     'cipherText': Buffer.from(cipher.output.toHex()).toString('base64'),
                    //     'tag': Buffer.from(cipher.mode.tag.toHex()).toString('base64'),
                    //     'encryptedKey': serverAesKey
                    // }
                    console.log('mess = ')
                    console.log(mess)
                    resolve(mess);
                })
                // return (JSON.parse(response).response);
            }else{
                reject("ERROR Decrypt AES")
            }
        }
    )}
}
