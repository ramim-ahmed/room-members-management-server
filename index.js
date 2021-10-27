const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 8000;
// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://roomAdmin01:qMdiFtMBK4UUBtzl@cluster0.ejor6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("members");
      const usersCollection = database.collection("users");


      //GET API
      app.get('/members', async (req, res) => {
          const cursor = usersCollection.find({});
          const result = await cursor.toArray();
          res.send(result)
      })
      
      //GET SINGLE API

      app.get('/members/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.findOne(query);
        res.send(result);
    })

      //UPDATE API

      app.put('/members/:id', async (req, res) => {
          const id = req.params.id;
          const updateMember = req.body;
          const filter = {_id: ObjectId(id)};
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  name: updateMember.name,
                  email: updateMember.email,
                  room_no: updateMember.room_no
              }
          }
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.json(result)
      })

      //POST API
      app.post('/member', async (req, res) => {
          const member = req.body;
          const result = await usersCollection.insertOne(member);
          res.json(result)
      })

    //  DELETE API
      app.delete('/members/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await usersCollection.deleteOne(query);
          res.json(result)
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('ROOM MEMBERS MANAGEMENT SERVER RUNNINGN..200')
})



// app listen 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// roomAdmin01
// qMdiFtMBK4UUBtzl