'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

module.exports = async function () {
  var db = mongoose.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).catch(err => {
    console.log("==> mongoose.connect error: <==");
    throw err;
  });

  var UserSchema = new Schema({
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    name: String,
    facebookProvider: {
      type: {
        id: String,
        avatar_url: String,
        access_token: String
      },
      select: false
    },
    githubProvider: {
      type: {
        id: String,
        avatar_url: String,
        access_token: String
      },
      select: false
    }
  });

  UserSchema.set('toJSON', {getters: true, virtuals: true});

  UserSchema.statics.upsertGithubUser = async function(accessToken, profile) {
    const filter = { 'email': profile.email };
    const update = {  
      email: profile.email,
      name: profile.name,
      githubProvider: {
        id: profile.id,
        avatar_url: profile.avatar_url,
        access_token: accessToken
      } 
    };
    try {
      await this.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
      });
      return null;
    } catch (err) {
      console.log("===> upsertGithubUser error <===");
      throw err;
    }
  };

  UserSchema.statics.upsertFacebookUser = async function(accessToken, profile) {
    const filter = { 'email': profile.email };
    const update = {  
      email: profile.email,
      name: profile.name,
      facebookProvider: {
        id: profile.id,
        avatar_url: profile.avatar_url,
        access_token: accessToken
      } 
    };
    try {
      await this.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
      });
      return null;
    } catch (err) {
      console.log("===> upsertFacebookUser error <===");
      throw err;
    }
  };

  UserSchema.statics.findUser = async function(email) {
    const filter = { 'email': email };
    try {
      const res = await this.findOne(filter);
      // console.log("===> findUser: ", res);
      return res;
    } catch (err) {
      console.log("===> findUser error <====");
      throw err;
    }
  };

  mongoose.model('User', UserSchema);

  return db;
};