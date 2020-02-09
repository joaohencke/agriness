/* eslint-disable */
const mongoose = require('mongoose');
const animals = require('./animals.json');

mongoose.connect('mongodb://localhost:27017/agriness-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  config: { autoIndex: true },
});

const animalModel = mongoose.model('animal', new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: Number,
    locale: String,
    birthDate: Date,
    entryDate: {
      type: Date,
      default: () => new Date(),
    },
    purchaseWeight: Number,
    breed: String,
    trackingCode: String,
    productionPhase: {
      initials: String,
      description: String,
    },
    farmType: {
      initials: String,
      description: String,
    },
  },
  { timestamps: true },
));

animalModel.insertMany(animals).then(() => console.log('done')).catch(() => console.log('problems loading db')).then(() => process.exit());

