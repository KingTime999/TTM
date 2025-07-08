# Team Task Management System

A comprehensive web-based team task management application with role-based access control for leaders and students.

## Features

### 🎯 **Student Features**
- **View Assigned Tasks**: Students can see all tasks assigned to them
- **Update Task Progress**: Students can update their task progress and status
- **Submit Completed Tasks**: Mark tasks as completed when finished
- **View Team Information**: Access team member details and project information

### 👨‍💼 **Leader Features**
- **Authentication**: Secure login system with role-based access
- **Create Groups**: Create new teams with project topics and descriptions
- **Assign Tasks**: Assign tasks to specific team members
- **Track Progress**: Monitor task progress and completion status
- **Evaluate Members**: Rate team members on various criteria
- **Update Task Status**: Modify task status, deadlines, and reassign tasks
- **Project Management**: Create and manage multiple projects

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The application will load automatically

## 🔐 Demo Accounts

### Leader Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Leader

### Student Accounts
- **Username**: `student1`
- **Password**: `student123`
- **Role**: Student

- **Username**: `student2`
- **Password**: `student123`
- **Role**: Student

- **Username**: `student3`
- **Password**: `student123`
- **Role**: Student

## 📋 How to Use

### For Leaders

#### 1. Login
- Use the leader credentials to log in
- Select "Leader" role from the dropdown

#### 2. Dashboard Overview
- View project statistics and recent activities
- Monitor team performance metrics

#### 3. Create Groups
- Navigate to the "Team" section
- Click "Create Group" button
- Fill in group name, project topic, and description
- Add team members (comma-separated)

#### 4. Manage Tasks
- Go to the "Tasks" section
- Click "Create Task" to add new tasks
- Assign tasks to team members
- Track progress and update status

#### 5. Evaluate Team Members
- Navigate to the "Evaluation" section
- Rate each team member on:
  - Task Completion
  - Quality of Work
  - Team Collaboration
- Add comments and submit evaluations

#### 6. Project Management
- Use the "Management" section to:
  - Create new projects
  - Assign tasks to members
  - Monitor project deadlines

### For Students

#### 1. Login
- Use student credentials to log in
- Select "Student" role from the dropdown

#### 2. View Tasks
- Check the "Tasks" section for assigned tasks
- Filter tasks by status (pending, in-progress, completed)

#### 3. Update Progress
- Click "Update Progress" on assigned tasks
- Enter progress percentage (0-100%)
- Tasks automatically update status based on progress

#### 4. View Team Information
- Access team details in the "Team" section
- See team member roles and statistics

## 🎨 Features Overview

### Dashboard
- **Statistics Cards**: Total tasks, completed tasks, pending tasks, team members
- **Recent Activities**: Timeline of recent actions and updates
- **Quick Navigation**: Easy access to all sections

### Task Management
- **Task Cards**: Visual representation with priority indicators
- **Status Tracking**: Pending, In Progress, Completed
- **Priority Levels**: High, Medium, Low with color coding
- **Progress Updates**: Real-time progress tracking

### Team Management
- **Member Profiles**: Individual member information and statistics
- **Role Assignment**: Define team member roles
- **Performance Tracking**: Monitor task completion rates

### Evaluation System
- **Star Ratings**: 5-star rating system for multiple criteria
- **Comments**: Detailed feedback for each team member
- **Performance Metrics**: Track improvement over time

## 🛠 Technical Features

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: Interactive functionality and data management
- **Font Awesome**: Icon library for better UX
- **Google Fonts**: Inter font family for modern typography

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Data persistence across browser sessions
- **Role-Based Access**: Different interfaces for leaders and students
- **Real-time Updates**: Immediate feedback on all actions
- **Modal Dialogs**: Clean, focused user interactions

### Data Management
- **Local Storage**: All data is stored locally in the browser
- **Demo Data**: Pre-populated with sample tasks and team members
- **Data Persistence**: Changes are automatically saved

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface with all controls
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with simplified navigation

## 🎯 Use Cases

### Educational Institutions
- **Group Projects**: Manage student group assignments
- **Course Projects**: Track progress on academic projects
- **Team Evaluations**: Assess individual contributions

### Small Teams
- **Project Management**: Organize tasks and deadlines
- **Team Collaboration**: Coordinate work among team members
- **Performance Tracking**: Monitor individual and team performance

### Research Groups
- **Research Projects**: Manage research tasks and milestones
- **Data Collection**: Track data gathering progress
- **Publication Tasks**: Organize writing and review tasks

## 🔧 Customization

### Adding New Features
The modular JavaScript structure makes it easy to add new features:
- Add new task types
- Implement additional evaluation criteria
- Create custom reporting features

### Styling Customization
The CSS is well-organized and can be easily customized:
- Change color schemes
- Modify layout components
- Add custom animations

## 📊 Data Structure

### Tasks
```javascript
{
  id: number,
  title: string,
  description: string,
  status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  assignee: string,
  deadline: string,
  createdAt: string,
  progress: number
}
```

### Team Members
```javascript
{
  username: string,
  name: string,
  role: string,
  tasksCompleted: number,
  rating: number
}
```

### Activities
```javascript
{
  id: number,
  type: string,
  message: string,
  timestamp: string
}
```

## 🚀 Future Enhancements

Potential improvements for future versions:
- **Backend Integration**: Server-side data storage
- **Real-time Collaboration**: Live updates across multiple users
- **File Attachments**: Support for task-related files
- **Notifications**: Email and push notifications
- **Advanced Analytics**: Detailed performance reports
- **Calendar Integration**: Sync with external calendars
- **API Support**: RESTful API for external integrations

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support or questions, please open an issue in the project repository or contact the development team.

---

**Built with ❤️ for effective team collaboration and project management** 