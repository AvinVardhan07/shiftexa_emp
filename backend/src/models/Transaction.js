const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type: { type: String, enum: ['CREDIT_TOP_UP', 'CALL_USAGE_DEDUCTION', 'WELCOME_BONUS', 'REFUND'], required: true },
  amount: { type: Number, required: true }, // positive for credit, negative for deduction
  balanceAfter: { type: Number, required: true },
  description: { type: String, required: true },
  referenceId: { type: String }, // Payment gateway ID or Call ID
  status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
