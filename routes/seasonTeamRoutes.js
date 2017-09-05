const mongoose = require('mongoose');
const SeasonTeam = mongoose.model('seasonTeams');

module.exports = app => {
  app.get('/api/seasonTeam/:id', (req, res) => {
    SeasonTeam.findOneAndPopulate(req.params.id, (err, seasonTeam) => {
      res.send(seasonTeam);
    });
  });
};
