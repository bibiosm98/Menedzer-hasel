const express = require('express')
const router = express.Router()
const request = require('request')
const PEM = require('pem-file')
const RSA = require('node-rsa')

router.post('/', (req, res) => {
    let publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
    let logInLink = 'https://fast-ridge-60024.herokuapp.com/api/SignIn'
    let getLink = 'https://fast-ridge-60024.herokuapp.com/api/AllSites'
    let data = []
    let message = JSON.stringify({"login": req.body.login, "password": req.body.password})

    let serverPublicKey
    let messageEncrypted
    try{
        request.get(publicKeyLink,(error, response, body) => {
            if (!error && response.statusCode == 200) {
                serverPublicKey = body
                const key = new RSA(serverPublicKey)
                key.setOptions('pkcs1_oaep')
                messageEncrypted = key.encrypt(message, 'base64')
                try{
                    request.post({
                        uri: logInLink,
                        headers: {'Content-Type': 'text/plain'},
                        body: messageEncrypted
                    }, (error, response, body) => {
                        console.log(body)
                        token = JSON.parse(body).response
                        console.log(token)
                        
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
                                    }
                                    res.render('./user/allSites', {data: data})
                                })
                            }catch{}

                    });
                }catch{
                    res.send("Error SignIn waiting for token: " + data.response)
                }
            }
        });
    }catch(e){
        console.log(e)
        res.send("SignIn error while GET publicServerKey :(")
    }
})


module.exports = router