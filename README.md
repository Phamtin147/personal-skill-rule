# 🎬 ANIME SUB TOOLKIT & SPECIALIST PIPELINE

> **Bộ công cụ và phương pháp luận dịch phụ đề Anime / Phim ảnh tiếng Việt chuẩn phong cách Fansub chuyên nghiệp.**  
> Tự động trích xuất, phân tích bối cảnh, thiết lập ma trận đại từ xưng hô, kiểm thử tính toàn vẹn 100% và đóng gói video có phụ đề tích hợp.

---

## 🌟 TẠI SAO BẢN DỊCH NÀY KHÁC BIỆT?

Hầu hết các công cụ dịch tự động hoặc AI thông thường đều thất bại khi dịch Anime vì:
1. **Tiếng Anh chỉ có *I/You***, trong khi tiếng Việt có hàng chục cách xưng hô (*Tôi - Cậu, Ta - Ngươi, Con - Mẹ, Lão - Công chúa, Thuộc hạ - Đại nhân,...*).
2. Dịch thô từng từ (*Literal Translation*) làm mất đi nhịp điệu và cảm xúc của nhân vật.
3. Không giữ được định dạng phụ đề ASS (`\N`, `{\i}`, màu sắc, bảng hiệu), dẫn đến lỗi hiển thị hoặc lệch timeline.

**Anime Sub Toolkit** giải quyết triệt để vấn đề này bằng **Quy trình 6 bước khép kín** kết hợp giữa **Nghiên cứu bối cảnh (`search-specialist`)** + **Ma trận xưng hô (Pronoun Matrix)** + **Công cụ tự động hóa Node.js/FFmpeg**.

---

## 📁 CẤU TRÚC THƯ MỤC

```text
anime-sub-toolkit/
├── skills/
│   └── anime-sub-specialist/
│       └── SKILL.md            # Skill định nghĩa năng lực chuyên gia cho AI (Claude, Antigravity,...)
├── rules/
│   └── ANIME_SUB_RULES.md      # Bộ quy tắc vàng dịch thuật và văn phong Fansub Việt Nam
├── templates/
│   └── SERIES_GUIDE_TEMPLATE.md# Mẫu cẩm nang bối cảnh & ma trận xưng hô cho phim mới
├── tools/                      # Bộ công cụ tự động hóa chạy bằng Node.js & FFmpeg
│   ├── extract.js              # Trích xuất track subtitle từ MKV/MP4
│   ├── parse_dialogues.js      # Bóc tách lời thoại thành file JSON cấu trúc cho AI
│   ├── verify_sub.js           # Kiểm thử toàn vẹn (lệch dòng, lỗi thẻ ASS, \N)
│   ├── build_sub.js            # Tái tạo file .vie.ass và .vie.srt từ JSON bản dịch
│   ├── remux.js                # Đóng gói phim MKV mới với sub Việt mặc định
│   ├── pipeline.js             # Bộ điều phối toàn bộ quy trình tự động (CLI)
│   └── ffmpeg-helper.js        # Helper tự tìm ffmpeg có sẵn trên hệ thống
├── prompts/
│   └── AI_TRANSLATION_PROMPT.md# Prompt mẫu chuẩn để copy-paste gửi cho bất kỳ AI nào
├── examples/
│   └── SHUIRO_NO_KAMEN_TRANSLATION_GUIDE.md # Ví dụ thực tế từ bộ phim Shuiro no Kamen
└── package.json
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG CHO BỘ PHIM MỚI

Bạn có thể áp dụng quy trình này theo 2 cách: **Nhờ AI tự động hoàn toàn** hoặc **Tự chạy công cụ kết hợp với Chat AI**.

### CÁCH 1: NHỜ AI TỰ ĐỘNG LÀM TẤT CẢ (Khuyên dùng với Antigravity / Cursor / Claude)

Chỉ cần đưa file phim vào và yêu cầu AI:
> *"Hãy dùng skill trong thư mục `anime-sub-toolkit` để nghiên cứu bối cảnh, lập file `[TÊN_PHIM]_TRANSLATION_GUIDE.md` và dịch phụ đề cho file phim `duong_dan_phim.mkv` sang tiếng Việt."*

AI sẽ tự động:
1. Chạy `tools/extract.js` và `tools/parse_dialogues.js`.
2. Dùng kỹ năng `search-specialist` để tra cứu tác giả, nhân vật, tuổi tác, quan hệ.
3. Tạo file `[TÊN_PHIM]_TRANSLATION_GUIDE.md`.
4. Dịch thoại áp dụng 100% ma trận xưng hô.
5. Chạy `tools/verify_sub.js` và `tools/build_sub.js` tạo ra `.vie.ass` và `.vie.srt`.
6. Chạy `tools/remux.js` để đóng gói ra video hoàn chỉnh!

---

### CÁCH 2: TỰ CHẠY BẰNG DÒNG LỆNH (Áp dụng với ChatGPT, Claude Web, DeepSeek,...)

#### Bước 1: Chuẩn bị dữ liệu thoại
Mở PowerShell/Terminal tại thư mục `anime-sub-toolkit`:
```powershell
node tools/pipeline.js prepare "F:\anime\Ten_Phim_Tap_01.mkv"
```
Lệnh này sẽ tự động:
* Trích xuất file phụ đề gốc: `Ten_Phim_Tap_01_extracted.ass`.
* Tạo file JSON chứa toàn bộ thoại: `Ten_Phim_Tap_01_dialogues.json`.

#### Bước 2: Tạo cẩm nang xưng hô (Chỉ làm 1 lần cho mỗi bộ phim)
* Copy file `templates/SERIES_GUIDE_TEMPLATE.md` thành `[TEN_PHIM]_TRANSLATION_GUIDE.md`.
* Tra cứu thông tin nhân vật hoặc nhờ AI điền giúp hồ sơ nhân vật + ma trận xưng hô.

#### Bước 3: Gửi cho AI dịch
* Mở file `prompts/AI_TRANSLATION_PROMPT.md`, copy toàn bộ nội dung prompt.
* Dán kèm nội dung file `[TEN_PHIM]_TRANSLATION_GUIDE.md` và file `Ten_Phim_Tap_01_dialogues.json`.
* Nhận kết quả mảng JSON từ AI và lưu vào file `Ten_Phim_Tap_01_translations.json`.

#### Bước 4: Kiểm thử và Đóng gói tự động
Chạy lệnh kết thúc:
```powershell
node tools/pipeline.js finish "F:\anime\Ten_Phim_Tap_01.mkv" "F:\anime\Ten_Phim_Tap_01_translations.json"
```
Hệ thống sẽ:
1. **Kiểm tra QA**: Xác nhận 100% số dòng khớp nhau, không có lỗi tag.
2. **Xuất phụ đề**: Tạo file `Ten_Phim_Tap_01.vie.ass` và `Ten_Phim_Tap_01.vie.srt`.
3. **Remux phim**: Tạo file `Ten_Phim_Tap_01_vi.mkv` có phụ đề tiếng Việt mặc định trong vài giây!

---

## 📚 TÀI LIỆU THAM KHẢO & QUY TẮC
* Đọc [ANIME_SUB_RULES.md](file:///rules/ANIME_SUB_RULES.md) để hiểu sâu về cách lựa chọn đại từ nhân xưng và bản địa hóa ngữ cảnh.
* Tham khảo [SHUIRO_NO_KAMEN_TRANSLATION_GUIDE.md](file:///examples/SHUIRO_NO_KAMEN_TRANSLATION_GUIDE.md) để xem một cẩm nang mẫu hoàn chỉnh.
