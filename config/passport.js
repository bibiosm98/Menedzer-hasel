const express = require('express')
const router = express.Router()
const request = require('request')
const RSA = require('node-rsa')
const passport = require('passport')


const LocalStrategy = require('passport-local').Strategy

module.exports = function(passport, token2){
    passport.use('local',
        new LocalStrategy({ usernameField: 'login', userpasswordField: 'password' }, (login, password, done) => {
            console.log(login)
            console.log(password)
            console.log("LOCAL STRATEGY")



            console.log("passport.authenticate req res")
                let message = JSON.stringify({"login": login, "password": password})
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
                        return done(null, token1) 
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
            request.get(publicKeyLink,(error, response, body) => {
                console.log("SIGNV_IN_ GET")
                if (!error && response.statusCode == 200) {
                    serverPublicKey = body
                    let key = new RSA(serverPublicKey)
                    key.setOptions('pkcs1_oaep')
                    resolve(key.encrypt(message, 'base64'))
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
    return new Promise((resolve, reject) => {
        try{
            console.log("SIGNV_IN_ post try")
            request.post({
                uri: logInLink,
                headers: {'Content-Type': 'text/plain'},
                body: messageEncrypted
            }, (error, response, body) => {
                let a 
                try{
                    a = JSON.parse(body)
                    if(a.response == "NOT LOGGED IN"){
                        console.log('not logged in')
                        // reject('NOT LOGGED IN')
                        resolve('NOT LOGGED IN')
                    }else{
                        console.log(body)
                        console.log('ELSE')
                        let token2 = JSON.parse(body).response
                        resolve(token2)
                    }
                }catch(e){
                    console.log('LOGIN NOT FIND')
                    // reject('LOGIN NOT FIND')
                    resolvet('LOGIN NOT FIND')
                }
            })
        }catch(e){
            reject(e)
        }
    })
}