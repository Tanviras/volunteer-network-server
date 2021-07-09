const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjygh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  res.send('hello world')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  const activities = client.db("volunteerNetwork").collection("userActivities");
  const admins=client.db("volunteerNetwork").collection("admins");
  console.log('db connection successfully');

//1st thing to do to connect with client
app.post('/addUserActivity', (req, res) => {
  const newActivity = req.body;
  console.log(newActivity);

  activities.insertOne(newActivity)
      .then(result => {
        //   console.log(result);
          res.send(result.insertedCount > 0);
      })
})



app.get("/userActivities", (req, res) => {
  activities.find({ email: req.query.email })
  .toArray((err, documents) => {
    res.send(documents);
  });
});

app.get("/userVolunteers", (req, res) => {
  activities.find({})
  .toArray((err, documents) => {
    res.send(documents);
  });
});



app.delete("/selectedActivities/:_id", (req, res) => {
  activities.deleteOne({ id: req.params.id }).then((result) => {
    console.log("Deleted Activity Successfully");
  });
});



app.delete("/admin/:_id", (req, res) => {
  activities.deleteOne({ id: req.params.id }).then((result) => {
    console.log("Deleted Activity Successfully");
  });
});




app.post('/addEvent', (req, res) => {
  const newEvent = req.body;
  console.log(newEvent);

  admins.insertOne(newEvent)
      .then(result => {
        //   console.log(result);
          res.send(result.insertedCount > 0);
      })
})


app.get("/userVolunteers", (req, res) => {
  admins.find({})
  .toArray((err, documents) => {
    res.send(documents);
  });
});



});//client.connect


app.listen(process.env.PORT|| 5000)