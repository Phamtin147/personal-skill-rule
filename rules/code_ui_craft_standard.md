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

## 3. Quy chuẩn Icon Bắt buộc & Triệt tiêu Icon AI Slop (100% Tuyệt đối)
- Khi chèn hoặc sử dụng icon trong UI, Frontend, Markdown, Documentation, hay Presentation:
  - **Bước 1: Quét hệ thống icon của dự án trước**: Luôn kiểm tra `package.json`, thư mục `assets/icons/`, hoặc các import trong code xem dự án hiện tại đang dùng bộ icon nào (`@radix-ui/react-icons`, `lucide-react`, `phosphor-react`, `@tabler/icons-react`, `@heroicons/react`...). **Nếu dự án đã có bộ icon, 100% BẮT BUỘC PHẢI DÙNG ĐÚNG BỘ ICON ĐÓ** để giữ đồng bộ nguyên vẹn cho toàn bộ codebase.
  - **Bước 2: Mặc định sang Radix Icons**: Nếu dự án chưa có hoặc cần thêm icon mới vào docs/markdown/UI: **100% BẮT BUỘC DÙNG `Radix Icons`** (hoặc SVG chuẩn lấy từ `assets/icons/` hay thư viện chính thức).
  - **CẤM TUYỆT ĐỐI (Không có ngoại lệ)**:
    - **Nghiêm cấm dùng icon do AI tự bịa / hallucinated SVG slop**: Không bao giờ để AI tự vẽ các SVG icon méo mó, không đồng nhất, hình glyph generic vô hồn.
    - **Nghiêm cấm dùng Emoji làm icon UI**: Tuyệt đối không dùng emoji (như rockets, lightbulbs, brains, packages, etc.) để thay thế icon trong nút bấm, thanh điều hướng, bảng biểu, tài liệu kỹ thuật, hay tiêu đề markdown.

## 4. Kiểm thử & Thẩm định Trực quan (Visual Inspection Loop)
- Sau khi code xong:
  - Chạy test kiểm thử logic và build đầy đủ.
  - **Đối với các thay đổi liên quan đến UI/UX**:
    - Bắt buộc chụp ảnh màn hình (screenshot kết quả render thực tế qua browser/công cụ kiểm thử trực quan/headless snapshot).
    - Tự mình quan sát, soi kỹ ảnh chụp: kiểm tra khoảng cách (padding/margin), độ tương phản, responsive và thẩm mỹ tổng thể.
    - Nếu phát hiện điểm chưa hoàn hảo, chủ động sửa lại ngay trước khi bàn giao cho người dùng.

## 5. Quy chuẩn Mermaid Diagram (Tuyệt đối không dùng Mindmap / Header lỗi)
- **100% Bắt buộc chỉ dùng các loại Diagram được hỗ trợ**:
  - `flowchart TD` / `flowchart LR` / `graph TD` / `graph LR` (Lưu đồ & đồ thị quan hệ)
  - `sequenceDiagram` (Biểu đồ tuần tự tương tác)
  - `stateDiagram-v2` hoặc `stateDiagram` (Biểu đồ trạng thái)
  - `classDiagram` (Biểu đồ lớp)
  - `erDiagram` (Sơ đồ cơ sở dữ liệu quan hệ thực thể ERD)
  - `xychart-beta` (Biểu đồ dữ liệu trục XY)
  - `pie` (Biểu đồ hình tròn)
- **CẤM TUYỆT ĐỐI**:
  - Nghiêm cấm dùng `mindmap`, `gitGraph`, `gantt`, `quadrantChart`, `journey`, `timeline`, `sankey-beta`, `block-beta`, `packet-beta`. Bất kỳ sơ đồ nào có các header này đều sẽ crash trình render markdown (`Failed to render Mermaid diagram: Invalid mermaid header`).
- **Cách biểu diễn thay thế**:
  - Vẽ sơ đồ tư duy (mindmap): Luôn dùng `flowchart TD` / `flowchart LR` dạng cây phân nhánh hoặc danh sách Markdown.
  - Vẽ lộ trình / tiến độ (timeline / gantt): Dùng `flowchart LR` hoặc bảng Markdown.
- **An toàn cú pháp**:
  - Bọc tất cả nhãn node có ký tự đặc biệt trong nháy kép `id["Label (Chi tiết)"]`.
  - Không nhúng HTML tags thô vào nhãn node.

## 6. Tiêu chuẩn Sao lưu & Đẩy lên Repo (100% Full Độc lập)
- Khi thực hiện push hoặc backup lên Git (như `personal-skill-rule`, `dotfiles`):
  - **100% bắt buộc sao lưu BẢN FULL trọn vẹn**: Giải quyết toàn bộ symlink thành file/thư mục thật (`copy dereference`).
  - Tuyệt đối không lưu dạng symlink rỗng hay trỏ link ra ngoài phòng trường hợp sau này tác giả xóa repo hoặc mất mạng thì vẫn có đủ 100% file để tải về và chạy độc lập.
