const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Assignment 11 is running on servers");
});

// const uri = "mongodb+srv://assignment-11:P9KB6879sVysynzB@cluster0.j4x9j8z.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j4x9j8z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const myServiceCollection = client.db("assignment").collection("services");
    const reviewCollection = client.db("assignment").collection("reviews");
    const blogsCollection = client.db("assignment").collection("blogs");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = myServiceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/blogs", async (req, res) => {
        const query = {};
        const cursor = blogsCollection.find(query);
        const ques = await cursor.toArray();
        res.send(ques);
      });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      // const query = { _id: ObjectId(id) };
      const query = {_id : ObjectId(id)}
      const service = await myServiceCollection.findOne(query);
      res.send(service);
    });
    app.get("/servicelimit", async (req, res) => {
      const query = {};
      const cursor = myServiceCollection.find(query);
      const service = await cursor.limit(3).toArray();
      res.send(service);
    });

    app.post("/addservices", async (req, res) => {
      const newService = req.body;
      const result = await myServiceCollection.insertOne(newService);
      res.send(result);
    });
    app.get("/addservices", async (req, res) => {
      const cursor = myServiceCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
    });
    app.post("/addreviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
        let query = {}
        if(req.query.title){
            query= {
                title: req.query.title
            }
        }
        const cursor = reviewCollection.find(query).sort();
        const service = await cursor.toArray();
        res.send(service);
      });
      app.get("/myreviews", async (req, res) => {
        const decodedEmail = req?.decoded?.email;
        const email = req?.query?.email;
        if (email === decodedEmail){
            const query = {email: email}
            const cursor = reviewCollection.find(query).sort({_id: -1});
            const reviews = await cursor.toArray();
            res.send(reviews);

        }else{
            res.status(403).send({message: 'Forbidden Access'})
        }
        
        
        
      });



      app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

    app.patch('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const status = req.body.status
        const query = { _id: ObjectId(id) }
        const updatedDoc = {
            $set:{
                status: status
            }
        }
        const result = await reviewCollection.updateOne(query, updatedDoc);
        res.send(result);
    })

  } finally  {
    
  }
}

run();
app.listen(port, () => {
  console.log(`Assignment 11 is loading from ${port}`);
});
