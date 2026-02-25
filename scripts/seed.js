const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibebuild';

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'participant' },
    needsPasswordSetup: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const SettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main' },
    submissionsEnabled: { type: Boolean, default: true },
    workshopEndTime: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 60 * 1000) },
    announcement: { type: String, default: 'Welcome to VibeBuild Workshop! 🚀' },
    galleryPublic: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

const participantsData = [
    { userId: '25EC072', pass: 'prerak25072', name: 'Parmar Prerakkumar Pradipkumar' },
    { userId: '25EC034', pass: 'shardul25034', name: 'Shardul Manish Gundekar' },
    { userId: '25EC119', pass: 'rudra25119', name: 'Rudra Shah' },
    { userId: '25EC063', pass: 'arnav25063', name: 'Arnav Pandya' },
    { userId: '25EC117', pass: 'jinesh25117', name: 'Jinesh Divyesh Shah' },
    { userId: '25EC113', pass: 'bhavya25113', name: 'Bhavyarajsinh Raulji' },
    { userId: '25EC118', pass: 'maan25118', name: 'Maan Niraj Shah' },
    { userId: '25EC147', pass: 'harmit25147', name: 'Harmit Viradiya' },
    { userId: '25EC075', pass: 'hari25075', name: 'Patel Hari Mehulbhai' },
    { userId: '25EC138A', pass: 'dev25138', name: 'Vaghani Dev' },
    { userId: '25EC142', pass: 'prashant25142', name: 'Prashant Valiyan' },
    { userId: '25EC035', pass: 'tirth25035', name: 'Tirth italiya' },
    { userId: '25EC026', pass: 'parth25026', name: 'Parth Dudhat' },
    { userId: '25EC071', pass: 'kaushal25071', name: 'Kaushal Parmar' },
    { userId: '25EC137', pass: 'mantra25137', name: 'Mantra Vadaliya' },
    { userId: '25EC091', pass: 'rohan25091', name: 'Rohan Tarunkumar Patel' },
    { userId: '25EC061', pass: 'khushi25061', name: 'Khushi Palande' },
    { userId: '25EC101', pass: 'yash25101', name: 'Yash Patel' },
    { userId: '25EC090', pass: 'richa25090', name: 'Richa Rakeshkumar Patel' },
    { userId: '25EC145', pass: 'shlok25145', name: 'Shlok Vekariya' },
    { userId: '25EC079', pass: 'jeel25079', name: 'Patel Jeel Nileshbhai' },
    { userId: '25EC124', pass: 'sumit25124', name: 'Sumit Solanki' },
    { userId: '25EC104', pass: 'dhrumil25104', name: 'Dhrumil Prajapati' },
    { userId: '25EC130', pass: 'aditya25130', name: 'Aditya Tailor' },
    { userId: '25EC033', pass: 'ishan25033', name: 'Gujarati Ishan Bharatbhai' },
    { userId: '25EC149', pass: 'meet25149', name: 'Meet Sakariya' },
    { userId: '25EC030', pass: 'riya25030', name: 'Ghetia Riya Miteshbhai' },
    { userId: '25EC087', pass: 'prince25087', name: 'Prince prajulkumar patel' },
    { userId: '25EC125', pass: 'hitansh25125', name: 'Hitansh soni' },
    { userId: '25EC121', pass: 'harsh25121', name: 'SHARMA HARSH MEGHA' },
    { userId: '25EC022', pass: 'tvisha25022', name: 'Tvisha Dhokai' },
    { userId: '25EC096', pass: 'smeet25096', name: 'Smeet Hetalkumar Patel' },
    { userId: '25EC120', pass: 'vraj25120', name: 'Vraj Jaykumar Shah' },
    { userId: '25EC006', pass: 'yogi25006', name: 'Yogi Bambharoliya' },
    { userId: '25EC081', pass: 'patel25081', name: 'Patel Kris Bharatbhai' },
    { userId: '25EC132', pass: 'meera25132', name: 'Thakkar Meera Jitendrakumar' },
    { userId: '25EC109', pass: 'suhani25109', name: 'Suhani Rana' },
    { userId: '25EC076', pass: 'harsh25076', name: 'Harsh Maulikbhai Patel' },
    { userId: '25EC115', pass: 'dharman25115', name: 'Dharman Savaliya' },
    { userId: '25EC039', pass: 'swastik25039', name: 'Swastik Kachhadiya' },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', UserSchema);
        const Settings = mongoose.model('Settings', SettingsSchema);

        // Clear existing basic data (optional, maybe just upsert)
        // await User.deleteMany({}); 

        console.log('Seeding admins...');
        const tempPassword = await bcryptjs.hash('temppass2024', 10);
        const admins = [
            { userId: 'DMP001', name: 'Faculty Coordinator' },
            { userId: '25EC080', name: 'Student Coordinator 1' },
            { userId: '25EC112', name: 'Student Coordinator 2' },
        ];

        for (const admin of admins) {
            await User.findOneAndUpdate(
                { userId: admin.userId },
                { ...admin, password: tempPassword, role: 'admin', needsPasswordSetup: true },
                { upsert: true }
            );
        }

        console.log('Seeding 40 participants...');
        for (const p of participantsData) {
            const hashedPassword = await bcryptjs.hash(p.pass, 10);
            await User.findOneAndUpdate(
                { userId: p.userId },
                { userId: p.userId, password: hashedPassword, name: p.name, role: 'participant', needsPasswordSetup: false },
                { upsert: true }
            );
        }

        await Settings.findOneAndUpdate(
            { key: 'main' },
            {
                submissionsEnabled: true,
                workshopEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
                announcement: 'Welcome to VibeBuild Workshop! 🚀',
                galleryPublic: true,
            },
            { upsert: true }
        );

        await mongoose.disconnect();
        console.log('\n✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
