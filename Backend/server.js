// Code for Creating Database using the below code in the mongodb.

// const mongoose = require('mongoose');
// const express = require('express');

// const app = express();
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/attributionDB').then(async () => {
//   console.log('Connected to MongoDB');

//   const engagementSchema = new mongoose.Schema({
//     channel: String,
//     engagements: Number,
//     clicks: [Number], // Array of click values
//   });

//   const Engagement = mongoose.model('Engagement', engagementSchema);

//   // Insert initial data if not exists
//   const initialData = [
//     { channel: "Email", engagements: 120, clicks: [3, 7, 15] },
//     { channel: "Ads", engagements: 80, clicks: [1, 4, 25] },
//     { channel: "Social Media", engagements: 150, clicks: [2, 3, 10] },
//   ];

//   Engagement.insertMany(initialData)
//   .then((docs) => console.log("Data inserted:", docs))
//   .catch((error) => console.error("Error inserting data:", error));

// //   for (const data of initialData) {
// //     const exists = await Engagement.findOne({ channel: data.channel });
// //     if (!exists) {
// //       await Engagement.create(data);
// //       console.log(`Inserted initial data for channel: ${data.channel}`);
// //     }
// //   }
// });

// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });


// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/attributionDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose Schema and Model
const engagementSchema = new mongoose.Schema({
  channel: String,
  engagements: Number,
  clicks: [Number],
});

const Engagement = mongoose.model("Engagement", engagementSchema);

// Route to Add Sample Data
// app.get("/api/add-sample-data", async (req, res) => {
//   const sampleEngagementData = [
//     { channel: "Email", engagements: 120, clicks: [3, 7, 15] },
//     { channel: "Ads", engagements: 80, clicks: [1, 4, 25] },
//     { channel: "Social Media", engagements: 150, clicks: [2, 3, 10] },
//   ];

//   try {
//     await Engagement.deleteMany({}); // Clear existing data
//     await Engagement.insertMany(sampleEngagementData);
//     res.send("Sample data added to MongoDB");
//   } catch (error) {
//     res.status(500).json({ error: "Error adding sample data" });
//   }
// });

// Route to Retrieve Data Based on Attribution Model
app.get("/api/attribution", async (req, res) => {
  const { model } = req.query;

  try {
    const engagements = await Engagement.find({});

    const data = engagements.map((item) => {
      switch (model) {
        case "last-click":
          return { channel: item.channel, value: item.clicks[item.clicks.length - 1] };
        case "first-click":
          return { channel: item.channel, value: item.clicks[0] };
        case "linear":
          const avg = item.clicks.reduce((sum, click) => sum + click, 0) / item.clicks.length;
          return { channel: item.channel, value: avg };
        default:
          return { channel: item.channel, value: item.engagements };
      }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
