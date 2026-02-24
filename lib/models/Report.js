import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: 'Other' },
    category: { type: String, default: 'Other' },
    description: { type: String, default: '' },
    uploadedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
