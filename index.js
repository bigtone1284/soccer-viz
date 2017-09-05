const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

require('./models/Team');
require('./models/Season');
require('./models/SeasonTeam');
require('./models/Fixture');

const Team = mongoose.model('teams');
const Season = mongoose.model('seasons');
const SeasonTeam = mongoose.model('seasonTeams');
const Fixture = mongoose.model('fixtures');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

require('./routes/seasonRoutes')(app);
require('./routes/seasonTeamRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
