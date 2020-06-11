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

const keyRSA = new RSA({b:384})

let encrypt, decrypt;

const crypto = require('crypto');
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
                        //console.log(token1.length)
                        if(token1.length >= 30){
                            return done(null, token1) 
                        }else{
                            // postDataAndGetToken(messageEncrypted).then((token3) => {
                                    
                            //     return done(null, token3) 
                            // })
                        }
                    }).catch((e) => {
                        res.redirect('/')  // tutaj rzuca błąd, res niew widać
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
                    let key = new RSA(serverPublicKey)
                    key.setOptions('pkcs1_oaep')
                    let mess = key.encrypt(message, 'base64');
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
            const keyRSApublic = keyRSA.exportKey('pkcs1-public-pem')
            const keyRSAprivate = keyRSA.exportKey('pkcs1-pem')
            request.post({
                uri: logInLink,
                headers: {'Content-Type': 'application/json'},
                body: {
                    'data':messageEncrypted,
                    'public_key_PEM':keyRSApublic
                },
                json: true,
            }, async(error, response, body) => {
                let a
                try{
                    let encryptedKey = Buffer.from(body.encryptedKey).toString();
                    let serverAesKey = new RSA(keyRSAprivate).decrypt(encryptedKey, 'base64')

                    key = Buffer.from(serverAesKey, 'base64');
                    iv = Buffer.from(body.nonce, 'base64');
                    tag = Buffer.from(body.tag, 'base64');
                    encrypted = Buffer.from(body.cipherText, 'base64');
                    var decipher = forge.cipher.createDecipher('AES-GCM', forge.util.createBuffer(key));
                    decipher.start({
                      iv: iv,
                      tagLength: 128,
                      tag: forge.util.createBuffer(tag)
                    });
                    temp = decipher.update(forge.util.createBuffer(encrypted));
                    console.log(temp);
                    pass = decipher.finish();
                    console.log(pass);
                    if(pass) {
                        let response = decipher.output.toString('utf-8')
                      console.log(response);
                      console.log(JSON.parse(response).response)
                      resolve(JSON.parse(response).response);
                    }
                }catch(e){
                    console.log('Catch ERROR')
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