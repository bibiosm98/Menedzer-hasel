const express = require('express')
const router = express.Router()
const request = require('request')
const BSON = require('bson');

router.get('/newLoginDataView', (req, res) => {
    console.log("Adding New Record View")
    let data = {}
    res.render('./user/newData', {data: data})
})

router.post('/newLoginData', (req, res) => {
    console.log("Adding New Record")
    console.log(req.body)

    let link = 'https://fast-ridge-60024.herokuapp.com/api/' //AllSites'
    let data = []
    
    try{
        request.post({
            uri: link + 'LoginData',
            headers: {'Content-Type': 'application/json', 'token': token},
            json: {
                "site": req.body.site,
                "login": req.body.login,
                "password": req.body.password,
                "note": req.body.note
            }
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log("response")
                console.log(body)
            }
        })
    }catch{
        res.send("error adding new record")
    }


    try{
        request.get({
            uri: link + "AllSites",
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
    }catch{
        res.send("error?")
    }
})


router.post('/updateLoginDataView/:id', (req, res) => {
    console.log("updateLoginDataView ")
    let link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/'+ req.params.id
    let data = []
    try{
        request.get({
            uri: link,
            headers: {
                'Content-Type': 'application/json', 
                'token': token}
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                let body2 = JSON.parse(body)
                console.log(body2)
                data.site = body2.site
                data.login = body2.login
                data.password = body2.password
                data.note = body2.note
            }
            res.render('./user/updateData', {id: req.params.id, data: data})
        })
    }catch{
        res.send("error updateLoginView")
    } 
})

router.post('/updateLoginData/:id', (req, res) => {
    console.log("Edit_Record route")
    console.log(req.body)
    let link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + req.params.id;
    let getLink = 'https://fast-ridge-60024.herokuapp.com/api/AllSites'
    let data = []
    try{
        console.log(link)
        console.log(token)
        console.log("token")

        request.put({
                uri: link,
                headers: {'token': token},
                json: {
                    "site": req.body.site,
                    "login": req.body.login,
                    "password": req.body.password,
                    "note": req.body.note
                }
            },
            (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    console.log(body)
                }
                console.log(response.status)
                console.log(body)
                
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
                }catch{
                    res.send("error?")
                }
            })
    }catch{
        res.send("error?")
    }
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
                
            res.redirect('/signin')
        })
    }catch{
        res.send("error?")
    }

})


module.exports = router