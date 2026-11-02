# Rule: Workspace Operations, Graphify, UI/UX Craft & Verification Standards

Áp dụng tuyệt đối cho MỌI tác vụ trong toàn bộ các phiên làm việc:

## 1. BẮT BUỘC TỰ ĐỘNG TẠO & SỬ DỤNG GRAPHIFY (100% Mọi tác vụ)
- **Tự động kích hoạt ngay lập tức**: Khi bắt đầu bất kỳ công việc nào tại thư mục gốc/workspace (`folder root`) — **bất kể là code, viết tool/script nhỏ, chỉnh sửa config, tài liệu hay phân tích**:
  - **100% bắt buộc tự động chạy `graphify`** trên thư mục root đó để tạo/cập nhật đồ thị tri thức `graphify-out/` ngay bước đầu tiên, không chờ người dùng nhắc.
- **Đọc và tương tác hoàn toàn qua Graphify**:
  - Sử dụng đồ thị tri thức, báo cáo `GRAPH_REPORT.md`, các cụm cộng đồng (clusters) và quan hệ node trong `graphify-out/` để định hướng, đọc hiểu code và kiến trúc thư mục trước và trong suốt quá trình thao tác.

## 2. Tiêu chuẩn UI/UX & Thủ công Frontend (100% Bắt buộc)
- Khi xây dựng hoặc chỉnh sửa bất kỳ giao diện nào (Web, Mobile, App):
  - **100% bắt buộc áp dụng tinh hoa của các skill**:
    - **`ui-ux-pro-max`** & **`ui-ux-designer`**: Tư duy trải nghiệm người dùng, phân cấp thị giác (visual hierarchy), UX copy rõ ràng, micro-interactions tinh tế.
    - **`design-taste-frontend` (tasteskill v2)**: Tuyệt đối không làm ra giao diện AI chung chung, vô hồn hay "slop". Áp dụng phong cách nghệ thuật sắc sảo, bảng màu chuẩn, kiểu chữ có chủ đích.
    - **`impeccable`**: Chuẩn mực thiết kế cao cấp nhất, hoàn thiện từng chi tiết từ spacing, token, responsive cho đến edge cases.

## 3. Kiểm thử & Thẩm định Trực quan (Visual Inspection Loop)
- Sau khi code xong:
  - Chạy test kiểm thử logic và build đầy đủ.
  - **Đối với các thay đổi liên quan đến UI/UX**:
    - Bắt buộc chụp ảnh màn hình (screenshot kết quả render thực tế qua browser/công cụ kiểm thử trực quan/headless snapshot).
    - Tự mình quan sát, soi kỹ ảnh chụp: kiểm tra khoảng cách (padding/margin), độ tương phản, responsive và thẩm mỹ tổng thể.
    - Nếu phát hiện điểm chưa hoàn hảo, chủ động sửa lại ngay trước khi bàn giao cho người dùng.

## 4. Tiêu chuẩn Sao lưu & Đẩy lên Repo (100% Full Độc lập)
- Khi thực hiện push hoặc backup lên Git (như `personal-skill-rule`, `dotfiles`):
  - **100% bắt buộc sao lưu BẢN FULL trọn vẹn**: Giải quyết toàn bộ symlink thành file/thư mục thật (`copy dereference`).
  - Tuyệt đối không lưu dạng symlink rỗng hay trỏ link ra ngoài phòng trường hợp sau này tác giả xóa repo hoặc mất mạng thì vẫn có đủ 100% file để tải về và chạy độc lập.
