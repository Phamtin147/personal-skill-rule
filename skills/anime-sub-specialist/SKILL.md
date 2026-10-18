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
[BƯỚC 0: TÁCH ÂM & BẬT/TẮT DOCKER TỰ ĐỘNG (Dành cho Video thô chưa có sub)]
       │ (Khởi động Docker GPU ➔ Chép lời ➔ Tắt sạch Docker giải phóng RAM/VRAM)
       ▼
[BƯỚC 1: TRÍCH XUẤT PHỤ ĐỀ / PHÂN TÍCH DIALOGUES]
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
[BƯỚC 5: KIỂM THỬ KỸ THUẬT & TOÀN VẸN (Line-by-line & Font QA)]
       │
       ▼
[BƯỚC 6: XUẤT PHỤ ĐỀ CHUẨN FONT TIẾNG VIỆT & BẢO VỆ Ổ CỨNG (Segoe UI & Zero Disk Bloat)]
```

### Bước 0: Xử lý Video thô & Tự động nhận diện phần cứng (Auto-Detect Engine)
- **Cơ chế tự động nhận biết định dạng đầu vào**:
  - Khi người dùng gửi video: AI kiểm tra xem video đã có track phụ đề (softsub) chưa.
  - **Nếu đã có track sub**: Bỏ qua Bước 0, chuyển ngay sang **Bước 1** (Trích xuất nhanh bằng FFmpeg chỉ mất 1-2 giây).
  - **Nếu là Video thô (RAW không có sub)**: AI tự động kích hoạt Engine Speech-to-Text để nghe và bóc tách tiếng Nhật/Hàn trực tiếp:
    1. **Ưu tiên 1 (NATIVE GPU PYTHON)**: Nếu phát hiện môi trường `F:\Python311\python.exe` (hoặc Python có CUDA trên máy như RTX 3070 Ti), AI chạy trực tiếp lệnh:
       `& "F:\Python311\python.exe" engine/transcribe.py "<đường_dẫn_video>" --model large-v3 --separate`
       *(Tốc độ siêu nhanh ~60s/tập, tận dụng tối đa GPU phần cứng và lưu cache vào ổ F, không tốn dung lượng ổ C)*.
    2. **Ưu tiên 2 (DOCKER GPU)**: Nếu chạy qua Docker:
       - **Khởi động**: `docker compose run --rm transcribe "/videos/[tên_phim].mkv" --model large-v3 --separate`
       - **Tắt sạch ngay lập tức**: Ngay sau khi file `_dialogues.json` xuất hiện, AI **BẮT BUỘC CHẠY** `docker compose down` để giải phóng 100% VRAM và RAM.

### Bước 1: Trích xuất & Khảo sát Subtitle
- Dùng công cụ `tools/extract.js` hoặc ffmpeg để lấy stream subtitle (nếu video đã có sẵn track phụ đề gốc).
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
- **Chiến lược Xưng hô Dự phòng (Zero-Knowledge Fallback Strategy)**:
  - Khi gặp nhân vật phụ, người qua đường (mob/citizen), hoặc nhân vật mới mà **không có nguồn tham khảo** để biết giới tính (nam/nữ) hay tuổi tác: **TUYỆT ĐỐI KHÔNG ĐOÁN MÒ** (không tự tiện gán ghép xưng hô thân mật như *anh - em*, *chú - cháu*).
  - Bắt buộc dùng đại từ trung tính / chung chung phù hợp nhất với bối cảnh tức thời của phim:
    + **Học đường, đời thường, phiêu lưu đồng trang lứa**: **`Tôi - Cậu`** (hoặc `Tớ - Cậu` / `Tôi - Bạn`).
    + **Chiến đấu, đối đầu, fantasy / kiếm hiệp, kẻ thù / quái vật**: **`Ta - Ngươi`** (số nhiều: `Ta - Các ngươi`).
    + **Xã giao lịch sự nơi công cộng**: **`Tôi - Vị này`** / **`Tôi - Đằng ấy`** / **`Tôi - Mọi người`**.

### Bước 4: Dịch ngữ cảnh 2 bước (2-Pass Translation)
- **Pass 1 (Đúng nghĩa & Đúng xưng hô)**: Dịch sát ngữ cảnh, tuyệt đối áp dụng ma trận xưng hô đã định nghĩa. Với các tình huống thiếu dữ liệu nhân vật, tự động kích hoạt chiến lược Xưng hô Dự phòng trung tính (`Tôi - Cậu` hoặc `Ta - Ngươi`) chuẩn bối cảnh.
- **Pass 2 (Chuốt văn phong Anime)**:
  - Thoại phải gãy gọn, súc tích, hợp nhịp thở và chuyển động môi của nhân vật.
  - Tuyệt đối tránh dịch "word-by-word" thô ráp từ tiếng Anh (ví dụ: *"my ass"* -> *"cái con khỉ"*, *"hocus pocus"* -> *"úm ba la xì bùa"*, *"snot-nosed kid"* -> *"thằng nhóc hỉ mũi chưa sạch"*).
  - Giữ nguyên thẻ định dạng ASS: `\N` (viết hoa), `{\i1}...{\i0}` (in nghiêng), các thẻ tọa độ/màu.
  - **Bản địa hóa Credits cuối phim**: Tự động thay thế tên nhóm sub ngoại quốc (Translator, Timer, Editor, QC,...) thành tên dịch giả tiếng Việt: **Phamtin147** (Ví dụ: *Phụ đề Việt ngữ: Phamtin147, Dịch & Timer: Phamtin147, QC: Phamtin147*).

### Bước 5: Kiểm thử toàn vẹn & Tương thích Font (QA & Font Verification)
- Chạy `tools/verify_sub.js`:
  - Khớp 1:1 số lượng dòng (tuyệt đối không để thiếu dòng gây lệch phụ đề).
  - Phát hiện ký tự `\n` viết thường để đổi thành `\N`.
  - Kiểm tra các cặp ngoặc thẻ nhọn `{}` không bị rách/thiếu.
  - **Kiểm định Font chữ tiếng Việt**: Phát hiện và chặn triệt để các font tiếng Anh subset (Trebuchet MS, Aparajita, Adobe Arabic, Times New Roman, Roboto,...) có nguy cơ biến dấu tiếng Việt thành ô vuông tofu `□`.

### Bước 6: Tái tạo & Xuất Phụ Đề Chuẩn Font Tiếng Việt & Bảo Vệ Ổ Cứng (Typography & Storage-Safe Export)

> [!IMPORTANT]
> **QUY TẮC BẮT BUỘC VỀ FONT TIẾNG VIỆT (ANTI-TOFU FONT RULE)**:
> 1. Tuyệt đối **KHÔNG GIỮ NGUYÊN FONT TIẾNG ANH GỐC** (như *Trebuchet MS*, *Aparajita*, *Times New Roman*) trong file ASS. Các nhóm rip MKV thường đính kèm file font subset chỉ 1-2KB không chứa ký tự tiếng Việt có dấu. Khi gặp các từ như *"run rẩy"*, chữ *"ẩy"* sẽ bị vỡ thành ô vuông rỗng `r□y`.
> 2. Bắt buộc ép Style sang font Unicode tiếng Việt tiêu chuẩn: **`Segoe UI`** (hoặc `Arial`). `Segoe UI` hỗ trợ 100% đầy đủ 134 ký tự tiếng Việt có dấu, nét chữ thanh thoát, viền đen sắc nét và không bao giờ bị đụng độ với font attachment rác trong MKV.
> 3. Bắt buộc đặt `Encoding: 1` (Unicode) trong Style và chuẩn hóa Unicode NFC (Precomposed) cho toàn bộ câu thoại.
> 4. Lưu file với `UTF-8 with BOM` (`\uFEFF`) để mọi video player (MPC-HC, VLC) luôn nhận diện đúng mã UTF-8.

> [!IMPORTANT]
> **QUY TẮC BẢO VỆ DUNG LƯỢNG Ổ CỨNG (ZERO DISK BLOAT)**:
> Tuyệt đối **KHÔNG TỰ Ý TẠO FILE VIDEO BẢN SAO (`_vi.mkv`)** khi người dùng không yêu cầu. Phim/anime dung lượng từ 1.5GB đến hàng chục GB, nếu nhân đôi dung lượng sẽ nhanh chóng làm đầy ổ cứng và làm hỏng trạng thái seeding của các phần mềm torrent (như qBittorrent).

- **1. Chế độ Mặc định (Khuyến nghị số 1 - Phụ đề rời Softsub External)**:
  - Dùng `tools/build_sub.js` để tạo file `.vie.ass`, `.ass` và `.vie.srt` cùng thư mục và cùng tên với video gốc.
  - Các trình phát phim phổ biến (**MPC-HC**, **VLC**, **PotPlayer**, **MPV**) sẽ **tự động nạp Sub Việt ngay lập tức** khi mở video gốc.
  - **Lợi ích vượt trội**:
    - Tốn đúng **~30KB - 50KB** (tiết kiệm 100% dung lượng video).
    - Giữ nguyên vẹn file gốc để tiếp tục seeding trên qBittorrent mà không bị lỗi hash.
    - Xong ngay trong 0.5 giây.
- **2. Chế độ Đóng gói MKV In-Place (Khi người dùng yêu cầu gộp thành 1 file duy nhất)**:
  - Dùng `node tools/remux.js "<video_goc>" "<sub_vi.ass>" --replace` (hoặc `pipeline.js finish ... --remux`).
  - Hệ thống remux an toàn qua file tạm và thay thế file gốc. Thư mục **LUÔN DUY TRÌ DUY NHẤT 1 FILE VIDEO**, không nhân đôi dung lượng!
- **3. Chế độ Tạo bản sao riêng biệt (`--copy`)**:
  - Chỉ áp dụng khi người dùng yêu cầu rõ ràng: *"hãy tạo một bản copy riêng giữ lại file gốc"*.
