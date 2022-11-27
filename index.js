const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category)
        })

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

    }
    finally {

    }
}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('phone resale server is running ')
})

app.listen(port, () => console.log(`phone resale running on ${port}`))