const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/newLoginDataView', (req, res) => {
    console.log("Adding New Record View")
    let data = {}
    res.render('./user/newData', {data: {data}})
})

router.post('/newLoginData', (req, res) => {
    addNewUserRecord({
        "site": req.body.site,
        "login": req.body.login,
        "password": req.body.password,
        "note": req.body.note
    }).then(() =>{
        getUserAllSites().then((data) => {
            res.render('./user/allSites', {data: data})
        }).catch((error) => {
            res.send(error)
        })
    }).catch((error) => {
        res.send(error)
    })
})

router.post('/updateLoginDataView/:id', (req, res) => {
    getUserLoginData(req.params.id).then((data) => {
        res.render('./user/updateData', {id: req.params.id, data: data})
    }).catch((error) => {
        res.send("error updateLoginView")
    })
})

router.post('/updateLoginData/:id', (req, res) => {
    updateUserRecord(req.params.id, {
        "site": req.body.site,
        "login": req.body.login,
        "password": req.body.password,
        "note": req.body.note
    }).then(() => {
        getUserAllSites().then((data) => {
            res.render('./user/allSites', {data: data})
        })
    }).catch((error) => {
        res.send(error)
    })
})

router.get('/getLoginData/:id', (req, res) => {
    getUserLoginData(req.params.id).then((data) => {
        res.render('./user/loginData', {data: data})
    }).catch((error) => {
        res.send(error)
    })
})

router.get('/deleteLoginData/:id', (req, res) => {
   deleteUserRecord(req.params.id).then(() => {
       res.redirect('/signin')
   }).catch((error) =>{
        res.send(error)
   })
})


function getUserAllSites(){
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
                console.log("getUserAllSites")
                console.log(body)
                const {decryptAES} = require('../config/decryptAES')
                const AESresponse = decryptAES(JSON.parse(body))
                if (!error && response.statusCode == 200) {
                    JSON.parse(AESresponse).forEach(element => {
                        data.push(element)
                    });
                    resolve(data)
                }
            })
        }catch(e){
            reject('Something goes wrong with GET user AllSites')
        }
    })
}

function addNewUserRecord(data){
    const link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData'
    return new Promise((resolve,reject) => {
        try{
            request.post({
                uri: link,
                headers: {'Content-Type': 'application/json', 'token': token},
                json: {
                    "site": data.site,
                    "login": data.login,
                    "password": data.password,
                    "note": data.note
                }
            },
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                }
            })
            resolve(true)
        }catch{
            reject('Something goes wrong with POST user LoginData')
        }
    })
}

function updateUserRecord(id, data){
    const link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + id;
    return new Promise((resolve, reject) => {
        try{
            request.put({
                uri: link,
                headers: {'token': token},
                json: {
                    "site": data.site,
                    "login": data.login,
                    "password": data.password,
                    "note": data.note
                }
            },
            (error, response, body) => {
                if(!error && response.statusCode == 200) {}
            })
            resolve(true)
        }catch{
            reject('Something goes wrong with PUT user LoginData')
        }
    })
}

function getUserLoginData(id){
    const link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + id
    return new Promise((resolve, reject) => {
        try{
            request.get({
                    uri: link,
                    headers: {'Content-Type': 'application/json', 'token': token}
                },
                (error, response, body) => {
                    console.log("GetUserLoginID")
                    console.log(body)
                    const {decryptAES} = require('../config/decryptAES')
                    const AESresponse = decryptAES(JSON.parse(body))
                    if(!error && response.statusCode == 200) {
                        data = JSON.parse(AESresponse)
                    }
                    resolve(data)
                }
            )
        }catch{
            reject('Something goes wrong with GET user LoginData')
        }
    })
}

function deleteUserRecord(id){
    const link = 'https://fast-ridge-60024.herokuapp.com/api/LoginData/' + id
    return new Promise((resolve, reject) =>{
        try{
            request.delete({
                    uri: link,
                    headers: {'token': token}
                },
                (error, response, body) => {
                    if(!error && response.statusCode == 200) {
                    }
                resolve(true)
            })
        }catch{
            reject('Something goes wrong with deleting user record')
        }
    })
}

module.exports = router