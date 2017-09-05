const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const seasonSchema = new Schema({
  leagueName: String,
  abbreviation: String,
  leagueImageUri: String,
  year: String,
  apiId: String,
  seasonTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'seasonTeams' }]
});

seasonSchema.statics.findOneAndPopulate = function(apiId, cb) {
  this.findOne({ apiId })
    .populate({
      path: 'seasonTeams',
      populate: {
        path: 'team fixtures',
        options: {
          sort: { matchday: 1 },
          populate: {
            path: 'opponent',
            select: 'team _id ',
            populate: {
              path: 'team'
            }
          }
        }
      }
    })
    .exec((err, season) => {
      season.seasonTeams = _.chain(season.seasonTeams)
        .sortBy([
          ({ results }) => {
            return results.points;
          },
          ({ results }) => {
            return results.goalsFor - results.goalsAllowed;
          },
          ({ results }) => {
            return results.goalsFor;
          },
          'teamName'
        ])
        .reverse()
        .value();
      cb(err, season);
    });
};

mongoose.model('seasons', seasonSchema);
