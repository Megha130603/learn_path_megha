const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email or username"
            });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        if (user) {
            req.session.userId = user._id;
            req.session.username = user.username;
            
            user.lastLogin = new Date();
            await user.save();
            
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                },
                message: "User registered successfully! 🎉"
            });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: username }, { username: username }]
        });

        if (user && (await user.comparePassword(password))) {
            req.session.userId = user._id;
            req.session.username = user.username;
            
            user.lastLogin = new Date();
            await user.save();
            
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                },
                message: "Login successful! 👋"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

const getMe = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = await User.findById(req.session.userId).select("-password");
            res.json({
                success: true,
                data: user
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Not logged in"
            });
        }
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching user data"
        });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error logging out"
            });
        }
        
        res.clearCookie("connect.sid");
        res.json({
            success: true,
            message: "Logged out successfully! 👋"
        });
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};
