import mongoose from 'mongoose'

const { Schema } = mongoose

const DonationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionId: { type: String, index: true },
  createdAt: { type: Date, default: Date.now }
})

const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema)
export default Donation
