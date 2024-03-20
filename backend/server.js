const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('./model/user');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://ayush6678:RnosCjcw28L51tcD@overdue.gije1vb.mongodb.net/?retryWrites=true&w=majority&appName=overdue', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ayush.6678@gmail.com',
        pass: 'CrossBow#47',
    },
});

// Cron job to send reminder emails
cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
    const users = await User.find();

    users.forEach(async (user) => {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Payment Reminder',
            text: `Hi ${user.name}, this is a reminder to pay the due amount of ₹${user.amount}.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            console.error(`Error sending email to ${user.email}: ${error}`);
        }
    });
});

// API routes
app.post('/api/users', async (req, res) => {
    const { name, amount, email } = req.body;
    const user = new User({ name, amount, email });

    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});