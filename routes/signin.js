const express = require('express')
const router = express.Router()
const request = require('request')
const PEM = require('pem-file')
const RSA = require('node-rsa')

router.post('/', (req, res) => {
    console.log(req.body)

    let publicKeyLink = 'https://fast-ridge-60024.herokuapp.com/api/GetPublicKey'
    let logInLink = 'https://fast-ridge-60024.herokuapp.com/api/SignIn'
    let data = {}
    let message = JSON.stringify({"login": req.body.login, "password": req.body.password})
    // console.log(message)
    // console.log(PEM.encode(Buffer.from(message), 'DATA'))

    let serverPublicKey
    let messageEncrypted
    try{
        request.get(publicKeyLink,(error, response, body) => {
            if (!error && response.statusCode == 200) {
                // console.log(body)
                serverPublicKey = body
                // console.log("ODKODOWANY")
                // console.log(PEM.decode(Buffer.from(body), 'DATA'))
                // console.log("KLUCZ SERWERA\n")
                // console.log(MY_KEY)
                // console.log(message)
                const key = new RSA(serverPublicKey)
                key.setOptions('pkcs1_oaep')
                messageEncrypted = key.encrypt(message, 'base64')
                // console.log(messageEncrypted)

                try{
                    request.post({
                        uri: logInLink,
                        headers: {'Content-Type': 'text/plain', token: "dasdafafafas..."},
                        body: messageEncrypted
                    }, (error, res, body) => {
                        console.log(body)
                    });


                    // request.post(link,
                    //     {
                
                    //     },
                    //     (error, response, body) => {
                    //         if (!error && response.statusCode == 200) {
                    //             console.log("Body: ")
                    //             console.log(body)
                    //             // console.log("Response: ")
                    //             // console.log(response)
                    //         }
                    //         data.response = body.response
                            
                    //         if(data.response === 'OK'){
                    //             // console.log("IF")
                    //             data.response = null
                    //             res.render('./index', {data: data})
                    //         }else{
                    //             // console.log("ELSE")
                    //             res.render('signup', {data: data})
                    //         }
                    //     })
                }catch{
                    res.send("Error creating SignIn: " + data.response)
                }
            }
        });
    }catch(e){
        console.log(e)
    }
    res.render('index', {data: "aa"})
})


module.exports = router