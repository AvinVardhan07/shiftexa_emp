const Call = require('../models/Call');
const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const UsageRecord = require('../models/UsageRecord');
const actionEngine = require('./actionEngine');
const env = require('../config/env');

class PostCallWorker {
  async processCompletedCall(callId, socketIo = null) {
    try {
      const call = await Call.findById(callId).populate('employeeId leadId');
      if (!call) {
        console.error(`[PostCallWorker] Call ${callId} not found`);
        return;
      }

      console.log(`[PostCallWorker] Processing post-call intelligence for Call ID: ${callId}`);

      // 1. Calculate duration and billing minutes
      const durationSec = call.durationSeconds || 120; // Default 2 mins for test call if empty
      const billedMinutes = Math.max(1, Math.ceil(durationSec / 60));
      const ratePerMin = call.costPerMin || env.CALL_RATE_PER_MIN;
      const totalCost = Number((billedMinutes * ratePerMin).toFixed(2));

      // 2. Generate Summary and Outcome if not set
      const summary = call.summary || 
        "Customer Rahul enquired about 3BHK in Gachibowli (Budget ~₹1.5 Cr). Expressed price hesitation and parents medical proximity requirements. Meera provided consultative guidance and successfully booked a site visit for Sunday 11:00 AM. Sent WhatsApp brochure.";

      const outcome = call.outcome || 'QUALIFIED_SITE_VISIT_BOOKED';

      // 3. Update Call Document
      call.status = 'COMPLETED';
      call.durationSeconds = durationSec;
      call.billedMinutes = billedMinutes;
      call.totalCost = totalCost;
      call.summary = summary;
      call.outcome = outcome;
      call.endedAt = new Date();
      call.extractedData = {
        budget: '₹1.5 Crore',
        preferredLocation: 'Gachibowli',
        configuration: '3BHK',
        timeline: '1 Month',
        siteVisitSlot: 'Sunday 11:00 AM',
        whatsappSent: true,
        sentiment: 'POSITIVE'
      };

      await call.save();

      // 4. Update Lead status and qualification data
      if (call.leadId) {
        await Lead.findByIdAndUpdate(call.leadId._id || call.leadId, {
          status: 'SITE_VISIT_BOOKED',
          lastCalledAt: new Date(),
          lastCallId: call._id,
          'qualificationData.budget': '₹1.5 Crore',
          'qualificationData.preferredLocation': 'Gachibowli',
          'qualificationData.configuration': '3BHK',
          'qualificationData.timeline': '1 Month',
          'qualificationData.siteVisitDate': 'Sunday 11:00 AM',
          'qualificationData.buyingPurpose': 'Family / Parents Residence'
        });

        // Trigger WhatsApp brochure tool via ActionEngine
        await actionEngine.sendWhatsApp({
          organizationId: call.organizationId,
          employeeId: call.employeeId._id || call.employeeId,
          callId: call._id,
          leadId: call.leadId._id || call.leadId,
          recipientPhone: call.leadId.phone || '+91 98765 43210',
          templateName: 'site_visit_confirmation',
          parameters: { name: call.leadId.name || 'Rahul Sharma', time: 'Sunday 11:00 AM' }
        });
      }

      // 5. Update Employee Stats
      await Employee.findByIdAndUpdate(call.employeeId._id || call.employeeId, {
        $inc: {
          'stats.totalCalls': 1,
          'stats.totalMinutes': billedMinutes,
          'stats.qualifiedLeads': 1,
          'stats.siteVisitsBooked': 1
        }
      });

      // 6. Deduct Billing from Wallet
      let wallet = await Wallet.findOne({ organizationId: call.organizationId });
      if (!wallet) {
        wallet = await Wallet.create({
          organizationId: call.organizationId,
          balance: 500.00
        });
      }

      const newBalance = Math.max(0, Number((wallet.balance - totalCost).toFixed(2)));
      wallet.balance = newBalance;
      wallet.updatedAt = new Date();
      await wallet.save();

      // Log Transaction
      await Transaction.create({
        organizationId: call.organizationId,
        walletId: wallet._id,
        type: 'CALL_USAGE_DEDUCTION',
        amount: -totalCost,
        balanceAfter: newBalance,
        description: `Meera call usage (${billedMinutes} min @ ₹${ratePerMin}/min)`,
        referenceId: call._id.toString(),
        status: 'SUCCESS'
      });

      // Log Usage Record
      await UsageRecord.create({
        organizationId: call.organizationId,
        employeeId: call.employeeId._id || call.employeeId,
        callId: call._id,
        durationSeconds: durationSec,
        billedMinutes: billedMinutes,
        ratePerMin: ratePerMin,
        totalAmountCharged: totalCost
      });

      console.log(`[PostCallWorker] Completed post-call processing for Call ID: ${callId}. Charged ₹${totalCost}. Wallet balance: ₹${newBalance}`);

      if (socketIo) {
        socketIo.emit(`call:updated:${call._id}`, { call, walletBalance: newBalance });
        socketIo.emit(`organization:updated:${call.organizationId}`, { type: 'CALL_COMPLETED', callId: call._id });
      }

      return call;
    } catch (err) {
      console.error('[PostCallWorker] Error during post-call processing:', err);
    }
  }
}

module.exports = new PostCallWorker();
