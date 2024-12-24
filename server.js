const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');  // Ensure User model is defined

dotenv.config();
const app = express();

app.use(bodyParser.json());

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: to, // Receiver email address
        subject: subject, // Email subject
        text: text, // Email body
    };

    return transporter.sendMail(mailOptions);
};

// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token (JWT token with expiration)
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Construct the reset password link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Send email with the reset link
        const emailResponse = await sendEmail(
            email,
            'Password Reset Request',
            `Click here to reset your password: ${resetLink}`
        );

        if (emailResponse.accepted.length > 0) {
            return res.status(200).json({ message: 'Password reset link sent to email' });
        } else {
            return res.status(500).json({ error: 'Error sending email' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset password endpoint
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on email (no need to store the token in DB)
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(400).send({ error: 'Invalid token or user not found' });

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.send({ message: 'Password reset successful' });
    } catch (err) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Email not registered" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).send({ error: 'User already exists' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
