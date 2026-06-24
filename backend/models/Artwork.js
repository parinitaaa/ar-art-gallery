const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        value: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'ETH',
        }
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
    },
    images: [{
        url: String,
        isPrimary: Boolean,
    }],
    model3D: {
        url: String,
        format: String, // 'glb' or 'gltf'
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: { type: String, default: 'cm' }
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'hidden'],
        default: 'available',
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isTrending: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Artwork = mongoose.model('Artwork', artworkSchema);
module.exports = Artwork;
