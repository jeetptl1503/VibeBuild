import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// ─── File-based persistence ───────────────────────────────────────
// Saves store data to a JSON file so it survives server restarts
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

    // Try loading from file first
    const saved = loadFromFile();
    if (saved) {
        globalThis.__vibebuild_store = saved;
        return saved;
    }

    // Fresh store with default admin accounts
    const tempPassword = bcryptjs.hashSync('temppass2024', 10);

    globalThis.__vibebuild_store = {
        users: [
            { userId: 'DMP001', password: tempPassword, name: 'Faculty Coordinator', role: 'admin', needsPasswordSetup: true },
            { userId: '25EC080', password: tempPassword, name: 'Student Coordinator 1', role: 'admin', needsPasswordSetup: true },
            { userId: '25EC112', password: tempPassword, name: 'Student Coordinator 2', role: 'admin', needsPasswordSetup: true },
        ],
        teams: [],
        projects: [],
        attendance: [],
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

// Helper: auto-save after mutations
function persist() {
    saveToFile();
}

export function getStore() {
    return store;
}

// ─── User operations ───────────────────────────────────────────────

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

// ─── Team operations (user-created teams) ──────────────────────────

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

// ─── Project operations ────────────────────────────────────────────

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
        Object.assign(store.projects[idx], data, { updatedAt: new Date().toISOString() });
        persist();
        return { project: store.projects[idx], updated: true };
    }
    const project = { _id: nextId(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    store.projects.push(project);
    persist();
    return { project, created: true };
}

export function deleteProject(id) {
    store.projects = store.projects.filter(p => p._id !== id);
    persist();
}

// ─── Attendance operations ─────────────────────────────────────────

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

// ─── Gallery operations ────────────────────────────────────────────

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

// ─── Reports operations ────────────────────────────────────────────

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

// ─── Certificate operations ────────────────────────────────────────

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

// ─── Settings operations ───────────────────────────────────────────

export function getSettings() {
    return { ...store.settings };
}

export function updateSettings(updates) {
    Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
    persist();
    return { ...store.settings };
}
