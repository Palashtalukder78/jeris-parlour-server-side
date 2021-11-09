const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = 5000

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