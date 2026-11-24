# Hướng dẫn Kết nối Google Form, Google Sheet & Google Drive — Nhà hàng Mộc Giang

Tài liệu này hướng dẫn chi tiết cách vận hành hệ thống **Nhập phiếu chi & Ảnh chụp minh chứng** tự động cập nhật lên biểu đồ **Chi phí cố định** và **Chi phí biến động** của **Nhà hàng Mộc Giang (199 Hoàng Cầu, Đống Đa, Hà Nội)**.

---

## 1. Tài nguyên Google Drive & Google Sheet đã được khởi tạo sẵn

Hệ thống đã tạo sẵn trên tài khoản Google (`minhdq.hrt@gmail.com`) của bạn:

1. **Bảng tính Google Sheet (`Mộc Giang - Quản Lý Chi Phí (Google Form Responses)`)**:
   - **Spreadsheet ID**: `14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE`
   - **Đường dẫn mở trực tiếp**: [https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit](https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit)
   - Đã tạo sẵn 9 cột chuẩn (`A1:I1`):
     `Dấu thời gian | Họ và tên | Ngày chi | Số tiền (VNĐ) | Ảnh chụp minh chứng | Loại chi phí | Danh mục chi phí cố định | Danh mục chi phí biến động | Ghi chú`
   - Đã nạp sẵn 32 dòng dữ liệu mẫu thực tế (ví dụ: `9 800 000`, `5 800 000`, `3 900 000`, `1 000 000`, `20 000` VNĐ...).

2. **Thư mục Google Drive lưu ảnh minh chứng (`Mộc Giang - Ảnh Minh Chứng Chi Phí`)**:
   - **Folder ID**: `1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2`
   - **Đường dẫn mở trực tiếp**: [https://drive.google.com/drive/folders/1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2](https://drive.google.com/drive/folders/1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2)

---

## 2. Cách tạo tự động Google Form rẽ nhánh (Chỉ với 1 cú nhấp chuột)

Bạn không cần tạo từng câu hỏi thủ công trên Google Form. File [`Code.gs`](./Code.gs) đã lập trình sẵn hàm `setupMocGiangExpenseForm()` để tự động sinh Google Form có rẽ nhánh và gắn trực tiếp vào Google Sheet trên:

1. Mở Google Sheet: [https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit](https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit)
2. Trên thanh menu, chọn **Tiện ích mở rộng (Extensions)** → **Apps Script**.
3. Xóa mã mặc định trong trình soạn thảo, mở file [`google-apps-script/Code.gs`](./Code.gs), copy toàn bộ nội dung dán vào và nhấn **Ctrl + S** (Lưu).
4. Trên thanh công cụ Apps Script, chọn hàm **`setupMocGiangExpenseForm`** rồi bấm **Chạy (Run)** (cấp quyền truy cập Google Form / Sheet / Drive lần đầu nếu Google hỏi).
5. Xem phần **Nhật ký thực thi (Execution Log)** ở phía dưới:
   - Hệ thống sẽ in ra **`Link điền Form (Published URL)`** và **`Link chỉnh sửa Form (Edit URL)`**.
   - Google Form được tạo tự động sẽ có đúng cấu trúc 3 phần rẽ nhánh:
     - **Phần 1**:
       - `Họ và tên`
       - `Ngày phát sinh`
       - `Số tiền (Đơn vị: VNĐ — ví dụ: 20 000, 1 000 000)` *(cho phép nhập dấu cách phân tách hàng nghìn)*
       - `Ảnh chụp minh chứng` *(có thể bật câu hỏi "Tải tệp lên / File Upload" trong giao diện Edit Form để ảnh tự lưu vào Google Drive)*
       - `Phân loại chi phí`:
         - Chọn **`Chi phí cố định`** → Tự động chuyển sang **Phần 2** (5 danh mục cố định: *Thuê mặt bằng (199 Hoàng Cầu)*, *Lương nhân sự cố định (Bếp & Quản lý)*, *Khấu hao thiết bị & Bảo trì định kỳ*, *Phần mềm POS, Internet & Bản quyền*, *Bảo hiểm, An ninh & Vệ sinh cố định*).
         - Chọn **`Chi phí biến động`** → Tự động chuyển sang **Phần 3** (3 danh mục biến động: *Suất cơm*, *Đồ uống*, *Bánh bao*).

---

## 3. Triển khai Web App API để đồng bộ 2 chiều với Website Dashboard

Để Website Dashboard Mộc Giang tự động đọc dữ liệu thời gian thực và tải ảnh chụp hóa đơn trực tiếp lên Google Drive:

1. Trong cửa sổ **Apps Script** vừa dán `Code.gs`, nhấn nút **Triển khai (Deploy)** ở góc phải trên cùng → **Tùy chọn triển khai mới (New deployment)**.
2. Nhấn biểu tượng bánh răng chọn loại **Ứng dụng web (Web app)**:
   - **Thực thi dưới dạng (Execute as)**: `Tôi (minhdq.hrt@gmail.com)`
   - **Ai có quyền truy cập (Who has access)**: `Bất kỳ ai (Anyone)`
3. Nhấn **Triển khai (Deploy)** và sao chép **URL ứng dụng web (Web App URL)** (có dạng `https://script.google.com/macros/s/.../exec`).
4. Mở trang web **Quản trị Nhà hàng Mộc Giang** → Vào mục **Chi phí cố định** hoặc **Chi phí biến động** → Nhấn nút **"Cấu hình Google Form & Sheet"** → Dán **Web App URL** và **Google Form URL** vào rồi bấm **Lưu & Đồng bộ**.

---

## 4. Quy tắc quy đổi Đơn vị VNĐ sang Triệu VNĐ trên Biểu đồ

- **Khi nhập trên Form**: Nhân sự nhập số tiền theo đơn vị **VNĐ** có dấu cách hoặc dấu chấm phân tách hàng nghìn để dễ nhìn:
  - Ví dụ 1: Nhập `20 000` (hai mươi nghìn đồng) → Hệ thống ghi nhận `20 000 VNĐ` và quy đổi thành **`0,02 Triệu VNĐ`** (`20000 / 1000000`).
  - Ví dụ 2: Nhập `1 000 000` (một triệu đồng) → Hệ thống ghi nhận `1 000 000 VNĐ` và quy đổi thành **`1,00 Triệu VNĐ`** (`1000000 / 1000000`).
  - Ví dụ 3: Nhập `9 800 000` → Hệ thống ghi nhận `9 800 000 VNĐ` và quy đổi thành **`9,80 Triệu VNĐ`**.
- **Khi hiển thị trên Dashboard**:
  - **Biểu đồ cột (Trục Y)**: Hiển thị theo đơn vị **Triệu VNĐ** (`tr`) khớp với trục Y của báo cáo quản trị.
  - **Biểu đồ tròn (%)**: Tự động cộng tổng từng danh mục và tính tỷ lệ phần trăm (`%`) chính xác.
  - **Bảng danh sách phiếu chi & Tooltip**: Hiển thị song song cả **Số tiền gốc (VNĐ)** (ví dụ `20 000 VNĐ`, `1 000 000 VNĐ`) và **Giá trị quy đổi (Triệu VNĐ)** (`0,02 tr`, `1,00 tr`) kèm ảnh chụp minh chứng.
