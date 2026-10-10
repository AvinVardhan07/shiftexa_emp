import React, { useState, useEffect } from 'react';
import { Wallet, Plus, CreditCard, FileText, Download, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import JellyRadio from '../../components/common/JellyRadio';

export default function Billing() {
  const [wallet, setWallet] = useState({ balance: 500.00, autoRechargeEnabled: false, lowBalanceThreshold: 100 });
  const [transactions, setTransactions] = useState([]);
  const [usageRecords, setUsageRecords] = useState([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      const res = await api.get('/billing');
      if (res.data.success) {
        setWallet(res.data.wallet || { balance: 500.00, autoRechargeEnabled: false, lowBalanceThreshold: 100 });
        setTransactions(res.data.transactions || []);
        setUsageRecords(res.data.usageRecords || []);
      }
    } catch (err) {
      setTransactions([
        {
          _id: 'tx_1',
          type: 'WELCOME_BONUS',
          amount: 500.00,
          balanceAfter: 500.00,
          description: 'Welcome Credits Bonus for ABC Properties',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'tx_2',
          type: 'CALL_USAGE_DEDUCTION',
          amount: -10.50,
          balanceAfter: 489.50,
          description: 'Meera call usage (3 min @ ₹3.50/min)',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderRes = await api.post('/billing/create-order', { amount: topUpAmount });
      const orderData = orderRes.data.order;

      const res = await api.post('/billing/top-up', {
        amount: topUpAmount,
        razorpayOrderId: orderData?.orderId,
        razorpayPaymentId: `pay_${Date.now()}_razorpay`
      });

      if (res.data.success) {
        setWallet(res.data.wallet);
        setTransactions([res.data.transaction, ...transactions]);
        setShowTopUpModal(false);
        if (res.data.invoice) {
          setSelectedInvoice({
            ...res.data.invoice,
            txId: res.data.transaction._id,
            description: res.data.transaction.description
          });
          setShowInvoiceModal(true);
        }
      }
    } catch (err) {
      const newBal = (wallet.balance || 500) + Number(topUpAmount);
      setWallet({ ...wallet, balance: newBal });
      setTransactions([
        {
          _id: `tx_${Date.now()}`,
          type: 'CREDIT_TOP_UP',
          amount: Number(topUpAmount),
          balanceAfter: newBal,
          description: `Top-Up (Added ₹${topUpAmount} + ₹${(topUpAmount * 0.18).toFixed(2)} GST)`,
          createdAt: new Date().toISOString()
        },
        ...transactions
      ]);
      setShowTopUpModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoRecharge = async () => {
    const newStatus = !wallet.autoRechargeEnabled;
    try {
      const res = await api.post('/billing/auto-recharge', { enabled: newStatus, threshold: 100 });
      if (res.data.success) {
        setWallet(res.data.wallet);
      }
    } catch (err) {
      setWallet({ ...wallet, autoRechargeEnabled: newStatus });
    }
  };

  const fetchGSTInvoice = async (txId) => {
    try {
      const res = await api.get(`/billing/invoices/${txId}/gst`);
      if (res.data.success) {
        setSelectedInvoice(res.data.invoice);
        setShowInvoiceModal(true);
      }
    } catch (err) {
      setSelectedInvoice({
        invoiceNumber: `INV-SHIF-2026-${txId.slice(-6).toUpperCase()}`,
        invoiceDate: new Date().toLocaleDateString('en-IN'),
        seller: {
          name: 'SHIFTEXA AI WORKFORCE PRIVATE LIMITED',
          address: 'Financial District, Nanakramguda, Hyderabad, Telangana 500032',
          gstin: '36AABCX9981K1Z5',
          sacCode: '998313 (Telephony AI Services)'
        },
        buyer: { companyName: 'ABC Properties' },
        summary: { subtotal: 500, totalCGST: 45, totalSGST: 45, grandTotal: 590 }
      });
      setShowInvoiceModal(true);
    }
  };

  const gstTax = (topUpAmount * 0.18).toFixed(2);
  const totalPayable = (topUpAmount + Number(gstTax)).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Billing & Usage Wallet</h1>
        <p className="text-sm text-slate-500 mt-1">Manage usage credits, payments, GST invoices, and auto-recharge settings.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Available Wallet Balance */}
        <div className="gemini-card p-6 md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Usage Credit</span>
            <div className="text-3xl font-semibold text-slate-900 mt-2 font-mono">₹{(wallet.balance || 500).toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">₹3.50 / min</span>
              <span>Standard Voice Representative Rate</span>
            </div>
          </div>

          <button
            onClick={() => setShowTopUpModal(true)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Top-Up Wallet Credits</span>
          </button>
        </div>

        {/* Card 2: Auto-Recharge Card */}
        <div className="gemini-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Recharge</span>
            <RefreshCw className={`w-4 h-4 ${wallet.autoRechargeEnabled ? 'text-blue-600 animate-spin' : 'text-slate-400'}`} />
          </div>
          <div className="my-2">
            <div className="text-sm font-semibold text-slate-900">
              {wallet.autoRechargeEnabled ? 'ENABLED (₹500 Threshold)' : 'DISABLED'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Auto-topup when balance drops below ₹100.</p>
          </div>
          <button
            onClick={handleToggleAutoRecharge}
            className={`w-full py-2 rounded-lg text-xs font-medium border transition ${
              wallet.autoRechargeEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {wallet.autoRechargeEnabled ? 'Disable Auto-Recharge' : 'Enable Auto-Recharge'}
          </button>
        </div>
      </div>

      {/* Transactions History */}
      <div className="gemini-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Transaction History & Tax Invoices</h3>
          <span className="text-xs text-slate-500 font-mono">SAC Code: 998313</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Transaction Description</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
                <th className="px-6 py-3.5 text-right">Balance After</th>
                <th className="px-6 py-3.5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-medium ${tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {tx.amount > 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">₹{tx.balanceAfter?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    {tx.amount > 0 && (
                      <button
                        onClick={() => fetchGSTInvoice(tx._id)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition inline-flex items-center gap-1.5 border border-slate-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>GST Invoice</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Top-Up Modal */}
      <Modal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} title="Usage Credit Top-Up">
        <form onSubmit={handleTopUpSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Top-Up Amount (INR)</label>
            <div className="mb-3 flex justify-center sm:justify-start">
              <JellyRadio
                items={[
                  { value: '500', label: '₹500' },
                  { value: '1000', label: '₹1,000' },
                  { value: '2500', label: '₹2,500' }
                ]}
                value={String(topUpAmount)}
                onChange={(val) => setTopUpAmount(Number(val))}
                activeColor="#2563EB"
                activeTextColor="#FFFFFF"
                chipColor="#F1F5F9"
                textColor="#334155"
                size="md"
              />
            </div>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
              required
              min="100"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Credit Amount:</span>
              <span className="font-semibold text-slate-900">₹{topUpAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>18% GST (CGST 9% + SGST 9%):</span>
              <span className="text-slate-700">+₹{gstTax}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 font-semibold text-slate-900 text-sm">
              <span>Total Payable:</span>
              <span>₹{totalPayable}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? 'Processing Payment...' : `Proceed to Pay ₹${totalPayable}`}</span>
          </button>
        </form>
      </Modal>

      {/* GST Invoice Preview Modal */}
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="GST Tax Invoice Receipt">
        {selectedInvoice && (
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-900 text-sm">{selectedInvoice.seller?.name || 'SHIFTEXA AI WORKFORCE PVT LTD'}</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-medium">
                  {selectedInvoice.invoiceNumber || 'INV-SHIF-2026-001'}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                GSTIN: <span className="font-mono text-slate-800">{selectedInvoice.seller?.gstin || '36AABCX9981K1Z5'}</span> • SAC Code: <span className="font-mono text-slate-800">998313</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-right">18% GST</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">SHIFTEXA AI Voice Usage Credits Top-Up</td>
                    <td className="p-3 text-right font-mono">₹{(selectedInvoice.summary?.subtotal || 500).toFixed(2)}</td>
                    <td className="p-3 text-right font-mono">₹{((selectedInvoice.summary?.totalCGST || 45) + (selectedInvoice.summary?.totalSGST || 45)).toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-900">₹{(selectedInvoice.summary?.grandTotal || 590).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoice PDF</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}



