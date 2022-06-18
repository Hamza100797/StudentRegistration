const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const constants = require('./constant/message')
const bodyParser = require('body-parser');
let cors = require("cors");
const StudentRegistrationRoutes = require('./routes/studentRegistration');
const path = require('path');

app.use(express.static(path.join(__dirname + "/uploads")))


//Headers MiddleWare
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



//.....BodyParser Middleware....//
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// support parsing of application/json type post data
app.use(bodyParser.json());
//.....BodyParser Middleware....//



//cors 
app.use(cors());
app.use(cors({ origin: true, credentials: true }));




//......... connect MongoDB ......//

const URL = `mongodb+srv://hbk100797:SHRaJeYGp35rYhor@studentregistrationcrud.jsbr6hg.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => {
        console.log('MongoDB Connected…')
    })
    .catch((err) => {
        console.log(err)
        console.log(constants.DataBaseError)
    })
//......... connect MongoDB ......//


//Routes
app.use('/app/v1/health', (req, res) => {
    res.send('API OKAY!');
});
app.use('/app/v1/studentRegistration', StudentRegistrationRoutes);

//......Error Handling Bad Request .....//
app.use((req, res, next) => {
    res.status(404).send({
        status: false,
        "message": constants.BAD_REQUEST
    })
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})