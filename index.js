const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ack9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("jerins_parlour");
        const serviceCollection = database.collection("services");
        const userCollection = database.collection("users");

        //Recieve Users from the website whene user will Register/Login
        //From the CreateUserPasword Auth
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result)
        })
        //From the Google login Auth
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        });
        app.get('/users', async (req, res) => {
            const user = userCollection.find({})
            const result = await user.toArray();
            res.json(result);
        })
        //Get services from database
        app.get('/services', async (req, res) => {
            const services = serviceCollection.find({})
            const result = await services.toArray();
            res.json(result);
        })
        //Recieve service from clientside dashboard (Add Service)
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            console.log(result);
            res.json(result);
        })

        console.log("Datebase Connection successfully");
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Jerins Parlour Server Start.........')
})

app.listen(port, () => {
    console.log('Server starting port: ', port)
})