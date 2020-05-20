const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/', (req, res) => {
    res.render('index', {data: {
            login: "wocolok",
            password: "g!AWS{=MA,2kk4Sn"
        }})
})

module.exports = router