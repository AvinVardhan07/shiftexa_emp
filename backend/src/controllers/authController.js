const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Membership = require('../models/Membership');
const Wallet = require('../models/Wallet');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;
    
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, password, companyName) are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const org = await Organization.create({
      name: companyName,
      slug,
      apiKey: `shiftexa_live_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    });

    const membership = await Membership.create({
      userId: user._id,
      organizationId: org._id,
      role: 'OWNER'
    });

    // Create Wallet with welcome bonus ₹500
    await Wallet.create({
      organizationId: org._id,
      balance: 500.00
    });

    const token = jwt.sign(
      { userId: user._id, organizationId: org._id },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      organization: { id: org._id, name: org.name, slug: org.slug, role: membership.role }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    let membership = await Membership.findOne({ userId: user._id }).populate('organizationId');
    let org = membership ? membership.organizationId : null;

    if (!org) {
      org = await Organization.create({
        name: `${user.name}'s Organization`,
        slug: `org-${Date.now()}`,
        apiKey: `shiftexa_live_${Date.now()}`
      });
      membership = await Membership.create({
        userId: user._id,
        organizationId: org._id,
        role: 'OWNER'
      });
      await Wallet.create({ organizationId: org._id, balance: 500.00 });
    }

    const token = jwt.sign(
      { userId: user._id, organizationId: org._id },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      organization: { id: org._id, name: org.name, slug: org.slug, role: membership.role }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const memberships = await Membership.find({ userId: req.user._id }).populate('organizationId');
    const currentOrg = req.membership ? req.membership.organizationId : (memberships[0] ? memberships[0].organizationId : null);

    res.json({
      success: true,
      user: { id: req.user._id, name: req.user.name, email: req.user.email },
      currentOrganization: currentOrg,
      organizations: memberships.map(m => ({
        id: m.organizationId._id,
        name: m.organizationId.name,
        role: m.role
      }))
    });
  } catch (err) {
    next(err);
  }
};

exports.getTeamMembers = async (req, res, next) => {
  try {
    const members = await Membership.find({ organizationId: req.organizationId })
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      members: members.map(m => ({
        membershipId: m._id,
        user: m.userId,
        role: m.role,
        joinedAt: m.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

exports.inviteTeamMember = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const hashedPassword = await bcrypt.hash('ShiftexaTemp123!', 10);
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: hashedPassword
      });
    }

    let membership = await Membership.findOne({ userId: user._id, organizationId: req.organizationId });
    if (membership) {
      return res.status(400).json({ success: false, message: 'User is already a member of this organization' });
    }

    membership = await Membership.create({
      userId: user._id,
      organizationId: req.organizationId,
      role: role || 'MEMBER'
    });

    res.status(201).json({
      success: true,
      membership,
      message: `Successfully invited ${email} as ${role || 'MEMBER'}.`
    });
  } catch (err) {
    next(err);
  }
};
