import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'other'], default: 'image' },
    caption: { type: String, default: '' },
    publicVisible: { type: Boolean, default: true },
    uploadedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
