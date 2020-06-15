const express = require('express')
const router = express.Router()
const request = require('request')


let RSA = require('node-rsa')
let rsa = new RSA({b: 1024})

// let clientRSA = new require('node-rsa')({b: 1024})

// clientRSA.setOptions('pkcs8')
// const clienKeyRSApublic = clientRSA.exportKey('pkcs8-public-pem')
// const clientKeyRSAprivate = clientRSA.exportKey('pkcs8-pem')

// console.log(clienKeyRSApublic)
// console.log(clientKeyRSAprivate)


// const rsa2 =  require('js-crypto-rsa')
// let publicKey
// let privateKey
// rsa2.generateKey(2048).then( (key) => {
//     // now you get the JWK public and private keys
//     publicKey = key.publicKey;
//     console.log(publicKey)
//     privateKey = key.privateKey;
//     //console.log(privateKey)
// })



// let forge = require('node-forge');
// let rsaForge = forge.pki.rsa
// let keypair = rsaForge.generateKeyPair({bits: 1024, e: 0x10001});
// // console.log(keypair)
// console.log(keypair.publicKey)
// const forgeRSApublic = keypair.publicKey
// const forgeRSAprivate = keypair.privateKey

// let subjectPublicKeyInfo = forge.pki.publicKeyToAsn1(forgeRSApublic);
// let der = forge.asn1.toDer(subjectPublicKeyInfo).getBytes();




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
    console.log(req.body)
    request.get('https://fast-ridge-60024.herokuapp.com/api/GetPublicKey', (error, response, body) => {
        if (!error) {
            console.log("Encrypted with pure RSA")
            console.log()
            console.log(body)
            // console.log(req.body)
            

            // let decrypted = Buffer.from(req.body.password, 'base64');
            // console.log(decrypted.length)
            // console.log(decrypted.toString().length)
            // console.log(decrypted.toString('utf8').length)
            // console.log(decrypted.toString('base64'))
            // forgeRSAprivate.decrypt(req.body.password, 'RSA-OAEP')


            rsa = new RSA(body)
            rsa.setOptions('pkcs1_oaep')
            let encrypted = Buffer.from(rsa.encrypt(JSON.stringify({"password": req.body.password})), 'base64').toString('base64')
            console.log(encrypted)
            request.post({
                url:'https://fast-ridge-60024.herokuapp.com/api/PasswordStrength',
                // body : "sddfa342122#!D  ",
                body : encrypted,
                // body :  req.body.password,
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


// router.get('/PublicRsaKey', (req, res) => {
//     res.send({
//         'public': der
//     })
//     // res.send(publicKey)

    
//     // 'Access-Control-Allow-Origin': '*',
// })
module.exports = router


