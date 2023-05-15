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
    const userCollection = client.db("assignment").collection("users");
    const reviewCollection = client.db("assignment").collection("reviews");
    const blogsCollection = client.db("assignment").collection("blogs");


    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = myServiceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });


    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
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
        const email = req.query.email;
        const query = { email };
        const reviews = await reviewCollection.find(query).toArray();
        res.send(reviews);
       
    });
    
      


      app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

    app.get('/myeditedreviews/:id', async(req, res)=>{
      const {id}= req.params;
      const email = req?.query?.email;
      const review = await reviewCollection.findOne({_id:ObjectId(id)});
      res.send(review)
    })

    app.patch('/updatereviews/edit/:id', async (req, res) => {
        const id = req.params;
        const result = await reviewCollection.updateOne( {_id: ObjectId(id)}, {$set: req.body});
       if(result.modifiedCount){
        res.send({
          success: true,
          message: `successfullu updated ${req.body.title}`
        })
       }else{
        res.send({
          success: false,
          error: "Coudn't Updated the review"
        })
       
      }
    })

  } 
  
  finally  {
    
  }
}

run();
app.listen(port, () => {
  console.log(`Assignment 11 is loading from ${port}`);
});
