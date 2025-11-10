const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGODB_URI);
//         console.log('✅ MongoDB Connected: ' + conn.connection.host);
//     } catch (error) {
//         console.error('❌ Database connection error: ' + error.message);
//         process.exit(1);
//     }
// };
const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/LearnProject");
        console.log('✅ MongoDB Connected: ' + conn.connection.host);
    } catch (error) {
        console.error('❌ Database connection error: ' + error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
