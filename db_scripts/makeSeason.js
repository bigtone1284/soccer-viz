const request = require('request');
const mongoose = require('mongoose');
const _ = require('lodash');
const keys = require('../config/keys');
const leagueInfo = require('./leagueInfo');
require('../models/Team');
require('../models/Season');
require('../models/SeasonTeam');

const Team = mongoose.model('teams');
const Season = mongoose.model('seasons');
const SeasonTeam = mongoose.model('seasonTeams');

mongoose.connect(keys.mongoURI, () => {
  Season.remove({}, (err, season) => {
    SeasonTeam.remove({}, (err, seasonTeam) => {
      request(
        'http://api.football-data.org/v1/competitions/445/',
        (error, response, body) => {
          const {
            id: apiId,
            caption: leagueName,
            league: abbreviation,
            year,
            _links: { teams: { href: teamLink } }
          } = JSON.parse(body);

          Season.create(
            {
              apiId,
              leagueName,
              abbreviation,
              year
            },
            (error, season) => {
              request(teamLink, (error, response, body) => {
                let { teams, count } = JSON.parse(body);

                _.each(teams, ({ code }) => {
                  Team.findOne({ code }, (error, team) => {
                    const seasonTeam = new SeasonTeam({
                      team,
                      season,
                      teamName: team.name,
                      seasonApiId: season.apiId
                    });
                    seasonTeam.save((err, team) => {
                      season.seasonTeams.push(seasonTeam);
                      count--;
                      if (count === 0) {
                        season.save(() => process.exit(1));
                      }
                    });
                  });
                });
              });
            }
          );
        }
      );
    });
  });
});
