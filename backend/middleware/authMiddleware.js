const User = require('../models/User');

const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    
    return res.status(401).json({
        success: false,
        message: 'Please log in to access this resource'
    });
};

const getCurrentUser = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            req.user = user;
        } catch (error) {
            console.error('Error fetching user from session:', error);
        }
    }
    next();
};

const optionalAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        req.user = null;
        next();
    }
};

module.exports = {
    requireAuth,
    getCurrentUser,
    optionalAuth
};
