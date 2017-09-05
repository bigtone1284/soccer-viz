const mongoose = require('mongoose');
const { Schema } = mongoose;

const fixtureSchema = new Schema(
  {
    home: Boolean,
    opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'seasonTeams' },
    goalsFor: Number,
    goalsAllowed: Number,
    matchday: Number
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

fixtureSchema.virtual('points').get(function() {
  const margin = this.goalsFor - this.goalsAllowed;
  if (margin > 0) {
    return 3;
  }
  if (margin < 0) {
    return 0;
  }
  return 1;
});

mongoose.model('fixtures', fixtureSchema);
