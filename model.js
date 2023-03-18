const mongoose = require('mongoose');

// const voteSchema = new mongoose.Schema({
//    movieId:Number,
//    like:Number,
//    dislike:Number
  
//   });
  
//   // Create the model based on the schema
//   const VoteModel = mongoose.model('Vote', voteSchema);

//   module.exports = {
//    VoteModel
// }






const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  vote: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
});

const voteSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.model("User", userSchema);
const VoteModel = mongoose.model("Vote", voteSchema);

module.exports = {
  UserModel,
  VoteModel,
};