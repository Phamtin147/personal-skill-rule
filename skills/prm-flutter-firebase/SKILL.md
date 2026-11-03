---
name: prm-flutter-firebase
description: Specialized skill for FPT University PRM (Mobile Programming - Flutter + Firebase) practical exams. Implements complete app rewrite into repository https://github.com/Phamtin147/PE-PRM-393, database cleanup, Apple Design System integrated with tasteskill v2 (design-taste-frontend), impeccable craftsmanship, ui-ux-pro-max guidelines, 100% exact strings validation, and FPT submission guidelines.
---

# PRM Practical Exam Specialist (Flutter + Firebase)

Chuyên gia thực hiện và hoàn thiện bài thi thực hành Practical Exam (PE) môn **PRM393 / PRM392 / PRN** (Flutter + Firebase) tại FPT University. Tích hợp toàn diện tiêu chuẩn thiết kế cao cấp: **Apple Design System** kết hợp **tasteskill v2 (`design-taste-frontend`)**, **`impeccable`** và **`ui-ux-pro-max`**, bài trừ 100% AI slop, khắc phục triệt để **7 cạm bẫy kỹ thuật**, đảm bảo chuẩn hóa dữ liệu, làm sạch Firebase Database và tự động nộp bài qua GitHub Actions.

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

## 2. BỘ BA NGUYÊN TẮC UI/UX ĐỈNH CAO (INTEGRATED DESIGN STANDARDS)

Ứng dụng Flutter PRM không được phép trông như một sản phẩm AI mặc định tầm thường (AI slop). Thay vào đó, app phải đạt tiêu chuẩn thủ công tinh tế (craftsmanship) với 3 bộ tiêu chuẩn:

### A. Triết Lý Anti-Slop (`design-taste-frontend` / tasteskill v2)
1. **Loại bỏ các chi tiết thừa thãi vô nghĩa (Zero Ornaments / No Slop):**
   - Không lạm dụng icon trang trí vô tội vạ, không dùng emoji làm icon UI (tuyệt đối không 🚀, 💡, 📚 trong header/button).
   - Không dùng gradient 7 màu mờ nhạt, viền neon rẻ tiền hay drop shadow xám đục.
   - Thay sự màu mè bằng **Chất liệu thực (Substance):** Typography tương phản mạnh, khoảng trống (whitespace) có nhịp điệu, các trường màu phẳng, sạch và dứt khoát.
2. **Quyết đoán trong thiết kế (Decisive Design):**
   - Màu sắc tập trung vào hành động: Nền trắng canvas `#F5F5F7` / `#FFFFFF`, chữ mực đậm `#1D1D1F`, màu tương tác duy nhất là Apple Accent Blue `#0071E3`.

### B. Độ Hoàn Thiện Tinh Xảo (`impeccable`)
1. **Operate Mode (Giao diện Vận hành & Làm việc):**
   - Ứng dụng thi cử thuộc chế độ **Operate**: Ưu tiên tốc độ quét thông tin (scanability), tính nhất quán, phản hồi xúc giác ngay lập tức và độ tin cậy tuyệt đối của Form.
2. **Chi tiết cấu kiện chuẩn mực:**
   - **Touch Target:** Tất cả nút bấm, icon bấm được tối thiểu `44x44px` (Apple Human Interface Guidelines).
   - **Padding & Rhythm:** Padding form nhất quán `16px - 20px`, khoảng cách giữa các trường `12px - 16px`.
   - **Input Fields:** Bo góc `11px`, border hairline nhẹ nhàng `#D2D2D7`, focus ring rõ nét màu `#0071E3` mà không làm nhảy layout.
   - **CTA Button:** Dạng Pill bo góc `980px`, chiều cao `44px - 48px`, chữ `17px semibold`, hiển thị rõ trạng thái Loading spinner trắng khi đang async.

### C. Trí Tuệ Giao Diện Di Động (`ui-ux-pro-max`)
1. **Độ tương phản & Khả năng tiếp cận (Accessibility - WCAG AAA):**
   - Độ tương phản chữ và nền tối thiểu 4.5:1. Nhãn form luôn hiển thị rõ ràng bên trên hoặc trong ô, không chỉ phụ thuộc vào `hintText` mờ.
   - Thông báo lỗi hiển thị ngay dưới trường vi phạm bằng màu đỏ tương phản chuẩn Apple (`#FF3B30`), không giấu lỗi trong toast/snack thoáng qua.
2. **Phản hồi tương tác (Touch & Feedback):**
   - Phím bấm có hiệu ứng nhấn nhẹ (ink/splash hoặc opacity feedback).
   - Trạng thái trống (Empty State) thiết kế trang nhã: Khi danh sách trống hiển thị chuẩn xác `No books found` kèm hình khối vector tối giản, không để màn hình trắng xóa trơ trọi.

---

## 3. QUY TRÌNH KHI CÓ ĐỀ THI MỚI (NEW EXAM PROTOCOL)

Khi người dùng cung cấp đề bài thi PRM mới (file Word/PDF, prompt, hoặc ảnh đề bài):

### Bước 1: Dọn sạch Database Firebase (Clean Firebase Database)
1. Chạy script dọn dẹp Firestore tự động:
   ```bash
   cd /home/amtia/Projects/PE-PRM-393 && dart run tool/clean_firebase.dart <collection_name>
   ```
2. Đảm bảo tài khoản chấm thi `grader.qe190087@example.com` (mật khẩu `Test1234!`) sạch sẽ, không còn rác từ đề cũ.

### Bước 2: Phân tích & Trích xuất Exact Strings 100%
- Giám khảo FPT dùng script tự động kiểm tra chuỗi UI và thông báo lỗi. Sai 1 dấu cách hay chữ hoa/thường là 0 điểm.
- Trích xuất: Tên bảng/collection, các field, enum dropdown, và toàn bộ Error Messages bắt buộc.

### Bước 3: Ghi đè (Overwrite) Source Code trong `PE-PRM-393`
- Thực hiện trực tiếp trên `/home/amtia/Projects/PE-PRM-393`.
- Cấu trúc thư mục:
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

### Bước 4: Khắc Phục Triệt Để 7 Cạm Bẫy Sống Còn
1. **StreamBuilder:** Khởi tạo `Stream` duy nhất trong `initState()`, tuyệt đối không gọi trong `build()`.
2. **Web Password Autofill:** Bọc ô password bằng `autofillHints: const [AutofillHints.oneTimeCode]`, `enableSuggestions: false`, `autocorrect: false` tránh popup Edge/Chrome đè nút.
3. **Dropdown Key:** Dùng `ValueKey('field_$_resetCount')` ổn định, không gắn key theo giá trị động.
4. **Duplicate Prevention & Security Rules:** Chuẩn hóa Document ID (`userId_title_author`) hoặc query chống trùng lặp; cấu hình `firestore.rules` kiểm tra kiểu, độ dài và `resource.data.userId == request.auth.uid`.
5. **Auth Navigation & Back Button:** Dùng `AuthGate` không chớp nháy; dùng `pushAndRemoveUntil` và `PopScope(canPop: false)` tại màn hình chính ngăn phím Back quay lại màn hình Login.
6. **CI/CD Build APK:** Cấu hình `.github/workflows/build.yml` để GitHub Actions tự động build release APK khi push tag `v1.0`.
7. **Quy chuẩn hồ sơ FPT:**
   - Thư mục nộp: `QE190087/`
   - File Word: `QE190087.docx` (bảng thông tin sinh viên + 16 caption ảnh).
   - File Zip: `QE190087.zip` (root là `pubspec.yaml`, không rác build, cache, git).

### Bước 5: Áp Dụng Apple Design System + tasteskill + impeccable + ui-ux-pro-max
- Canvas `#F5F5F7` / Card Surface `#FFFFFF` bo góc `16px`.
- CTA Pill Button `#0071E3`, cao `44px`, chữ trắng `17px semibold`.
- Typography SF Pro tinh gọn, không emoji slop.
- Form inputs sạch sẽ bo góc `11px`, border `#D2D2D7`.

### Bước 6: Commit, Tag & Push lên GitHub
```bash
git add .
git commit -m "feat(prm): complete exam implementation with clean database & impeccable apple UI"
git push origin main
git tag -fa v1.0 -m "Release v1.0"
git push origin v1.0 --force
```
Đợi GitHub Actions hoàn thành để tạo APK release tại link tải chính thức.

---

## 4. TÀI LIỆU CHI TIẾT
Toàn bộ mã nguồn mẫu, bảng token Apple Design System và playbook chi tiết 15,900 dòng được lưu tại:
`resources/PRM_FLUTTER_FIREBASE_DESIGN_SKILL.md`
