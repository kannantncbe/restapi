require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const apiRouter = require('./apiRouter');

const app = express();

const PORT = process.env.APP_PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));// we  use morgan with the pre-defined format "dev" for developer.

app.use('/api/v1/employee/', apiRouter);

app.listen(PORT, () => {
    console.log(`server is listening  on ${PORT}`);
});

module.exports = app;