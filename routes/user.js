const express = require('express')
const router = express.Router()
const request = require('request')
const BSON = require('bson');


router.post('/updateLoginData/:id', (req, res) => {
    console.log("Edit_Record route")
    console.log(req.body)
    res.send("update password")
    // let link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + req.params.id;
    // let data
    // try{
    //     console.log(link)
    //     console.log(token)
    //     console.log("token")

    //     request.put({
    //             uri: link,
    //             headers: {'token': token},
    //             json: {
    //                 "site": "12412e12S@wp.pl",
    //                 "login": "S21e12e12@o2.pl",
    //                 "password": "!12312312",
    //                 "note": "3wqewfewfwe  sda"
    //             }
    //         },
    //         (error, response, body) => {
    //             if(!error && response.statusCode == 200) {
    //                 console.log(body)
    //             }
    //             console.log(response.status)
    //             console.log(body)
                
    //             res.send("editpassword")
    //         })
    // }catch{
    //     res.send("error?")
    // }
})


router.get('/getLoginData/:id', (req, res) => {
    console.log(req.body)
    console.log("get password route")
    let link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + req.params.id;
    let data
    try{
        request.get({
                uri: link,
                headers: {'token': token}
            },
            (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    data = JSON.parse(body)
                }
                res.render('./user/loginData', {data: data})
            })
        }catch{
            res.send("error?")
        }
})

router.get('/deleteLoginData/:id', (req, res) => {
    console.log("Delete_Record")
    console.log(req.body)
    let link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + req.params.id
    let data
    try{
        console.log(link)
        console.log(token)
        console.log("token")

        request.delete({
                uri: link,
                headers: {'token': token}
            },
            (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    // console.log(body)
                }
                console.log(body)
                
            res.send("deleteData")
        })
    }catch{
        res.send("error?")
    }

})


module.exports = router