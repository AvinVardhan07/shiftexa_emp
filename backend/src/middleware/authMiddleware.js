const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Membership = require('../models/Membership');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    req.user = user;

    // Attach organization if available in header or query
    const targetOrgId = req.headers['x-organization-id'] || req.query.organizationId || decoded.organizationId;
    if (targetOrgId) {
      const membership = await Membership.findOne({ userId: user._id, organizationId: targetOrgId });
      if (membership) {
        req.membership = membership;
        req.organizationId = targetOrgId;
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const requireRole = (allowedRoles = ['OWNER', 'ADMIN']) => {
  return (req, res, next) => {
    if (!req.membership || !allowedRoles.includes(req.membership.role)) {
      return res.status(403).json({ success: false, message: 'Permission denied. Insufficient role.' });
    }
    next();
  };
};

module.exports = { authenticate, requireRole };
