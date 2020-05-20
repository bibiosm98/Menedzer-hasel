const express = require('express')
const router = express.Router()
const request = require('request')

//Get all login-password records
router.post('/', (req, res) => {
    let data  
    console.log(req.body)
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.body.login + '/AllSites';
    try{
        request.get(link, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                data = (JSON.parse(body))
            }
            // console.log("dane: " + data)
            res.render('./user/user', {data: data, login: req.body.login})
        });
    }catch{
        res.send("error?")
    }
})
//Get one login-password record
router.post('/:userId/loginData', (req,res) => {
    console.log("ID: " + req.params.userId + " LoginID: " + req.body.loginId)
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData/' + req.body.loginId;
    let data
    try{
        request.get(link, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
            }
            // console.log("dane: " + data)
            // res.render('./user/user', {data: data, login: req.body.login})
            res.render('./user/userLogin', {data: data, login: req.params.userId})
        });
    }catch{
        res.send("error?")
    }
})
router.get('/:userId/loginData/edit/:loginId', (req, res) => {
    console.log("editPassword")
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData/' + req.params.loginId;
    let data
    try{
        request.get(link, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
            }
            console.log("dane: " + data)
            // res.render('./user/user', {data: data, login: req.body.login})
            res.render('./user/userLoginEdit', {data: data, login: req.params.userId})
        });
    }catch{
        res.send("error?")
    }
    // res.render('./user/userLoginEdit', {data: data, login: req.params.userId})
})
//Update data of one login-password record
router.post('/:userId/loginData/update/:loginId', (req, res) => {
    console.log("updatePassword")
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData/' + req.params.loginId;
    let data
    try{
        request.put(link, 
            {
                json: {
                    "site": req.body.site,
                    "login": req.body.login,
                    "password": req.body.password,
                    "note": req.body.note
                }
            },
            (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
            }
            console.log("dane: " + data)
        });
        res.send("update done")
    }catch{
        res.send("error update?")
    }
})
// router.post('/:userId/loginData/:loginId/delete', (req, res) => {
//     console.log("updatePassword")
//     let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData/' + req.params.loginId;
//     let data
//     try{
//         request.put(link, 
//             {
//                 json: {
//                     "site": req.body.site,
//                     "login": req.body.login,
//                     "password": req.body.password,
//                     "note": req.body.note
//                 }
//             },
//             (error, response, body) => {
//             if (!error && response.statusCode == 200) {
//                 console.log(body)
//                 data = JSON.parse(body)
//             }
//             console.log("dane: " + data)
//         });
//         res.send("update done")
//     }catch{
//         res.send("error update?")
//     }
// })
// Delete one record
router.get('/:userId/loginData/delete/:loginId', (req, res) => {
    console.log("deleteRecord")
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData/' + req.params.loginId;
    let data
    try{
        request.delete(link,
            (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
            }
            console.log("dane: " + data)
        });
        res.send("delete done")
    }catch{
        res.send("error delete?")
    }
})
//Add new record
router.post('/:userId/loginData/new', (req, res) => {
    console.log("new Record")
    console.log(req.body)
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/LoginData'
    try{
        request.post(link,
            {
                json: {
                    "site": req.body.site,
                    "login": req.body.login,
                    "password": req.body.password,
                    "passwordStrength": 3,
                    "note": req.body.note
                }
            },
            (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        })
        res.render('./user/newRecord', {login: req.params.userId})
    }catch{
        res.send("error new record?")
    }
})
//Get backup
router.get('/:userId/backup', (req, res) => {
    console.log("Backup") 
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId + '/Backup';
    let data = ''
    try{
        request.get(link,(error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
                console.log(data)
            }
        })
        console.log("Data: " + data)
        res.render('./user/backup', {login: req.params.userId, data: data})
    }catch{
        res.send("error backup?")
    }
})
// User data edit-form
router.get('/:userId/loginData/editUser', (req, res) => {
    // let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId;
    try{
        // request.put(link,
        //     {
        //         json: {
        //             "email": req.body.email,
        //             "login": req.body.login,
        //             "password": req.body.password
        //         }
        //     },
        //     (error, response, body) => {
        //     if (!error && response.statusCode == 200) {
        //         console.log(body)
        //         data = JSON.parse(body)
        //         console.log(data)
        //     }
        // })
        console.log("succed show edit user-form")
        res.render('./user/userData', {userId: req.params.userId})
    }catch{
        res.send("error delete user?")
    }
})
// User data edit
router.post('/:userId/loginData/editUser', (req, res) => {
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId;
    try{
        request.put(link,
            {
                json: {
                    "email": req.body.email,
                    "login": req.body.login,
                    "password": req.body.password
                }
            },
            (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        })
        console.log("succed update user")
        res.render('./user/userData', {userId: req.params.userId})
    }catch{
        res.send("error delete user?")
    }
})
// Delete User
router.get('/:userId/loginData/deleteUser', (req, res) => {
    let link = 'https://fast-ridge-60024.herokuapp.com/api/user/' + req.params.userId;
    try{
        request.delete(link,(error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                data = JSON.parse(body)
                console.log(data)
            }
        })
        console.log("succed delete user")
        res.render('index')
    }catch{
        res.send("error delete user?")
    }
})


// //Check passwordStrength
// router.post('/passwordStrength', (req, res) => {
//     console.log("pass stren")
//     console.log(req.body.checkPassword)
//     let link = 'https://fast-ridge-60024.herokuapp.com/api/PasswordStrength';
//     let data, passwordStrength
//     try{
//         request.post(link, 
//             {
//                 json:{
//                     "password": req.body.checkPassword
//                 }    
//             },
//             (error, response, body) => {
//             if (!error && response.statusCode == 200) {
//                 console.log(body.passwordStrength)
//                 passwordStrength = body.passwordStrength
//             }
//         })
//         console.log("strength: " + passwordStrength)
//         res.json({"pass": passwordStrength})
//     }catch{
//         res.send("error GET pass strength?")
//     }
// })

module.exports = router
