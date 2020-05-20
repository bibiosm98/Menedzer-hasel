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
                    res.render('./index', {data: data})
                }else{
                    // console.log("ELSE")
                    res.render('signup', {data: data})
                }
            })
    }catch{
        res.send("Error creating new account: " + data.response)
    }
})

module.exports = router