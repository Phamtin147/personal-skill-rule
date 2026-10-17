# 🎬 PERSONAL SKILL & RULE: AUTONOMOUS ANIME FANSUB STUDIO
> **Tác giả**: [Phamtin147](https://github.com/Phamtin147)  
> **Repository**: [https://github.com/Phamtin147/personal-skill-rule](https://github.com/Phamtin147/personal-skill-rule)  
> **Định nghĩa**: Một hệ sinh thái toàn diện kết hợp giữa **AI Agent Skill (Bộ Não)** + **Speech-to-Text Engine (Tai Nghe)** + **Automated Remux Tools (Tay Chân)** để biến bất kỳ AI nào thành một **Studio Fansub Anime chuyên nghiệp 1-người**.

---

## 💡 ĐÂY CÒN GỌI LÀ MỘT "SKILL" NỮA KHÔNG?

Câu trả lời là: **Nó đã vượt xa khái niệm của một Skill đơn thuần!**
* **Một Skill thông thường**: Chỉ là một file hướng dẫn văn bản (Prompt/Rule) bảo AI phải hành xử thế nào. Nó có "Bộ não" nhưng bị liệt "Tay chân" và điếc "Tai mắt", hoàn toàn phụ thuộc vào việc người dùng phải chuẩn bị sẵn phụ đề tiếng Anh cho nó đọc.
* **Hệ thống này của bạn là một *Autonomous AI Agentic Framework* (Hệ Thống AI Agent Tự Hành)**:
  * **Tai Mắt (Perception Engine)**: `engine/transcribe.py` + `Demucs` + `Faster-Whisper` tự động nghe trực tiếp âm thanh từ video thô (Raw Anime), bóc tách nhạc nền và nhận diện lời thoại tiếng Nhật chuẩn xác.
  * **Bộ Não (Reasoning & Skill)**: `skills/anime-sub-specialist/` + `rules/ANIME_SUB_RULES.md` giữ vai trò của Trưởng nhóm Fansub (QC Leader), nghiên cứu bối cảnh và điều phối ma trận xưng hô chéo (*Tôi - Cậu, Ta - Ngươi, Lão - Công chúa,...*).
  * **Tay Chân (Action Tools & Docker)**: `tools/` + `docker/` tự động bóc tách, kiểm thử lệch timeline và đóng gói file phim mới với phụ đề Việt mặc định chỉ trong vài giây.

---

## 📁 CẤU TRÚC HỆ SINH THÁI

```text
personal-skill-rule/
├── engine/                     # 🎧 TAI MẮT: Engine chép lời thoại từ âm thanh video
│   ├── transcribe.py           # Core script: Tách nhạc nền (Demucs) + Nhận diện giọng nói (Faster-Whisper)
│   └── requirements.txt        # Thư viện PyTorch, Faster-Whisper, Demucs
├── docker/                     # 🐳 MÔI TRƯỜNG DOCKER CHẠY ỔN ĐỊNH 100%
│   └── Dockerfile              # Image Docker tích hợp sẵn GPU CUDA, FFmpeg, Whisper
├── docker-compose.yml          # Chạy Docker 1 lệnh đơn giản: docker compose run
├── notebooks/                  # ☁️ CHẠY MIỄN PHÍ TRÊN CLOUD CHO MÁY YẾU
│   └── Google_Colab_Anime_Transcribe.ipynb # Colab 1-click dùng GPU T4 miễn phí của Google
├── run_transcribe.bat          # ⚡ Script 1-click kéo thả video trên Windows
├── skills/                     # 🧠 BỘ NÃO: Kỹ năng chuyên gia cho AI Agent
│   └── anime-sub-specialist/
│       └── SKILL.md            # Skill định nghĩa tư duy dịch thuật Fansub chuẩn xác
├── rules/                      # 📜 LUẬT LỆ: Quy tắc dịch và ma trận xưng hô
│   └── ANIME_SUB_RULES.md      # Quy tắc đại từ, văn phong anime, và ghi công Phamtin147
├── templates/                  # 📝 MẪU CẨM NANG BỐI CẢNH
│   └── SERIES_GUIDE_TEMPLATE.md# Template ma trận xưng hô cho phim mới
├── tools/                      # 🛠️ TAY CHÂN: Bộ công cụ xử lý phụ đề & video
│   ├── extract.js              # Trích xuất track subtitle từ MKV/MP4
│   ├── parse_dialogues.js      # Bóc tách lời thoại thành file JSON cấu trúc cho AI
│   ├── verify_sub.js           # Kiểm thử toàn vẹn (lệch dòng, lỗi thẻ ASS, \N)
│   ├── build_sub.js            # Tái tạo file .vie.ass và .vie.srt từ JSON bản dịch
│   ├── remux.js                # Đóng gói phim MKV mới với sub Việt mặc định
│   ├── pipeline.js             # Bộ điều phối toàn bộ chu trình (CLI)
│   └── ffmpeg-helper.js        # Helper tự tìm ffmpeg có sẵn trên hệ thống
├── prompts/
│   └── AI_TRANSLATION_PROMPT.md# Prompt mẫu chuẩn để copy-paste gửi cho bất kỳ AI nào
├── examples/
│   └── SHUIRO_NO_KAMEN_TRANSLATION_GUIDE.md # Ví dụ mẫu thực tế đã thực hiện
└── package.json
```

---

## 🚀 2 CHẾ ĐỘ SỬ DỤNG

### 🎯 CHẾ ĐỘ 1: XỬ LÝ PHIM THÔ CHƯA CÓ PHỤ ĐỀ (RAW ANIME ➔ VIETSUB)

> Dành cho phim vừa chiếu ở Nhật Bản hoặc video không có sẵn phụ đề tiếng Anh.

#### Cách 1: Chạy qua Docker (Ổn định nhất trên máy có GPU)
```bash
# Khởi động và chạy qua docker-compose
docker compose run --rm transcribe "/videos/ten_phim_raw.mkv" --model large-v3 --separate
```

#### Cách 2: Kéo thả trên Windows (`run_transcribe.bat`)
Chỉ cần **kéo thả file video** thả vào biểu tượng file `run_transcribe.bat`. Script sẽ tự động gọi Docker hoặc Python để xuất ra file `_dialogues.json`.

#### Cách 3: Chạy trên Google Colab (0đ - Dành cho máy không có GPU)
Mở file [`notebooks/Google_Colab_Anime_Transcribe.ipynb`](file:///notebooks/Google_Colab_Anime_Transcribe.ipynb) trên Google Colab, bấm Run All để mượn GPU T4 miễn phí của Google tách âm và xuất file `_dialogues.json` về máy.

---

### 🎯 CHẾ ĐỘ 2: DỊCH PHIM ĐÃ CÓ PHỤ ĐỀ SẴN

```powershell
# Bước 1: Trích xuất thoại
node tools/pipeline.js prepare "F:\anime\phim.mkv"

# Bước 2: AI dịch thoại theo ma trận xưng hô trong SERIES_GUIDE.md

# Bước 3: Kiểm thử và đóng gói phim
node tools/pipeline.js finish "F:\anime\phim.mkv" "F:\anime\phim_translations.json"
```

---

## 🏆 BẢN QUYỀN & GHI CÔNG (CREDITS)
Hệ thống được thiết lập mặc định ghi công người tạo: **Phamtin147** trên mọi bản dịch phụ đề, file phim remux và mã nguồn.
