// Demo accounts for testing
const demoAccounts = {
    students: [
        { email: "leader@student.com", password: "123456", role: "leader", name: "Nguyễn Văn A" },
        { email: "member@student.com", password: "123456", role: "member", name: "Trần Thị B" },
        { email: "member2@student.com", password: "123456", role: "member", name: "Lê Văn C" }
    ],
    lecturers: [
        { email: "lecturer@teacher.com", password: "123456", name: "Dr. Phạm Văn D" }
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
            name: "Dự án Web E-commerce",
            description: "Xây dựng website bán hàng trực tuyến",
            lecturer: "Dr. Phạm Văn D",
            status: "active",
            maxGroups: 5,
            deadline: "2024-05-30"
        }
    ];

    // Demo groups
    groups = [
        {
            id: 1,
            name: "Nhóm 1 - Dự án Web",
            projectId: 1,
            topic: "Thiết kế giao diện người dùng",
            leader: "Nguyễn Văn A",
            members: ["Trần Thị B", "Lê Văn C"],
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
            title: "Thiết kế giao diện",
            description: "Tạo mockup cho trang chủ",
            groupId: 1,
            assignedTo: "Trần Thị B",
            status: "in-progress",
            deadline: "2024-02-15",
            priority: "high",
            startTime: "2024-02-01",
            completedTime: null,
            extensionRequests: []
        },
        {
            id: 2,
            title: "Phát triển backend",
            description: "Xây dựng API cho hệ thống",
            groupId: 1,
            assignedTo: "Lê Văn C",
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
            evaluator: "Trần Thị B",
            evaluated: "Lê Văn C",
            score: 8,
            comment: "Làm việc rất tích cực",
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
    const role = document.getElementById('student-role').value;

    const student = demoAccounts.students.find(s => 
        s.email === email && s.password === password && s.role === role
    );

    if (student) {
        currentUser = { ...student, type: 'student' };
        showDashboard();
        checkInvitedGroups();
    } else {
        alert('Thông tin đăng nhập không chính xác!');
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
        alert('Thông tin đăng nhập không chính xác!');
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
                    <span>Xin chào, ${currentUser.name}</span>
                    <button class="logout-btn" onclick="logout()">Đăng xuất</button>
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
            <label><b>Chọn nhóm:</b></label>
            <select id="groupSwitcher" onchange="switchGroup()">
                ${myGroups.map(g => `<option value="${g.id}" ${g.id === selectedGroupId ? 'selected' : ''}>${g.name}</option>`).join('')}
            </select>
            <button class="btn" onclick="showCreateGroupModal()">Tạo nhóm mới</button>
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
                        <h3>Nhóm: ${myGroup.name}</h3>
                        <p><strong>Đề tài:</strong> ${myGroup.topic}</p>
                        <p><strong>Tiến độ:</strong> ${completedTasks}/${myGroup.totalTasks} task hoàn thành</p>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${(completedTasks/myGroup.totalTasks)*100}%"></div>
                        </div>
                        <button class="btn btn-info" onclick="showAddMemberModal(${myGroup.id})">Thêm thành viên</button>
                        <button class="btn btn-danger" onclick="showLeaveGroupModal(${myGroup.id})">Rời nhóm</button>
                        <button class="btn btn-warning" onclick="deleteGroup(${myGroup.id})">Xóa nhóm</button>
                        ${completedTasks >= myGroup.totalTasks ? 
                            '<button class="btn btn-success" onclick="showFinalEvaluation()">Xem đánh giá cuối kỳ</button>' : 
                            `<button class="btn" onclick="showCreateTaskModalForGroup(${myGroup.id})">Tạo task mới</button>`
                        }
                    </div>
                </div>
                <div class="section">
                    <h2>Thành viên nhóm</h2>
                    <ul style="margin-left:16px;">
                        <li><b>${myGroup.leader} (Trưởng nhóm)</b></li>
                        ${myGroup.members.map(m => `
                            <li>${m} <button class='btn btn-danger' style='margin-left:8px;padding:2px 8px;' onclick="removeMemberFromGroup(${myGroup.id}, '${m}')">Xóa</button></li>
                        `).join('')}
                    </ul>
                </div>
                <div class="section">
                    <h2>Danh sách task của nhóm ${myGroup.name}</h2>
                    ${renderTasksForGroup(myGroup.id)}
                </div>
                <div class="section">
                    <h2>Thống kê nhóm ${myGroup.name}</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${groupTasks.length}</div>
                            <div class="stat-label">Tổng số task</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${completedTasks}</div>
                            <div class="stat-label">Task hoàn thành</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${myGroup.members.length + 1}</div>
                            <div class="stat-label">Thành viên</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    if (typeof renderMemberRequests === 'function') {
        dashboard += `<div class="section"><h2>Yêu cầu tham gia nhóm</h2>${renderMemberRequests()}</div>`;
    }
    return dashboard;
}

function createMemberDashboard() {
    // Lấy tất cả nhóm mà member tham gia
    const myGroups = groups.filter(g => g.members.includes(currentUser.name));
    if (myGroups.length > 0 && (!selectedGroupId || !myGroups.some(g => g.id === selectedGroupId))) {
        selectedGroupId = myGroups[0].id;
    }
    let dashboard = `
        <div class="section">
            <label><b>Chọn nhóm:</b></label>
            <select id="groupSwitcher" onchange="switchGroup()">
                ${myGroups.map(g => `<option value="${g.id}" ${g.id === selectedGroupId ? 'selected' : ''}>${g.name}</option>`).join('')}
            </select>
            <button class="btn" onclick="showJoinGroupModal()">Gửi yêu cầu tham gia nhóm</button>
        </div>
    `;
    if (myGroups.length > 0) {
        const myGroup = myGroups.find(g => g.id === selectedGroupId);
        if (myGroup) {
            dashboard += `
                <div class="card">
                    <h3>Nhóm hiện tại: ${myGroup.name}</h3>
                    <p><strong>Đề tài:</strong> ${myGroup.topic}</p>
                    <p><strong>Trưởng nhóm:</strong> ${myGroup.leader}</p>
                    <button class="btn btn-danger" onclick="showLeaveGroupModal(${myGroup.id})">Rời nhóm</button>
                </div>
                <div class="section">
                    <h2>Task của tôi trong nhóm này</h2>
                    ${renderMyTasksForGroup(myGroup.id)}
                </div>
            `;
        }
    } else {
        dashboard += `<div class="section"><p>Bạn chưa tham gia nhóm nào.</p></div>`;
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
                    <p>Tự động tạo deadline cho bài tập</p>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-users"></i>
                    <h3>Member Evaluation</h3>
                    <p>Đánh giá tự động thành viên</p>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-chart-bar"></i>
                    <h3>Statistics</h3>
                    <p>Thống kê tổng thể</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Quản lý dự án</h2>
            <button class="btn" onclick="showCreateProjectModal()">Tạo dự án mới</button>
            <button class="btn" onclick="showCreateGroupModal()">Tạo nhóm</button>
            <button class="btn" onclick="showOverallEvaluationModal()">Đánh giá tổng thể</button>
        </div>

        <div class="section">
            <h2>Danh sách dự án</h2>
            ${renderProjects()}
        </div>

        <div class="section">
            <h2>Danh sách nhóm</h2>
            ${renderGroups()}
        </div>

        <div class="section">
            <h2>Yêu cầu tham gia nhóm</h2>
            ${renderMemberRequests()}
        </div>

        <div class="section">
            <h2>Thống kê tổng thể</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${projects.length}</div>
                    <div class="stat-label">Tổng số dự án</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${groups.length}</div>
                    <div class="stat-label">Tổng số nhóm</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${tasks.length}</div>
                    <div class="stat-label">Tổng số bài tập</div>
                </div>
            </div>
        </div>
    `;
}

// Render functions
function renderProjects() {
    if (projects.length === 0) {
        return '<p>Chưa có dự án nào.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Tên dự án</th>
                    <th>Mô tả</th>
                    <th>Deadline</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
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
                            <button class="btn btn-secondary" onclick="viewProject(${project.id})">Xem</button>
                            <button class="btn btn-warning" onclick="editProject(${project.id})">Sửa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderGroups() {
    if (groups.length === 0) {
        return '<p>Chưa có nhóm nào.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Tên nhóm</th>
                    <th>Đề tài</th>
                    <th>Leader</th>
                    <th>Thành viên</th>
                    <th>Tiến độ</th>
                    <th>Hành động</th>
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
                                <button class="btn btn-secondary" onclick="viewGroup(${group.id})">Xem</button>
                                ${isCurrentUserInGroup ? `<button class="btn btn-danger" onclick="showLeaveGroupModal(${group.id})">Rời nhóm</button>` : ''}
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
    if (requests.length === 0) return '<p>Không có yêu cầu tham gia nhóm nào.</p>';
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Thành viên</th>
                    <th>Nhóm</th>
                    <th>Hành động</th>
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
                                <button class="btn btn-success" onclick="approveMemberRequest(${r.id})">Chấp nhận</button>
                                <button class="btn btn-danger" onclick="rejectMemberRequest(${r.id})">Từ chối</button>
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
        return '<p>Chưa có task nào.</p>';
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Mô tả</th>
                    <th>Người thực hiện</th>
                    <th>Trạng thái</th>
                    <th>Deadline</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => `
                    <tr>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${task.assignedTo}</td>
                        <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                        <td>${task.deadline}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewTask(${task.id})">Xem</button>
                            <button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Sửa</button>
                            <button class="btn btn-success" onclick="completeTask(${task.id})">Hoàn thành</button>
                        </td>
                    </tr>
                `).join('')}
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
                    return `
                        <tr>
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                            <td>${task.deadline}</td>
                            <td>${workTime} ngày</td>
                            <td>
                                <button class="btn btn-success" onclick="completeTask(${task.id})">Hoàn thành</button>
                                <button class="btn btn-warning" onclick="requestExtension(${task.id})">Gia hạn</button>
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
        'pending': 'Chờ thực hiện',
        'in-progress': 'Đang thực hiện',
        'completed': 'Hoàn thành',
        'overdue': 'Quá hạn',
        'active': 'Hoạt động',
        'inactive': 'Không hoạt động'
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
                    comment: "Đánh giá tự động từ AI",
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
                <h2>Tạo dự án mới</h2>
                <form onsubmit="createProject(event)">
                    <div class="form-group">
                        <label>Tên dự án</label>
                        <input type="text" id="projectName" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="projectDescription" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Deadline</label>
                            <input type="date" id="projectDeadline" required>
                        </div>
                        <div class="form-group">
                            <label>Số nhóm tối đa</label>
                            <input type="number" id="maxGroups" min="1" max="10" value="5" required>
                        </div>
                    </div>
                    <button type="submit" class="btn">Tạo dự án</button>
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
                <h2>Tạo nhóm mới</h2>
                <form onsubmit="createGroup(event)">
                    ${currentUser.type === 'lecturer' ? `
                        <div class="form-group">
                            <label>Dự án</label>
                            <select id="groupProject" required>
                                <option value="">Chọn dự án</option>
                                ${projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Tên nhóm</label>
                        <input type="text" id="groupName" required>
                    </div>
                    <div class="form-group">
                        <label>Tên đề tài</label>
                        <input type="text" id="groupTopic" required>
                    </div>
                    ${currentUser.type === 'lecturer' ? `
                        <div class="form-group">
                            <label>Trưởng nhóm</label>
                            <select id="groupLeader" required>
                                <option value="">Chọn trưởng nhóm</option>
                                <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                                <option value="Trần Thị B">Trần Thị B</option>
                                <option value="Lê Văn C">Lê Văn C</option>
                            </select>
                        </div>
                    ` : `
                        <div class="form-group">
                            <label>Tên trưởng nhóm</label>
                            <input type="text" id="groupLeader" value="${currentUser.name}" readonly>
                        </div>
                    `}
                    <div class="form-group">
                        <label>Thành viên</label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="text" id="groupMembers" placeholder="Tên thành viên, phân cách bằng dấu phẩy" style="flex: 1;">
                            <button type="button" class="btn" id="inviteMemberBtn" onclick="inviteMember()">Invite</button>
                        </div>
                    </div>
                    <button type="submit" class="btn">Tạo nhóm</button>
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
                <h2>Tạo task mới</h2>
                <form onsubmit="createTask(event)">
                    <div class="form-group">
                        <label>Tiêu đề task</label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="taskDescription" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Người thực hiện</label>
                            <select id="taskAssignee" required>
                                <option value="">Chọn người thực hiện</option>
                                <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                                <option value="Trần Thị B">Trần Thị B</option>
                                <option value="Lê Văn C">Lê Văn C</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Độ ưu tiên</label>
                            <select id="taskPriority" required onchange="updateAutoDeadline()">
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Deadline (AI tự động)</label>
                            <input type="date" id="taskDeadline" required>
                        </div>
                        <div class="form-group">
                            <label>Cho phép chỉnh sửa deadline</label>
                            <input type="checkbox" id="allowDeadlineEdit" checked>
                        </div>
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
    const modalHTML = `
        <div id="joinGroupModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('joinGroupModal')">&times;</span>
                <h2>Gửi yêu cầu tham gia nhóm</h2>
                <form onsubmit="joinGroup(event)">
                    <div class="form-group">
                        <label>Chọn nhóm</label>
                        <select id="selectedGroup" required>
                            <option value="">Chọn nhóm muốn tham gia</option>
                            ${availableGroups.map(group => `
                                <option value="${group.id}">${group.name} - ${group.topic} (${group.members.length}/4 thành viên)</option>
                            `).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn">Gửi yêu cầu</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('joinGroupModal').style.display = 'block';
}

function showFinalEvaluation() {
    const myGroup = groups.find(g => g.leader === currentUser.name);
    if (!myGroup) return;
    
    const autoEvaluations = generateMemberEvaluation(myGroup.id);
    const evaluationHTML = `
        <div id="finalEvaluationModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('finalEvaluationModal')">&times;</span>
                <h2>Đánh giá cuối kỳ - ${myGroup.name}</h2>
                
                <div class="section">
                    <h3>Bảng đánh giá thành viên</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Người đánh giá</th>
                                <th>Người được đánh giá</th>
                                <th>Điểm tổng</th>
                                <th>Teamwork</th>
                                <th>Responsibility</th>
                                <th>Quality</th>
                                <th>Punctuality</th>
                                <th>Nhận xét</th>
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
                    <h3>Thống kê thời gian làm việc</h3>
                    ${generateWorkTimeStatistics(myGroup.id)}
                </div>
                
                <div class="section">
                    <h3>Báo cáo hoàn thành task</h3>
                    ${generateTaskCompletionReport(myGroup.id)}
                </div>
                
                <button class="btn" onclick="closeModal('finalEvaluationModal')">Đóng</button>
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
                    <th>Thành viên</th>
                    <th>Số task</th>
                    <th>Tổng thời gian (ngày)</th>
                    <th>Thời gian trung bình/task</th>
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
                    <th>Thành viên</th>
                    <th>Tổng task</th>
                    <th>Hoàn thành đúng hạn</th>
                    <th>Hoàn thành trễ hạn</th>
                    <th>Tỷ lệ đúng hạn</th>
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
    const members = document.getElementById('groupMembers').value.split(',').map(m => m.trim()).filter(m => m);
    const invited = [...invitedEmails];

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
        allowDeadlineEdit: allowEdit
    };

    tasks.push(newTask);
    selectedGroupId = myGroup.id;
    closeModal('createTaskModal');
    showDashboard();
    alert('Tạo task thành công!');
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
        alert('Task đã được hoàn thành!');
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
        const extensionDays = prompt('Nhập số ngày muốn gia hạn (tối đa 7 ngày):', '3');
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
            
            alert(`Đã gửi yêu cầu gia hạn ${days} ngày!`);
        } else {
            alert('Số ngày gia hạn không hợp lệ!');
        }
    }
}

function showEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const modalHTML = `
        <div id="editTaskModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('editTaskModal')">&times;</span>
                <h2>Chỉnh sửa Task</h2>
                <form onsubmit="editTask(event, ${taskId})">
                    <div class="form-group">
                        <label>Tiêu đề task</label>
                        <input type="text" id="editTaskTitle" value="${task.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="editTaskDescription" required>${task.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Người thực hiện</label>
                        <select id="editTaskAssignee" required>
                            <option value="Nguyễn Văn A" ${task.assignedTo === 'Nguyễn Văn A' ? 'selected' : ''}>Nguyễn Văn A</option>
                            <option value="Trần Thị B" ${task.assignedTo === 'Trần Thị B' ? 'selected' : ''}>Trần Thị B</option>
                            <option value="Lê Văn C" ${task.assignedTo === 'Lê Văn C' ? 'selected' : ''}>Lê Văn C</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input type="date" id="editTaskDeadline" value="${task.deadline}" required>
                    </div>
                    <button type="submit" class="btn">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('editTaskModal').style.display = 'block';
}

function editTask(event, taskId) {
    event.preventDefault();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.title = document.getElementById('editTaskTitle').value;
    task.description = document.getElementById('editTaskDescription').value;
    task.assignedTo = document.getElementById('editTaskAssignee').value;
    task.deadline = document.getElementById('editTaskDeadline').value;
    closeModal('editTaskModal');
    showDashboard();
    alert('Đã cập nhật task thành công!');
}

function showCreateTaskModalForGroup(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const modalHTML = `
        <div id="createTaskModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('createTaskModal')">&times;</span>
                <h2>Tạo task mới cho nhóm: ${group.name}</h2>
                <form onsubmit="createTaskForGroup(event, ${groupId})">
                    <div class="form-group">
                        <label>Tiêu đề task</label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="taskDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Người thực hiện</label>
                        <select id="taskAssignee" required>
                            <option value="">Chọn người thực hiện</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                            <option value="Trần Thị B">Trần Thị B</option>
                            <option value="Lê Văn C">Lê Văn C</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input type="date" id="taskDeadline" required>
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
    const assignedTo = document.getElementById('taskAssignee').value;
    const deadline = document.getElementById('taskDeadline').value;
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        groupId,
        assignedTo,
        status: 'pending',
        deadline,
        startTime: new Date().toISOString().split('T')[0]
    };
    tasks.push(newTask);
    selectedGroupId = groupId;
    closeModal('createTaskModal');
    showDashboard();
    alert('Tạo task thành công!');
}

function renderTasksForGroup(groupId) {
    const groupTasks = tasks.filter(task => task.groupId === groupId);
    if (groupTasks.length === 0) {
        return '<p>Chưa có task nào.</p>';
    }
    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Mô tả</th>
                    <th>Người thực hiện</th>
                    <th>Trạng thái</th>
                    <th>Deadline</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${groupTasks.map(task => `
                    <tr>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${task.assignedTo}</td>
                        <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                        <td>${task.deadline}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewTask(${task.id})">Xem</button>
                            <button class="btn btn-warning" onclick="showEditTaskModal(${task.id})">Sửa</button>
                            <button class="btn btn-success" onclick="completeTask(${task.id})">Hoàn thành</button>
                        </td>
                    </tr>
                `).join('')}
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
                <h2>Thêm thành viên vào nhóm: ${group.name}</h2>
                <form onsubmit="addMemberToGroup(event, ${groupId})">
                    <div class="form-group">
                        <label>Tên thành viên</label>
                        <input type="text" id="newMemberName" required placeholder="Nhập tên thành viên">
                    </div>
                    <button type="submit" class="btn">Thêm thành viên</button>
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
        alert('Đã thêm thành viên vào nhóm!');
    } else {
        alert('Tên thành viên không hợp lệ hoặc đã tồn tại trong nhóm!');
    }
}

function deleteGroup(groupId) {
    if (confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
        const idx = groups.findIndex(g => g.id === groupId);
        if (idx !== -1) {
            groups.splice(idx, 1);
            // Xóa luôn các task thuộc nhóm này
            for (let i = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].groupId === groupId) tasks.splice(i, 1);
            }
            showDashboard();
            alert('Đã xóa nhóm thành công!');
        }
    }
}

function switchGroup() {
    selectedGroupId = parseInt(document.getElementById('groupSwitcher').value);
    showDashboard();
}

function renderMyTasksForGroup(groupId) {
    const myTasks = tasks.filter(task => task.assignedTo === currentUser.name && task.groupId === groupId);
    if (myTasks.length === 0) {
        return '<p>Bạn chưa có task nào trong nhóm này.</p>';
    }
    return `
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
                ${myTasks.map(task => `
                    <tr>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td><span class="status ${task.status}">${getStatusText(task.status)}</span></td>
                        <td>${task.deadline}</td>
                        <td>
                            <button class="btn btn-success" onclick="completeTask(${task.id})">Hoàn thành</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
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
                <h2>Mời thành viên vào nhóm</h2>
                <form onsubmit="addInvitedEmail(event)">
                    <div class="form-group">
                        <label>Email thành viên</label>
                        <input type="email" id="inviteEmail" placeholder="Nhập email thành viên" required>
                    </div>
                    <button type="submit" class="btn">Thêm email</button>
                </form>
                <div id="invitedEmailList" style="margin-top:16px;"></div>
                <button class="btn" onclick="closeModal('inviteModal')">Đóng</button>
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
                        <button class="btn" onclick="closeModal('${modalId}')">Từ chối</button>
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

// Thêm hàm xóa thành viên khỏi nhóm
function removeMemberFromGroup(groupId, memberName) {
    const group = groups.find(g => g.id === groupId);
    if (group) {
        group.members = group.members.filter(m => m !== memberName);
        showDashboard();
        alert(`Đã xóa thành viên ${memberName} khỏi nhóm!`);
    }
}

// Hàm hiển thị bảng thông tin nhóm sau khi tạo
function showGroupInfoTable(group) {
    const modalHTML = `
        <div id="groupInfoModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('groupInfoModal')">&times;</span>
                <h2><i class="fas fa-check-circle"></i> Tạo nhóm thành công!</h2>
                <div class="group-info-table">
                    <h3>Thông tin nhóm đã tạo:</h3>
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
        alert('Bạn không phải thành viên của nhóm này!');
        return;
    }
    
    let modalHTML = `
        <div id="leaveGroupModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('leaveGroupModal')">&times;</span>
                <h2><i class="fas fa-sign-out-alt"></i> Rời nhóm</h2>
                <div class="leave-group-info">
                    <h3>Thông tin nhóm:</h3>
                    <p><strong>Tên nhóm:</strong> ${group.name}</p>
                    <p><strong>Chủ đề:</strong> ${group.topic}</p>
                    <p><strong>Vai trò của bạn:</strong> ${isLeader ? 'Trưởng nhóm' : 'Thành viên'}</p>
                </div>
    `;
    
    if (isLeader) {
        // Nếu là leader, hiển thị tùy chọn trao quyền
        const otherMembers = group.members.filter(m => m !== currentUser.name);
        if (otherMembers.length > 0) {
            modalHTML += `
                <div class="transfer-leadership">
                    <h3>Trao quyền trưởng nhóm:</h3>
                    <p>Bạn có muốn trao quyền trưởng nhóm cho thành viên khác không?</p>
                    <div class="form-group">
                        <label>Chọn thành viên mới:</label>
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
                    <p><strong>Lưu ý:</strong> Bạn là thành viên duy nhất trong nhóm. Nếu rời nhóm, nhóm sẽ bị xóa.</p>
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
        alert('Vui lòng chọn thành viên mới!');
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