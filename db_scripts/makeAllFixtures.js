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
  Fixture.remove({}, () => {
    request(
      'http://api.football-data.org/v1/competitions/445/leagueTable',
      (error, response, body) => {
        const { matchday } = JSON.parse(body);
        let i = 1;
        while (i <= matchday) {
          request(
            `http://api.football-data.org/v1/competitions/445/fixtures?matchday=${i}`,
            (error, response, body) => {
              const { fixtures } = JSON.parse(body);
              _.each(fixtures, fixture => {
                const {
                  homeTeamName,
                  awayTeamName,
                  result: { goalsHomeTeam, goalsAwayTeam },
                  matchday: matchdayFixture
                } = fixture;
                SeasonTeam.findSeasonTeamBySeasonTeamName(
                  '445',
                  homeTeamName,
                  (err, homeSeasonTeam) => {
                    SeasonTeam.findSeasonTeamBySeasonTeamName(
                      '445',
                      awayTeamName,
                      (err, awaySeasonTeam) => {
                        const awayTeamFixture = Fixture.create(
                          {
                            matchday: matchdayFixture,
                            home: false,
                            goalsFor: goalsAwayTeam,
                            goalsAllowed: goalsHomeTeam,
                            opponent: homeSeasonTeam
                          },
                          (err, fixture) => {
                            awaySeasonTeam.fixtures.push(fixture);
                            awaySeasonTeam.save();
                          }
                        );

                        const homeTeamFixture = Fixture.create(
                          {
                            matchday: matchdayFixture,
                            home: true,
                            goalsAllowed: goalsAwayTeam,
                            goalsFor: goalsHomeTeam,
                            opponent: awaySeasonTeam
                          },
                          (err, fixture) => {
                            homeSeasonTeam.fixtures.push(fixture);
                            homeSeasonTeam.save();
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
          i++;
        }
      }
    );
  });
});
