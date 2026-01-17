# Hướng Dẫn Quản Trị Website LaDu Flower

Tài liệu này hướng dẫn cách sử dụng trang quản trị (Keystatic) để cập nhật hình ảnh và nội dung cho website LaDu Flower.

**Đường dẫn quản trị:** `https://laduflower.vercel.app/keystatic`

---

## 1. Đăng Nhập
1. Truy cập đường dẫn trên.
2. Nhấn nút **"Login with GitHub"**.
3. Đăng nhập bằng tài khoản GitHub được cấp quyền.

---

## 2. Quản Lý Bộ Sưu Tập (Gallery)

### Thêm ảnh mới vào bộ sưu tập
1. Chọn menu **"Gallery Categories"** bên trái.
2. Chọn danh mục muốn sửa (ví dụ: *Giỏ Hoa*).
3. Kéo xuống phần **"Images"**.
4. Nhấn nút **"Add"** (hoặc nút +) để thêm ảnh mới.
5. **Quan trọng - Nhập thông tin:**
   - **Image**: Upload ảnh từ máy tính (Nên dùng ảnh JPG/PNG, dung lượng < 2MB để tải nhanh).
   - **Mô tả ảnh cho SEO**: Nhập ngắn gọn nội dung ảnh (ví dụ: "Giỏ hoa hồng phấn tặng sinh nhật"). *Việc này giúp Google hiểu nội dung ảnh.*
   - **Order (Thứ tự)**:
     - ⚠️ **Lưu ý:** Hệ thống KHÔNG tự động điền số thứ tự tiếp theo.
     - Bạn hãy nhìn số thứ tự của ảnh liền trước (ví dụ 5), và nhập số tiếp theo cho ảnh mới (là 6).
     - Ảnh sẽ được sắp xếp hiển thị từ nhỏ đến lớn (1, 2, 3...).

6. **Lưu thay đổi:**
   - Sau khi thêm xong, nhìn lên góc phải trên cùng.
   - Nhấn nút **Create** (nếu tạo mới) hoặc **Save** (nếu sửa).

---

## 3. Quản Lý Nội Dung Chung
Để sửa thông tin như Tiêu đề trang, Số điện thoại, Link Facebook...
1. Chọn menu **"Site Content"** bên trái.
2. Sửa các nội dung trong các mục:
   - **Site**: Tên trang web, slogan.
   - **Contact**: Link Facebook, TikTok...
3. Nhấn **Save** để lưu.

---

## 4. Lưu ý quan trọng khi cập nhật

1.  **Chờ 1-2 phút:**
    Sau khi bạn nhấn **Save**, hệ thống sẽ tự động "xây dựng" (build) lại trang web để cập nhật nội dung mới.
    - Quá trình này mất khoảng **1 đến 2 phút**.
    - Sau đó bạn truy cập trang chủ `laduflower.vercel.app` và nhấn F5 (Refresh) để thấy thay đổi.

2.  **Đặt tên file ảnh:**
    - Nên đặt tên ảnh không dấu, cách nhau bằng gạch ngang.
    - Ví dụ: `hoa-hong-do-dep.jpg` (Tốt), `IMG_1234.JPG` (Không tốt cho SEO), `Hoa Hồng.jpg` (Không nên).

3.  **Backup:**
    Toàn bộ dữ liệu được lưu an toàn trên GitHub, bạn không cần lo mất dữ liệu khi tắt máy.