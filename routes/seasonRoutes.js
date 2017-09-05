const mongoose = require('mongoose');
const _ = require('lodash');
const Season = mongoose.model('seasons');

module.exports = app => {
  app.get('/api/season/:id', (req, res) => {
    Season.findOneAndPopulate(req.params.id, (err, season) => {
      res.send(season);
    });
  });
};
