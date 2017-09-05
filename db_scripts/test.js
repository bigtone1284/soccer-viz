const request = require('request');
const mongoose = require('mongoose');
const _ = require('lodash');
const keys = require('../config/keys');
const leagueInfo = require('./leagueInfo');
require('../models/Team');
require('../models/Season');
require('../models/SeasonTeam');
require('../models/Fixture');

const Team = mongoose.model('teams');
const Season = mongoose.model('seasons');
const SeasonTeam = mongoose.model('seasonTeams');
const Fixture = mongoose.model('fixtures');

mongoose.connect(keys.mongoURI, () => {
  Fixture.find().populate('opponent').exec((err, fixtures) => {
    console.log(fixtures);
  });
});
