const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')
const signupRoute = require('./routes/signup')
const signinRoute = require('./routes/signin')

global.token = ''

app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views');
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(expressLayouts)
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));
app.use('/', indexRoute)
app.use('/user', userRoute)
app.use('/signup', signupRoute)
app.use('/signin', signinRoute)
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.listen(process.env.PORT || 3000)