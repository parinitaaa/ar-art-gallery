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

// Password hashing middleware (Mongoose 9 async pre-hook — no next() call needed)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    // bcryptjs v3 uses callbacks — wrap in a Promise
    const salt = await new Promise((res, rej) =>
        bcrypt.genSalt(process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 10, (err, s) => err ? rej(err) : res(s))
    );
    this.password = await new Promise((res, rej) =>
        bcrypt.hash(this.password, salt, null, (err, h) => err ? rej(err) : res(h))
    );
});

const User = mongoose.model('User', userSchema);
module.exports = User;
