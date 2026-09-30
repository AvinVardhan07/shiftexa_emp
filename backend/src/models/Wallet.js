const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, unique: true },
  balance: { type: Number, default: 500.00 }, // Default welcome bonus ₹500.00
  currency: { type: String, default: 'INR' },
  autoRechargeEnabled: { type: Boolean, default: false },
  lowBalanceThreshold: { type: Number, default: 50.00 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);
