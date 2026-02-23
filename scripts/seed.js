const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibebuild';

const TeamSchema = new mongoose.Schema({
    teamId: String, password: String, name: String, domain: String,
    role: { type: String, default: 'team' }, members: [{ name: String, email: String }],
    createdAt: { type: Date, default: Date.now },
});

const ProjectSchema = new mongoose.Schema({
    teamId: String, teamName: String, domain: String, title: String,
    description: String, githubUrl: String, liveUrl: String,
    techStack: [String], status: { type: String, default: 'submitted' },
    submittedAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const SettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main' },
    submissionsEnabled: { type: Boolean, default: true },
    workshopEndTime: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 60 * 1000) },
    announcement: { type: String, default: '' },
    galleryPublic: { type: Boolean, default: true },
});

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Team = mongoose.model('Team', TeamSchema);
        const Project = mongoose.model('Project', ProjectSchema);
        const Settings = mongoose.model('Settings', SettingsSchema);

        // Clear existing data
        await Team.deleteMany({});
        await Project.deleteMany({});
        await Settings.deleteMany({});

        const password = await bcryptjs.hash('vibebuild2024', 10);
        const adminPassword = await bcryptjs.hash('admin2024', 10);

        const teams = [
            {
                teamId: 'TEAM001', password, name: 'Team AlphaNova', domain: 'Healthcare AI',
                members: [{ name: 'Aarav Sharma', email: 'aarav@example.com' }, { name: 'Priya Patel', email: 'priya@example.com' }],
            },
            {
                teamId: 'TEAM002', password, name: 'Team CodeCatalyst', domain: 'Agriculture AI',
                members: [{ name: 'Rohan Gupta', email: 'rohan@example.com' }, { name: 'Ananya Singh', email: 'ananya@example.com' }],
            },
            {
                teamId: 'TEAM003', password, name: 'Team NeuralForge', domain: 'Smart Cities',
                members: [{ name: 'Vikram Reddy', email: 'vikram@example.com' }, { name: 'Meera Joshi', email: 'meera@example.com' }],
            },
            {
                teamId: 'TEAM004', password, name: 'Team DataVibe', domain: 'Education Tech',
                members: [{ name: 'Arjun Nair', email: 'arjun@example.com' }, { name: 'Kavya Menon', email: 'kavya@example.com' }],
            },
            {
                teamId: 'TEAM005', password, name: 'Team PixelPulse', domain: 'Healthcare AI',
                members: [{ name: 'Siddharth Kumar', email: 'siddharth@example.com' }, { name: 'Riya Das', email: 'riya@example.com' }],
            },
            {
                teamId: 'TEAM006', password, name: 'Team AI Innovators', domain: 'Agriculture AI',
                members: [{ name: 'Aditya Verma', email: 'aditya@example.com' }, { name: 'Sneha Rao', email: 'sneha@example.com' }],
            },
            {
                teamId: 'TEAM007', password, name: 'Team Tech Titans', domain: 'Smart Cities',
                members: [{ name: 'Harsh Mehta', email: 'harsh@example.com' }, { name: 'Pooja Iyer', email: 'pooja@example.com' }],
            },
            {
                teamId: 'TEAM008', password, name: 'Team Quantum Coders', domain: 'Education Tech',
                members: [{ name: 'Nikhil Jain', email: 'nikhil@example.com' }, { name: 'Divya Shah', email: 'divya@example.com' }],
            },
            {
                teamId: 'ADMIN001', password: adminPassword, name: 'Workshop Admin', domain: 'Admin',
                role: 'admin', members: [],
            },
        ];

        await Team.insertMany(teams);
        console.log('✅ Teams seeded');

        const projects = [
            {
                teamId: 'TEAM001', teamName: 'Team AlphaNova', domain: 'Healthcare AI',
                title: 'MedAssist AI - Patient Diagnosis Helper',
                description: 'An AI-powered platform that assists doctors in diagnosing diseases by analyzing patient symptoms, medical history, and lab reports using machine learning models.',
                githubUrl: 'https://github.com/alphanova/medassist-ai',
                liveUrl: 'https://medassist-ai.vercel.app',
                techStack: ['Next.js', 'Python', 'TensorFlow', 'MongoDB', 'OpenAI API'],
                status: 'submitted', submittedAt: new Date(),
            },
            {
                teamId: 'TEAM002', teamName: 'Team CodeCatalyst', domain: 'Agriculture AI',
                title: 'CropGuard - Smart Crop Disease Detection',
                description: 'A mobile-friendly web app that uses computer vision to detect crop diseases from leaf images and provides treatment recommendations to farmers.',
                githubUrl: 'https://github.com/codecatalyst/cropguard',
                liveUrl: 'https://cropguard.vercel.app',
                techStack: ['React', 'FastAPI', 'PyTorch', 'AWS S3', 'Tailwind CSS'],
                status: 'submitted', submittedAt: new Date(),
            },
            {
                teamId: 'TEAM003', teamName: 'Team NeuralForge', domain: 'Smart Cities',
                title: 'TrafficFlow AI - Intelligent Traffic Management',
                description: 'Real-time traffic monitoring and optimization system using AI to reduce congestion, predict traffic patterns, and suggest optimal routes.',
                githubUrl: 'https://github.com/neuralforge/trafficflow',
                liveUrl: 'https://trafficflow-ai.vercel.app',
                techStack: ['Next.js', 'Node.js', 'TensorFlow.js', 'MapBox', 'Socket.io'],
                status: 'submitted', submittedAt: new Date(),
            },
            {
                teamId: 'TEAM004', teamName: 'Team DataVibe', domain: 'Education Tech',
                title: 'LearnPath AI - Personalized Learning Platform',
                description: 'An adaptive learning platform that creates personalized study paths for students using AI, tracking progress and adjusting difficulty in real-time.',
                githubUrl: 'https://github.com/datavibe/learnpath',
                liveUrl: 'https://learnpath-ai.vercel.app',
                techStack: ['Next.js', 'Express', 'MongoDB', 'OpenAI API', 'Chart.js'],
                status: 'submitted', submittedAt: new Date(),
            },
            {
                teamId: 'TEAM005', teamName: 'Team PixelPulse', domain: 'Healthcare AI',
                title: 'VitalScan - AI Health Monitoring Dashboard',
                description: 'A comprehensive health monitoring dashboard that uses AI to analyze vital signs, predict health risks, and provide personalized wellness recommendations.',
                githubUrl: 'https://github.com/pixelpulse/vitalscan',
                techStack: ['React', 'Django', 'Scikit-learn', 'PostgreSQL', 'D3.js'],
                status: 'draft',
            },
        ];

        await Project.insertMany(projects);
        console.log('✅ Projects seeded');

        await Settings.create({
            key: 'main',
            submissionsEnabled: true,
            workshopEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
            announcement: 'Welcome to VibeBuild Workshop! 🚀',
            galleryPublic: true,
        });
        console.log('✅ Settings seeded');

        console.log('\n📋 Login Credentials:');
        console.log('─'.repeat(40));
        console.log('Teams: TEAM001 - TEAM008 | Password: vibebuild2024');
        console.log('Admin: ADMIN001 | Password: admin2024');
        console.log('─'.repeat(40));

        await mongoose.disconnect();
        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
