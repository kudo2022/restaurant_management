# Hướng dẫn Kết nối Google Form, Google Sheet & Google Drive — Nhà hàng Mộc Giang

Tài liệu này hướng dẫn chi tiết cách vận hành hệ thống **Nhập phiếu chi & Ảnh chụp minh chứng** tự động cập nhật lên biểu đồ **Chi phí** (9 danh mục thống nhất) của **Nhà hàng Mộc Giang (199 Hoàng Cầu, Đống Đa, Hà Nội)**.

---

## 1. Tài nguyên Google Drive & Google Sheet đã được khởi tạo sẵn

1. **Bảng tính Google Sheet (`Mộc Giang - Quản Lý Chi Phí (Google Form Responses)`)**:
   - **Spreadsheet ID**: `14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE`
   - **Đường dẫn mở trực tiếp**: [https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit](https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit)
   - Cấu trúc 7 cột chuẩn trên `Sheet1` (`A1:G1`):
     `Dấu thời gian | Họ và tên | Ngày chi | Số tiền (VNĐ) | Ảnh chụp minh chứng | Loại chi phí | Ghi chú`
   - Đã nạp sẵn 16 dòng dữ liệu thực tế (`9 164 000 VNĐ`):
     - `7` phiếu **Chi phí dụng cụ** (`1 365 000 VNĐ`)
     - `9` phiếu **Chi phí nguyên vật liệu đầu vào** (`7 799 000 VNĐ`)

2. **Thư mục Google Drive lưu ảnh minh chứng (`Mộc Giang - Ảnh Minh Chứng Chi Phí`)**:
   - **Folder ID**: `1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2`
   - **Đường dẫn mở trực tiếp**: [https://drive.google.com/drive/folders/1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2](https://drive.google.com/drive/folders/1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2)

---

## 2. Cấu trúc Google Form thống nhất (9 loại chi phí)

Hàm `setupMocGiangExpenseForm()` trong [`Code.gs`](./Code.gs) tự động tạo Google Form gồm 1 phần duy nhất:
- **Họ và tên**
- **Ngày phát sinh**
- **Số tiền (Đơn vị: VNĐ — ví dụ: 20 000, 1 000 000)**
- **Ảnh chụp minh chứng**
- **Loại chi phí** (Trắc nghiệm 1 trong 9 loại):
  1. `Chi phí nguyên vật liệu đầu vào`
  2. `Chi phí nhân công`
  3. `Chi phí dụng cụ`
  4. `Chi phí điện nước`
  5. `Các dịch vụ khác`
  6. `Chi phí ship`
  7. `Chi phí vận hành`
  8. `Chi phí thuê mặt bằng`
  9. `Chi phí tài sản khấu hao`
- **Ghi chú (nếu có)**

---

## 3. Quy tắc quy đổi Đơn vị VNĐ sang Triệu VNĐ trên Biểu đồ

- **Khi nhập trên Form**: Nhân sự nhập số tiền theo đơn vị **VNĐ** (ví dụ `20 000` hoặc `1 000 000`).
- **Khi hiển thị trên Dashboard**:
  - **Biểu đồ cột (Trục Y)**: Hiển thị theo đơn vị **Triệu VNĐ** (`tr`).
  - **Biểu đồ tròn (%)**: Tự động cộng tổng từng loại trong 9 loại chi phí và tính tỷ lệ phần trăm (`%`).
  - **Trang Tổng quan**: Hiển thị tổng chi phí thực tế hợp nhất (**Doanh thu · Chi phí · Lợi nhuận**).
