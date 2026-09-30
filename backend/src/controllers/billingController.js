const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const UsageRecord = require('../models/UsageRecord');

exports.getWalletDetails = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ organizationId: req.organizationId });
    if (!wallet) {
      wallet = await Wallet.create({
        organizationId: req.organizationId,
        balance: 500.00
      });
    }

    const transactions = await Transaction.find({ organizationId: req.organizationId })
      .sort({ createdAt: -1 })
      .limit(20);

    const usageRecords = await UsageRecord.find({ organizationId: req.organizationId })
      .populate('employeeId', 'name')
      .populate('callId')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      wallet,
      transactions,
      usageRecords
    });
  } catch (err) {
    next(err);
  }
};

exports.topUpWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const topUpAmount = Number(amount);

    if (!topUpAmount || topUpAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum top-up amount is ₹100' });
    }

    let wallet = await Wallet.findOne({ organizationId: req.organizationId });
    if (!wallet) {
      wallet = await Wallet.create({ organizationId: req.organizationId, balance: 500.00 });
    }

    const newBalance = Number((wallet.balance + topUpAmount).toFixed(2));
    wallet.balance = newBalance;
    wallet.updatedAt = new Date();
    await wallet.save();

    const transaction = await Transaction.create({
      organizationId: req.organizationId,
      walletId: wallet._id,
      type: 'CREDIT_TOP_UP',
      amount: topUpAmount,
      balanceAfter: newBalance,
      description: `Wallet Top-Up via Razorpay (Added ₹${topUpAmount})`,
      referenceId: `pay_${Date.now()}_test`,
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      wallet,
      transaction,
      message: `Successfully added ₹${topUpAmount} to your wallet.`
    });
  } catch (err) {
    next(err);
  }
};
