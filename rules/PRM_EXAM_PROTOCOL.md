---
description: PRM Practical Exam Protocol (Flutter + Firebase) - Always overwrite repo PE-PRM-393, clean Firebase database, and follow FPT submission guidelines
always_on: true
---

# PRM Practical Exam Workflow & Target Repository Protocol

## 1. Thông Tin Nhận Diện & Repository Mục Tiêu
Bất kỳ khi nào người dùng yêu cầu làm bài thi, giải đề thi, chuẩn bị bài thi hoặc nhắc đến môn học **PRM / PRM393 / PRM392 / PRN** (Flutter + Firebase):
- **Repository mục tiêu duy nhất:** `https://github.com/Phamtin147/PE-PRM-393`
- **Thư mục local:** `/home/amtia/Projects/PE-PRM-393`
- **Mã sinh viên:** `QE190087`
- **Họ tên:** `Pham Trung Tin`
- **Firebase Project ID:** `pe-prn-393`
- **Tài khoản test chấm thi:**
  - Email: `grader.qe190087@example.com`
  - Password: `Test1234!`
- **Link tải APK phát hành:** `https://github.com/Phamtin147/PE-PRM-393/releases/download/v1.0/app-release.apk`

---

## 2. Quy Trình Bắt Buộc Khi Nhận Đề Thi Mới ("Sau này có đề khác")

1. **Làm Sạch Database Firebase (Clean Database):**
   - Trước khi nạp dữ liệu cho đề mới, phải làm sạch dữ liệu cũ trong Firestore của project `pe-prn-393` (xóa sạch các collection cũ của bài trước).
   - Đảm bảo tài khoản chấm thi `grader.qe190087@example.com` sẵn sàng và Firestore chỉ chứa đúng dữ liệu mẫu mà đề bài mới yêu cầu.

2. **Ghi Đè Toàn Bộ Mã Nguồn Repo Cũ (Overwrite Codebase):**
   - Thực hiện trực tiếp trên repository `/home/amtia/Projects/PE-PRM-393`.
   - Ghi đè toàn bộ model, screens, services, firestore.rules để khớp 100% với đề thi mới.
   - Không tạo repo mới, không phân nhánh phụ làm rối, chỉ duy trì codebase chuẩn xác nhất trên nhánh `main`.

3. **Tuân Thủ Bộ Kỹ Năng & 7 Cạm Bẫy Tuyệt Đối:**
   - **Exact Strings 100%:** Toàn bộ thông báo lỗi và label UI phải chính xác từng ký tự theo đề thi.
   - **StreamBuilder:** Khởi tạo trong `initState()`, không gọi mới trong `build()` để tránh spinner giật lag và mất form khi `setState()`.
   - **Autofill Hints:** Khóa popup gợi ý password trên web bằng `AutofillHints.oneTimeCode`.
   - **Dropdown:** Dùng key reset cố định `ValueKey('field_$_resetCount')`.
   - **Security Rules:** Chặn truy cập và kiểm tra dữ liệu nghiêm ngặt ở tầng `firestore.rules`.
   - **Apple Design System:** Giao diện tối giản, hiện đại theo phong cách Apple (SF Pro, Primary Blue `#0071E3`, surface `#F5F5F7` / `#FFFFFF`, bo góc pill `980px`).

4. **Tự Động Nộp & Đẩy Lên GitHub (Push & CI/CD Release):**
   - Commit toàn bộ thay đổi và push lên `https://github.com/Phamtin147/PE-PRM-393` nhánh `main`.
   - Gắn tag `v1.0` (hoặc push tag đè `git tag -fa v1.0 -m "Release v1.0" && git push origin v1.0 --force`) để kích hoạt GitHub Actions build file APK release.
   - Chuẩn bị file báo cáo nộp bài `<StudentCode>.docx` và file zip mã nguồn sạch `<StudentCode>.zip`.
