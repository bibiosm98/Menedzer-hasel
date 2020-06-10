const express = require('express')
const router = express.Router()
const request = require('request')
const RSA = require('node-rsa')
const passport = require('passport')
const getPem = require('rsa-pem-from-mod-exp');

const modulus =  "niqcAxl7L1lB0kE6q9AcAd8EE+0W6AsriR9Fs9T+6QVXl8uiCiAbh/KCyy8X8C2bHsFpNBvwGTqMwHbqZqWBVUvYRtfCFcy3Xmertb09DnOBeWqKS4181kss97JDO6G07QNbuLSWwkkO82CHD1kUmeF5/dof0Ra6bsRXqppdo86NzlgFud+E2s5BM3XwewZVSpA69bwEiXaRDhrsg5mqeOm68VyxE8LQu+895kKsBnTvTueZTrXT+HNaIveoYe8+Lb7b/mZYtlhrDK0i/8EDox85vxnzKZ7wNswqqcDg6vfC2911phSTPh13jv2FIOkjO/WHhHEzRnS2VQqivqIbsQ";
const exponent = "AQAB";
const PEM = getPem(modulus, exponent);


const forge = require('node-forge');
// let privateKey, publicKey
// let rsa = forge.pki.rsa
// let keyPair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

// let key = forge.random.getBytesSync(16)
// let iv = forge.random.getBytesSync(16)

const keyRSA = new RSA({b:512})


const LocalStrategy = require('passport-local').Strategy

module.exports = function(passport, token2){
    passport.use('local',
        new LocalStrategy({ usernameField: 'login', userpasswordField: 'password' }, (login, password, done) => {
            console.log(login)
            console.log(password)
            console.log("LOCAL STRATEGY")
            console.log("passport.authenticate req res")
                let message = JSON.stringify({'login': login, 'password': password})
                getPublicKeyFromServer(message)
                .then((messageEncrypted) => {
                    postDataAndGetToken(messageEncrypted)
                    .then((token1) => {
                        console.log('passport authenticate')  
                        token = token1
                        // getUserAllSites(token1).then((data) => {
                        //     res.render('./user/allSites', {data: data})
                        // }).catch((e) => {
                        //     res.redirect('/')
                        // })        
                        console.log(token1.length)
                        if(token1.length >= 30){
                            return done(null, token1) 
                        }else{
                            // postDataAndGetToken(messageEncrypted).then((token3) => {
                                    
                            //     return done(null, token3) 
                            // })
                        }
                    }).catch((e) => {
                        res.redirect('/')
                    })
                }).catch((e) => {

                })
        })
    )
    passport.serializeUser((token, done) => {
        console.log('serializable')
        console.log('token: ' + token)
        done(null, token);
    });
    
    passport.deserializeUser(function(token, done) {
        console.log('deserializable')
        return done(null, token);
    });
}

function getPublicKeyFromServer(message){
    let publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
    return new Promise((resolve, reject) => {
        try{
            request.get(publicKeyLink, async (error, response, body) => {
                console.log("SIGNV_IN_ GET" )
                if (!error && response.statusCode == 200) {
                    serverPublicKey = body
                    // console.log(body);
                    //console.log("MESSAGE = " + message)
                    //console.log("SERVER PUBLIC KEY = " + serverPublicKey)
                    let key = new RSA(serverPublicKey)
                    key.setOptions('pkcs1_oaep')

                    // message to     let message = JSON.stringify({"login": login, "password": password})
                    // to jest body w dalszej części
                    let mess = key.encrypt(message, 'base64');
                    console.log("Message to server = ")
                    console.log(message)
                    console.log("Message encrypted by RSA server public key = ")
                    console.log(mess)
                    //console.log("MESSAGE BASE 64 = " + mess)
                    //mess = new Buffer.alloc(mess.length, (mess).toString('ascii'))
                    //console.log("MESSAGE to ASCII = " + mess)
                    resolve(mess)
                }
            })
        }
        catch(e){
            reject('SignIn error while GET publicServerKey :(')
        }
    })
}

function postDataAndGetToken(messageEncrypted){
    let logInLink = 'https://fast-ridge-60024.herokuapp.com/api/SignIn'
    return new Promise(async (resolve, reject) => {
        try{
            
            console.log("SIGNV_IN_ post try")
            console.log("KEY PAIR")
            keyRSA.setOptions('pkcs1_oaep')
            keyRSA.generateKeyPair()
            let keyRSApublic = keyRSA.exportKey('pkcs1-public-pem')
            let keyRSAprivate = keyRSA.exportKey('pkcs1-pem')
            // console.log(keyRSApublic)
            // console.log(keyRSAprivate)
            
            // console.log(keyPair)
            // });
            // console.log("KEY PUBLIC")
            // console.log(forge.pki.publicKeyToPem(keyPair.publicKey))
            // console.log("GET PEM = ")
            // console.log(PEM)
            request.post({
                uri: logInLink,
                headers: {'Content-Type': 'application/json'},
                body: {
                    'data':messageEncrypted,
                    'public_key_PEM':keyRSApublic
                },
                json: true,
            }, (error, response, body) => {
                let a
                try{
                    console.log("BODY = ")
                    console.log(body)
                    console.log()

                    console.log("NONCE = ")
                    console.log(body.nonce)
                    console.log(Buffer.from(body.nonce, 'utf-8').toString('base64'))

                    console.log()
                    console.log("CipherText = ")
                    console.log(body.cipherText)
                    let cipherText = Buffer.from(body.cipherText, 'utf-8').toString('base64')
                    console.log(cipherText)

                    console.log()
                    console.log("TAG = ")
                    console.log(body.tag)
                    let tag = Buffer.from(body.tag, 'utf-8').toString('base64')
                    console.log(tag)

                    console.log()
                    console.log("EncryptedKey = ")
                    console.log(body.encryptedKey)
                    let encryptedKey = Buffer.from(body.encryptedKey, 'utf-8').toString('base64')
                    console.log(encryptedKey)


                    console.log()
                    console.log('SERVER AES KEY = ')
                    let serverAesKey = keyRSA.decrypt(encryptedKey, 'base64')
                    console.log(serverAesKey)

                    let aesKEY = Buffer.from(serverKey).toString('base64')
                    console.log(aesKEY);


                    // console.log("ENCRYPTED text from cipherText = ")
                    // var decipher = forge.cipher.createDecipher('AES-GCM', aesKEY);
                    // decipher.start({
                    //     iv: Buffer.from(body.nonce).toString('base64'),
                    //     //additionalData: 'binary-encoded string', // optional
                    //     tagLength: 96, // optional, defaults to 128 bits
                    //     tag: Buffer.from(body.tag).toString('base64') // authentication tag from encryption
                    // });
                    // decipher.update(Buffer.from(body.cipherText).toString('base64'));
                    // var pass = decipher.finish();
                    // // pass is false if there was a failure (eg: authentication tag didn't match)
                    // if(pass) {
                    // // outputs decrypted hex
                    //     console.log(decipher.output.toHex());
                    // }

                    console.log(a);
                    //if(a.nonce != "NOT LOGGED IN"){
                        console.log('not logged in')
                        // reject('NOT LOGGED IN')
                        resolve('NOT LOGGED IN')
                   // }else{
                        console.log(body)
                        console.log('ELSE')
                        //let token2 = JSON.parse(body).response
                        //resolve(token2)
                    //}
                }catch(e){
                    console.log('LOGIN NOT FIND2')
                    // reject('LOGIN NOT FIND')
                    resolve('LOGIN NOT FIND')
                }
            })
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}