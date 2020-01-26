import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['refresh_token', 'access_token'],
    },
    token: { type: String, index: true },
    expiresAt: Date,
    userId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

authSchema.virtual('user', {
  ref: 'user',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export default mongoose.model('auth', authSchema);
