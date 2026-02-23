import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    submissionsEnabled: { type: Boolean, default: true },
    workshopEndTime: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 60 * 1000) },
    announcement: { type: String, default: '' },
    galleryPublic: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
