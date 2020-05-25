const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/', (req, res) => {
    const link = 'https://fast-ridge-60024.herokuapp.com/api/User'
    // return new Promise((resolve, reject) => {
        try{
            request.get({
                    uri: link,
                    headers: {'Content-Type': 'application/json', 'token': token}
                },
                (error, response, body) => {
                    if(!error && response.statusCode == 200) {
                        const data = JSON.parse(body)

                        console.log(body)
                        console.log(data)

                        console.log(data._id)
                        // const id = JSON.parse(data._id)
                        console.log()
                        res.render('./userAccount/account', {data: {
                            "email": data.email,
                            "login": data.login,
                            "id": data._id
                        }})
                    }
                    // resolve(data)
                }
            )
        }catch{
            // reject('Something goes wrong with GET user LoginData')
        }
    // })
})

router.get('/delete', (req, res) => {
    const link = 'https://fast-ridge-60024.herokuapp.com/api/User'
    try{
        request.delete({
                uri: link,
                headers: {'Content-Type': 'application/json', 'token': token}
            },
            (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    console.log(body)
                    res.redirect('../')
                }
                // resolve(data)
            }
        )
    }catch{
        // reject('Something goes wrong with GET user LoginData')
    }
    // console.log("DELETE")
    // res.redirect('../')
})

module.exports = router