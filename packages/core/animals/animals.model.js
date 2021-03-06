import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema(
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
);

export default mongoose.model('animal', animalSchema);
