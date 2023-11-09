require('dotenv').config();


const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path');




const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');


const app = express();
const PORT = process.env.PORT || 5000;


//Connecting to DB
    
connectDB();

//middleware
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(session({
    secret: 'Oni gang',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // 1 hour (in milliseconds)
}))

//Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))
app.use(express.static(__dirname + '/public'))
app.listen(PORT, () => {
    console.log(`App is runnig on ${PORT}`)
});

