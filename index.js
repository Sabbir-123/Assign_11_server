const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/',(req, res)=>{
    res.send('Assignment 11 is running on server')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j4x9j8z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect();
const myServiceCollection = client.db('assignment').collection('services');
app.get('/services', async(req, res)=>{
    const query = {};
    const cursor = myServiceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services)
})

app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await myServiceCollection.findOne(query);
    res.send(service);
});
app.get('/servicelimit', async(req, res) =>{
    const query = {}
    const cursor = myServiceCollection.find(query);
    const service = await cursor.limit(3).toArray();
    res.send( service);
});
}
catch(error){
    console.log(err.name, err.message)
}

}


run()
app.listen(port , ()=>{
    console.log(`Assignment 11 is loading from ${port}`)
})

