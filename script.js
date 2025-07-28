// Demo accounts for testing
const demoAccounts = {
    students: [
        { email: "leader@student.com", password: "123456", role: "leader", name: "Lê Tấn Nguyện" },
        { email: "member@student.com", password: "123456", role: "member", name: "Ngô Khải Luân" },
        { email: "member2@student.com", password: "123456", role: "member", name: "Phạm Lê Duy Bảo" }
    ],
    lecturers: [
        { email: "lecturer@teacher.com", password: "123456", name: "Dr. Robert Wilson" }
    ]
};

// Global variables
let currentUser = null;
let groups = [];
let tasks = [];
let evaluations = [];
let projects = [];
let memberRequests = [];
let selectedGroupId = null;
let invitedEmails = [];

// Initialize demo data
function initializeDemoData() {
    // Demo projects
    projects = [
        {
            id: 1,
            name: "Web E-commerce Project",
            description: "Build an online shopping website",
            lecturer: "Dr. Robert Wilson",
            status: "active",
            maxGroups: 5,
            deadline: "2024-05-30"
        }
    ];

    // Demo groups
    groups = [
        {
            id: 1,
            name: "Group 1 - Web Project",
            projectId: 1,
            topic: "User Interface Design",
            leader: "Lê Tấn Nguyện",
            members: ["Ngô Khải Luân", "Phạm Lê Duy Bảo"],
            createdBy: "lecturer@teacher.com",
            status: "active",
            completedTasks: 0,
            totalTasks: 10
        }
    ];

    // Demo tasks
    tasks = [
        {
            id: 1,
            title: "Design Interface",
            description: "Create mockup for homepage",
            groupId: 1,
            assignedTo: "Ngô Khải Luân",
            status: "in-progress",
            deadline: "2024-02-15",
            priority: "high",
            startTime: "2024-02-01",
            completedTime: null,
            extensionRequests: []
        },
        {
            id: 2,
            title: "Develop Backend",
            description: "Build API for the system",
            groupId: 1,
            assignedTo: "Phạm Lê Duy Bảo",
            status: "pending",
            deadline: "2024-02-20",
            priority: "medium",
            startTime: "2024-02-05",
            completedTime: null,
            extensionRequests: []
        }
    ];

    // Demo evaluations
    evaluations = [
        {
            id: 1,
            groupId: 1,
            evaluator: "Ngô Khải Luân",
            evaluated: "Phạm Lê Duy Bảo",
            score: 8,
            comment: "Works very actively",
            criteria: {
                teamwork: 8,
                responsibility: 9,
                quality: 7,
                punctuality: 8
            }
        }
    ];

    // Demo member requests
    memberRequests = [
        {
            id: 1,
            studentEmail: "member@student.com",
            studentName: "Trần Thị B",
            groupId: 1,
            status: "approved"
        }
    ];
}

// Login functions
function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(type + '-login').classList.add('active');
}

function loginStudent(event) {
    event.preventDefault();
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;

    const student = demoAccounts.students.find(s => 
        s.email === email && s.password === password 
    );

    if (student) {
        currentUser = { ...student, type: 'student' };
        showDashboard();
        // Only members check group invitations
        if (student.role === 'member') {
            checkInvitedGroups();
        }
    } else {
        alert('Login information is incorrect!');
    }
}

function loginLecturer(event) {
    event.preventDefault();
    const email = document.getElementById('lecturer-email').value;
    const password = document.getElementById('lecturer-password').value;

    const lecturer = demoAccounts.lecturers.find(l => 
        l.email === email && l.password === password
    );

    if (lecturer) {
        currentUser = { ...lecturer, type: 'lecturer' };
        showDashboard();
        checkInvitedGroups();
    } else {
        alert('Login information is incorrect!');
    }
}

// Dashboard functions
function showDashboard() {
    initializeDemoData();
    
    let dashboardHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-tasks"></i> Task Manager Dashboard</h1>
                <div class="user-info">
                    <span>Hello, ${currentUser.name}</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="dashboard-content">
    `;

    if (currentUser.type === 'student') {
        if (currentUser.role === 'leader') {
            dashboardHTML += createLeaderDashboard();
        } else {
            dashboardHTML += createMemberDashboard();
        }
    } else {
        dashboardHTML += createLecturerDashboard();
    }

    dashboardHTML += `
            </div>
        </div>
    `;

    document.querySelector('.container').innerHTML = dashboardHTML;
}

function createLeaderDashboard() {
    const myGroups = groups.filter(g => g.leader === currentUser.name);
    if (myGroups.length > 0 && (!selectedGroupId || !myGroups.some(g => g.id === selectedGroupId))) {
        selectedGroupId = myGroups[0].id;
    }
    let dashboard = `
        <div class="section">
            <label><b>Select Group:</b></label>
            <select id="groupSwitcher" onchange="switchGroup()">
                ${myGroups.map(g => `<option value="${g.id}" ${g.id === selectedGroupId ? 'selected' : ''}>${g.name}</option>`).join('')}
            </select>
            <button class="btn" onclick="showCreateGroupModal()">Create New Group</button>
        </div>
    `;
    if (myGroups.length > 0) {
        const myGroup = myGroups.find(g => g.id === selectedGroupId);
        if (myGroup) {
            const groupTasks = tasks.filter(t => t.groupId === myGroup.id);
            const completedTasks = groupTasks.filter(t => t.status === 'completed').length;
            dashboard += `
                <div class="section">
                    <div class="card">
                        <h3>Group: ${myGroup.name}</h3>
                        <p><strong>Topic:</strong> ${myGroup.topic}</p>
                        <p><strong>Progress:</strong> ${completedTasks}/${myGroup.totalTasks} tasks completed</p>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${(completedTasks/myGroup.totalTasks)*100}%"></div>
                        </div>
                        <button class="btn btn-info" onclick="showAddMemberModal(${myGroup.id})">Add Member</button>
                        <button class="btn btn-danger" onclick="showLeaveGroupModal(${myGroup.id})">Leave Group</button>
                        <button class="btn btn-warning" onclick="deleteGroup(${myGroup.id})">Delete Group</button>
                        ${completedTasks >= myGroup.totalTasks ? 
                            '<button class="btn btn-success" onclick="showFinalEvaluation()">View Final Evaluation</button>' : 
                            `<button class="btn" onclick="showCreateTaskModalForGroup(${myGroup.id})">Create New Task</button>`
                        }
                    </div>
                </div>
                <div class="section">
                    <h2>Group Members</h2>
                    <ul style="margin-left:16px;">
                        <li><b>${myGroup.leader} (Group Leader)</b></li>
                        ${myGroup.members.map(m => `
                            <li>${m} <button class='btn btn-danger' style='margin-left:8px;padding:2px 8px;' onclick="removeMemberFromGroup(${myGroup.id}, '${m}')">Remove</button></li>
                        `).join('')}
                    </ul>
                </div>
                <div class="section">
                    <h2>Task List for Group ${myGroup.name}</h2>
                    ${renderTasksForGroup(myGroup.id)}
                </div>
                <div class="section">
                    <h2>Group Statistics ${myGroup.name}</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${groupTasks.length}</div>
                            <div class="stat-label">Total Tasks</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${completedTasks}</div>
                            <div class="stat-label">Completed Tasks</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${groupTasks.length > 0 ? Math.round((completedTasks/groupTasks.length)*100) : 0}%</div>
                            <div class="stat-label">% Completed</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    if (typeof renderMemberRequests === 'function') {
        dashboard += `<div class="section"><h2>Group Join Requests</h2>${renderMemberRequests()}</div>`;
    }
    
    // Thêm phần đánh giá thành viên
    if (myGroups.length > 0) {
        const myGroup = myGroups.find(g => g.id === selectedGroupId);
        if (myGroup) {
            dashboard += `
                <div class="section">
                    <h2>Member Evaluation Board</h2>
                    <button class="btn btn-primary" onclick="showMemberEvaluationModal(${myGroup.id})">Create Member Evaluation</button>
                    <button class="btn btn-info" onclick="viewMemberEvaluation(${myGroup.id})">View Evaluation</button>
                    <div id="memberEvaluationDisplay"></div>
                </div>
            `;
        }
    }
    
    return dashboard;
}

function createMemberDashboard() {
    // Get all groups that the member participates in
    const myGroups = groups.filter(g => g.members.includes(currentUser.name));
    if (myGroups.length > 0 && (!selectedGroupId || !myGroups.some(g => g.id === selectedGroupId))) {
        selectedGroupId = myGroups[0].id;
    }
    let dashboard = `
        <div class="section">
            <label><b>Select Group:</b></label>
            <select id="groupSwitcher" onchange="switchGroup()">
                ${myGroups.map(g => `<option value="${g.id}" ${g.id === selectedGroupId ? 'selected' : ''}>${g.name}</option>`).join('')}
            </select>
            <button class="btn" onclick="showInviteNotificationsModal()">Notifications</button>
            <button class="btn" onclick="showJoinGroupModal()">Request to Join Group</button>
        </div>
    `;
    if (myGroups.length > 0) {
        const myGroup = myGroups.find(g => g.id === selectedGroupId);
        if (myGroup) {
            dashboard += `
                <div class="card">
                    <h3>Current Group: ${myGroup.name}</h3>
                    <p><strong>Topic:</strong> ${myGroup.topic}</p>
                    <p><strong>Group Leader:</strong> ${myGroup.leader}</p>
                    <button class="btn btn-danger" onclick="showLeaveGroupModal(${myGroup.id})">Leave Group</button>
                    <button class="btn btn-primary" onclick="showCreateTaskModalForGroup(${myGroup.id})">Create New Task</button>
                </div>
                <div class="section">
                    <h2>My Tasks in This Group</h2>
                    ${renderMyTasksForGroup(myGroup.id)}
                </div>
                <div class="section">
                    <h2>All Tasks in Group</h2>
                    ${renderTasksForGroup(myGroup.id)}
                </div>
                <div class="section">
                    <h2>Member Evaluation</h2>
                    <button class="btn btn-primary" onclick="showMemberEvaluationModal(${myGroup.id})">Create Member Evaluation</button>
                    <button class="btn btn-info" onclick="viewMemberEvaluation(${myGroup.id})">View My Evaluation</button>
                    <div id="memberEvaluationDisplay"></div>
                </div>
            `;
        }
    } else {
        dashboard += `<div class="section"><p>You haven't joined any group yet.</p></div>`;
    }
    return dashboard;
}

function createLecturerDashboard() {
    return `
        <div class="ai-section">
            <h2><i class="fas fa-robot"></i> AI System</h2>
            <div class="ai-features">
                <div class="ai-feature">
                    <i class="fas fa-clock"></i>
                    <h3>Auto Deadline</h3>
                    <p>Automatically create deadlines for assignments</p>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-users"></i>
                    <h3>Member Evaluation</h3>
                    <p>Automatic member evaluation</p>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-chart-bar"></i>
                    <h3>Statistics</h3>
                    <p>Overall statistics</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Project Management</h2>
            <button class="btn" onclick="showCreateProjectModal()">Create New Project</button>
            <button class="btn" onclick="showCreateGroupModal()">Create Group</button>
            <button class="btn" onclick="showOverallEvaluationModal()">Overall Evaluation</button>
        </div>

        <div class="section">
            <h2>Project List</h2>
            ${renderProjects()}
        </div>

        <div class="section">
            <h2>Group List</h2>
            ${renderGroups()}
        </div>

        <div class="section">
            <h2>Group Join Requests</h2>
            ${renderMemberRequests()}
        </div>

        <div class="section">
            <h2>Overall Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${projects.length}</div>
                    <div class="stat-label">Total Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${groups.length}</div>
                    <div class="stat-label">Total Groups</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${tasks.length}</div>
                    <div class="stat-label">Total Assignments</div>
                </div>
            </div>
        </div>
    `;
}

// Render functions
function renderProjects() {
    if (projects.length === 0) {
        return '<p>No projects yet.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${projects.map(project => `
                    <tr>
                        <td>${project.name}</td>
                        <td>${project.description}</td>
                        <td>${project.deadline}</td>
                        <td><span class="status ${project.status}">${project.status}</span></td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewProject(${project.id})">View</button>
                            <button class="btn btn-warning" onclick="editProject(${project.id})">Edit</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderGroups() {
    if (groups.length === 0) {
        return '<p>No groups yet.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Group Name</th>
                    <th>Topic</th>
                    <th>Leader</th>
                    <th>Members</th>
                    <th>Progress</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${groups.map(group => {
                    const groupTasks = tasks.filter(t => t.groupId === group.id);
                    const completedTasks = groupTasks.filter(t => t.status === 'completed').length;
                    const isCurrentUserInGroup = group.leader === currentUser.name || group.members.includes(currentUser.name);
                    
                    return `
                        <tr>
                            <td>${group.name}</td>
                            <td>${group.topic}</td>
                            <td>${group.leader}</td>
                            <td>${group.members.join(', ')}</td>
                            <td>${completedTasks}/${group.totalTasks}</td>
                            <td>
                                <button class="btn btn-secondary" onclick="viewGroup(${group.id})">View</button>
                                ${isCurrentUserInGroup ? `<button class="btn btn-danger" onclick="showLeaveGroupModal(${group.id})">Leave Group</button>` : ''}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderMemberRequests() {
    if (!window.memberRequests) window.memberRequests = [];
    const myGroups = groups.filter(g => g.leader === currentUser.name);
    const myGroupIds = myGroups.map(g => g.id);
    const requests = window.memberRequests.filter(r => myGroupIds.includes(r.groupId) && r.status === 'pending');
    if (requests.length === 0) return '<p>No group join requests.</p>';
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Group</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${requests.map(r => {
                    const group = groups.find(g => g.id === r.groupId);
                    return `
                        <tr>
                            <td>${r.studentName}</td>
                            <td>${group ? group.name : ''}</td>
                            <td>
                                <button class="btn btn-success" onclick="approveMemberRequest(${r.id})">Approve</button>
                                <button class="btn btn-danger" onclick="rejectMemberRequest(${r.id})">Reject</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderTasks() {
    if (tasks.length === 0) {
        return '<p>No tasks yet.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => {
                    const filesInfo = task.attachedFiles && task.attachedFiles.length > 0 ? 
                        `<div style="font-size: 11px; color: #666; margin-top: 4px;">
                            📎 ${task.attachedFiles.length} attached files
                        </div>` : '';
                    
                    return `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}${filesInfo}</td>
                            <td>${task.assignedTo}</td>
                            <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                            <td>${task.deadline}</td>
                                                <td>
                        <button class="btn btn-secondary" onclick="viewTask(${task.id})">View</button>
                        <button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Edit</button>
                        <button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>
                    </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderMyTasks() {
    const myTasks = tasks.filter(task => task.assignedTo === currentUser.name);
    
    if (myTasks.length === 0) {
        return '<p>Bạn chưa có task nào.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Deadline</th>
                    <th>Thời gian làm</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${myTasks.map(task => {
                    const workTime = task.completedTime ? 
                        Math.round((new Date(task.completedTime) - new Date(task.startTime)) / (1000 * 60 * 60 * 24)) : 
                        Math.round((new Date() - new Date(task.startTime)) / (1000 * 60 * 60 * 24));
                    
                    const filesInfo = task.attachedFiles && task.attachedFiles.length > 0 ? 
                        `<div style="font-size: 11px; color: #666; margin-top: 4px;">
                            📎 ${task.attachedFiles.length} file đính kèm
                        </div>` : '';
                    
                    return `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}${filesInfo}</td>
                            <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                            <td>${task.deadline}</td>
                            <td>${workTime} days</td>
                            <td>
                                <button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>
                                <button class="btn btn-warning" onclick="requestExtension(${task.id})">Extend</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'overdue': 'Overdue',
        'active': 'Active',
        'inactive': 'Inactive'
    };
    return statusMap[status] || status;
}

function logout() {
    currentUser = null;
    location.reload();
}

// AI System functions
function generateAutoDeadline(taskType, priority) {
    const baseDays = {
        'high': 3,
        'medium': 7,
        'low': 14
    };
    
    const today = new Date();
    const deadline = new Date(today.getTime() + (baseDays[priority] * 24 * 60 * 60 * 1000));
    return deadline.toISOString().split('T')[0];
}

function generateMemberEvaluation(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const allMembers = [group.leader, ...group.members];
    const evaluations = [];
    
    allMembers.forEach(evaluator => {
        allMembers.forEach(evaluated => {
            if (evaluator !== evaluated) {
                evaluations.push({
                    id: evaluations.length + 1,
                    groupId: groupId,
                    evaluator: evaluator,
                    evaluated: evaluated,
                    score: Math.floor(Math.random() * 3) + 7, // Random score 7-9
                    comment: "Automatic evaluation from AI",
                    criteria: {
                        teamwork: Math.floor(Math.random() * 3) + 7,
                        responsibility: Math.floor(Math.random() * 3) + 7,
                        quality: Math.floor(Math.random() * 3) + 7,
                        punctuality: Math.floor(Math.random() * 3) + 7
                    }
                });
            }
        });
    });
    
    return evaluations;
}

// Modal functions
function showCreateProjectModal() {
    const modalHTML = `
        <div id="createProjectModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('createProjectModal')">&times;</span>
                <h2>Create New Project</h2>
                <form onsubmit="createProject(event)">
                    <div class="form-group">
                        <label>Project Name <span style="color: red;">*</span></label>
                        <input type="text" id="projectName" required>
                    </div>
                    <div class="form-group">
                        <label>Description <span style="color: red;">*</span></label>
                        <textarea id="projectDescription" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Deadline <span style="color: red;">*</span></label>
                            <input type="date" id="projectDeadline" required>
                        </div>
                        <div class="form-group">
                            <label>Maximum Groups <span style="color: red;">*</span></label>
                            <input type="number" id="maxGroups" min="1" max="10" value="5" required>
                        </div>
                    </div>
                    <button type="submit" class="btn">Create Project</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('createProjectModal').style.display = 'block';
}

function showCreateGroupModal() {
    const modalHTML = `
        <div id="createGroupModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('createGroupModal')">&times;</span>
                <h2>Create New Group</h2>
                <form onsubmit="createGroup(event)">
                    ${currentUser.type === 'lecturer' ? `
                        <div class="form-group">
                            <label>Dự án <span style="color: red;">*</span></label>
                            <select id="groupProject" required>
                                <option value="">Chọn dự án</option>
                                ${projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Group Name <span style="color: red;">*</span></label>
                        <input type="text" id="groupName" required>
                    </div>
                    <div class="form-group">
                        <label>Topic Name <span style="color: red;">*</span></label>
                        <input type="text" id="groupTopic" required>
                    </div>
                    ${currentUser.type === 'lecturer' ? `
                        <div class="form-group">
                            <label>Trưởng nhóm <span style="color: red;">*</span></label>
                            <select id="groupLeader" required>
                                <option value="">Chọn trưởng nhóm</option>
                                <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                                <option value="Trần Thị B">Trần Thị B</option>
                                <option value="Lê Văn C">Lê Văn C</option>
                            </select>
                        </div>
                    ` : `
                        <div class="form-group">
                            <label>Group Leader Name</label>
                            <input type="text" id="groupLeader" value="${currentUser.name}" readonly>
                        </div>
                    `}
                    <div class="form-group">
                        <label>Members</label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="text" id="groupMembers" placeholder="Member names, separated by commas" style="flex: 1;">
                            <button type="button" class="btn" id="inviteMemberBtn" onclick="inviteMember()">Invite</button>
                        </div>
                    </div>
                    <button type="submit" class="btn">Create Group</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('createGroupModal').style.display = 'block';
}

function showCreateTaskModal() {
    const modalHTML = `
        <div id="createTaskModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('createTaskModal')">&times;</span>
                <h2>Create New Task</h2>
                <form onsubmit="createTask(event)">
                    <div class="form-group">
                        <label>Task Title <span style="color: red;">*</span></label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Description <span style="color: red;">*</span></label>
                        <textarea id="taskDescription" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Assigned To <span style="color: red;">*</span></label>
                            <select id="taskAssignee" required>
                                <option value="">Select assignee</option>
                                <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                                <option value="Trần Thị B">Trần Thị B</option>
                                <option value="Lê Văn C">Lê Văn C</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Độ ưu tiên <span style="color: red;">*</span></label>
                            <select id="taskPriority" required onchange="updateAutoDeadline()">
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Deadline (AI tự động) <span style="color: red;">*</span></label>
                            <input type="date" id="taskDeadline" required>
                        </div>
                        <div class="form-group">
                            <label>Allow deadline editing</label>
                            <input type="checkbox" id="allowDeadlineEdit" checked>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>File đính kèm</label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="file" id="taskFiles" multiple style="flex: 1;" onchange="handleFileSelection()">
                            <button type="button" class="btn" onclick="document.getElementById('taskFiles').click()">Add File</button>
                        </div>
                        <div id="selectedFilesList" style="margin-top: 8px; font-size: 12px; color: #666;"></div>
                    </div>
                    <button type="submit" class="btn">Tạo task</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('createTaskModal').style.display = 'block';
    
    // Auto-set deadline
    updateAutoDeadline();
}

function showJoinGroupModal() {
    const availableGroups = groups.filter(g => g.members.length < 4 && g.leader !== currentUser.name && !g.members.includes(currentUser.name));
    // Lấy danh sách trưởng nhóm duy nhất
    const leaders = [...new Set(availableGroups.map(g => g.leader))];
    const modalHTML = `
        <div id="joinGroupModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('joinGroupModal')">&times;</span>
                <h2>Send Group Join Request</h2>
                <form onsubmit="joinGroup(event)">
                    <div class="form-group">
                        <label>Select Group Leader</label>
                        <select id="leaderFilter" onchange="filterGroupsByLeader()">
                            <option value="">All</option>
                            ${leaders.map(leader => `<option value="${leader}">${leader}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Select Group <span style="color: red;">*</span></label>
                        <select id="selectedGroup" required>
                            <option value="">Select group to join</option>
                            ${availableGroups.map(group => `
                                <option value="${group.id}" data-leader="${group.leader}">${group.name} - ${group.topic} (${group.members.length}/4 members)</option>
                            `).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn">Send Request</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('joinGroupModal').style.display = 'block';
}

// Hàm lọc nhóm theo trưởng nhóm
function filterGroupsByLeader() {
    const leader = document.getElementById('leaderFilter').value;
    const groupSelect = document.getElementById('selectedGroup');
    // Ẩn/hiện option theo leader
    for (let option of groupSelect.options) {
        if (!option.value) continue; // bỏ qua option mặc định
        if (!leader || option.getAttribute('data-leader') === leader) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
    // Reset lại chọn nhóm nếu nhóm đang chọn không thuộc leader đã chọn
    if (groupSelect.selectedIndex > 0 && leader && groupSelect.options[groupSelect.selectedIndex].getAttribute('data-leader') !== leader) {
        groupSelect.selectedIndex = 0;
    }
}

function showFinalEvaluation() {
    const myGroup = groups.find(g => g.leader === currentUser.name);
    if (!myGroup) return;
    
    const autoEvaluations = generateMemberEvaluation(myGroup.id);
    const evaluationHTML = `
        <div id="finalEvaluationModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('finalEvaluationModal')">&times;</span>
                <h2>Final Evaluation - ${myGroup.name}</h2>
                
                <div class="section">
                    <h3>Member Evaluation Board</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Evaluator</th>
                                <th>Person Evaluated</th>
                                <th>Total Score</th>
                                <th>Teamwork</th>
                                <th>Responsibility</th>
                                <th>Quality</th>
                                <th>Punctuality</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${autoEvaluations.map(eval => `
                                <tr>
                                    <td>${eval.evaluator}</td>
                                    <td>${eval.evaluated}</td>
                                    <td>${eval.score}/10</td>
                                    <td>${eval.criteria.teamwork}/10</td>
                                    <td>${eval.criteria.responsibility}/10</td>
                                    <td>${eval.criteria.quality}/10</td>
                                    <td>${eval.criteria.punctuality}/10</td>
                                    <td>${eval.comment}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h3>Work Time Statistics</h3>
                    ${generateWorkTimeStatistics(myGroup.id)}
                </div>
                
                <div class="section">
                    <h3>Task Completion Report</h3>
                    ${generateTaskCompletionReport(myGroup.id)}
                </div>
                
                <button class="btn" onclick="closeModal('finalEvaluationModal')">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', evaluationHTML);
    document.getElementById('finalEvaluationModal').style.display = 'block';
}

function generateWorkTimeStatistics(groupId) {
    const groupTasks = tasks.filter(t => t.groupId === groupId);
    const memberStats = {};
    
    groupTasks.forEach(task => {
        if (!memberStats[task.assignedTo]) {
            memberStats[task.assignedTo] = { totalTime: 0, taskCount: 0 };
        }
        
        const workTime = task.completedTime ? 
            Math.round((new Date(task.completedTime) - new Date(task.startTime)) / (1000 * 60 * 60 * 24)) : 
            Math.round((new Date() - new Date(task.startTime)) / (1000 * 60 * 60 * 24));
        
        memberStats[task.assignedTo].totalTime += workTime;
        memberStats[task.assignedTo].taskCount += 1;
    });
    
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Task Count</th>
                    <th>Total Time (days)</th>
                    <th>Average Time/Task</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(memberStats).map(([member, stats]) => `
                    <tr>
                        <td>${member}</td>
                        <td>${stats.taskCount}</td>
                        <td>${stats.totalTime}</td>
                        <td>${(stats.totalTime / stats.taskCount).toFixed(1)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateTaskCompletionReport(groupId) {
    const groupTasks = tasks.filter(t => t.groupId === groupId);
    const memberCompletion = {};
    
    groupTasks.forEach(task => {
        if (!memberCompletion[task.assignedTo]) {
            memberCompletion[task.assignedTo] = { onTime: 0, late: 0, total: 0 };
        }
        
        memberCompletion[task.assignedTo].total += 1;
        
        if (task.status === 'completed') {
            const completedDate = new Date(task.completedTime || task.deadline);
            const deadlineDate = new Date(task.deadline);
            
            if (completedDate <= deadlineDate) {
                memberCompletion[task.assignedTo].onTime += 1;
            } else {
                memberCompletion[task.assignedTo].late += 1;
            }
        }
    });
    
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Total Tasks</th>
                    <th>Completed On Time</th>
                    <th>Completed Late</th>
                    <th>On-Time Rate</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(memberCompletion).map(([member, stats]) => `
                    <tr>
                        <td>${member}</td>
                        <td>${stats.total}</td>
                        <td>${stats.onTime}</td>
                        <td>${stats.late}</td>
                        <td>${((stats.onTime / stats.total) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById(modalId).remove();
}

// Action functions
function createProject(event) {
    event.preventDefault();
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;
    const maxGroups = parseInt(document.getElementById('maxGroups').value);

    const newProject = {
        id: projects.length + 1,
        name,
        description,
        lecturer: currentUser.name,
        status: 'active',
        maxGroups,
        deadline
    };

    projects.push(newProject);
    closeModal('createProjectModal');
    showDashboard();
    alert('Tạo dự án thành công!');
}

function createGroup(event) {
    event.preventDefault();
    const name = document.getElementById('groupName').value;
    const topic = document.getElementById('groupTopic').value;
    const leader = currentUser.name;
    const members = []; // Khi tạo nhóm, chỉ có leader là thành viên, không thêm member nào
    const invited = []; // Không mời ai khi tạo nhóm

    const newGroup = {
        id: groups.length + 1,
        name,
        topic,
        leader,
        members,
        invited,
        createdBy: currentUser.email,
        completedTasks: 0,
        totalTasks: 10
    };

    groups.push(newGroup);
    selectedGroupId = newGroup.id;
    invitedEmails = [];
    closeModal('createGroupModal');
    showDashboard();
    
    // Hiển thị bảng thông tin nhóm đã tạo
    showGroupInfoTable(newGroup);
}

function createTask(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const assignedTo = document.getElementById('taskAssignee').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;
    const allowEdit = document.getElementById('allowDeadlineEdit').checked;
    
    // Lấy danh sách file đã chọn
    const fileInput = document.getElementById('taskFiles');
    const selectedFiles = Array.from(fileInput.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
    }));

    const myGroup = groups.find(g => g.leader === currentUser.name);
    
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        groupId: myGroup.id,
        assignedTo,
        status: 'pending',
        deadline,
        priority,
        startTime: new Date().toISOString().split('T')[0],
        completedTime: null,
        extensionRequests: [],
        allowDeadlineEdit: allowEdit,
        attachedFiles: selectedFiles
    };

    tasks.push(newTask);
    selectedGroupId = myGroup.id;
    closeModal('createTaskModal');
    showDashboard();
    alert('Tạo task thành công!');
}

// Hàm xử lý khi chọn file
function handleFileSelection() {
    const fileInput = document.getElementById('taskFiles');
    const filesList = document.getElementById('selectedFilesList');
    
    if (fileInput.files.length > 0) {
        const filesArray = Array.from(fileInput.files);
        const filesHTML = filesArray.map(file => {
            const sizeInKB = (file.size / 1024).toFixed(2);
            return `<div style="margin: 4px 0; padding: 4px; background: #f5f5f5; border-radius: 4px;">
                📎 ${file.name} (${sizeInKB} KB)
            </div>`;
        }).join('');
        filesList.innerHTML = filesHTML;
    } else {
        filesList.innerHTML = '';
    }
}

// Hàm hiển thị modal tạo đánh giá thành viên
function showMemberEvaluationModal(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const allMembers = [group.leader, ...group.members];
    const isLeader = currentUser.name === group.leader;
    
    // Leader và member đều không thể đánh giá chính mình
    const evaluatableMembers = allMembers.filter(member => member !== currentUser.name);
    
    const modalHTML = `
        <div id="memberEvaluationModal" class="modal">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close" onclick="closeModal('memberEvaluationModal')">&times;</span>
                <h2>Create Member Evaluation - Group: ${group.name}</h2>
                <form onsubmit="createMemberEvaluation(event, ${groupId})">
                    <input type="hidden" id="evaluator" value="${currentUser.name}">
                    <div class="form-group">
                        <label>Person to Evaluate <span style="color: red;">*</span></label>
                        <select id="evaluated" required>
                            <option value="">Select person to evaluate</option>
                            ${evaluatableMembers.map(member => `<option value="${member}">${member}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Teamwork (1-10) <span style="color: red;">*</span></label>
                            <input type="number" id="teamwork" min="1" max="10" required>
                        </div>
                        <div class="form-group">
                            <label>Responsibility (1-10) <span style="color: red;">*</span></label>
                            <input type="number" id="responsibility" min="1" max="10" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Work Quality (1-10) <span style="color: red;">*</span></label>
                            <input type="number" id="quality" min="1" max="10" required>
                        </div>
                        <div class="form-group">
                            <label>Punctuality (1-10) <span style="color: red;">*</span></label>
                            <input type="number" id="punctuality" min="1" max="10" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Comments</label>
                        <textarea id="comment" rows="3" placeholder="Enter comments about the member..."></textarea>
                    </div>
                    <button type="submit" class="btn">Create Evaluation</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('memberEvaluationModal').style.display = 'block';
}

// Hàm tạo đánh giá thành viên
function createMemberEvaluation(event, groupId) {
    event.preventDefault();
    
    const evaluator = document.getElementById('evaluator').value;
    const evaluated = document.getElementById('evaluated').value;
    const teamwork = parseInt(document.getElementById('teamwork').value);
    const responsibility = parseInt(document.getElementById('responsibility').value);
    const quality = parseInt(document.getElementById('quality').value);
    const punctuality = parseInt(document.getElementById('punctuality').value);
    const comment = document.getElementById('comment').value;
    
    // Kiểm tra không đánh giá chính mình
    if (evaluator === evaluated) {
        alert('Không thể đánh giá chính mình!');
        return;
    }
    
    // Tính điểm trung bình
    const averageScore = Math.round((teamwork + responsibility + quality + punctuality) / 4);
    
    const evaluation = {
        id: Date.now(),
        groupId: groupId,
        evaluator: evaluator,
        evaluated: evaluated,
        score: averageScore,
        comment: comment || 'No comments',
        criteria: {
            teamwork: teamwork,
            responsibility: responsibility,
            quality: quality,
            punctuality: punctuality
        },
        createdAt: new Date().toISOString()
    };
    
    // Lưu đánh giá vào localStorage hoặc biến global
    if (!window.memberEvaluations) window.memberEvaluations = [];
    window.memberEvaluations.push(evaluation);
    
    closeModal('memberEvaluationModal');
    showDashboard();
    alert('Evaluation created successfully!');
}

// Hàm xem đánh giá thành viên
function viewMemberEvaluation(groupId) {
    if (!window.memberEvaluations) window.memberEvaluations = [];
    const groupEvaluations = window.memberEvaluations.filter(e => e.groupId === groupId);
    const group = groups.find(g => g.id === groupId);
    const isLeader = currentUser.name === group.leader;
    
    if (groupEvaluations.length === 0) {
        alert('No evaluations for this group yet!');
        return;
    }
    
    // Lọc đánh giá theo quyền
    let filteredEvaluations = groupEvaluations;
    let modalTitle = `Member Evaluation Board - Group: ${group.name}`;
    
    if (!isLeader) {
        // Member chỉ xem được đánh giá của chính mình
        filteredEvaluations = groupEvaluations.filter(eval => eval.evaluated === currentUser.name);
        modalTitle = `My Evaluation - Group: ${group.name}`;
        
        if (filteredEvaluations.length === 0) {
            alert('No evaluations for you yet!');
            return;
        }
    }
    
    const modalHTML = `
        <div id="viewEvaluationModal" class="modal">
            <div class="modal-content" style="max-width: 900px;">
                <span class="close" onclick="closeModal('viewEvaluationModal')">&times;</span>
                <h2>${modalTitle}</h2>
                <div style="max-height: 500px; overflow-y: auto;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Người đánh giá</th>
                                <th>Người được đánh giá</th>
                                <th>Làm việc nhóm</th>
                                <th>Trách nhiệm</th>
                                <th>Chất lượng</th>
                                <th>Đúng hạn</th>
                                <th>Điểm TB</th>
                                <th>Nhận xét</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredEvaluations.map(eval => `
                                <tr>
                                    <td>${eval.evaluator}</td>
                                    <td>${eval.evaluated}</td>
                                    <td>${eval.criteria.teamwork}/10</td>
                                    <td>${eval.criteria.responsibility}/10</td>
                                    <td>${eval.criteria.quality}/10</td>
                                    <td>${eval.criteria.punctuality}/10</td>
                                    <td><strong>${eval.score}/10</strong></td>
                                    <td>${eval.comment}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${isLeader ? `
                    <div style="margin-top: 20px;">
                        <h3>Thống kê đánh giá</h3>
                        ${generateEvaluationStats(groupEvaluations)}
                    </div>
                ` : ''}
                <button class="btn" onclick="closeModal('viewEvaluationModal')">Đóng</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('viewEvaluationModal').style.display = 'block';
}

// Hàm tạo thống kê đánh giá
function generateEvaluationStats(evaluations) {
    const memberStats = {};
    
    // Tính điểm trung bình cho từng thành viên
    evaluations.forEach(eval => {
        if (!memberStats[eval.evaluated]) {
            memberStats[eval.evaluated] = {
                totalScore: 0,
                count: 0,
                criteria: { teamwork: 0, responsibility: 0, quality: 0, punctuality: 0 }
            };
        }
        memberStats[eval.evaluated].totalScore += eval.score;
        memberStats[eval.evaluated].count += 1;
        memberStats[eval.evaluated].criteria.teamwork += eval.criteria.teamwork;
        memberStats[eval.evaluated].criteria.responsibility += eval.criteria.responsibility;
        memberStats[eval.evaluated].criteria.quality += eval.criteria.quality;
        memberStats[eval.evaluated].criteria.punctuality += eval.criteria.punctuality;
    });
    
    let statsHTML = '<div class="stats-grid">';
    Object.keys(memberStats).forEach(member => {
        const stats = memberStats[member];
        const avgScore = Math.round(stats.totalScore / stats.count);
        const avgTeamwork = Math.round(stats.criteria.teamwork / stats.count);
        const avgResponsibility = Math.round(stats.criteria.responsibility / stats.count);
        const avgQuality = Math.round(stats.criteria.quality / stats.count);
        const avgPunctuality = Math.round(stats.criteria.punctuality / stats.count);
        
        statsHTML += `
            <div class="stat-card">
                <h4>${member}</h4>
                <div class="stat-number">${avgScore}/10</div>
                <div class="stat-label">Điểm trung bình</div>
                <div style="font-size: 12px; margin-top: 8px;">
                    <div>Làm việc nhóm: ${avgTeamwork}/10</div>
                    <div>Trách nhiệm: ${avgResponsibility}/10</div>
                    <div>Chất lượng: ${avgQuality}/10</div>
                    <div>Đúng hạn: ${avgPunctuality}/10</div>
                </div>
            </div>
        `;
    });
    statsHTML += '</div>';
    
    return statsHTML;
}

// Hàm xem chi tiết task
function viewTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        alert('Không tìm thấy task!');
        return;
    }
    
    const group = groups.find(g => g.id === task.groupId);
    const startDate = task.startTime || 'Chưa bắt đầu';
    const endDate = task.completedTime || 'Not completed';
    const statusText = getStatusText(task.status);
    
    // Tính thời gian làm việc
    let workTime = 'Chưa tính được';
    if (task.startTime && task.completedTime) {
        const start = new Date(task.startTime);
        const end = new Date(task.completedTime);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        workTime = `${diffDays} days`;
    } else if (task.startTime) {
        const start = new Date(task.startTime);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        workTime = `${diffDays} days (in progress)`;
    }
    
    // Hiển thị file đính kèm
    const filesInfo = task.attachedFiles && task.attachedFiles.length > 0 ? 
        `<div style="margin-top: 10px;">
            <h4>File đính kèm (${task.attachedFiles.length} file):</h4>
            <ul style="margin-left: 20px;">
                ${task.attachedFiles.map(file => `
                    <li>📎 ${file.name} (${(file.size / 1024).toFixed(2)} KB)</li>
                `).join('')}
            </ul>
        </div>` : '<p><em>Không có file đính kèm</em></p>';
    
    const modalHTML = `
        <div id="viewTaskModal" class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <span class="close" onclick="closeModal('viewTaskModal')">&times;</span>
                <h2>Chi tiết Task: ${task.title}</h2>
                
                <div class="task-detail-section">
                    <h3>Thông tin cơ bản</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label><strong>Tiêu đề:</strong></label>
                            <span>${task.title}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Mô tả:</strong></label>
                            <span>${task.description}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Người thực hiện:</strong></label>
                            <span>${task.assignedTo}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Trạng thái:</strong></label>
                            <span class="status ${task.status}">${statusText}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Độ ưu tiên:</strong></label>
                            <span>${task.priority || 'Không xác định'}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Deadline:</strong></label>
                            <span>${task.deadline}</span>
                        </div>
                    </div>
                </div>
                
                <div class="task-detail-section">
                    <h3>Thời gian thực hiện</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label><strong>Thời gian bắt đầu:</strong></label>
                            <span>${startDate}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Thời gian kết thúc:</strong></label>
                            <span>${endDate}</span>
                        </div>
                        <div class="detail-item">
                            <label><strong>Thời gian làm việc:</strong></label>
                            <span>${workTime}</span>
                        </div>
                    </div>
                </div>
                
                <div class="task-detail-section">
                    <h3>File đính kèm</h3>
                    ${filesInfo}
                </div>
                
                ${task.extensionRequests && task.extensionRequests.length > 0 ? `
                    <div class="task-detail-section">
                        <h3>Extension Request</h3>
                        <ul style="margin-left: 20px;">
                            ${task.extensionRequests.map(req => `
                                <li>${req.reason} - ${req.requestedDate}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div style="margin-top: 20px; text-align: center;">
                                            <button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Edit Task</button>
                        ${task.status !== 'completed' ? `<button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>` : ''}
                    <button class="btn" onclick="closeModal('viewTaskModal')">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('viewTaskModal').style.display = 'block';
}

function joinGroup(event) {
    event.preventDefault();
    const groupId = parseInt(document.getElementById('selectedGroup').value);
    if (!window.memberRequests) window.memberRequests = [];
    const newRequest = {
        id: window.memberRequests.length + 1,
        studentName: currentUser.name,
        groupId: groupId,
        status: 'pending'
    };
    window.memberRequests.push(newRequest);
    closeModal('joinGroupModal');
    showDashboard();
    alert('Đã gửi yêu cầu tham gia nhóm!');
}

function approveMemberRequest(requestId) {
    const request = window.memberRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        const group = groups.find(g => g.id === request.groupId);
        if (group && !group.members.includes(request.studentName)) {
            group.members.push(request.studentName);
        }
        showDashboard();
        alert('Đã chấp nhận yêu cầu tham gia nhóm!');
    }
}

function rejectMemberRequest(requestId) {
    const request = window.memberRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        showDashboard();
        alert('Đã từ chối yêu cầu tham gia nhóm!');
    }
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        task.completedTime = new Date().toISOString().split('T')[0];
        const group = groups.find(g => g.id === task.groupId);
        if (group) {
            group.completedTasks = tasks.filter(t => t.groupId === group.id && t.status === 'completed').length;
        }
        showDashboard();
        alert('Task completed successfully!');
    }
}

function updateAutoDeadline() {
    const priority = document.getElementById('taskPriority').value;
    const deadline = generateAutoDeadline('task', priority);
    document.getElementById('taskDeadline').value = deadline;
}

function requestExtension(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const extensionDays = prompt('Enter number of days to extend (maximum 7 days):', '3');
        const days = parseInt(extensionDays);
        
        if (days && days > 0 && days <= 7) {
            const currentDeadline = new Date(task.deadline);
            const newDeadline = new Date(currentDeadline.getTime() + (days * 24 * 60 * 60 * 1000));
            
            task.extensionRequests.push({
                requestedBy: currentUser.name,
                requestedDays: days,
                status: 'pending',
                requestDate: new Date().toISOString().split('T')[0]
            });
            
            alert(`Extension request sent for ${days} days!`);
        } else {
            alert('Invalid extension days!');
        }
    }
}

function showEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const group = groups.find(g => g.id === task.groupId);
    const isLeader = currentUser.name === group.leader;
    const isAssignedMember = task.assignedTo === currentUser.name;
    
    // Kiểm tra quyền chỉnh sửa
    const canEdit = isLeader || isAssignedMember;
    
    const modalHTML = `
        <div id="editTaskModal" class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <span class="close" onclick="closeModal('editTaskModal')">&times;</span>
                <h2>Edit Task</h2>
                <form onsubmit="editTask(event, ${taskId})">
                    <div class="form-group">
                        <label>Tiêu đề task <span style="color: red;">*</span></label>
                        <input type="text" id="editTaskTitle" value="${task.title}" required ${!canEdit ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="editTaskDescription" rows="4" style="width:100%" ${!canEdit ? 'readonly' : ''}>${task.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Người thực hiện</label>
                        <select id="editTaskAssignee" ${!canEdit ? 'disabled' : ''}>
                            <option value="${task.assignedTo}">${task.assignedTo}</option>
                            ${isLeader ? `
                                <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                                <option value="Trần Thị B">Trần Thị B</option>
                                <option value="Lê Văn C">Lê Văn C</option>
                            ` : ''}
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Trạng thái <span style="color: red;">*</span></label>
                            <select id="editTaskStatus" required ${!canEdit ? 'disabled' : ''}>
                                <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="overdue" ${task.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Độ ưu tiên</label>
                            <select id="editTaskPriority" ${!canEdit ? 'disabled' : ''}>
                                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Thấp</option>
                                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Trung bình</option>
                                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Cao</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Thời gian bắt đầu</label>
                            <input type="date" id="editTaskStartTime" value="${formatDateForInput(task.startTime)}" ${!canEdit ? 'readonly' : ''}>
                        </div>
                        <div class="form-group">
                            <label>Thời gian kết thúc</label>
                            <input type="date" id="editTaskCompletedTime" value="${formatDateForInput(task.completedTime)}" ${!canEdit ? 'readonly' : ''}>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Deadline <span style="color: red;">*</span></label>
                        <input type="date" id="editTaskDeadline" value="${formatDateForInput(task.deadline)}" required ${!canEdit ? 'readonly' : ''}>
                    </div>
                    ${canEdit ? `
                        <button type="submit" class="btn">Lưu thay đổi</button>
                    ` : `
                        <div style="text-align: center; color: #666; font-style: italic; margin-top: 20px;">
                            You do not have permission to edit this task
                        </div>
                    `}
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('editTaskModal').style.display = 'block';
}

// Hàm format lại ngày cho input type date
function formatDateForInput(dateStr) {
    // Hỗ trợ cả yyyy-mm-dd và mm/dd/yyyy
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr;
    const [mm, dd, yyyy] = dateStr.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function editTask(event, taskId) {
    event.preventDefault();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const group = groups.find(g => g.id === task.groupId);
    const isLeader = currentUser.name === group.leader;
    const isAssignedMember = task.assignedTo === currentUser.name;
    
    // Kiểm tra quyền chỉnh sửa
    if (!isLeader && !isAssignedMember) {
        alert('You do not have permission to edit this task!');
        return;
    }
    
    // Lấy giá trị từ form
    const newTitle = document.getElementById('editTaskTitle').value;
    const newDescription = document.getElementById('editTaskDescription').value;
    const newAssignee = document.getElementById('editTaskAssignee').value;
    const newStatus = document.getElementById('editTaskStatus').value;
    const newPriority = document.getElementById('editTaskPriority').value;
    const newStartTime = document.getElementById('editTaskStartTime').value;
    const newCompletedTime = document.getElementById('editTaskCompletedTime').value;
    const newDeadline = document.getElementById('editTaskDeadline').value;
    
    // Cập nhật task
    task.title = newTitle;
    task.description = newDescription;
    task.assignedTo = newAssignee;
    task.status = newStatus;
    task.priority = newPriority;
    task.startTime = newStartTime || task.startTime;
    task.deadline = newDeadline;
    
    // Xử lý thời gian kết thúc
    if (newCompletedTime) {
        task.completedTime = newCompletedTime;
        if (newStatus === 'completed' && !task.completedTime) {
            task.completedTime = new Date().toISOString().split('T')[0];
        }
    } else if (newStatus === 'completed' && !task.completedTime) {
        task.completedTime = new Date().toISOString().split('T')[0];
    } else if (newStatus !== 'completed') {
        task.completedTime = null;
    }
    
    // Cập nhật thống kê nhóm nếu cần
    if (group) {
        group.completedTasks = tasks.filter(t => t.groupId === group.id && t.status === 'completed').length;
    }
    
    closeModal('editTaskModal');
    showDashboard();
    alert('Đã cập nhật task thành công!');
}

function showCreateTaskModalForGroup(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const isMember = currentUser.role === 'member';
    const modalHTML = `
        <div id="createTaskModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('createTaskModal')">&times;</span>
                <h2>Tạo task mới cho nhóm: ${group.name}</h2>
                <form onsubmit="createTaskForGroup(event, ${groupId})">
                    <div class="form-group">
                        <label>Tiêu đề task <span style="color: red;">*</span></label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả <span style="color: red;">*</span></label>
                        <textarea id="taskDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Người thực hiện</label>
                        ${isMember ? `<input type='text' id='taskAssignee' value='${currentUser.name}' readonly>` : `
                        <select id="taskAssignee" required>
                            <option value="">Chọn người thực hiện</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                            <option value="Trần Thị B">Trần Thị B</option>
                            <option value="Lê Văn C">Lê Văn C</option>
                        </select>`}
                    </div>
                    <div class="form-group">
                        <label>Deadline <span style="color: red;">*</span></label>
                        <input type="date" id="taskDeadline" required>
                    </div>
                    <div class="form-group">
                        <label>File đính kèm</label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="file" id="taskFiles" multiple style="flex: 1;" onchange="handleFileSelection()">
                            <button type="button" class="btn" onclick="document.getElementById('taskFiles').click()">Add File</button>
                        </div>
                        <div id="selectedFilesList" style="margin-top: 8px; font-size: 12px; color: #666;"></div>
                    </div>
                    <button type="submit" class="btn">Tạo task</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('createTaskModal').style.display = 'block';
}

function createTaskForGroup(event, groupId) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    let assignedTo;
    if (currentUser.role === 'member') {
        assignedTo = currentUser.name;
    } else {
        assignedTo = document.getElementById('taskAssignee').value;
    }
    const deadline = document.getElementById('taskDeadline').value;
    
    // Lấy danh sách file đã chọn
    const fileInput = document.getElementById('taskFiles');
    const selectedFiles = Array.from(fileInput.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
    }));
    
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        groupId,
        assignedTo,
        status: 'pending',
        deadline,
        startTime: new Date().toISOString().split('T')[0],
        attachedFiles: selectedFiles
    };
    tasks.push(newTask);
    selectedGroupId = groupId;
    closeModal('createTaskModal');
    showDashboard();
    alert('Tạo task thành công!');
}

function renderTasksForGroup(groupId) {
    const groupTasks = tasks.filter(task => task.groupId === groupId);
    const group = groups.find(g => g.id === groupId);
    const isLeader = currentUser.name === group.leader;
    
    if (groupTasks.length === 0) {
        return '<p>Chưa có task nào.</p>';
    }
    return `
        <table class="table">
                                <thead>
                        <tr>
                            <th>Task</th>
                            <th>Description</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
            <tbody>
                ${groupTasks.map(task => {
                    const filesInfo = task.attachedFiles && task.attachedFiles.length > 0 ? 
                        `<div style="font-size: 11px; color: #666; margin-top: 4px;">
                            📎 ${task.attachedFiles.length} file đính kèm
                        </div>` : '';
                    
                    const isAssignedMember = task.assignedTo === currentUser.name;
                    const canEdit = isLeader || isAssignedMember;
                    
                    return `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}${filesInfo}</td>
                            <td>${task.assignedTo}</td>
                            <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                            <td>${task.deadline}</td>
                            <td>
                                                    <button class="btn btn-secondary" onclick="viewTask(${task.id})">View</button>
                    ${canEdit ? `<button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Edit</button>` : ''}
                    ${task.status !== 'completed' ? `<button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>` : ''}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function showAddMemberModal(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const modalHTML = `
        <div id="addMemberModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('addMemberModal')">&times;</span>
                <h2>Add Member to Group: ${group.name}</h2>
                <form onsubmit="addMemberToGroup(event, ${groupId})">
                    <div class="form-group">
                        <label>Member Name <span style="color: red;">*</span></label>
                        <input type="text" id="newMemberName" required placeholder="Enter member name">
                    </div>
                    <button type="submit" class="btn">Add Member</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('addMemberModal').style.display = 'block';
}

function addMemberToGroup(event, groupId) {
    event.preventDefault();
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const newMember = document.getElementById('newMemberName').value.trim();
    if (newMember && !group.members.includes(newMember)) {
        group.members.push(newMember);
        closeModal('addMemberModal');
        showDashboard();
        alert('Member added to group!');
    } else {
        alert('Invalid member name or already exists in group!');
    }
}

function deleteGroup(groupId) {
    if (confirm('Are you sure you want to delete this group?')) {
        const idx = groups.findIndex(g => g.id === groupId);
        if (idx !== -1) {
            groups.splice(idx, 1);
            // Xóa luôn các task thuộc nhóm này
            for (let i = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].groupId === groupId) tasks.splice(i, 1);
            }
            showDashboard();
            alert('Group deleted successfully!');
        }
    }
}

function switchGroup() {
    selectedGroupId = parseInt(document.getElementById('groupSwitcher').value);
    showDashboard();
}

function renderMyTasksForGroup(groupId) {
    const myTasks = tasks.filter(task => task.assignedTo === currentUser.name && task.groupId === groupId);
    let addBtn = `<button class="btn btn-primary" style="margin-bottom:10px" onclick="showCreateTaskModalForGroup(${groupId})">+ Add Subtask</button>`;
    if (myTasks.length === 0) {
        return addBtn + '<p>Bạn chưa có task nào trong nhóm này.</p>';
    }
    return `
        ${addBtn}
        <table class="table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Deadline</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${myTasks.map(task => {
                    const filesInfo = task.attachedFiles && task.attachedFiles.length > 0 ? 
                        `<div style="font-size: 11px; color: #666; margin-top: 4px;">
                            📎 ${task.attachedFiles.length} file đính kèm
                        </div>` : '';
                    
                    return `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}${filesInfo}</td>
                            <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                            <td>${task.deadline}</td>
                            <td style="display:flex;gap:4px;flex-wrap:wrap;">
                                                        <button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>
                        <button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Edit</button>
                                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Thêm hàm xóa task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx !== -1) {
            tasks.splice(idx, 1);
            showDashboard();
            alert('Task deleted!');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Task Manager loaded successfully!');
    console.log('Demo accounts:');
    console.log('Students:');
    demoAccounts.students.forEach(s => {
        console.log(`- ${s.role}: ${s.email} / ${s.password}`);
    });
    console.log('Lecturers:');
    demoAccounts.lecturers.forEach(l => {
        console.log(`- ${l.email} / ${l.password}`);
    });
});

function inviteMember() {
    // Hiện modal nhập email
    const modalHTML = `
        <div id="inviteModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('inviteModal')">&times;</span>
                <h2>Invite Member to Group</h2>
                <form onsubmit="addInvitedEmail(event)">
                    <div class="form-group">
                        <label>Member Email</label>
                        <input type="email" id="inviteEmail" placeholder="Enter member email" required>
                    </div>
                    <button type="submit" class="btn">Add Email</button>
                </form>
                <div id="invitedEmailList" style="margin-top:16px;"></div>
                <button class="btn" onclick="closeModal('inviteModal')">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('inviteModal').style.display = 'block';
    renderInvitedEmailList();
}

function addInvitedEmail(event) {
    event.preventDefault();
    const email = document.getElementById('inviteEmail').value.trim();
    if (email && !invitedEmails.includes(email)) {
        invitedEmails.push(email);
        renderInvitedEmailList();
        document.getElementById('inviteEmail').value = '';
        alert('Member invited successfully!');
        // Không gọi checkInvitedGroups ở đây, không hiện modal nào cho leader
    }
}

function renderInvitedEmailList() {
    const listDiv = document.getElementById('invitedEmailList');
    if (!listDiv) return;
    if (invitedEmails.length === 0) {
        listDiv.innerHTML = '<i>Chưa có email nào được mời.</i>';
    } else {
        listDiv.innerHTML = '<b>Đã mời:</b><ul style="margin:8px 0 0 16px;">' +
            invitedEmails.map(email => `<li>${email} <button onclick=\"removeInvitedEmail('${email}')\" style=\"margin-left:8px;color:red;\">X</button></li>`).join('') +
            '</ul>';
    }
}

function removeInvitedEmail(email) {
    invitedEmails = invitedEmails.filter(e => e !== email);
    renderInvitedEmailList();
}

function checkInvitedGroups() {
    if (!currentUser || !currentUser.email) return;
    const invitedGroups = groups.filter(g => g.invited && g.invited.includes(currentUser.email));
    if (invitedGroups.length > 0) {
        invitedGroups.forEach(g => {
            // Nếu đã từ chối lời mời vào group này thì bỏ qua
            if (localStorage.getItem(`declined_invite_${g.id}_${currentUser.email}`) === 'yes') return;
            // Hiện modal join group
            const modalId = `joinInvitedGroupModal_${g.id}`;
            if (document.getElementById(modalId)) return;
            const modalHTML = `
                <div id="${modalId}" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal('${modalId}')">&times;</span>
                        <h2>Bạn được mời vào nhóm: ${g.name}</h2>
                        <p>Chủ đề: <b>${g.topic}</b></p>
                        <button class="btn" onclick="acceptInviteToGroup(${g.id}, '${currentUser.email}', '${modalId}')">Tham gia nhóm</button>
                        <button class="btn" onclick="declineInviteToGroup(${g.id}, '${currentUser.email}', '${modalId}')">Từ chối</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.getElementById(modalId).style.display = 'block';
        });
    }
}

function acceptInviteToGroup(groupId, email, modalId) {
    const group = groups.find(g => g.id === groupId);
    if (group) {
        // Thêm tên vào members nếu chưa có
        if (!group.members.includes(currentUser.name)) {
            group.members.push(currentUser.name);
        }
        // Xóa email khỏi danh sách mời
        group.invited = group.invited.filter(e => e !== email);
        closeModal(modalId);
        showDashboard();
        alert('Bạn đã tham gia nhóm thành công!');
    }
}

function declineInviteToGroup(groupId, email, modalId) {
    localStorage.setItem(`declined_invite_${groupId}_${email}`, 'yes');
    closeModal(modalId);
    alert('Bạn đã từ chối lời mời vào nhóm này.');
}

// Thêm hàm xóa thành viên khỏi nhóm
function removeMemberFromGroup(groupId, memberName) {
    const group = groups.find(g => g.id === groupId);
    if (group) {
        group.members = group.members.filter(m => m !== memberName);
        showDashboard();
        alert(`Member ${memberName} removed from group!`);
    }
}

// Hàm hiển thị bảng thông tin nhóm sau khi tạo
function showGroupInfoTable(group) {
    const modalHTML = `
        <div id="groupInfoModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('groupInfoModal')">&times;</span>
                <h2><i class="fas fa-check-circle"></i> Group Created Successfully!</h2>
                <div class="group-info-table">
                    <h3>Created Group Information:</h3>
                    <table class="info-table">
                        <tr>
                            <th>Thông tin</th>
                            <th>Chi tiết</th>
                        </tr>
                        <tr>
                            <td><strong>Tên nhóm:</strong></td>
                            <td>${group.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Chủ đề:</strong></td>
                            <td>${group.topic}</td>
                        </tr>
                        <tr>
                            <td><strong>Trưởng nhóm:</strong></td>
                            <td>${group.leader}</td>
                        </tr>
                        <tr>
                            <td><strong>Thành viên:</strong></td>
                            <td>${group.members.length > 0 ? group.members.join(', ') : 'Chưa có thành viên'}</td>
                        </tr>
                        <tr>
                            <td><strong>Email đã mời:</strong></td>
                            <td>${group.invited.length > 0 ? group.invited.join(', ') : 'Không có'}</td>
                        </tr>
                        <tr>
                            <td><strong>ID nhóm:</strong></td>
                            <td>${group.id}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày tạo:</strong></td>
                            <td>${new Date().toLocaleDateString('vi-VN')}</td>
                        </tr>
                    </table>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeModal('groupInfoModal')">Đóng</button>
                    <button class="btn btn-secondary" onclick="printGroupInfo()">In thông tin</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('groupInfoModal').style.display = 'block';
}

// Hàm in thông tin nhóm
function printGroupInfo() {
    const printWindow = window.open('', '_blank');
    const group = groups[groups.length - 1]; // Lấy nhóm vừa tạo
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Thông tin nhóm - ${group.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                h1 { color: #333; text-align: center; }
                .header { text-align: center; margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Thông tin nhóm</h1>
                <p>Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <table>
                <tr>
                    <th>Thông tin</th>
                    <th>Chi tiết</th>
                </tr>
                <tr>
                    <td><strong>Tên nhóm:</strong></td>
                    <td>${group.name}</td>
                </tr>
                <tr>
                    <td><strong>Chủ đề:</strong></td>
                    <td>${group.topic}</td>
                </tr>
                <tr>
                    <td><strong>Trưởng nhóm:</strong></td>
                    <td>${group.leader}</td>
                </tr>
                <tr>
                    <td><strong>Thành viên:</strong></td>
                    <td>${group.members.length > 0 ? group.members.join(', ') : 'Chưa có thành viên'}</td>
                </tr>
                <tr>
                    <td><strong>Email đã mời:</strong></td>
                    <td>${group.invited.length > 0 ? group.invited.join(', ') : 'Không có'}</td>
                </tr>
                <tr>
                    <td><strong>ID nhóm:</strong></td>
                    <td>${group.id}</td>
                </tr>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Hàm hiển thị modal rời nhóm
function showLeaveGroupModal(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const isLeader = group.leader === currentUser.name;
    const isMember = group.members.includes(currentUser.name);
    
    if (!isLeader && !isMember) {
        alert('You are not a member of this group!');
        return;
    }
    
    let modalHTML = `
        <div id="leaveGroupModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('leaveGroupModal')">&times;</span>
                <h2><i class="fas fa-sign-out-alt"></i> Rời nhóm</h2>
                <div class="leave-group-info">
                    <h3>Thông tin nhóm:</h3>
                    <p><strong>Group Name:</strong> ${group.name}</p>
                    <p><strong>Chủ đề:</strong> ${group.topic}</p>
                    <p><strong>Your Role:</strong> ${isLeader ? 'Group Leader' : 'Member'}</p>
                </div>
    `;
    
    if (isLeader) {
        // Nếu là leader, hiển thị tùy chọn trao quyền
        const otherMembers = group.members.filter(m => m !== currentUser.name);
        if (otherMembers.length > 0) {
            modalHTML += `
                <div class="transfer-leadership">
                    <h3>Trao quyền trưởng nhóm:</h3>
                    <p>Do you want to transfer leadership to another member?</p>
                    <div class="form-group">
                        <label>Select new member:</label>
                        <select id="newLeaderSelect">
                            ${otherMembers.map(member => `<option value="${member}">${member}</option>`).join('')}
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-warning" onclick="leaveGroupAsLeader(${groupId})">Trao quyền và rời nhóm</button>
                        <button class="btn btn-secondary" onclick="closeModal('leaveGroupModal')">Hủy</button>
                    </div>
                </div>
            `;
        } else {
            modalHTML += `
                <div class="no-members">
                    <p><strong>Note:</strong> You are the only member in the group. If you leave, the group will be deleted.</p>
                    <div class="modal-actions">
                        <button class="btn btn-danger" onclick="deleteGroup(${groupId})">Xóa nhóm</button>
                        <button class="btn btn-secondary" onclick="closeModal('leaveGroupModal')">Hủy</button>
                    </div>
                </div>
            `;
        }
    } else {
        // Nếu là member thường
        modalHTML += `
            <div class="leave-confirmation">
                <p>Bạn có chắc chắn muốn rời khỏi nhóm này?</p>
                <div class="modal-actions">
                    <button class="btn btn-danger" onclick="leaveGroupAsMember(${groupId})">Rời nhóm</button>
                    <button class="btn btn-secondary" onclick="closeModal('leaveGroupModal')">Hủy</button>
                </div>
            </div>
        `;
    }
    
    modalHTML += `
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('leaveGroupModal').style.display = 'block';
}

// Hàm rời nhóm khi là leader và trao quyền
function leaveGroupAsLeader(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const newLeader = document.getElementById('newLeaderSelect').value;
    if (!newLeader) {
        alert('Please select a new member!');
        return;
    }
    
    // Trao quyền cho thành viên mới
    group.leader = newLeader;
    group.members = group.members.filter(m => m !== newLeader);
    
    // Xóa leader cũ khỏi members
    group.members = group.members.filter(m => m !== currentUser.name);
    
    closeModal('leaveGroupModal');
    showDashboard();
    alert(`Đã trao quyền trưởng nhóm cho ${newLeader} và rời khỏi nhóm thành công!`);
}



// Hàm rời nhóm khi là member thường
function leaveGroupAsMember(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Xóa member khỏi nhóm
    group.members = group.members.filter(m => m !== currentUser.name);
    
    closeModal('leaveGroupModal');
    showDashboard();
    alert('Đã rời khỏi nhóm thành công!');
} 

function showInviteNotificationsModal() {
    // Lấy các nhóm đã mời user
    const invitedGroups = groups.filter(g => g.invited && g.invited.includes(currentUser.email));
    let modalHTML = `
        <div id="inviteNotificationsModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('inviteNotificationsModal')">&times;</span>
                <h2>Group Invitation Notifications</h2>
                <div>
    `;
    if (invitedGroups.length === 0) {
        modalHTML += `<p>You don't have any invitations yet.</p>`;
    } else {
        modalHTML += `
            <ul style="list-style:none;padding:0;">
                ${invitedGroups.map(g => `
                    <li style="margin-bottom:16px;padding:12px;border:1px solid #eee;border-radius:8px;">
                        <b>${g.name}</b> - <i>${g.topic}</i><br/>
                        <button class='btn btn-success' style='margin-right:8px' onclick="acceptInviteToGroup(${g.id}, '${currentUser.email}', 'inviteNotificationsModal')">Đồng ý</button>
                        <button class='btn btn-danger' onclick="declineInviteToGroup(${g.id}, '${currentUser.email}', 'inviteNotificationsModal')">Không đồng ý</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }
    modalHTML += `
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('inviteNotificationsModal').style.display = 'block';
} 