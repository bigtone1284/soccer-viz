const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;
const Season = mongoose.model('seasons');
const Team = mongoose.model('teams');

const seasonTeamSchema = new Schema(
  {
    fixtures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fixtures'
      }
    ],
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'seasons' },
    seasonApiId: String,
    teamName: String
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

seasonTeamSchema.statics.findSeasonTeamBySeasonTeamName = function(
  seasonApiId,
  teamName,
  cb
) {
  this.findOne(
    {
      seasonApiId,
      teamName
    },
    (err, seasonTeam) => {
      return cb(err, seasonTeam);
    }
  );
};

seasonTeamSchema.statics.findOneAndPopulate = function(id, cb) {
  this.findById(id)
    .populate({
      path: 'fixtures team',
      options: { sort: { matchday: 1 } },
      populate: { path: 'opponent', populate: { path: 'team' } }
    })
    .exec((err, seasonTeam) => {
      cb(err, seasonTeam);
    });
};

seasonTeamSchema.virtual('results').get(function() {
  let results = {
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0,
    goalsFor: 0,
    goalsAllowed: 0
  };
  _.each(this.fixtures, ({ goalsFor, goalsAllowed, points }) => {
    switch (points) {
      case 0:
        results.losses++;
        break;
      case 1:
        results.draws++;
        results.points += points;
        break;
      case 3:
        results.wins++;
        results.points += points;
        break;
      default:
        break;
    }
    results.goalsFor += goalsFor;
    results.goalsAllowed += goalsAllowed;
  });
  return results;
});

seasonTeamSchema.pre('save', function(next) {
  next();
});

mongoose.model('seasonTeams', seasonTeamSchema);
