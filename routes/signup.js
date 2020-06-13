const express = require('express')
const router = express.Router()
const request = require('request')

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
            console.log(body)
            // let key = new RSA(serverPublicKey)
            // key.setOptions('pkcs1_oaep')
            // let mess = key.encrypt(message, 'base64');
            // resolve(mess)
            const RSA = require('node-rsa')
            const rsa = new RSA(body)
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
module.exports = router


