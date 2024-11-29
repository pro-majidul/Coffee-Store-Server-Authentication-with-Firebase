const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send(`server running on port ${port}`);
});


// const uri = "mongodb+srv://mdMajidul:mY4orBE4laExGvy2@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    // await client.db("admin").command({ ping: 1 });
    const coffeeCollection = client.db('insertDB').collection('coffees')
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })


    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffee/:id' ,async(req,res)=>{
      const id = req.params.id;
      const updateCoffee = req.body;
      const filter = { _id : new ObjectId(id)};
      const options ={upsert : true};
      const coffee = {
        $set:{
          name:updateCoffee.name, chef:updateCoffee.chef, suplier:updateCoffee.suplier, test:updateCoffee.test, category:updateCoffee.category, details:updateCoffee.details, photo:updateCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter , coffee , options);
      res.send(result)
    })

    app.delete('/Coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`local Server in runnign on port ${port}`)
})