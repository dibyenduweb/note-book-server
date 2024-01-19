const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mai7bpy.mongodb.net/?retryWrites=true&w=majority`;

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjfwgbt.mongodb.net/?retryWrites=true&w=majority`

console.log(uri);
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
   // await client.connect();

    const noteCollection =client.db('notebook-DB').collection('note');


//data post
app.post("/note", async (req, res) => {
  const user = req.body;
  //   console.log(user);
  const result = await noteCollection.insertOne(user);
  console.log(result);
  res.send(result);
});

// data get
app.get("/note", async (req, res) => {
  const result = await noteCollection.find().toArray();
  res.send(result);
});

//delete or remove  data
app.delete("/note/:id", async (req, res) => {
  const id = req.params.id;
  console.log("delete", id);
  const query = {
    _id: new ObjectId(id),
  };
  const result = await noteCollection.deleteOne(query);
  console.log(result);
  res.send(result);
});


//update data
app.get("/note/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  const query = {
    _id: new ObjectId(id),
  }
  const result = await noteCollection.findOne(query);
  //console.log(result);
  res.send(result);
});

app.put('/note/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    console.log('Received data:', data);

    const options = { upsert: true };
    const filter = {
      _id: new ObjectId(id),
    };
    const updatedData = {
      $set: {
        title: data.title,
        description: data.description,
        date: data.date,
      },
    };
    const result = await noteCollection.updateOne(filter, updatedData, options);

    console.log('Filter:', filter);
    console.log('Updated data:', updatedData);

    if (result.matchedCount > 0) {
      res.send({ success: true, message: 'Update successful' });
    } else {
      res.status(404).send({ success: false, message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




//server test code...
app.get("/", (req, res) => {
    res.send("server is running...");
  });

app.listen(port, () => {
    console.log(`server is Running on port ${port}`);
  });
  
  