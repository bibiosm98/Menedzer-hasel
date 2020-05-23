const express = require('express')
const router = express.Router()
const request = require('request')
const RSA = require('node-rsa')

router.post('/', (req, res) => {
    let message = JSON.stringify({"login": req.body.login, "password": req.body.password})
    getPublicKeyFromServer(message)
    .then((messageEncrypted) => {
        postDataAndGetToken(messageEncrypted)
        .then((token1) => {
            token = token1
            getUserAllSites(token1).then((data) => {
                res.render('./user/allSites', {data: data})
            })
        })
    })
})

router.get('/', (req, res) => {
    getUserAllSites(token).then((data) => {
        res.render('./user/allSites', {data: data})
    })
})

function getPublicKeyFromServer(message){
    let publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
    let messageEncrypted = ''
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
                console.log(body)
                let token2 = JSON.parse(body).response
                resolve(token2)
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
                    console.log("ASd")
                    console.log(body)
                    JSON.parse(body).forEach(element => {
                        data.push(element)
                    });
                    resolve(data)
                }
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = router