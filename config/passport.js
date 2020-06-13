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
const { session } = require('passport')
const keyRSA = new RSA({b:384})
keyRSA.setOptions('pkcs1_oaep')
keyRSA.generateKeyPair()
const keyRSApublic = keyRSA.exportKey('pkcs1-public-pem')
const keyRSAprivate = keyRSA.exportKey('pkcs1-pem')
session.key = keyRSAprivate
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
                        if(token1.length >= 30){
                            return done(null, token1) 
                        }else{
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
            console.log("postDataAndGetToken")
            console.log("SIGNV_IN_ post try")
            request.post({
                uri: logInLink,
                headers: {'Content-Type': 'application/json'},
                body: {
                    'data':messageEncrypted,
                    'public_key_PEM':keyRSApublic
                },
                json: true,
            }, (error, response, body) => {
                try{
                    console.log(body)
                    const {decryptAES} = require('../config/decryptAES')
                    console.log("AESresponse")
                    // const AESresponse = decryptAES(JSON.parse(body))
                    const AESresponse = decryptAES(body)
                    resolve(JSON.parse(AESresponse).response)
                }catch(e){
                    console.log('Catch ERROR')
                    resolve('LOGIN NOT FIND')
                }
            })
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}