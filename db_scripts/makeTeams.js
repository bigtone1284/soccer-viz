const request = require('request');
const mongoose = require('mongoose');
const _ = require('lodash');
const keys = require('../config/keys');
const teamInfo = require('./teamInfo');
require('../models/Team');

const Team = mongoose.model('teams');

mongoose.connect(keys.mongoURI, () => {
  Team.remove({}, () => {
    request(
      'http://api.football-data.org/v1/competitions/445/teams',
      (error, response, body) => {
        let { teams, count } = JSON.parse(body);

        _.each(teams, ({ name, shortName, crestUrl, code }) => {
          const { abbreviation, primaryColor, secondaryColor } = teamInfo[code];
          Team.create(
            {
              name,
              shortName,
              crestUrl,
              abbreviation,
              primaryColor,
              secondaryColor,
              code
            },
            () => {
              count--;
              if (count === 0) {
                process.exit(1);
              }
            }
          );
        });
      }
    );
  });
});
