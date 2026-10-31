# 🎬 PERSONAL SKILL & RULE: AUTONOMOUS ANIME FANSUB STUDIO
> **Tác giả**: [Amtia(NOFACE)](https://99)  
> **Repository**: [https://145/personal-skill-rule](https://189/personal-skill-rule)  
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
│   ├── anime-sub-specialist/
│   │   └── SKILL.md            # Skill định nghĩa tư duy dịch thuật Fansub chuẩn xác
│   ├── session-monitor/
│   │   └── SKILL.md            # Giám sát & tiếp quản session chạy ngầm trên Antigravity
│   ├── slides/
│   │   └── SKILL.md            # Tạo slide HTML 16:9 scroll-snap & Markdown dàn ý chuẩn
│   ├── presentation-slides/
│   │   └── SKILL.md            # Quy chuẩn thiết kế slide thuyết trình chuyên nghiệp
│   └── graphify/
│       └── SKILL.md            # Xây dựng Knowledge Graph codebase & giảm ~300x token cho AI Agent
├── rules/                      # 📜 LUẬT LỆ: Quy tắc dịch và ma trận xưng hô
│   ├── ANIME_SUB_RULES.md      # Quy tắc đại từ, văn phong anime, và ghi công Amtia(NOFACE)
│   ├── PRM_EXAM_PROTOCOL.md    # Quy trình thi thực hành PRM392/393 Flutter & Firebase
│   └── GRAPHIFY_RULE.md        # Rule ưu tiên đọc Knowledge Graph trước khi quét codebase
├── templates/                  # 📝 MẪU CẨM NANG BỐI CẢNH
│   └── SERIES_GUIDE_TEMPLATE.md# Template ma trận xưng hô cho phim mới
├── tools/                      # 🛠️ TAY CHÂN: Bộ công cụ xử lý phụ đề & video
│   ├── extract.js              # Trích xuất track subtitle từ MKV/MP4
│   ├── parse_dialogues.js      # Bóc tách lời thoại thành file JSON cấu trúc cho AI
│   ├── verify_sub.js           # Kiểm thử toàn vẹn (lệch dòng, lỗi thẻ ASS, \N)
│   ├── build_sub.js            # Tái tạo file .vie.ass và .vie.srt từ JSON bản dịch
│   ├── remux.js                # Đóng gói phim MKV mới với sub Việt mặc định
│   ├── pipeline.js             # Bộ điều phối toàn bộ chu trình (CLI)
│   ├── session_monitor.js      # Giám sát & trích xuất log brain của các session Antigravity
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
Mở file [`notebooks/Google_Colab_Anime_Transcribe.ipynb`](notebooks/Google_Colab_Anime_Transcribe.ipynb) trên Google Colab, bấm Run All để mượn GPU T4 miễn phí của Google tách âm và xuất file `_dialogues.json` về máy.

---

### 🎯 CHẾ ĐỘ 2: HOÀN THIỆN & XUẤT SUB BẢO VỆ Ổ CỨNG (ZERO DISK BLOAT)

> 🛡️ **Tối ưu dung lượng 100%**: Tuyệt đối không sinh ra file video copy trùng lặp làm tốn dung lượng ổ đĩa hay lỗi torrent seeding trên qBittorrent.

#### 1. Mặc định (Khuyến nghị số 1 - Softsub External):
```bash
node tools/pipeline.js finish "F:\anime\video.mkv"
```
* **Kết quả**: Tạo file `video.vie.ass`, `video.ass` và `video.vie.srt` ngay cạnh file video gốc.
* **Dung lượng**: Chỉ tốn **~30KB - 50KB** (0MB video phát sinh).
* **Trình phát**: Mở `video.mkv` trên **MPC-HC** hoặc **VLC** sẽ tự động nạp phụ đề Việt ngay lập tức!
* **Torrent**: File gốc nguyên vẹn 100%, tiếp tục seed torrent bình thường.

#### 2. Đóng gói MKV 1 File duy nhất (In-Place Replace):
```bash
node tools/pipeline.js finish "F:\anime\video.mkv" --remux
# hoặc gọi trực tiếp công cụ remux:
node tools/remux.js "F:\anime\video.mkv" "F:\anime\video.vie.ass" --replace
```
* **Cơ chế an toàn**: Remux ra file tạm, kiểm tra toàn vẹn, sau đó thay thế file gốc cũ.
* **Kết quả**: Thư mục luôn **chỉ có 1 file video duy nhất**, không bị nhân đôi dung lượng ổ cứng!

#### 3. Xuất file bản sao riêng biệt (`--copy`):
```bash
node tools/pipeline.js finish "F:\anime\video.mkv" --remux --copy
```
* Chỉ dùng khi bạn muốn tạo riêng một file `[Tên_phim]_vi.mkv` độc lập và giữ nguyên file gốc ban đầu.

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT CHI TIẾT TỪ A-Z (SETUP GUIDE)

Bạn có thể chọn 1 trong 3 cách cài đặt sau tùy theo sở thích và cấu hình máy:

### 🟢 LỰA CHỌN 1: CÀI ĐẶT BẰNG DOCKER (KHUYÊN DÙNG - CỰC KỲ ỔN ĐỊNH)
* **Ưu điểm**: Không bao giờ lo xung đột thư viện Python, chạy được cả GPU CUDA, tự động bật khi dùng và tắt sạch khi xong để không tốn RAM.
* **Các bước chuẩn bị**:
  1. Tải và cài đặt [Docker Desktop cho Windows](https://www.docker.com/products/docker-desktop/).
  2. Bật tính năng **WSL 2 backend** trong Docker Settings.
  3. (Nếu có card NVIDIA): Cài đặt [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) để Docker nhận card đồ họa.
  4. Mở PowerShell tại thư mục dự án và build image:
     ```powershell
     docker compose build
     ```
  5. **Cơ chế tự động**: Khi chạy lệnh dịch, hệ thống sẽ tự động bật container để chép lời, và ngay khi hoàn tất sẽ tự chạy `docker compose down` để giải phóng 100% tài nguyên RAM/VRAM cho máy tính của bạn!

---

### 🟡 LỰA CHỌN 2: CÀI ĐẶT PYTHON NATIVE TRỰC TIẾP TRÊN WINDOWS
* **Ưu điểm**: Chạy trực tiếp không cần ảo hóa Docker.
* **Các bước thực hiện**:
  1. Tải và cài đặt **Python 3.10 hoặc 3.11** (nhớ tích chọn *Add Python to PATH*).
  2. Cài đặt PyTorch hỗ trợ GPU CUDA:
     ```powershell
     pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
     ```
  3. Cài đặt các thư viện lõi của engine:
     ```powershell
     pip install -r engine/requirements.txt
     ```
  4. Cài đặt [FFmpeg](https://ffmpeg.org/download.html) và thêm vào biến môi trường PATH.

---

### 🔵 LỰA CHỌN 3: DÙNG GOOGLE COLAB (0 CẦN CÀI ĐẶT TRÊN MÁY - MIỄN PHÍ 100%)
* **Ưu điểm**: Máy yếu, laptop văn phòng không có card đồ họa vẫn "quất" mượt mà nhờ mượn card T4 GPU miễn phí của Google trên trình duyệt.
* **Các bước thực hiện**:
  1. Đăng nhập [Google Colab](https://colab.research.google.com/).
  2. Tải file [`notebooks/Google_Colab_Anime_Transcribe.ipynb`](notebooks/Google_Colab_Anime_Transcribe.ipynb) lên.
  3. Chọn menu **Runtime** ➔ **Change runtime type** ➔ Chọn **T4 GPU**.
  4. Bấm **Run All**, tải file video lên, chờ 2 phút và tải về file `_dialogues.json` để dịch!

---

## 🛰️ SKILL: SESSION MONITOR & TASK HANDOFF (`skills/session-monitor`)

Giám sát thời gian thực các phiên làm việc đang chạy trên Antigravity qua nhật ký `transcript.jsonl` trong `~/.gemini/antigravity/brain/`:

```bash
# Kiểm tra phiên đang chạy gần nhất
node tools/session_monitor.js status

# Xem danh sách các phiên gần đây
node tools/session_monitor.js list

# Xem 10 bước log mới nhất của phiên đang hoạt động
node tools/session_monitor.js tail 10

# Kiểm tra phiên theo từ khóa hoặc ID
node tools/session_monitor.js status linh-lung
```

---

## 🕸️ SKILL & RULE: GRAPHIFY KNOWLEDGE GRAPH (`skills/graphify` & `rules/GRAPHIFY_RULE.md`)

Tự động biến toàn bộ codebase thành đồ thị tri thức (Knowledge Graph) trực quan kèm báo cáo `GRAPH_REPORT.md` và Wiki, giúp AI Agent nắm bắt toàn bộ kiến trúc ngay lập tức và **tiết kiệm ~250x – 300x lượng token** mỗi truy vấn:

```bash
# Cài đặt rule & skill cho Antigravity trong dự án bất kỳ
graphify antigravity install

# Cập nhật đồ thị AST và xuất HTML + Call-flow + Wiki
graphify update . --force
graphify export html
graphify export callflow-html
graphify export wiki

# Đo lường mức giảm thiểu token
graphify benchmark graphify-out/graph.json
```

---

## 🏆 BẢN QUYỀN & GHI CÔNG (CREDITS)
Hệ thống được thiết lập mặc định ghi công người tạo: **Amtia(NOFACE)** trên mọi bản dịch phụ đề, file phim remux và mã nguồn.

