import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    domain: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubUrl: { type: String, required: true },
    liveUrl: { type: String },
    techStack: [{ type: String }],
    status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
    submittedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
