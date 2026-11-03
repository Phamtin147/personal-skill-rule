---
description: PRM Practical Exam Protocol (Flutter + Firebase) - Always overwrite repo PE-PRM-393, clean Firebase database, follow FPT submission guidelines with Apple Design System, tasteskill v2, impeccable, and ui-ux-pro-max standards
always_on: true
---

# PRM Practical Exam Protocol & Execution Standards

## 1. Thông Tin Nhận Diện & Repository Mục Tiêu Cố Định
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

## 2. Tiêu Chuẩn Giao Diện Đỉnh Cao: Apple Design + tasteskill v2 + impeccable + ui-ux-pro-max
Tuyệt đối không sinh mã nguồn giao diện cẩu thả hoặc theo kiểu AI mặc định (AI slop). Mọi màn hình phải tuân thủ:
1. **tasteskill v2 (Anti-Slop Art Direction):**
   - Loại bỏ toàn bộ chi tiết thừa: không emoji làm icon (cấm 📚, 🚀, 💡...), không viền neon mờ ảo, không gradient rẻ tiền.
   - Tập trung vào thực chất (Substance): Typography SF Pro tương phản rõ nét, bảng màu dứt khoát (Canvas `#F5F5F7`, Surface `#FFFFFF`, Accent Blue `#0071E3`, Ink `#1D1D1F`).
2. **impeccable (Operate Mode Craftsmanship):**
   - Touch Target tối thiểu 44x44px cho mọi nút và item click.
   - Nút hành động chính (Primary CTA): Dạng Pill `borderRadius: 980px`, cao 44-48px, text semibold.
   - Input Fields: Bo góc `11px`, border hairline `#D2D2D7`, focus ring rõ nét, feedback mượt mà.
3. **ui-ux-pro-max (Mobile Design Intelligence):**
   - Đảm bảo độ tương phản 4.5:1 (WCAG AAA), nhãn label rõ ràng, báo lỗi đỏ `#FF3B30` ngay dưới trường vi phạm.
   - Trạng thái Empty State tinh tế khi danh sách rỗng (`No books found`).

---

## 3. Quy Trình Bắt Buộc Khi Nhận Đề Thi Mới ("Sau này có đề khác")

1. **Làm Sạch Database Firebase (Clean Database):**
   - Chạy script: `cd /home/amtia/Projects/PE-PRM-393 && dart run tool/clean_firebase.dart <collection_name>`
   - Đảm bảo Firestore sạch sẽ, chỉ chứa đúng dữ liệu của đề bài mới.

2. **Ghi Đè Toàn Bộ Mã Nguồn Repo Cũ (`PE-PRM-393`):**
   - Thực hiện trực tiếp trên `/home/amtia/Projects/PE-PRM-393`.
   - Ghi đè toàn bộ model, screens, services, firestore.rules để khớp 100% với đề thi mới.

3. **Khắc Phục 7 Cạm Bẫy Sống Còn & Exact Strings 100%:**
   - **Exact Strings 100%:** Toàn bộ thông báo lỗi và label UI phải chính xác từng ký tự theo đề thi.
   - **StreamBuilder:** Khởi tạo trong `initState()`, không tạo Stream mới trong `build()` tránh reload form.
   - **Autofill Hints:** Khóa popup gợi ý password trên web bằng `AutofillHints.oneTimeCode`.
   - **Dropdown:** Dùng key reset ổn định `ValueKey('field_$_resetCount')`.
   - **Security Rules:** Xác thực chặt chẽ ở tầng `firestore.rules` (`resource.data.userId == request.auth.uid`).
   - **Back Button:** Dùng `PopScope(canPop: false)` và `pushAndRemoveUntil` tránh back về màn login.

4. **Tự Động Nộp & Đẩy Lên GitHub (Push & CI/CD Release):**
   - Commit toàn bộ thay đổi và push lên nhánh `main`.
   - Gắn tag `v1.0` (`git tag -fa v1.0 -m "Release v1.0" && git push origin v1.0 --force`) kích hoạt GitHub Actions build APK.
   - Chuẩn bị file báo cáo nộp bài `<StudentCode>.docx` và file zip mã nguồn sạch `<StudentCode>.zip`.
