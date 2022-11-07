// exports
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// port
const port = process.env.PORT;

// init app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// mongoDB

// init server
app.get('/', (req, res) => {
    res.send({
        message: 'Solo-Carpentry Server.',
    });
});

// listen route
app.listen(port, () => {
    console.log(`Listening to PORT: ${port}`);
});
