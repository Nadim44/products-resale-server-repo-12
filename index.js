const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vtfbuf5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const categoryCollection = client.db('phoneResale').collection('categoryCollection');
        const allProductCollection = client.db('phoneResale').collection('productCollection');
        const bookingsCollection = client.db('phoneResale').collection('bookings');
        const usersCollection = client.db('phoneResale').collection('users');

        // category
        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category)
        })

        // categories product
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await categoryCollection.findOne(query);
            res.send(service)
        })

        app.get('/allproducts', async (req, res) => {
            // console.log(req.query)
            let query = {}
            if (req.query.categoryName) {
                query = {
                    categoryName: req.query.categoryName
                }
            }
            const cursor = allProductCollection.find(query);
            const product = await cursor.toArray();
            // console.log(product)
            res.send(product)
        })

        //booking email address
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            console.log('token', req.headers.authorization)
            const query = { email: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        //booking collection
        app.post('/bookings', async (req, res) => {
            const booking = req.body
            // console.log(booking)
            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
        });


        // jwt
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '20d' })
                return res.send({ accessToken: token })
            }
            console.log(user)
            res.status(403).send({ accessToken: '' })
        })


        // all users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })



    }
    finally {

    }
}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('phone resale server is running ')
})

app.listen(port, () => console.log(`phone resale running on ${port}`))