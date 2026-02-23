import bcryptjs from 'bcryptjs';

// In-memory data store — used as fallback when MongoDB is unavailable
const password = bcryptjs.hashSync('vibebuild2024', 10);
const adminPassword = bcryptjs.hashSync('admin2024', 10);

const store = {
    teams: [
        { teamId: 'TEAM001', password, name: 'Team AlphaNova', domain: 'Healthcare AI', role: 'team', members: [{ name: 'Aarav Sharma', email: 'aarav@example.com' }, { name: 'Priya Patel', email: 'priya@example.com' }] },
        { teamId: 'TEAM002', password, name: 'Team CodeCatalyst', domain: 'Agriculture AI', role: 'team', members: [{ name: 'Rohan Gupta', email: 'rohan@example.com' }, { name: 'Ananya Singh', email: 'ananya@example.com' }] },
        { teamId: 'TEAM003', password, name: 'Team NeuralForge', domain: 'Smart Cities', role: 'team', members: [{ name: 'Vikram Reddy', email: 'vikram@example.com' }, { name: 'Meera Joshi', email: 'meera@example.com' }] },
        { teamId: 'TEAM004', password, name: 'Team DataVibe', domain: 'Education Tech', role: 'team', members: [{ name: 'Arjun Nair', email: 'arjun@example.com' }, { name: 'Kavya Menon', email: 'kavya@example.com' }] },
        { teamId: 'TEAM005', password, name: 'Team PixelPulse', domain: 'Healthcare AI', role: 'team', members: [{ name: 'Siddharth Kumar', email: 'siddharth@example.com' }, { name: 'Riya Das', email: 'riya@example.com' }] },
        { teamId: 'TEAM006', password, name: 'Team AI Innovators', domain: 'Agriculture AI', role: 'team', members: [{ name: 'Aditya Verma', email: 'aditya@example.com' }, { name: 'Sneha Rao', email: 'sneha@example.com' }] },
        { teamId: 'TEAM007', password, name: 'Team Tech Titans', domain: 'Smart Cities', role: 'team', members: [{ name: 'Harsh Mehta', email: 'harsh@example.com' }, { name: 'Pooja Iyer', email: 'pooja@example.com' }] },
        { teamId: 'TEAM008', password, name: 'Team Quantum Coders', domain: 'Education Tech', role: 'team', members: [{ name: 'Nikhil Jain', email: 'nikhil@example.com' }, { name: 'Divya Shah', email: 'divya@example.com' }] },
        { teamId: 'ADMIN001', password: adminPassword, name: 'Workshop Admin', domain: 'Admin', role: 'admin', members: [] },
    ],
    projects: [
        { _id: 'p1', teamId: 'TEAM001', teamName: 'Team AlphaNova', domain: 'Healthcare AI', title: 'MedAssist AI - Patient Diagnosis Helper', description: 'An AI-powered platform that assists doctors in diagnosing diseases by analyzing patient symptoms, medical history, and lab reports using machine learning models.', githubUrl: 'https://github.com/alphanova/medassist-ai', liveUrl: 'https://medassist-ai.vercel.app', techStack: ['Next.js', 'Python', 'TensorFlow', 'MongoDB', 'OpenAI API'], status: 'submitted', submittedAt: new Date().toISOString() },
        { _id: 'p2', teamId: 'TEAM002', teamName: 'Team CodeCatalyst', domain: 'Agriculture AI', title: 'CropGuard - Smart Crop Disease Detection', description: 'A mobile-friendly web app that uses computer vision to detect crop diseases from leaf images and provides treatment recommendations to farmers.', githubUrl: 'https://github.com/codecatalyst/cropguard', liveUrl: 'https://cropguard.vercel.app', techStack: ['React', 'FastAPI', 'PyTorch', 'AWS S3', 'Tailwind CSS'], status: 'submitted', submittedAt: new Date().toISOString() },
        { _id: 'p3', teamId: 'TEAM003', teamName: 'Team NeuralForge', domain: 'Smart Cities', title: 'TrafficFlow AI - Intelligent Traffic Management', description: 'Real-time traffic monitoring and optimization system using AI to reduce congestion, predict traffic patterns, and suggest optimal routes.', githubUrl: 'https://github.com/neuralforge/trafficflow', liveUrl: 'https://trafficflow-ai.vercel.app', techStack: ['Next.js', 'Node.js', 'TensorFlow.js', 'MapBox', 'Socket.io'], status: 'submitted', submittedAt: new Date().toISOString() },
        { _id: 'p4', teamId: 'TEAM004', teamName: 'Team DataVibe', domain: 'Education Tech', title: 'LearnPath AI - Personalized Learning Platform', description: 'An adaptive learning platform that creates personalized study paths for students using AI, tracking progress and adjusting difficulty in real-time.', githubUrl: 'https://github.com/datavibe/learnpath', liveUrl: 'https://learnpath-ai.vercel.app', techStack: ['Next.js', 'Express', 'MongoDB', 'OpenAI API', 'Chart.js'], status: 'submitted', submittedAt: new Date().toISOString() },
        { _id: 'p5', teamId: 'TEAM005', teamName: 'Team PixelPulse', domain: 'Healthcare AI', title: 'VitalScan - AI Health Monitoring Dashboard', description: 'A comprehensive health monitoring dashboard that uses AI to analyze vital signs, predict health risks, and provide personalized wellness recommendations.', githubUrl: 'https://github.com/pixelpulse/vitalscan', liveUrl: '', techStack: ['React', 'Django', 'Scikit-learn', 'PostgreSQL', 'D3.js'], status: 'draft', submittedAt: null },
    ],
    attendance: [],
    gallery: [],
    settings: {
        key: 'main',
        submissionsEnabled: true,
        workshopEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        announcement: 'Welcome to VibeBuild Workshop! 🚀',
        galleryPublic: true,
    },
    _nextId: 100,
};

function nextId() {
    return 'mem_' + (store._nextId++);
}

export function getStore() {
    return store;
}

// Team operations
export function findTeamByTeamId(teamId) {
    return store.teams.find(t => t.teamId === teamId) || null;
}

export function getTeams(role = 'team') {
    return store.teams.filter(t => t.role === role).map(({ password, ...rest }) => rest);
}

export function addTeam(team) {
    store.teams.push(team);
    return team;
}

export function updateTeam(teamId, updates) {
    const team = store.teams.find(t => t.teamId === teamId);
    if (!team) return null;
    Object.assign(team, updates);
    return team;
}

export function deleteTeam(teamId) {
    store.teams = store.teams.filter(t => t.teamId !== teamId);
}

// Project operations
export function getProjects(filter = {}) {
    let results = [...store.projects];
    if (filter.teamId) results = results.filter(p => p.teamId === filter.teamId);
    if (filter.status) results = results.filter(p => p.status === filter.status);
    return results;
}

export function findProjectByTeamId(teamId) {
    return store.projects.find(p => p.teamId === teamId) || null;
}

export function upsertProject(teamId, data) {
    const idx = store.projects.findIndex(p => p.teamId === teamId);
    if (idx >= 0) {
        Object.assign(store.projects[idx], data, { updatedAt: new Date().toISOString() });
        return { project: store.projects[idx], updated: true };
    }
    const project = { _id: nextId(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    store.projects.push(project);
    return { project, created: true };
}

// Attendance operations
export function getAttendance() {
    return [...store.attendance];
}

export function addAttendance(record) {
    const item = { _id: nextId(), ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    store.attendance.push(item);
    return item;
}

export function updateAttendance(id, updates) {
    const item = store.attendance.find(a => a._id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    return item;
}

export function deleteAttendance(id) {
    store.attendance = store.attendance.filter(a => a._id !== id);
}

// Gallery operations
export function getGallery(publicOnly = true) {
    return publicOnly ? store.gallery.filter(g => g.publicVisible) : [...store.gallery];
}

export function addGalleryItem(item) {
    const entry = { _id: nextId(), ...item, createdAt: new Date().toISOString() };
    store.gallery.push(entry);
    return entry;
}

export function deleteGalleryItem(id) {
    store.gallery = store.gallery.filter(g => g._id !== id);
}

// Settings operations
export function getSettings() {
    return { ...store.settings };
}

export function updateSettings(updates) {
    Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
    return { ...store.settings };
}
