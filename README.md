# <img src="assets/icons/layers.svg" width="28" height="28" alt="layers" /> PERSONAL SKILL, RULE & AGENTIC WORKSPACE HUB
> **Tác giả**: [Amtia(NOFACE)](https://github.com/Phamtin147)  
> **Repository**: [https://github.com/Phamtin147/personal-skill-rule](https://github.com/Phamtin147/personal-skill-rule)  
> **Định nghĩa**: Hệ sinh thái toàn diện lưu trữ **81 Agent Skills độc lập (100% Standalone Full-Files)**, **Hệ thống Rule & Chuẩn mực Tự hành (Global Autonomous Rules)**, **Đồ thị tri thức Codebase (Graphify Knowledge Graph)**, và **Studio Phụ đề Anime Tự động hóa**.

---

## <img src="assets/icons/dashboard.svg" width="20" height="20" alt="dashboard" /> TỔNG QUAN HỆ THỐNG

Kho lưu trữ này được xây dựng theo chuẩn **100% Full Standalone Backup**: Mọi skill, rule, asset, font chữ và công cụ đều được sao lưu trọn vẹn tệp tin thực tế (không dùng symlink rỗng hay liên kết ngoài dễ mất), đảm bảo hệ thống có thể clone về và vận hành độc lập 100% trên bất kỳ máy tính mới nào.

```text
personal-skill-rule/
├── assets/                     # Bộ tài nguyên giao diện, icon Radix Icons chính thức
│   └── icons/                  # 20+ Vector Radix Icons chuẩn SVG sắc nét
├── skills/                     # KHO 81 SKILL TINH TUYỂN (BẢN FULL ĐỘC LẬP)
│   ├── agent-reach/            # Cào và tìm kiếm thông tin 14+ nền tảng (X, Reddit, Bilibili, YouTube, GitHub...)
│   ├── search-specialist/      # Nghiên cứu web nâng cao, đối soát chéo và xác thực thông tin
│   ├── ui-ux-pro-max/          # Trí tuệ thiết kế giao diện UI/UX Web, Mobile, Desktop
│   ├── design-taste-frontend/  # Tasteskill v2 chống giao diện AI vô hồn (anti-slop art direction)
│   ├── impeccable/             # Chuẩn mực thủ công cao cấp nhất (spacing, typography, edge cases)
│   ├── ui-styling/             # shadcn/ui, Radix UI, Tailwind CSS utilities
│   ├── ui-visual-validator/    # Kiểm thử giao diện trực quan, soi pixel và sai lệch thiết kế
│   ├── slides/                 # Tạo slide thuyết trình HTML 16:9 scroll-snap độc lập
│   ├── html-diagram/           # Vẽ sơ đồ kiến trúc full-screen SVG tương tác cao (html-effectiveness)
│   ├── graphify/               # Xây dựng đồ thị tri thức codebase & giảm 300x token context
│   ├── python-pro/             # Lập trình Python 3.12+, async, typing và kiến trúc chuẩn
│   ├── rust-pro/               # Rust idiomatic, Tokio async và an toàn bộ nhớ
│   ├── golang-pro/             # Go microservices, goroutines và concurrency patterns
│   ├── typescript-pro/         # TypeScript hệ type nâng cao, generics và clean architecture
│   ├── kubernetes-architect/   # Kiến trúc K8s, GitOps, Helm và Service Mesh
│   ├── anime-sub-specialist/   # Chuyên gia dịch thuật phụ đề Anime chuẩn văn phong Fansub Việt
│   ├── prm-flutter-firebase/   # Quy chuẩn hoàn thiện bài thi thực hành PRM Flutter + Firebase
│   └── ... (đầy đủ 81 skills chuyên sâu mọi lĩnh vực)
├── rules/                      # BỘ QUY TẮC TOÀN CỤC (GLOBAL AUTONOMOUS RULES)
│   ├── GEMINI_GLOBAL_RULES.md  # Quy tắc tối cao: Zero Option Modals, Full Automation, Auto-Graphify
│   ├── code_ui_craft_standard.md # Chuẩn mực đọc code qua Graphify, UI/UX Craft và Soi ảnh chụp
│   ├── ANIME_SUB_RULES.md      # Quy tắc dịch thuật, ma trận xưng hô chéo anime và ghi công
│   ├── PRM_EXAM_PROTOCOL.md    # Quy trình làm bài và nộp bài thi thực hành PRM392/393
│   └── creative_ui_scrollytelling.md # Chuẩn mực web cuộn scrollytelling Awwwards (GSAP + WebGL)
├── graphify-out/               # ĐỒ THỊ TRI THỨC CODEBASE TOÀN DIỆN
│   ├── graph.json              # 2.964 nodes, 6.096 edges, 173 cụm kiến trúc AST
│   └── manifest.json           # Danh mục định danh quan hệ toàn bộ kho lưu trữ
├── engine/                     # Bóc tách âm thanh và chép lời thoại Anime
│   ├── transcribe.py           # Core script: Demucs (tách nhạc) + Faster-Whisper (nhận diện giọng)
│   └── requirements.txt        # Danh sách thư viện PyTorch, CUDA, Whisper
├── docker/                     # Môi trường Docker GPU CUDA cho tác vụ nặng
├── notebooks/                  # Colab 1-click dùng GPU T4 miễn phí chạy transcribe
├── tools/                      # Bộ công cụ CLI xử lý phụ đề, remux và session monitor
└── prompts/ & templates/       # Mẫu prompt dịch thuật và cẩm nang bối cảnh phim
```

---

## <img src="assets/icons/file-text.svg" width="20" height="20" alt="rules" /> CÁC QUY TẮC CỐT LÕI (SYSTEM RULES ENFORCEMENT)

Toàn bộ các phiên làm việc của AI Agent kết nối với kho lưu trữ này đều tuân thủ nghiêm ngặt 5 trụ cột:

1. **Zero Option Modals & Full Automation**:
   - Nghiêm cấm hiển thị hộp thoại trắc nghiệm bắt người dùng chọn lựa. AI chủ động đưa ra giải pháp kỹ thuật tối ưu nhất và thực thi từ A đến Z.
2. **Auto-Graphify First (100% Bắt buộc cho mọi tác vụ)**:
   - Khi làm việc tại bất kỳ thư mục gốc nào (dù là dự án lớn hay viết script nhỏ), hành động đầu tiên **luôn luôn là tự động chạy `graphify`** để tạo hoặc cập nhật đồ thị tri thức `graphify-out/`.
   - Đọc hiểu cấu trúc, tìm kiếm file và phân tích quan hệ phụ thuộc hoàn toàn thông qua Graphify.
3. **Tiêu chuẩn UI/UX & Nghệ thuật Frontend (Anti-Slop)**:
   - 100% tác vụ giao diện phải áp dụng tư duy từ `ui-ux-pro-max`, `design-taste-frontend` (tasteskill v2) và `impeccable`.
   - **Quy chuẩn Icon Chuyên nghiệp**: Bắt buộc chỉ sử dụng các bộ icon chuẩn như **Radix Icons**, **Lucide Icons**, **Phosphor Icons**, **Tabler Icons**, hoặc **Heroicons**. Tuyệt đối không dùng icon SVG tự chế méo mó (AI slop) hay emoji giao diện.
4. **Kiểm thử & Soi ảnh trực quan (Visual Inspection Loop)**:
   - Sau khi hoàn thành code giao diện, bắt buộc phải chụp ảnh màn hình (screenshot render thực tế qua browser/công cụ kiểm thử) để tự kiểm tra độ tương phản, khoảng cách, font chữ và responsive trước khi kết thúc task.
5. **Sao lưu Toàn vẹn (100% Full Standalone Backup)**:
   - Khi push hoặc backup lên Git, bắt buộc dereference toàn bộ symlink thành file và thư mục thật. Không đẩy liên kết rỗng phòng trường hợp nguồn ngoài bị xóa.

---

## <img src="assets/icons/lightning-bolt.svg" width="20" height="20" alt="skills" /> DANH MỤC CÁC SKILL NỔI BẬT

### 1. <img src="assets/icons/magnifying-glass.svg" width="16" height="16" alt="search" /> Tìm kiếm, Cào dữ liệu & RAG
- **`agent-reach`**: Đọc và tìm kiếm thông tin chuyên sâu trên 14+ nền tảng có tường lửa/đăng nhập (X/Twitter, Reddit, Bilibili, YouTube, GitHub, V2EX, Xueqiu, LinkedIn, BOSS Zhipin...).
- **`search-specialist`**: Bậc thầy tra cứu thông tin đa nguồn, tối ưu toán tử tìm kiếm và đối soát tính xác thực.
- **`rag-implementation` & `hybrid-search-implementation`**: Kiến trúc tìm kiếm ngữ nghĩa kết hợp vector database và BM25 lexical search.

### 2. <img src="assets/icons/color-wheel.svg" width="16" height="16" alt="design" /> Thiết kế, Đồ họa & UI/UX
- **`ui-ux-pro-max` & `ui-ux-designer`**: Bố cục, phân cấp thị giác, token thiết kế và trải nghiệm người dùng cao cấp.
- **`design-taste-frontend` (tasteskill v2)**: Định hình phong cách nghệ thuật độc đáo dựa trên 247 curated design galleries danh tiếng.
- **`impeccable`**: Chuẩn mực hoàn thiện giao diện đỉnh cao, triệt tiêu mọi lỗi layout và edge cases.
- **`slides`**: Tạo slide thuyết trình HTML 16:9 scroll-snap tự động, hỗ trợ Dark/Light mode, slide counter và macOS code blocks.
- **`html-diagram`**: Tạo sơ đồ kiến trúc full-screen SVG tương tác cao dựa trên bộ thư viện `html-effectiveness`.

### 3. <img src="assets/icons/code.svg" width="16" height="16" alt="code" /> Ngôn ngữ Lập trình & Frameworks (Pro Tiers)
- **Python / APIs**: `python-pro`, `fastapi-pro`, `django-pro`, `uv-package-manager`.
- **TypeScript / Modern Web**: `typescript-pro`, `javascript-pro`, `nextjs-app-router-patterns`, `react-modernization`, `react-state-management`, `tailwind-design-system`.
- **Systems & Cloud-Native**: `rust-pro`, `rust-async-patterns`, `golang-pro`, `go-concurrency-patterns`, `cpp-pro`, `c-pro`, `bash-pro`, `posix-shell-pro`.
- **Mobile Development**: `flutter-expert`, `react-native-architecture`, `mobile-developer`, `frontend-mobile-development-component-scaffold`.

### 4. <img src="assets/icons/cube.svg" width="16" height="16" alt="architecture" /> Kiến trúc, DevOps & Database
- **Kiến trúc**: `architecture-patterns`, `microservices-patterns`, `api-design-principles`, `cqrs-implementation`, `c4-architecture-c4-architecture`.
- **DevOps & Hạ tầng**: `kubernetes-architect`, `k8s-manifest-generator`, `k8s-security-policies`, `github-actions-templates`, `terraform-module-library`.
- **Cơ sở dữ liệu**: `postgresql`, `sql-pro`, `vector-database-engineer`, `database-migrations-sql-migrations`.
- **Kiểm thử & Debug**: `debugger`, `error-detective`, `test-automator`, `tdd-workflows-tdd-cycle`, `e2e-testing-patterns`, `unit-testing-test-generate`, `prometheus-configuration`, `grafana-dashboards`.

---

## <img src="assets/icons/video.svg" width="20" height="20" alt="video" /> TÍCH HỢP STUDIO PHỤ ĐỀ ANIME TỰ ĐỘNG HÓA

Hệ thống tích hợp trọn gói pipeline chuyển đổi từ Anime Raw sang phụ đề tiếng Việt chất lượng cao:

```bash
# 1. Bóc tách âm thanh & nhận diện lời thoại tự động bằng Whisper GPU
docker compose run --rm transcribe "/videos/anime_raw.mkv" --model large-v3 --separate

# 2. Hoàn thiện phụ đề chuẩn Fansub (Zero Disk Bloat - không tốn dung lượng ổ cứng)
node tools/pipeline.js finish "/videos/anime_raw.mkv"
```

---

## <img src="assets/icons/badge.svg" width="20" height="20" alt="badge" /> BẢN QUYỀN & GHI CÔNG
Toàn bộ hệ thống kỹ năng, quy tắc và công cụ thuộc sở hữu của: **[Amtia(NOFACE)](https://github.com/Phamtin147)**.
Mọi mã nguồn và sản phẩm đầu ra từ hệ thống được bảo lưu bản quyền và định danh tác giả chính thức.
