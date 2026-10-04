const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const UsageRecord = require('../models/UsageRecord');
const Organization = require('../models/Organization');

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
      .limit(30);

    const usageRecords = await UsageRecord.find({ organizationId: req.organizationId })
      .populate('employeeId', 'name')
      .populate('callId')
      .sort({ createdAt: -1 })
      .limit(30);

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

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const topUpAmount = Number(amount);

    if (!topUpAmount || topUpAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum top-up amount is ₹100' });
    }

    const gstAmount = Number((topUpAmount * 0.18).toFixed(2));
    const totalPayable = Number((topUpAmount + gstAmount).toFixed(2));
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      order: {
        orderId,
        amount: totalPayable * 100, // paise
        creditAmount: topUpAmount,
        gstAmount,
        totalPayable,
        currency: 'INR',
        keyId: 'rzp_live_shiftexa_key_998313'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.topUpWallet = async (req, res, next) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId } = req.body;
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

    const paymentRef = razorpayPaymentId || `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const gstAmount = Number((topUpAmount * 0.18).toFixed(2));

    const transaction = await Transaction.create({
      organizationId: req.organizationId,
      walletId: wallet._id,
      type: 'CREDIT_TOP_UP',
      amount: topUpAmount,
      balanceAfter: newBalance,
      description: `Wallet Top-Up via Razorpay (Added ₹${topUpAmount} + ₹${gstAmount} GST)`,
      referenceId: paymentRef,
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      wallet,
      transaction,
      invoice: {
        invoiceNumber: `INV-SHIF-2026-${transaction._id.toString().slice(-6).toUpperCase()}`,
        date: transaction.createdAt,
        subtotal: topUpAmount,
        cgst: (gstAmount / 2).toFixed(2),
        sgst: (gstAmount / 2).toFixed(2),
        totalAmount: (topUpAmount + gstAmount).toFixed(2),
        sacCode: '998313 - Telephony AI Services'
      },
      message: `Successfully added ₹${topUpAmount} to your wallet.`
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleAutoRecharge = async (req, res, next) => {
  try {
    const { enabled, threshold } = req.body;

    let wallet = await Wallet.findOne({ organizationId: req.organizationId });
    if (!wallet) {
      wallet = await Wallet.create({ organizationId: req.organizationId, balance: 500.00 });
    }

    if (typeof enabled === 'boolean') wallet.autoRechargeEnabled = enabled;
    if (threshold && Number(threshold) > 0) wallet.lowBalanceThreshold = Number(threshold);

    wallet.updatedAt = new Date();
    await wallet.save();

    res.json({
      success: true,
      wallet,
      message: `Auto-recharge setting updated. Status: ${wallet.autoRechargeEnabled ? 'ENABLED' : 'DISABLED'}`
    });
  } catch (err) {
    next(err);
  }
};

exports.getGSTInvoice = async (req, res, next) => {
  try {
    const { txId } = req.params;
    const tx = await Transaction.findOne({ _id: txId, organizationId: req.organizationId });
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    const org = await Organization.findById(req.organizationId);
    const subtotal = Math.abs(tx.amount);
    const cgst = Number((subtotal * 0.09).toFixed(2));
    const sgst = Number((subtotal * 0.09).toFixed(2));
    const grandTotal = Number((subtotal + cgst + sgst).toFixed(2));

    const invoiceData = {
      invoiceNumber: `INV-SHIF-2026-${tx._id.toString().slice(-6).toUpperCase()}`,
      invoiceDate: new Date(tx.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      seller: {
        name: 'SHIFTEXA AI WORKFORCE PRIVATE LIMITED',
        address: 'Financial District, Nanakramguda, Hyderabad, Telangana 500032',
        gstin: '36AABCX9981K1Z5',
        sacCode: '998313 (Information Technology Telephony AI Services)'
      },
      buyer: {
        companyName: org ? org.name : 'Client Organization',
        organizationId: req.organizationId
      },
      lineItems: [
        {
          description: tx.description || 'Usage Credits Top-Up',
          sacCode: '998313',
          subtotal,
          cgst,
          sgst,
          total: grandTotal
        }
      ],
      summary: {
        subtotal,
        totalCGST: cgst,
        totalSGST: sgst,
        grandTotal
      }
    };

    res.json({ success: true, invoice: invoiceData });
  } catch (err) {
    next(err);
  }
};

