const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const cors=require('cors');

//route inititializations
const userroutes = require('./routes/userroute');
const blogroutes=require('./routes/blogroute');
const bodyParser = require('body-parser');


var app = express();
var server = http.createServer(app);

const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise;
//live
mongoose.connect('mongodb://localhost:27017/blog',

    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DataBase connected.");
        console.log("Fetched Live Data.")
    },
        err => {
            console.log("db connection error");
            console.log(err)
        });

app.use(cors());
app.use(express.json());//takingb in json
app.use(bodyParser.json({limit:'150mb'}));
app.use(bodyParser.urlencoded({extended:true,limit:'150mb'}));
app.use(userroutes);
app.use(blogroutes);

server.listen(port, () => {
    console.log(`Server with ws capability running on port ${port}`);//backslash
    console.log("Database Connection Initiated")
});