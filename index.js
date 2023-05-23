const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u0amvcb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //  client.connect();

        const toyCollection = client.db('toyDB').collection('toyCollection')

        // app.get('/allToy', async(req,res)=>{
        //     const cursor = toyCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })


        app.get('/allToy', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();

            res.send(result)
        })

        app.get('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result)


        })


        app.post('/addToy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy);
            res.send(result)
        })

        app.put('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedToy = req.body;
            const toy = {
                $set: {
                    photo:updatedToy.photo,
                    name:updatedToy.name,
                    seller:updatedToy.seller,
                    email:updatedToy.email,
                    subCategory:updatedToy.subCategory,
                    price:updatedToy.price,
                    rating:updatedToy.rating,
                    details:updatedToy.details,
                    quantity:updatedToy.quantity
                }
            }
            const result = await toyCollection.updateOne(filter,toy, options);
            res.send(result)

        })

        app.delete('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result)

        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("server is smoothly running ");
})


app.listen(port, () => {
    console.log(`server is running at ${port}`);
})