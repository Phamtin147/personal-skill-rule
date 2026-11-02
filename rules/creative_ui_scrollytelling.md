# Rule: Creative UI & Scrollytelling Standard (Awwwards & High-End Tech Specs)

Khi người dùng yêu cầu thiết kế giao diện web, landing page giới thiệu sản phẩm (Game, Phần mềm, SaaS, Phần cứng) hoặc web kể chuyện dạng cuộn (Scrollytelling / Interactive Web):

1. **Kiến trúc Chuyển động & Cuộn mượt (Animation Stack):**
   - **Scroll Animation:** Luôn ưu tiên dùng **GSAP + ScrollTrigger** (với `scrub: 1` để tạo quán tính tự nhiên, `pin: true` cho các cảnh dừng lại để xoay 3D / kể chuyện).
   - **Smooth Scroll:** Kết hợp **Lenis** để làm mượt chuyển động chuột, loại bỏ khựng giật.
   - **3D / Canvas:** Dùng **Three.js** (hoặc React Three Fiber) hoặc nhúng **Spline Runtime** khi có mô hình 3D xoay lật.

2. **Kỷ luật Hiệu năng GPU (Strict Performance Rules):**
   - **Transform & Opacity Only:** Chỉ cho phép animate các thuộc tính `translate3d`, `scale`, `rotate3d` và `opacity`. Tuyệt đối không animate `top`, `left`, `width`, `height`, `margin` khi cuộn chuột để tránh giật lag render (Layout Thrashing).
   - **Zero Scroll Hijacking:** Tuyệt đối không khóa chết thanh cuộn trình duyệt (`overflow: hidden` trên body) gây ức chế cho người dùng.
   - **Dọn dẹp bộ nhớ (Memory Cleanup):** Luôn hủy (`kill()`) các instance ScrollTrigger và giải phóng (`dispose()`) Three.js textures/geometries khi unmount component.
   - **Tối ưu Mobile (< 768px):** Tự động tắt shader/3D nặng trên điện thoại, chuyển sang hiệu ứng CSS Fade/Slide nhẹ nhàng.
