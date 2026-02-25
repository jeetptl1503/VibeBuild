import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// ─── File-based persistence ───────────────────────────────────────
const DATA_FILE = path.join(process.cwd(), '.data', 'store.json');

function saveToFile() {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (e) {
        console.warn('Could not save store to file:', e.message);
    }
}

function loadFromFile() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn('Could not load store from file:', e.message);
    }
    return null;
}

// ─── Store initialization ─────────────────────────────────────────
function initStore() {
    if (globalThis.__vibebuild_store) return globalThis.__vibebuild_store;

    const saved = loadFromFile();
    if (saved) {
        globalThis.__vibebuild_store = saved;
        return saved;
    }

    const tempPassword = bcryptjs.hashSync('temppass2024', 10);

    const participants = [
        { userId: '25EC072', password: bcryptjs.hashSync('prerak25072', 10), name: 'Parmar Prerakkumar Pradipkumar', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC034', password: bcryptjs.hashSync('shardul25034', 10), name: 'Shardul Manish Gundekar', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC119', password: bcryptjs.hashSync('rudra25119', 10), name: 'Rudra Shah', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC063', password: bcryptjs.hashSync('arnav25063', 10), name: 'Arnav Pandya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC117', password: bcryptjs.hashSync('jinesh25117', 10), name: 'Jinesh Divyesh Shah', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC113', password: bcryptjs.hashSync('bhavya25113', 10), name: 'Bhavyarajsinh Raulji', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC118', password: bcryptjs.hashSync('maan25118', 10), name: 'Maan Niraj Shah', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC147', password: bcryptjs.hashSync('harmit25147', 10), name: 'Harmit Viradiya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC075', password: bcryptjs.hashSync('hari25075', 10), name: 'Patel Hari Mehulbhai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC138A', password: bcryptjs.hashSync('dev25138', 10), name: 'Vaghani Dev', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC142', password: bcryptjs.hashSync('prashant25142', 10), name: 'Prashant Valiyan', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC035', password: bcryptjs.hashSync('tirth25035', 10), name: 'Tirth italiya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC026', password: bcryptjs.hashSync('parth25026', 10), name: 'Parth Dudhat', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC071', password: bcryptjs.hashSync('kaushal25071', 10), name: 'Kaushal Parmar', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC137', password: bcryptjs.hashSync('mantra25137', 10), name: 'Mantra Vadaliya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC091', password: bcryptjs.hashSync('rohan25091', 10), name: 'Rohan Tarunkumar Patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC061', password: bcryptjs.hashSync('khushi25061', 10), name: 'Khushi Palande', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC101', password: bcryptjs.hashSync('yash25101', 10), name: 'Yash Patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC090', password: bcryptjs.hashSync('richa25090', 10), name: 'Richa Rakeshkumar Patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC145', password: bcryptjs.hashSync('shlok25145', 10), name: 'Shlok Vekariya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC079', password: bcryptjs.hashSync('jeel25079', 10), name: 'Patel Jeel Nileshbhai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC124', password: bcryptjs.hashSync('sumit25124', 10), name: 'Sumit Solanki', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC104', password: bcryptjs.hashSync('dhrumil25104', 10), name: 'Dhrumil Prajapati', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC130', password: bcryptjs.hashSync('aditya25130', 10), name: 'Aditya Tailor', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC033', password: bcryptjs.hashSync('ishan25033', 10), name: 'Gujarati Ishan Bharatbhai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC149', password: bcryptjs.hashSync('meet25149', 10), name: 'Meet Sakariya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC030', password: bcryptjs.hashSync('riya25030', 10), name: 'Ghetia Riya Miteshbhai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC087', password: bcryptjs.hashSync('prince25087', 10), name: 'Prince prajulkumar patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC125', password: bcryptjs.hashSync('hitansh25125', 10), name: 'Hitansh soni', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC121', password: bcryptjs.hashSync('harsh25121', 10), name: 'SHARMA HARSH MEGHA', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC022', password: bcryptjs.hashSync('tvisha25022', 10), name: 'Tvisha Dhokai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC096', password: bcryptjs.hashSync('smeet25096', 10), name: 'Smeet Hetalkumar Patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC120', password: bcryptjs.hashSync('vraj25120', 10), name: 'Vraj Jaykumar Shah', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC006', password: bcryptjs.hashSync('yogi25006', 10), name: 'Yogi Bambharoliya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC081', password: bcryptjs.hashSync('patel25081', 10), name: 'Patel Kris Bharatbhai', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC132', password: bcryptjs.hashSync('meera25132', 10), name: 'Thakkar Meera Jitendrakumar', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC109', password: bcryptjs.hashSync('suhani25109', 10), name: 'Suhani Rana', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC076', password: bcryptjs.hashSync('harsh25076', 10), name: 'Harsh Maulikbhai Patel', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC115', password: bcryptjs.hashSync('dharman25115', 10), name: 'Dharman Savaliya', role: 'participant', needsPasswordSetup: false },
        { userId: '25EC039', password: bcryptjs.hashSync('swastik25039', 10), name: 'Swastik Kachhadiya', role: 'participant', needsPasswordSetup: false },
    ];

    globalThis.__vibebuild_store = {
        users: [
            { userId: 'DMP001', password: tempPassword, name: 'Faculty Coordinator', role: 'admin', needsPasswordSetup: true },
            { userId: '25EC080', password: tempPassword, name: 'Student Coordinator 1', role: 'admin', needsPasswordSetup: true },
            { userId: '25EC112', password: tempPassword, name: 'Student Coordinator 2', role: 'admin', needsPasswordSetup: true },
            ...participants,
        ],
        teams: [],
        projects: [],
        attendance: participants.map((p, i) => ({
            _id: `att_${i + 1}`,
            participantName: p.name,
            studentId: p.userId,
            firstHalf: false,
            secondHalf: false,
            remarks: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })),
        gallery: [],
        reports: [],
        certificates: [],
        settings: {
            key: 'main',
            submissionsEnabled: true,
            workshopEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            announcement: 'Welcome to VibeBuild Workshop! 🚀',
            galleryPublic: true,
        },
        _nextId: 100,
    };

    saveToFile();
    return globalThis.__vibebuild_store;
}

const store = initStore();

function nextId() {
    return 'mem_' + (store._nextId++);
}

function persist() {
    saveToFile();
}

export function getStore() {
    return store;
}

export function findUserByUserId(userId) {
    return store.users.find(u => u.userId === userId) || null;
}

export function getUsers(role = 'participant') {
    return store.users.filter(u => u.role === role).map(({ password, ...rest }) => rest);
}

export function addUser(user) {
    store.users.push(user);
    persist();
    return user;
}

export function updateUser(userId, updates) {
    const user = store.users.find(u => u.userId === userId);
    if (!user) return null;
    Object.assign(user, updates);
    persist();
    return user;
}

export function deleteUser(userId) {
    store.users = store.users.filter(u => u.userId !== userId);
    persist();
}

export function getUserTeams() {
    return [...store.teams];
}

export function getTeamByLeader(leaderId) {
    return store.teams.find(t => t.leaderId === leaderId) || null;
}

export function getTeamByMember(userId) {
    return store.teams.find(t =>
        t.leaderId === userId || t.members.some(m => m.userId === userId)
    ) || null;
}

export function createTeam(teamData) {
    const team = { _id: nextId(), ...teamData, createdAt: new Date().toISOString() };
    store.teams.push(team);
    persist();
    return team;
}

export function updateTeamData(teamId, updates) {
    const team = store.teams.find(t => t._id === teamId);
    if (!team) return null;
    Object.assign(team, updates);
    persist();
    return team;
}

export function deleteTeamData(teamId) {
    store.teams = store.teams.filter(t => t._id !== teamId);
    persist();
}

export function getProjects(filter = {}) {
    let results = [...store.projects];
    if (filter.userId) results = results.filter(p => p.userId === filter.userId);
    if (filter.status) results = results.filter(p => p.status === filter.status);
    return results;
}

export function findProjectByUserId(userId) {
    return store.projects.find(p => p.userId === userId) || null;
}

export function upsertProject(userId, data) {
    const idx = store.projects.findIndex(p => p.userId === userId);
    if (idx >= 0) {
        Object.assign(store.projects[idx], {
            ...data,
            updatedAt: new Date().toISOString()
        });
        persist();
        return { project: store.projects[idx], updated: true };
    }
    const project = {
        _id: nextId(),
        ...data,
        rating: 0,
        score: 0,
        adminFeedback: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    store.projects.push(project);
    persist();
    return { project, created: true };
}

export function updateProjectAdmin(projectId, adminData) {
    const idx = store.projects.findIndex(p => p._id === projectId || p.userId === projectId);
    if (idx >= 0) {
        Object.assign(store.projects[idx], adminData, { updatedAt: new Date().toISOString() });
        persist();
        return store.projects[idx];
    }
    return null;
}

export function deleteProject(id) {
    store.projects = store.projects.filter(p => p._id !== id && p.userId !== id);
    persist();
}

export function getAttendance() {
    return [...store.attendance];
}

export function addAttendance(record) {
    const item = { _id: nextId(), ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    store.attendance.push(item);
    persist();
    return item;
}

export function updateAttendance(id, updates) {
    const item = store.attendance.find(a => a._id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    persist();
    return item;
}

export function deleteAttendance(id) {
    store.attendance = store.attendance.filter(a => a._id !== id);
    persist();
}

export function getGallery(publicOnly = true) {
    return publicOnly ? store.gallery.filter(g => g.publicVisible) : [...store.gallery];
}

export function addGalleryItem(item) {
    const entry = { _id: nextId(), ...item, publicVisible: item.publicVisible !== false, createdAt: new Date().toISOString() };
    store.gallery.push(entry);
    persist();
    return entry;
}

export function toggleGalleryVisibility(id) {
    const item = store.gallery.find(g => g._id === id);
    if (!item) return null;
    item.publicVisible = !item.publicVisible;
    persist();
    return item;
}

export function deleteGalleryItem(id) {
    store.gallery = store.gallery.filter(g => g._id !== id);
    persist();
}

export function getReports() {
    return [...store.reports];
}

export function addReport(report) {
    const entry = { _id: nextId(), ...report, createdAt: new Date().toISOString() };
    store.reports.push(entry);
    persist();
    return entry;
}

export function deleteReport(id) {
    store.reports = store.reports.filter(r => r._id !== id);
    persist();
}

export function getCertificates() {
    return [...store.certificates];
}

export function getCertificateByStudentId(studentId) {
    return store.certificates.filter(c => c.studentId === studentId);
}

export function addCertificate(cert) {
    const entry = { _id: nextId(), ...cert, createdAt: new Date().toISOString() };
    store.certificates.push(entry);
    persist();
    return entry;
}

export function deleteCertificate(id) {
    store.certificates = store.certificates.filter(c => c._id !== id);
    persist();
}

export function getSettings() {
    return { ...store.settings };
}

export function updateSettings(updates) {
    Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
    persist();
    return { ...store.settings };
}
