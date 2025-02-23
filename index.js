require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyhfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const  tasksCollection = client.db("notifyDb").collection("tasks");

        
        app.get('/tasks', async(req, res)=>{
           
            const result = await tasksCollection.find().toArray();
            res.send(result);
        })
        app.get('/latestTask', async(req, res)=>{
           
            const result = await tasksCollection
            .find()
            .sort({ date: -1, time: -1 }) // Sort by date and time in descending order
            .limit(4)
            .toArray();
            res.send(result);
        })
        app.get('/toDo', async(req, res)=>{
           
            const query = {status : "To Do"}
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/inProgress', async(req, res)=>{
           
            const query = {status : "In Progress"}
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/taskDone', async(req, res)=>{
           
            const query = {status : "Done"}
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
        // add a new task
        app.post('/addTask', async (req, res)=>{
            const newTask = req.body;
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        })
         //delete a task
         app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })





        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task is processing...')
})
app.listen(port, () => {
    console.log(`Notify is processing on port ${port}`);
})