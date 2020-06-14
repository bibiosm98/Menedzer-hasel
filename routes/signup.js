const express = require('express')
const router = express.Router()
const request = require('request')


// const RSA = require('node-rsa')
// let rsa = new RSA({b: 1024})

let clientRSA = new require('node-rsa')({b: 1024})

clientRSA.setOptions('pkcs8-public')
const clienKeyRSApublic = clientRSA.exportKey('pkcs1-public-pem')
const clientKeyRSAprivate = clientRSA.exportKey('pkcs1-pem')

console.log(clienKeyRSApublic)
console.log(clientKeyRSAprivate)

router.get('/', (req, res) => {
    res.render('signup', {data: {}})
})

router.post('/', async (req, res) => {
    let link = 'https://fast-ridge-60024.herokuapp.com/api/SignUp'
    let data = {}
    data.email = req.body.email
    data.login = req.body.login
    try{
        request.post(link,
            {
                json: {
                    "email": req.body.email,
                    "login": req.body.login,
                    "password": req.body.password
                }
            },
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    console.log("Body: ")
                    console.log(body)
                    // console.log("Response: ")
                    // console.log(response)
                }
                data.response = body.response
                
                if(data.response === 'OK'){
                    // console.log("IF")
                    data.response = null
                    res.redirect('./')//, {data: data})
                }else{
                    // console.log("ELSE")
                    res.render('signup', {data: data})
                }
            })
    }catch{
        res.send("Error creating new account: " + data.response)
    }
})

router.post('/checkStrength', (req, res) => {
    console.log(req.body.password)
    request.get('https://fast-ridge-60024.herokuapp.com/api/GetPublicKey', (error, response, body) => {
        if (!error) {
            console.log("Encrypted with pure RSA")
            console.log()
            console.log()
            console.log(req.body.password)
            // let key = new RSA(serverPublicKey)
            // key.setOptions('pkcs1_oaep')
            // let mess = key.encrypt(message, 'base64');
            // resolve(mess)
            // const keyRSApublic = rsa.exportKey('pkcs1-public-pem')
            // const keyRSAprivate = rsa.exportKey('pkcs1-pem')
            // console.log()
            // console.log(keyRSApublic)
            // console.log()
            // console.log(keyRSAprivate)
             rsa = new RSA(`-----BEGIN RSA PRIVATE KEY-----
             MIICXQIBAAKBgQDZNvsSpBVZsiRWYuTZBRdEiDhb7p84suQn01NmnED8G165M/lE
             ETHKgj4XANpnllepSchDIeCcxVwLi2jBbouI2R7f7p1rCx9AJywrZ2+Uq6TDlgu4
             1r2sDBlMO10kBu6cI97RLS0Vuy2gCv0+tU0kBakiAfirSnUgcUm5MWnuIQIDAQAB
             AoGAWX3eeXKi3T6Y3AKImKURTgn1dmLctKZ3e7UEYn00BOpd3137b8DJy85XOHEA
             ircVTMj6OjZl7REe+B6qvS8HS0rpUZDv944wllRXVUJccWyEkrc7i2q7ifhsfp4r
             QklRv8b+soP4DmE/KoRhdz7tVc+twUSqJbW9tsSuT0W7kzECQQD3Ty11L9kmJmSF
             Go6c4Z3lNzkmQcCXir/8ED7dr47itZjBG0+0PHp7LilYieD1iSadKIMQ+np4bzaO
             tttMP5INAkEA4NkRySPqclp2FNTjvc4kzm4UN+K/SoURx2fOZTxV7OGKFi4bU21W
             PlL07HTUcIuUYrasXNipLMgtWVpBYVnLZQJBAMrUf13bTmeBmXOpIkn8qLkzn4WG
             6+PeAjNDR6wdrjy134CRW79g0rtwUqyw+HWodKj0bvpf1E4uODq4MgfJI4kCQQC0
             zznTMpOMY5xDAjMlZckJS1Hs4uUK6tkyLhK2K/+43mFplqgYvXq14YXdQ9G1szie
             7ODMRNo+DbcR/FdJDqlVAkAHw3viKfLtL3iz14YFk1rJdlgmPOBwLoRi3ph2s+jB
             iO+BXfwn/zktg9ZdRi31m2af5Ga4JqEOTKcd6/DiSdrJ
             -----END RSA PRIVATE KEY-----`)
                
            rsa.setOptions('pkcs1')
            let decrypted = rsa.decrypt(Buffer.from(req.body.password).toString(), 'base64')//.toString('base64')
            console.log('Decrypted')
            console.log()
            console.log(decrypted)
            console.log()
            rsa = new RSA(body)
            rsa.setOptions('pkcs1_oaep')
            let encrypted = Buffer.from(rsa.encrypt(JSON.stringify({"password": req.body.password})), 'base64').toString('base64')
            console.log(encrypted)
            request.post({
                url:'https://fast-ridge-60024.herokuapp.com/api/PasswordStrength',
                body : encrypted,
                'Content-Type': 'text/plain'
            },
            (error, response, body) => {
                const strength = JSON.parse(body).passwordStrength
                console.log(body)
                res.send({"strength": strength})
            })
        }
    })
})


router.get('/PublicRsaKey', (req, res) => {
    res.send(clienKeyRSApublic)
})
module.exports = router


