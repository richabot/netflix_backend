const express = require("express");
const app=express()
const axios=require("axios")
const { MongoClient } = require('mongodb');
app.use(express.json());
// var axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { UserModel,VoteModel } = require("./model");
// const { default: axios } = require("axios");
require("dotenv").config();

// const {UserMNodel}=require("./model/user.model")
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({ extended: false }))

const db = 'mongodb+srv://richagshah:sarita700@cluster0.zygzowx.mongodb.net/flex?retryWrites=true&w=majority';

// Connect to the MongoDB database
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cors = require('cors');
app.use(cors());
mongoose.connect(db).then(()=>{
console.log("Mongodb connected")
}).catch((err)=>console.log("NO connected",err))
// const generateUserId = () => {
//   // Generate a random 6-digit number
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }; 
// const userId=generateUserId()
app.post('/movies/like', async (req, res) => {
  // console.log(userId,"userid")
  console.log('Received request to /movies/like route');
    const { movieId,userId } = req.body;
    console.log(req.body,"requestbody")
     // Check if the user has already voted for this movie
  const existingVote = await UserModel.findOne({ userId, movieId });
  console.log("existing person in Lik")
  if (existingVote) {
    // If the existing vote is "dislike", update it to "like"
    if (existingVote.vote === "dislike") {
      existingVote.vote = "like";
      await existingVote.save();
      
      // Update the vote count in VoteModel
      await VoteModel.findOneAndUpdate(
        { movieId },
        { $inc: { like: 1, dislike: -1 } },
        { upsert: true }
      );
    }
    // If the existing vote is already "like", do nothing
    console.log("like updated")
    return res.sendStatus(200);
  }
  
  // Create a new user record with the vote
  const newUser = new UserModel({
    userId,
    movieId,
    vote: "like",
  });
  
  // Update the vote count in VoteModel
  await VoteModel.findOneAndUpdate(
    { movieId },
    { $inc: { like: 1 } },
    { upsert: true }
  );
  
  // Save the new user record
  await newUser.save();
  
  console.log("Data updated in MongoDB");
  
  res.sendStatus(200);
    // await VoteModel.findOneAndUpdate(
    //   { movieId },
    //   { $inc: { like: 1 } },
    //   { upsert: true },
     
    // );
    // console.log('Data updated in MongoDB');
    // res.sendStatus(200);
  });
  
  app.post('/movies/dislike', async (req, res) => {
    const { movieId,userId } = req.body;
    // await console.log(userId,"userid")
    // await VoteModel.findOneAndUpdate(
    //   { movieId },
    //   { $inc: { dislike: 1 } },
    //   { upsert: true }
    // );
    // res.sendStatus(200);
    const existingVote = await UserModel.findOne({ userId, movieId });
    if (existingVote) {
      // If the existing vote is "dislike", update it to "like"
      if (existingVote.vote === "like") {
        existingVote.vote = "dislike";
        await existingVote.save();
        
        // Update the vote count in VoteModel
        await VoteModel.findOneAndUpdate(
          { movieId },
          { $inc: { like: -1, dislike: 1 } },
          { upsert: true }
        );
      }
      // If the existing vote is already "like", do nothing
      console.log("dislike updated")
      return res.sendStatus(200);
    }
    
    // Create a new user record with the vote
    const newUser = new UserModel({
      userId,
      movieId,
      vote: "dislike",
    });
    
    // Update the vote count in VoteModel
    await VoteModel.findOneAndUpdate(
      { movieId },
      { $inc: { dislike: 1 } },
      { upsert: true }
    );
    
    // Save the new user record
    await newUser.save();
    
    console.log("Data updated in MongoDB");
    
    res.sendStatus(200);

  });
  app.get("/data", async (req, res) => {
    try {
      const data = await VoteModel.find({});
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id,"id")
    const movie = await VoteModel.findOne({ movieId: id });
    console.log(movie)
    if (movie) {
      res.json({
        like: movie.like,
        dislike: movie.dislike
      });
    } else {
       res.json({
        like: 0,
        dislike:0
      });
    }
  });
app.listen(8080,function(){
    console.log("listening on port 8080")
})

