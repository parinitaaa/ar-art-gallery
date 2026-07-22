const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['visitor', 'artist', 'admin'],
        default: 'visitor',
    },
    profile: {
        bio: String,
        avatar: String,
        socialLinks: {
            twitter: String,
            instagram: String,
            website: String,
        }
    }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
