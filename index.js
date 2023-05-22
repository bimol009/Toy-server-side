const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["PUT", "PATCH", "POST", "GET", "DELETE", "OPTIONS"],
  })
);
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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const carsCollection = client.db("ToyAddSection").collection("serviceToy");
    const specialAddCar = client.db("ToyAddSection").collection("bookings");

    app.get("/AllToyShow", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalCount = await carsCollection.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      const result = await carsCollection
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ price: -1 })
        .toArray();

      const formattedResult = result.map((car) => ({
        ...car,
        price: car.price,
      }));

      res.send({
        data: formattedResult,
        page: page,
        totalPages: totalPages,
      });
    });
    app.get("/sportsCar", async (req, res) => {
      const query = { category: "sports car" };
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/truck", async (req, res) => {
      const query = { category: "truck" };
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/fireTruck", async (req, res) => {
      const query = { category: "fire truck" };
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/police", async (req, res) => {
      const query = { category: "police" };
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/AllToyShow/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.send(result);
    });
    app.get("/addBook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await specialAddCar.findOne(query);
      res.send(result);
    });

    app.post("/addBook", async (req, res) => {
      const specialBook = req.body;
      console.log(specialBook);
      const result = await specialAddCar.insertOne(specialBook);
      res.send(result);
    });

    app.get("/addBook", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await specialAddCar.find(query).toArray();
      res.send(result);
    });

    app.delete("/addBook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await specialAddCar.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/addBook/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = req.body;
      console.log("update", updateToy);
      const toy = {
        $set: {
          name: updateToy.name,
          customerName: updateToy.customerName,
          quantity: updateToy.quantity,
          about: updateToy.about,
          photo: updateToy.photo,
        },
      };
      const result = await specialAddCar.updateOne(filter, toy, options);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Toy server is running port ${port}`);
});
