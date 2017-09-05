const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  abbreviation: String,
  shortName: String,
  crestUrl: String,
  primaryColor: String,
  secondaryColor: String,
  code: String
});

mongoose.model('teams', teamSchema);
