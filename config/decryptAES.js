const forge = require('node-forge');
const RSA = require('node-rsa')
const { session } = require('passport')

module.exports = {
    decryptAES: function(body){
        console.log(body)
        const encryptedKey = Buffer.from(body.encryptedKey).toString();
        const serverAesKey = new RSA(session.key).decrypt(encryptedKey, 'base64')

        key = Buffer.from(serverAesKey, 'base64');
        iv = Buffer.from(body.nonce, 'base64');
        tag = Buffer.from(body.tag, 'base64');
        encrypted = Buffer.from(body.cipherText, 'base64');

        // console.log(key);
        // console.log(iv);
        // console.log(tag);
        // console.log(encrypted);
        var decipher = forge.cipher.createDecipher('AES-GCM', forge.util.createBuffer(key));
        decipher.start({
        iv: iv,
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
    }
}