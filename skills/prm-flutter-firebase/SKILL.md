---
name: prm-flutter-firebase
description: Specialized skill for FPT University PRM (Mobile Programming - Flutter + Firebase) practical exams. Implements complete app rewrite into repository https://github.com/Phamtin147/PE-PRM-393, database cleanup, Apple Design System, 100% exact strings validation, and FPT submission guidelines.
---

# PRM Practical Exam Specialist (Flutter + Firebase)

Chuyên gia thực hiện và hoàn thiện bài thi thực hành Practical Exam (PE) môn **PRM393 / PRM392 / PRN** (Flutter + Firebase) tại FPT University, tuân thủ nghiêm ngặt hệ thống thiết kế **Apple Design System**, khắc phục triệt để **7 cạm bẫy kỹ thuật**, đảm bảo chuẩn hóa dữ liệu, làm sạch Firebase Database và tự động nộp bài qua GitHub Actions.

---

## 1. THÔNG TIN THÍ SINH & REPOSITORY MỤC TIÊU CỐ ĐỊNH

- **Repository chính thức:** `https://github.com/Phamtin147/PE-PRM-393`
- **Local Workspace:** `/home/amtia/Projects/PE-PRM-393`
- **Mã sinh viên (Student Code):** `QE190087`
- **Họ và tên (Full Name):** `Pham Trung Tin`
- **Firebase Project ID:** `pe-prn-393`
- **Tài khoản chấm thi (Test Account):**
  - **Email:** `grader.qe190087@example.com`
  - **Password:** `Test1234!`
- **Link tải APK tự động:** `https://github.com/Phamtin147/PE-PRM-393/releases/download/v1.0/app-release.apk`

---

## 2. QUY TRÌNH KHI CÓ ĐỀ THI MỚI (NEW EXAM PROTOCOL)

Khi người dùng cung cấp đề bài thi PRM mới (file Word/PDF, prompt, hoặc ảnh đề bài):

### Bước 1: Dọn sạch Database Firebase (Clean Firebase Database)
1. Trước khi tạo hoặc seed dữ liệu mới, chạy script dọn dẹp hoặc xóa toàn bộ documents trong các collection Firestore của đề bài trước đó (ví dụ: `books`, v.v.).
2. Xóa các test documents không cần thiết, chuẩn bị sẵn tài khoản chấm thi: `grader.qe190087@example.com` với mật khẩu `Test1234!`.
3. Có thể dùng script `dart run tool/clean_firebase.dart` hoặc REST/SDK tool.

### Bước 2: Phân tích & Trích xuất Exact Strings 100%
- Giám khảo FPT chấm bài bằng script tự động kiểm tra chuỗi UI và thông báo lỗi. Bất kỳ sai lệch nào về chữ hoa/thường hay dấu cách đều bị trừ điểm tối đa.
- Lập bảng ánh xạ: Trường -> Ràng buộc -> Thông báo lỗi chính xác (Exact Error Message).
- Trích xuất toàn bộ enum, dropdown options, collection names, và field names.

### Bước 3: Ghi đè (Overwrite) Source Code trong `PE-PRM-393`
- Toàn bộ source code cũ trong `/home/amtia/Projects/PE-PRM-393` sẽ được ghi đè và điều chỉnh để phục vụ hoàn toàn cho đề thi mới.
- Cấu trúc thư mục chuẩn:
  ```
  lib/
  ├── firebase_options.dart
  ├── main.dart
  ├── models/
  │   └── <entity>.dart
  ├── services/
  │   ├── auth_service.dart
  │   └── <entity>_service.dart
  └── screens/
      ├── auth_gate.dart
      ├── login_screen.dart
      ├── register_screen.dart
      ├── home_screen.dart
      ├── add_edit_screen.dart
      └── detail_screen.dart
  ```

### Bước 4: 7 Cạm Bẫy Sống Còn Bắt Buộc Tuân Thủ
1. **StreamBuilder:** Khởi tạo `Stream` duy nhất trong `initState()`, tuyệt đối không gọi `getStream()` trong `build()`.
2. **Web Password Autofill:** Bọc ô password bằng `autofillHints: const [AutofillHints.oneTimeCode]`, `enableSuggestions: false`, `autocorrect: false` để tránh trình duyệt bung popup đè nút.
3. **Dropdown Key:** Dùng `ValueKey('field_$_resetCount')` ổn định, không gắn key theo giá trị động để tránh reset/đóng dropdown bất thường.
4. **Duplicate Prevention & Security Rules:** Chuẩn hóa doc ID (`userId_title_author`) hoặc truy vấn chống trùng lặp theo user; cấu hình `firestore.rules` xác thực chặt chẽ kiểu dữ liệu, độ dài và quyền sở hữu (`resource.data.userId == request.auth.uid`).
5. **Auth Navigation & Back Button:** Dùng `AuthGate` mượt mà không chớp màn hình; dùng `pushAndRemoveUntil(..., (route) => false)` và `PopScope(canPop: false)` tại màn hình chính để ngăn phím Back quay lại Login.
6. **CI/CD Build APK:** Cấu hình `.github/workflows/build.yml` để GitHub Actions tự động build release APK khi đẩy tag `v1.0`.
7. **Quy chuẩn hồ sơ FPT:**
   - Thư mục nộp: `QE190087/`
   - File Word: `QE190087.docx` (bảng thông tin sinh viên + 16 caption ảnh chụp màn hình).
   - File Zip: `QE190087.zip` (root là `pubspec.yaml`, không chứa `build/`, `.dart_tool/`, `.git/`, hay file key nhạy cảm).

### Bước 5: Áp dụng Apple Design System (iOS Human Interface Guidelines)
- **Màu sắc:** Primary Blue `#0071E3`, Background Canvas `#F5F5F7` / Surface `#FFFFFF`, Text Primary `#1D1D1F`, Hairline `#D2D2D7`.
- **Bo góc (Radius):** Pill CTA `980px`, Card `14px - 18px`, Input `11px`.
- **Typography:** SF Pro font styling, phân cấp rõ ràng (Display / Title / Body / Caption).

### Bước 6: Commit & Push lên GitHub
1. Thêm commit rõ ràng, ghi đè hoàn chỉnh vào nhánh `main`.
2. Push lên remote:
   ```bash
   git add .
   git commit -m "feat(prm): complete exam implementation with clean database"
   git push origin main
   git tag -fa v1.0 -m "Release v1.0"
   git push origin v1.0 --force
   ```
3. Đợi GitHub Actions hoàn thành để tạo APK release tại link tải chính thức.

---

## 3. TÀI LIỆU CHI TIẾT
Toàn bộ mã nguồn mẫu, bảng token Apple Design System và playbook chi tiết 15,900 dòng được lưu tại:
`resources/PRM_FLUTTER_FIREBASE_DESIGN_SKILL.md`
