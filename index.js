const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy making server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcb1rgs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carsCollection = client.db("toysCollection").collection("toysSection");


    app.get("/AllToyShow", async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/sportsCar", async (req, res) => {
      const query = {category: 'sports car'};
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/truck", async (req, res) => {
      const query = {category: 'truck'};
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/fireTruck", async (req, res) => {
      const query = {category: 'fire truck'};
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/police", async (req, res) => {
      const query = {category: 'police'};
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get("/cars/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const query = { id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, img: 1 },
      };

      const result = await carsCollection.findOne(query, options);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Toy server is running port ${port}`);
});
