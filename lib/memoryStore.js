import bcryptjs from 'bcryptjs';

// In-memory data store — used as fallback when MongoDB is unavailable
const tempPassword = bcryptjs.hashSync('temppass2024', 10);

const store = {
    teams: [
        // 3 Admin accounts — first login requires password setup
        { teamId: 'DMP001', password: tempPassword, name: 'Faculty Coordinator', domain: 'Admin', role: 'admin', needsPasswordSetup: true, members: [] },
        { teamId: '25EC080', password: tempPassword, name: 'Student Coordinator 1', domain: 'Admin', role: 'admin', needsPasswordSetup: true, members: [] },
        { teamId: '25EC112', password: tempPassword, name: 'Student Coordinator 2', domain: 'Admin', role: 'admin', needsPasswordSetup: true, members: [] },
    ],
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

export function deleteProject(id) {
    store.projects = store.projects.filter(p => p._id !== id);
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

// Reports operations (admin file uploads for HOD)
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

// Certificate operations
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

// Settings operations
export function getSettings() {
    return { ...store.settings };
}

export function updateSettings(updates) {
    Object.assign(store.settings, updates, { updatedAt: new Date().toISOString() });
    return { ...store.settings };
}
