const express = require('express')
const router = express.Router()
const request = require('request')
const RSA = require('node-rsa')
const { session } = require('passport')
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/authenticated');
const inicializePassport = require('../config/passport')
router.post('/', 
    passport.authenticate('local', //'local-token', 
    {
        successRedirect: '/signin',
        failureRedirect: '/signup',
        failureFlash: true
    })
)

// GET AllSites route for user
router.get('/', (req, res) => {
    console.log("SIGNIN GET")
    console.log(req.session)
    getUserAllSites(req.session.passport.user).then((data) => {
        res.render('./user/allSites', {data: data})
    })
})

router.get('/signout', (req, res) => {
    token = ''
    res.redirect('/')
})

function getPublicKeyFromServer(message){
    let publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
    return new Promise((resolve, reject) => {
        try{
            request.get(publicKeyLink,(error, response, body) => {
                console.log("SIGNV_IN_ GET")
                if (!error && response.statusCode == 200) {
                    serverPublicKey = body
                    console.log('signin body = ')
                    console.log(body)
                    session.publicRSAserverKey = serverPublicKey
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

function getUserAllSites(token){
    let getLink = 'https://fast-ridge-60024.herokuapp.com/api/AllSites' 
    let data = []
    return new Promise((resolve, reject) => {
        try{
            request.get({
                uri: getLink,
                headers: {'Content-Type': 'application/json', 'token': token},
                body: ""
            },
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    console.log("User AllSites body")
                    const {decryptAES} = require('../config/decryptAES')
                    const AESresponse = decryptAES(JSON.parse(body))
                    try{
                        JSON.parse(AESresponse).forEach(element => {
                            data.push(element)
                        });
                    }catch(e){
                        reject(e)
                    }
                    resolve(data)
                }
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = router