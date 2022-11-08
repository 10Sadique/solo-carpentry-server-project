// exports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// port
const port = process.env.PORT;

// init app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onfc57d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    const database = client.db('soloCarpentry');
    const serviceCollection = database.collection('services');

    // get services
    app.get('/services', async (req, res) => {
        let query = {};
        let size = Infinity;

        if (req.query.limit) {
            size = +req.query.limit;
        }
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(size).toArray();

        res.send(services);
    });

    // get service by id
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = {
            _id: ObjectId(id),
        };

        const result = await serviceCollection.findOne(query);

        res.send(result);
    });
}

run().catch((err) => console.log(err));

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
