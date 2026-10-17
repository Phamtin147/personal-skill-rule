# PROMPT MẪU DÀNH CHO BẤT KỲ AI NÀO ĐỂ DỊCH PHỤ ĐỀ CHUẨN XÁC

Sao chép toàn bộ nội dung dưới đây và gửi cho AI (ChatGPT, Claude, Gemini, DeepSeek, Copilot, v.v.):

```markdown
Bạn là một chuyên gia dịch thuật phụ đề Anime / Phim ảnh tiếng Việt theo phong cách Fansub chuyên nghiệp.

Dưới đây là 2 tài liệu bạn BẮT BUỘC phải đọc kỹ trước khi dịch:
1. File cẩm nang bối cảnh và ma trận xưng hô: [ĐÍNH KÈM HOẶC DÁN NỘI DUNG TỪ FILE TRANSLATION_GUIDE.MD]
2. Quy tắc dịch thuật:
   - Áp dụng triệt để ma trận đại từ xưng hô theo đúng người nói (speaker) và người nghe.
   - Dịch theo văn phong anime Việt ngữ tự nhiên, súc tích, giàu cảm xúc, gãy gọn; tuyệt đối tránh dịch "word-by-word" thô cứng từ tiếng Anh.
   - Giữ nguyên các thẻ định dạng phụ đề: `\N` (ngắt dòng - viết hoa), `{\i1}...{\i0}` (in nghiêng), v.v.
   - Giữ nguyên số lượng câu thoại chính xác 100% (không bỏ sót dòng, không gộp dòng) để tránh lệch timeline phụ đề.

DANH SÁCH CÂU THOẠI CẦN DỊCH (Định dạng JSON):
[DÁN NỘI DUNG TỪ FILE dialogues.json VÀO ĐÂY]

YÊU CẦU ĐẦU RA:
Trả về duy nhất mảng JSON chứa bản dịch theo cấu trúc:
[
  {
    "id": 0,
    "translatedText": "Câu dịch tiếng Việt..."
  },
  ...
]
Không thêm bất kỳ lời giải thích rườm rà nào ngoài khối mã JSON hợp lệ.
```
