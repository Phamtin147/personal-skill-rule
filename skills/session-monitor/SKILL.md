---
name: session-monitor
description: Giám sát thời gian thực các phiên làm việc (sessions/tasks) đang chạy trên Antigravity qua brain transcript, tự động theo dõi tiến độ, phát hiện trạng thái chờ duyệt (Proceed/Approve) hoặc tiếp quản chuyển giao công việc (handoff) sang phiên mới.
metadata:
  model: inherit
---

# Session Monitor & Task Handoff Specialist

Skill chuyên trách giám sát, theo dõi thời gian thực tiến độ các phiên làm việc (conversations/sessions) chạy song song trên Antigravity bằng cách phân tích trực tiếp nhật ký `transcript.jsonl` và trạng thái `plan.md` trong thư mục `~/.gemini/antigravity/brain/`.

---

## ⚡ KHI NÀO SỬ DỤNG SKILL NÀY

- Kiểm tra xem phiên làm việc khác (hoặc task chạy ngầm) đang chạy đến bước nào, dịch/xử lý đến file nào.
- Hẹn giờ định kỳ (`/schedule`) theo dõi một task dài (dịch phim, build, migration) và chỉ thông báo khi hoàn thành hoặc gặp sự cố.
- Tự động tiếp quản (Handoff): Theo dõi session cũ cho đến khi hoàn tất một giai đoạn, sau đó tự động kích hoạt giai đoạn tiếp theo ở session hiện tại mà người dùng không cần can thiệp.

---

## 🛠️ CÔNG CỤ CLI ĐI KÈM (Zero-Dependency Helper)

Hệ thống đi kèm công cụ CLI Node.js chuẩn xác và siêu nhanh:
```bash
node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js [command]
```

### Các lệnh phổ biến:
1. **Kiểm tra phiên đang chạy khác (Mặc định)**:
   ```bash
   node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js status
   ```
   *Tự động bỏ qua phiên hiện tại và hiển thị thông tin phiên đang hoạt động gần nhất.*

2. **Kiểm tra phiên theo từ khóa hoặc ID**:
   ```bash
   node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js status linh-lung
   node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js status 12f95bff
   ```

3. **Danh sách các phiên gần nhất**:
   ```bash
   node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js list
   ```

4. **Xem N bước log mới nhất của phiên đang chạy**:
   ```bash
   node /home/amtia/Projects/personal-skill-rule/tools/session_monitor.js tail 10
   ```

---

## 📋 3 QUY TRÌNH THỰC THI CHUẨN (STANDARD WORKFLOWS)

### Quy trình 1: Báo cáo nhanh tiến độ (Quick Status Check)
Khi người dùng hỏi: *"Session kia chạy đến đâu rồi?"*
1. Chạy `node tools/session_monitor.js status`.
2. Trích xuất thông tin: Trạng thái (đang gọi tool, đang tạo câu trả lời, hay chờ duyệt), công việc cụ thể đang làm, số bước đã thực hiện.
3. Báo cáo ngắn gọn, súc tích cho người dùng kèm link file kết quả thực tế trên ổ cứng (nếu có).

---

### Quy trình 2: Theo dõi định kỳ & Báo cáo khi xong (Continuous Watch)
Khi người dùng ra lệnh theo dõi định kỳ (kèm `/schedule`):
1. Thiết lập timer kiểm tra định kỳ (ví dụ mỗi 5 - 10 phút) bằng tool `schedule`.
2. Mỗi lần chuông báo thức kích hoạt:
   - Chạy `session_monitor.js status` để lấy trạng thái mới nhất.
   - Nếu session vẫn đang `RUNNING`, chỉ ghi nhận và tiếp tục hẹn giờ.
   - Nếu session chuyển sang `AWAITING APPROVAL` (nút Proceed) hoặc `COMPLETED / IDLE`: Gửi thông báo ngay lập tức cho người dùng biết giai đoạn đã hoàn tất.

---

### Quy trình 3: Tự động tiếp quản chuyển giao (Autonomous Handoff)
Khi người dùng yêu cầu: *"Theo dõi session X, khi nào xong giai đoạn thì chạy tiếp giai đoạn Y tại đây"*:
1. Xác định điều kiện kết thúc của session cũ (ví dụ: hoàn thành tập cuối của season, hoặc xuất hiện báo cáo tổng kết giai đoạn).
2. Định kỳ kiểm tra nhật ký `transcript.jsonl` của session cũ.
3. Ngay khi session cũ hoàn thành hoặc dừng lại:
   - Thông báo cho người dùng: *"Session trước đã hoàn thành [Giai đoạn 1]. Bắt đầu tiếp quản thực hiện [Giai đoạn 2] ngay bây giờ."*
   - Tự động nạp Skill nghiệp vụ tương ứng (ví dụ: `/anime-sub-specialist`) và thực thi tiếp giai đoạn kế tiếp một mạch, không gián đoạn.

---

## 🔍 NGUYÊN LÝ LẤY DỮ LIỆU TỪ BRAIN

```
~/.gemini/antigravity/brain/
└── <conversation-id>/
    ├── plan.md                       <- Kế hoạch tổng thể và checklist
    ├── plan.md.metadata.json         <- Trạng thái requestFeedback (nút Proceed/Approve)
    └── .system_generated/
        └── logs/
            ├── transcript.jsonl      <- Nhật ký toàn bộ turns, tool calls thời gian thực
            └── transcript_full.jsonl <- Chi tiết dữ liệu đầy đủ
```
Skill đọc trực tiếp các tệp này ở tầng hệ điều hành nên luôn cập nhật tức thời 100% mà không gây ảnh hưởng hay chiếm dụng tài nguyên của phiên đang chạy.
