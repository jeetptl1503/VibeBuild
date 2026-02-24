import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    certificateUrl: { type: String, default: '' },
    certificateType: { type: String, default: 'participation' },
    issuedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
