import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect mongodb
const uri = "mongodb+srv://SohanRazzak:TestDB001@cluster0.szyjjk8.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();

        const database = client.db("prac-56");
        const userCollection = database.collection("userCollection");

        app.get('/users', async (req, res)=>{
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.get('/user/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id : new ObjectId(id)};
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        app.put('/user/:id', async (req, res)=>{
            const id = req.params.id;
            const user = req.body;
            const query = { _id : new ObjectId(id)};
            const options = { upsert : true };
            const updateUser = {
                $set : {
                    fullName : user.fullName,
                    email : user.email,
                    password : user.password
                }
            }
            const result = await userCollection.updateOne(query, updateUser, options);
            res.send(result);
        })

        app.delete('/user/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id : new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        console.log('connected to mongodb');
    }
}
run().catch(console.dir);


// basic code
app.get('/', (req, res) => {
    res.send("hellw world")
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
