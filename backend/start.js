// PORT=3000
// HOST=192.168.1.144
// #IP=192.168.1.144
// MUSER=user_licenta
// MPASSWORD=password_licenta
// MHOST=192.168.1.144
// MPORT=30000
// MDATABASE=licenta
// JWT_SECRET_KEY=licenta

const express = require('express');
const morgan = require('morgan'); //middleware de logare
const helmet = require('helmet'); //middleware de securitate
require('dotenv').config(); //read form .env file
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/licenta', routes);

// handler de erori declarat ca middleware
app.use((err, req, res, next) => {
    console.trace(err);
    let status = 500;
    let message = 'Something Bad Happened';
    if (err.httpStatus) {
        status = err.httpStatus;
        message = err.message;
    }
    res.status(status).json({
        error: message,
    });
});


app.listen(process.env.PORT, () => {
    console.log(`App is listening on ${process.env.PORT}`);
});
