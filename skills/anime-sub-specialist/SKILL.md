---
name: anime-sub-specialist
description: Chuyên gia dịch thuật phụ đề Anime / Phim ảnh chuẩn văn phong Fansub Việt Nam với nghiên cứu bối cảnh, quan hệ nhân vật, tuổi tác và hệ thống đại từ xưng hô chính xác 100%.
metadata:
  model: inherit
---

## KHI NÀO SỬ DỤNG SKILL NÀY

- Dịch phụ đề phim/anime từ tiếng Anh/tiếng Nhật sang tiếng Việt.
- Thiết lập hệ thống xưng hô, bảng quan hệ nhân vật và cẩm nang dịch thuật cho một bộ phim bất kỳ.
- Trích xuất phụ đề, chuyển ngữ, kiểm tra tính toàn vẹn (lệch dòng, lỗi thẻ hiệu ứng) và đóng gói video có phụ đề.

---

## 6 BƯỚC CỐT LÕI CỦA PHƯƠNG PHÁP DỊCH ANIME CHUẨN XÁC

```
[BƯỚC 1: TRÍCH XUẤT PHỤ ĐỀ]
       │
       ▼
[BƯỚC 2: NGHIÊN CỨU THỰC THỂ & BỐI CẢNH (Search Specialist)]
       │
       ▼
[BƯỚC 3: THIẾT LẬP BẢNG XƯNG HÔ & THUẬT NGỮ (Series Guide MD)]
       │
       ▼
[BƯỚC 4: DỊCH NGỮ CẢNH THEO VĂN PHONG FANSUB (2-Pass Translation)]
       │
       ▼
[BƯỚC 5: KIỂM THỬ KỸ THUẬT & TOÀN VẸN (Line-by-line QA)]
       │
       ▼
[BƯỚC 6: ĐÓNG GÓI PHIM & XUẤT ĐA ĐỊNH DẠNG (Remux & Export)]
```

### Bước 1: Trích xuất & Khảo sát Subtitle
- Dùng công cụ `tools/extract.js` hoặc ffmpeg để lấy stream subtitle (ưu tiên ASS để giữ format/timing/font).
- Dùng `tools/parse_dialogues.js` để bóc tách thành danh sách câu thoại và nhận diện các speaker (tên nhân vật xuất hiện trong subtitle).

### Bước 2: Nghiên cứu Thực thể (Character & Lore Discovery)
- Trước khi dịch bất kỳ từ nào, PHẢI tra cứu:
  1. Tên gốc (tiếng Nhật / tiếng Anh), tên tác giả, bối cảnh cốt truyện.
  2. Hồ sơ từng nhân vật: Giới tính, độ tuổi ước tính, vai vế xã hội (chủ - tớ, sư phụ - đệ tử, cha mẹ - con cái, bạn bè, đối thủ).
  3. Tính cách và tâm lý của nhân vật (lạnh lùng, tinh nghịch, tàn bạo, nhút nhát).

### Bước 3: Tạo cẩm nang dịch thuật (Series Translation Guide MD)
- Nếu bộ phim chưa có file `[TÊN_PHIM]_TRANSLATION_GUIDE.md`, AI lập tức tạo file này dựa theo mẫu trong `templates/SERIES_GUIDE_TEMPLATE.md`.
- Lập **Bảng ma trận xưng hô chéo**: Ai nói với ai thì xưng gì - gọi gì.
- Lập **Bảng thuật ngữ chuẩn**: Tên chiêu thức, tổ chức, địa danh, vật phẩm.

### Bước 4: Dịch ngữ cảnh 2 bước (2-Pass Translation)
- **Pass 1 (Đúng nghĩa & Đúng xưng hô)**: Dịch sát ngữ cảnh, tuyệt đối áp dụng ma trận xưng hô đã định nghĩa.
- **Pass 2 (Chuốt văn phong Anime)**:
  - Thoại phải gãy gọn, súc tích, hợp nhịp thở và chuyển động môi của nhân vật.
  - Tuyệt đối tránh dịch "word-by-word" thô ráp từ tiếng Anh (ví dụ: *"my ass"* -> *"cái con khỉ"*, *"hocus pocus"* -> *"úm ba la xì bùa"*, *"snot-nosed kid"* -> *"thằng nhóc hỉ mũi chưa sạch"*).
  - Giữ nguyên thẻ định dạng ASS: `\N` (viết hoa), `{\i1}...{\i0}` (in nghiêng), các thẻ tọa độ/màu.

### Bước 5: Kiểm thử toàn vẹn (QA Verification)
- Chạy `tools/verify_sub.js`:
  - Khớp 1:1 số lượng dòng (tuyệt đối không để thiếu dòng gây lệch phụ đề).
  - Phát hiện ký tự `\n` viết thường để đổi thành `\N`.
  - Kiểm tra các cặp ngoặc thẻ nhọn `{}` không bị rách/thiếu.

### Bước 6: Tái tạo & Đóng gói (Build & Remux)
- Dùng `tools/build_sub.js` để tạo file `.vie.ass` và `.vie.srt`.
- Dùng `tools/remux.js` để ghép vào MKV gốc thành file `[Tên_phim]_vi.mkv` với:
  - Video + Audio gốc (stream copy không giảm chất lượng, chỉ mất 1-2 giây).
  - Sub Việt làm mặc định.
  - Sub Anh làm dự phòng.
  - Giữ nguyên tất cả font chữ đính kèm.
