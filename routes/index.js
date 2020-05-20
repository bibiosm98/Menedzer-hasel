const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/', (req, res) => {
    let link = 'https://fast-ridge-60024.herokuapp.com/api/AllData'
    let data
    let users = []
    try{
        request.get(link, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                JSON.parse(body).forEach(element => {
                    users.push({login:element.login, password:element.password})
                });
            }
            // console.log(users)
            res.locals.users = users
            res.render('index', {data: {
                login: users[0].login,
                password: users[0].password
            },
                users: users
            })
        });
        
    }catch{
        res.render('index', {data: {
            login: "wocolok",
            password: "g!AWS{=MA,2kk4Sn",
            error: "error getting AllData"
        }})
    }
    // res.render('index', {
    // data: {
    //     login: "wocolok",
    //     password: "g!AWS{=MA,2kk4Sn"
    // },
    //     users: users
    // })
})

module.exports = router