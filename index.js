// exports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId,
    Timestamp,
} = require('mongodb');

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
    try {
        const database = client.db('soloCarpentry');
        const serviceCollection = database.collection('services');
        const reviewCollection = database.collection('reviews');

        // services
        // get services
        app.get('/services', async (req, res) => {
            const query = {};
            let sortBy = { $natural: 1 };
            let size = Infinity;

            if (req.query.limit) {
                size = +req.query.limit;
                sortBy = { $natural: -1 };
            }
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort(sortBy).limit(size).toArray();

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

        // add service
        app.post('/services/add', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);

            res.send(result);
        });

        // reviews
        // get reviews by email
        app.get('/reviews', async (req, res) => {
            const userEmail = req.query.email;
            const query = {
                email: userEmail,
            };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        // get review by id
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id),
            };

            const review = await reviewCollection.findOne(query);

            res.send(review);
        });

        // get reviews by Id
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                serviceId: id,
            };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        // add reviews
        app.post('/reviews/add', async (req, res) => {
            const review = req.body;
            review.createdAt = new Date();

            const result = await reviewCollection.insertOne(review);

            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id),
            };

            const result = await reviewCollection.deleteOne(query);

            res.send(result);
        });
    } finally {
    }
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
