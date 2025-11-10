const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: username, email, password'
        });
    }
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
            success: false,
            message: 'Username must be between 3 and 30 characters'
        });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide username/email and password'
        });
    }
    
    next();
};

module.exports = {
    validateRegister,
    validateLogin
};
