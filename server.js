"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const https = require("http");
const helmet = require("helmet");
const mysql = require('mysql');
const app = express();
const server = https.createServer(app);
const iooptions = {
    serveClient: process.env.ENV_TEST ? true : false,
    path: "/socket.io",
    cors: { origin: process.env.ENV_TEST ? "http://localhost:3000" : `https://${process.env.SITE_URI}` },
};
exports.io = require('socket.io')(server, iooptions);
exports.io.on('connection', (s) => { });
process.on('unhandledRejection', function (err) {
    (0, index_1.writeLog)(JSON.stringify({ msg: 'unhandled rejection', err: err }), 'crit');
    process.exit(1);
});
process.on('uncaughtException', function (err) {
    (0, index_1.writeLog)(JSON.stringify({ msg: 'uncaught exception', err: err }), 'crit');
    process.exit(1);
});
process.on('exit', code => {
    if (code) {
        (0, index_1.writeLog)(JSON.stringify({ msg: 'process exit', stack: code }), 'crit');
        process.exit(1);
    }
});

const models_1 = require("./backend/models");
var SequelizeSessionStore = require("connect-session-sequelize")(session.Store);
const routes_1 = require("./backend/routes");
const index_1 = require("./backend/utility/index");
const corsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: process.env.ENV_TEST ? "http://localhost:3000" : [`https://${process.env.SITE_URI}`, 'https://status-check.testweb-demo.com'],
    preflightContinue: false,
};
app.use(cors(corsOptions));
app.use(helmet({ contentSecurityPolicy: false }), express.json(), express.urlencoded({ extended: true }), session({
    secret: process.env.SESS_SEC,
    store: new SequelizeSessionStore({
        db: models_1.db.sequelize,
        checkExpirationInterval: 60 * 60 * 1000
    }),
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        maxAge: 86400000 * 7
    }
}));
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use('/api', routes_1.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

const PORT = process.env.PORT;
app.set('port', PORT);
server.listen(PORT);

let isProduction = process.env.NODE_ENV == "production";
models_1.db.sequelize.sync({ alter: !isProduction })
    .then(() => {
        return index_1.CustomTaskScheduler.runMessageNotification();
    }).catch(e => {
        console.warn(e);
        throw e;
    });

// our MySQL Configuration to store data in eventservey code starts here
const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "pcr3"
});


app.post('/pcr3', (req, res) => {
    const data = req.body;

    console.log('Received data:', data);

    const sql = 'INSERT INTO eventservey (fname, lname, email, ttype, dateRange, testDate, venue, staff, equipment, overall, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [data.fname, data.lname, data.email, data.ttype, data.dateRange, data.testDate, data.venue, data.staff, data.equipment, data.overall, data.feedback], (error, results) => {
        if (error) {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Internal Server Error');
        }

        console.log('Data inserted successfully:', results);
        return res.status(200).send('Registration Successful');
    });
});

app.get('/pcr3', (req, res) => {
    const sql = 'SELECT id, fname, lname, email, ttype, dateRange, testDate, venue, staff, equipment, overall, feedback FROM eventservey';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Data fetched successfully:', results);
        return res.status(200).json(results);
    });
});

app.delete('/pcr3/:id', (req, res) => {
    const id = req.params.id;
    console.log('Received delete request for ID:', id);

    const sql = 'DELETE FROM eventservey WHERE id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error deleting data from the database:', error);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Data deleted successfully:', results);
        return res.status(200).send('Deletion Successful');
    });
});

app.listen(8081, () => {
    console.log("Spyder Server is Activated");
});

// our MySQL Configuration to store data in eventservey code ends here