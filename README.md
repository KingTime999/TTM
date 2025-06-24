# Task Manager - Hệ thống Quản lý Công việc

## Mô tả
Hệ thống Task Manager giúp quản lý và theo dõi công việc một cách hiệu quả cho sinh viên và giảng viên. Hệ thống hỗ trợ tạo nhóm, phân công task, đánh giá thành viên và thống kê hiệu suất.

## Tính năng chính

### 🔐 Đăng nhập
- **Sinh viên**: Đăng nhập với vai trò Leader hoặc Member
- **Giảng viên**: Quản lý lớp học và đánh giá tổng thể

### 👨‍🎓 Chức năng Sinh viên

#### Leader:
1. **Tạo nhóm**: Tạo nhóm mới và quản lý thành viên
2. **Tạo task**: Phân công công việc cho các thành viên
3. **Check & Feedback**: Kiểm tra tiến độ và đưa ra phản hồi
4. **Đánh giá cá nhân**: Đánh giá từng thành viên trong nhóm

#### Member:
1. **Tham gia nhóm**: Tham gia vào các nhóm có sẵn
2. **Báo cáo task**: Gửi báo cáo khi hoàn thành công việc
3. **Đánh giá thành viên**: Đánh giá các thành viên khác trong nhóm

### 👨‍🏫 Chức năng Giảng viên
1. **Tạo nhóm**: Tạo các nhóm cho lớp học
2. **Tạo bài tập**: Tạo các bài tập cho sinh viên
3. **Đánh giá tổng thể**: Đánh giá hiệu suất của các nhóm

### 🤖 AI System
1. **Auto Deadline**: Tự động tạo deadline cho task
2. **Member Evaluation**: Tạo đánh giá thành viên tự động
3. **Statistics**: Tạo thống kê và báo cáo

## Tài khoản Demo

### Sinh viên:
- **Leader**: `leader@student.com` / `123456`
- **Member**: `member@student.com` / `123456`
- **Member 2**: `member2@student.com` / `123456`

### Giảng viên:
- **Lecturer**: `lecturer@teacher.com` / `123456`

## Cách sử dụng

### 1. Khởi chạy hệ thống
1. Mở file `index.html` trong trình duyệt web
2. Chọn tab "Student" hoặc "Lecturer"
3. Nhập thông tin đăng nhập từ danh sách tài khoản demo

### 2. Sử dụng với vai trò Leader
1. Đăng nhập với tài khoản `leader@student.com`
2. Chọn vai trò "Leader"
3. Sử dụng các chức năng:
   - Tạo nhóm mới
   - Tạo task và phân công
   - Kiểm tra tiến độ
   - Đánh giá thành viên

### 3. Sử dụng với vai trò Member
1. Đăng nhập với tài khoản `member@student.com`
2. Chọn vai trò "Member"
3. Sử dụng các chức năng:
   - Xem task được phân công
   - Gửi báo cáo hoàn thành
   - Đánh giá thành viên khác

### 4. Sử dụng với vai trò Giảng viên
1. Đăng nhập với tài khoản `lecturer@teacher.com`
2. Sử dụng các chức năng:
   - Tạo nhóm cho lớp học
   - Tạo bài tập
   - Xem thống kê tổng thể
   - Đánh giá hiệu suất nhóm

## Cấu trúc dự án

```
TTM/
├── index.html          # Trang chính
├── styles.css          # File CSS
├── script.js           # File JavaScript
└── README.md           # Hướng dẫn sử dụng
```

## Công nghệ sử dụng
- **HTML5**: Cấu trúc trang web
- **CSS3**: Giao diện người dùng
- **JavaScript**: Logic xử lý
- **Font Awesome**: Icon
- **Responsive Design**: Tương thích mobile

## Tính năng nổi bật

### 🎨 Giao diện hiện đại
- Thiết kế responsive
- Gradient màu sắc đẹp mắt
- Animation mượt mà
- Icon trực quan

### 📊 Thống kê chi tiết
- Số lượng nhóm
- Số lượng task
- Tỷ lệ hoàn thành
- Biểu đồ trực quan

### 🔄 Quản lý real-time
- Cập nhật trạng thái task
- Thông báo hoàn thành
- Đánh giá tức thì

### 📱 Tương thích đa thiết bị
- Desktop
- Tablet
- Mobile

## Hướng dẫn phát triển

### Thêm tài khoản mới
Chỉnh sửa file `script.js`, thêm vào mảng `demoAccounts`:

```javascript
students: [
    { email: "new@student.com", password: "123456", role: "leader", name: "Tên mới" }
]
```

### Thêm chức năng mới
1. Tạo function trong `script.js`
2. Thêm button trong HTML
3. Cập nhật CSS nếu cần

### Tùy chỉnh giao diện
Chỉnh sửa file `styles.css` để thay đổi:
- Màu sắc
- Font chữ
- Layout
- Animation

## Lưu ý
- Đây là phiên bản demo, dữ liệu sẽ reset khi refresh trang
- Để lưu trữ dữ liệu thực tế, cần tích hợp database
- Có thể mở rộng thêm tính năng chat, notification, file upload

## Liên hệ
Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ team phát triển.

---
**Phiên bản**: 1.0  
**Ngày cập nhật**: 2024  
**Tác giả**: Team TTM 