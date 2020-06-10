const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')
const signupRoute = require('./routes/signup')
const signinRoute = require('./routes/signin')
const userAccountRoute = require('./routes/userAccount')

const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
require('./config/passport')(passport);

global.token = ''

app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views');
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
      secure: true
    })
);
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts)
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));
app.use('/', indexRoute)
app.use('/user', userRoute)
app.use('/signup', signupRoute)
app.use('/signin', signinRoute)
app.use('/userAccount', userAccountRoute)
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.listen(process.env.PORT || 3000)