const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Todo Task App Server Side')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z3bgx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        await client.connect();
        // Collection
        const taskCollection = client.db("todo").collection("tasks");
        const completeTaskCollection = client.db("todo").collection("completeTask");

        // get AllTask
        app.get("/allTask", async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        })

        // get AllCompleteTask
        app.get("/allCompleteTask", async (req, res) => {
            const result = await completeTaskCollection.find().toArray();
            res.send(result);
        })

        // insert Task
        app.post("/addTask", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send({ success: true, result });
        })

        // insert CompleteTask
        app.post("/completeTask", async (req, res) => {
            const task = req.body.task;
            const completeTask = { task: task }
            const result = await completeTaskCollection.insertOne(completeTask);
            res.send({ success: true, result });
        })

        // Delete Task
        app.delete("/deleteTask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // Delte CompleteTask
        app.delete("/deleteCompleteTask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await completeTaskCollection.deleteOne(query);
            res.send(result);
        })

        // Updated Task
        app.put("/taskEdit/:id", async (req, res) => {
            const id = req.params.id;
            const editTask = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { task: editTask.task }
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})