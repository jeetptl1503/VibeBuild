import bcryptjs from 'bcryptjs';

// In-memory data store — used as fallback when MongoDB is unavailable
const tempPassword = bcryptjs.hashSync('temppass2024', 10);

const store = {
    users: [
        // 3 Admin accounts — first login requires password setup
        { userId: 'DMP001', password: tempPassword, name: 'Faculty Coordinator', role: 'admin', needsPasswordSetup: true },
        { userId: '25EC080', password: tempPassword, name: 'Student Coordinator 1', role: 'admin', needsPasswordSetup: true },
        { userId: '25EC112', password: tempPassword, name: 'Student Coordinator 2', role: 'admin', needsPasswordSetup: true },
    ],
    teams: [],       // User-created teams: { _id, teamName, leaderId, leaderName, members: [{ name, userId }], domain, createdAt }
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

function nextId() {
    return 'mem_' + (store._nextId++);
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
    return user;
}

export function updateUser(userId, updates) {
    const user = store.users.find(u => u.userId === userId);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
}

export function deleteUser(userId) {
    store.users = store.users.filter(u => u.userId !== userId);
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
    return team;
}

export function updateTeamData(teamId, updates) {
    const team = store.teams.find(t => t._id === teamId);
    if (!team) return null;
    Object.assign(team, updates);
    return team;
}

export function deleteTeamData(teamId) {
    store.teams = store.teams.filter(t => t._id !== teamId);
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
        return { project: store.projects[idx], updated: true };
    }
    const project = { _id: nextId(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    store.projects.push(project);
    return { project, created: true };
}

export function deleteProject(id) {
    store.projects = store.projects.filter(p => p._id !== id);
}

// ─── Attendance operations ─────────────────────────────────────────

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

// ─── Gallery operations ────────────────────────────────────────────

export function getGallery(publicOnly = true) {
    return publicOnly ? store.gallery.filter(g => g.publicVisible) : [...store.gallery];
}

export function addGalleryItem(item) {
    const entry = { _id: nextId(), ...item, publicVisible: item.publicVisible !== false, createdAt: new Date().toISOString() };
    store.gallery.push(entry);
    return entry;
}

export function toggleGalleryVisibility(id) {
    const item = store.gallery.find(g => g._id === id);
    if (!item) return null;
    item.publicVisible = !item.publicVisible;
    return item;
}

export function deleteGalleryItem(id) {
    store.gallery = store.gallery.filter(g => g._id !== id);
}

// ─── Reports operations ────────────────────────────────────────────

export function getReports() {
    return [...store.reports];
}

export function addReport(report) {
    const entry = { _id: nextId(), ...report, createdAt: new Date().toISOString() };
    store.reports.push(entry);
    return entry;
}

export function deleteReport(id) {
    store.reports = store.reports.filter(r => r._id !== id);
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
    return entry;
}

export function deleteCertificate(id) {
    store.certificates = store.certificates.filter(c => c._id !== id);
}

// ─── Settings operations ───────────────────────────────────────────

export function getSettings() {
    return { ...store.settings };
}

export function updateSettings(updates) {
    Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
    return { ...store.settings };
}
