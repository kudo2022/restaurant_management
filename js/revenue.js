/**
 * Nhà hàng Mộc Giang — Quản lý Doanh thu thực tế từ POS (js/revenue.js)
 * Gồm 2 phân mục chính theo yêu cầu người dùng:
 *  1. Doanh thu theo hình thức (Bán tại chỗ · Bán mang về · Bán online)
 *     - Biểu đồ cột nhóm 3 cột (Vertical Grouped Bar Chart) theo ngày (Đơn vị: Triệu VNĐ)
 *     - Biểu đồ tròn (Pie / Donut Chart) cơ cấu % từng hình thức bán
 *     - Bảng tổng hợp theo ngày & Danh sách 156 hóa đơn POS thực tế (17/11/2026 – 24/11/2026)
 *  2. Doanh thu theo món (Cơm & Món ăn · Đồ uống · Bánh bao)
 *     - Bộ lọc theo Nhóm món, Ngày, và Chế độ biểu đồ (Top 10 món / Top 15 món / 3 Nhóm món chính)
 *     - 4 thẻ KPI: Tổng doanh thu món, Món doanh thu số 1 (Best Seller), Món bán chạy nhất theo số lượng, Tổng số lượng bán
 *     - Biểu đồ cột Doanh thu theo món (Trục X: Tên món/nhóm, Trục Y: Triệu VNĐ)
 *     - Biểu đồ tròn Tỷ trọng Doanh thu theo món (%)
 *     - Bảng xếp hạng chi tiết toàn bộ các món bán ra (có tìm kiếm & thanh tỷ trọng %)
 */
(function () {
  'use strict';

  // Dữ liệu POS thực tế nhúng sẵn (156 hóa đơn từ 17/11/2026 đến 24/11/2026) làm fallback chuẩn xác 100%
  var EMBEDDED_POS_DATA = {"daily":[{"date":"17/11","fullDate":"Thứ Ba, 17/11/2026","onlineVnd":0,"dineInVnd":1235000,"takeawayVnd":73000,"totalVnd":1308000,"orderCount":15,"onlineOrders":0,"dineInOrders":13,"takeawayOrders":2,"online":0,"dineIn":1.235,"takeaway":0.073,"total":1.308,"orders":15},{"date":"18/11","fullDate":"Thứ Tư, 18/11/2026","onlineVnd":1314000,"dineInVnd":611000,"takeawayVnd":85000,"totalVnd":2010000,"orderCount":16,"onlineOrders":2,"dineInOrders":11,"takeawayOrders":3,"online":1.314,"dineIn":0.611,"takeaway":0.085,"total":2.01,"orders":16},{"date":"19/11","fullDate":"Thứ Năm, 19/11/2026","onlineVnd":3087000,"dineInVnd":338000,"takeawayVnd":0,"totalVnd":3425000,"orderCount":17,"onlineOrders":10,"dineInOrders":7,"takeawayOrders":0,"online":3.087,"dineIn":0.338,"takeaway":0,"total":3.425,"orders":17},{"date":"20/11","fullDate":"Thứ Sáu, 20/11/2026","onlineVnd":165000,"dineInVnd":540000,"takeawayVnd":912000,"totalVnd":1617000,"orderCount":26,"onlineOrders":1,"dineInOrders":7,"takeawayOrders":18,"online":0.165,"dineIn":0.54,"takeaway":0.912,"total":1.617,"orders":26},{"date":"21/11","fullDate":"Thứ Bảy, 21/11/2026","onlineVnd":0,"dineInVnd":589000,"takeawayVnd":1272000,"totalVnd":1861000,"orderCount":26,"onlineOrders":0,"dineInOrders":8,"takeawayOrders":18,"online":0,"dineIn":0.589,"takeaway":1.272,"total":1.861,"orders":26},{"date":"22/11","fullDate":"Chủ Nhật, 22/11/2026","onlineVnd":0,"dineInVnd":0,"takeawayVnd":951000,"totalVnd":951000,"orderCount":15,"onlineOrders":0,"dineInOrders":0,"takeawayOrders":15,"online":0,"dineIn":0,"takeaway":0.951,"total":0.951,"orders":15},{"date":"23/11","fullDate":"Thứ Hai, 23/11/2026","onlineVnd":0,"dineInVnd":768000,"takeawayVnd":261000,"totalVnd":1029000,"orderCount":20,"onlineOrders":0,"dineInOrders":14,"takeawayOrders":6,"online":0,"dineIn":0.768,"takeaway":0.261,"total":1.029,"orders":20},{"date":"24/11","fullDate":"Thứ Ba, 24/11/2026","onlineVnd":0,"dineInVnd":828000,"takeawayVnd":451000,"totalVnd":1279000,"orderCount":21,"onlineOrders":0,"dineInOrders":16,"takeawayOrders":5,"online":0,"dineIn":0.828,"takeaway":0.451,"total":1.279,"orders":21}],"byDish":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":40,"orderCount":10,"revenueVnd":720000,"byDate":{"23/11":{"revenueVnd":18000,"quantity":1,"orderCount":1},"22/11":{"revenueVnd":36000,"quantity":2,"orderCount":2},"21/11":{"revenueVnd":36000,"quantity":2,"orderCount":2},"20/11":{"revenueVnd":54000,"quantity":3,"orderCount":3},"19/11":{"revenueVnd":576000,"quantity":32,"orderCount":2}},"byChannel":{"online":576000,"dineIn":18000,"takeaway":126000},"revenueTrieu":0.72,"sharePercent":5.34,"color":"#2E6B22"},{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":11,"orderCount":7,"revenueVnd":649000,"byDate":{"18/11":{"revenueVnd":354000,"quantity":6,"orderCount":2},"17/11":{"revenueVnd":295000,"quantity":5,"orderCount":5}},"byChannel":{"online":354000,"dineIn":295000,"takeaway":0},"revenueTrieu":0.649,"sharePercent":4.81,"color":"#2B7BBB"},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":33,"orderCount":18,"revenueVnd":594000,"byDate":{"24/11":{"revenueVnd":54000,"quantity":3,"orderCount":3},"22/11":{"revenueVnd":36000,"quantity":2,"orderCount":2},"21/11":{"revenueVnd":108000,"quantity":6,"orderCount":5},"20/11":{"revenueVnd":108000,"quantity":6,"orderCount":6},"19/11":{"revenueVnd":288000,"quantity":16,"orderCount":2}},"byChannel":{"online":288000,"dineIn":90000,"takeaway":216000},"revenueTrieu":0.594,"sharePercent":4.41,"color":"#D97724"},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":10,"orderCount":7,"revenueVnd":590000,"byDate":{"18/11":{"revenueVnd":295000,"quantity":5,"orderCount":2},"17/11":{"revenueVnd":295000,"quantity":5,"orderCount":5}},"byChannel":{"online":295000,"dineIn":295000,"takeaway":0},"revenueTrieu":0.59,"sharePercent":4.38,"color":"#8E3B24"},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":32,"orderCount":17,"revenueVnd":576000,"byDate":{"24/11":{"revenueVnd":54000,"quantity":3,"orderCount":3},"23/11":{"revenueVnd":72000,"quantity":4,"orderCount":4},"22/11":{"revenueVnd":36000,"quantity":2,"orderCount":2},"21/11":{"revenueVnd":18000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":90000,"quantity":5,"orderCount":5},"19/11":{"revenueVnd":306000,"quantity":17,"orderCount":2}},"byChannel":{"online":306000,"dineIn":54000,"takeaway":216000},"revenueTrieu":0.576,"sharePercent":4.27,"color":"#6BA353"},{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":19,"orderCount":6,"revenueVnd":570000,"byDate":{"23/11":{"revenueVnd":30000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":30000,"quantity":1,"orderCount":1},"19/11":{"revenueVnd":420000,"quantity":14,"orderCount":2},"18/11":{"revenueVnd":90000,"quantity":3,"orderCount":2}},"byChannel":{"online":420000,"dineIn":120000,"takeaway":30000},"revenueTrieu":0.57,"sharePercent":4.23,"color":"#C88A2B"},{"name":"Trà Sen Vàng Củ Năng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":18,"orderCount":3,"revenueVnd":540000,"byDate":{"24/11":{"revenueVnd":90000,"quantity":3,"orderCount":2},"19/11":{"revenueVnd":450000,"quantity":15,"orderCount":1}},"byChannel":{"online":450000,"dineIn":60000,"takeaway":30000},"revenueTrieu":0.54,"sharePercent":4.01,"color":"#3B842D"},{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":12,"orderCount":7,"revenueVnd":520000,"byDate":{"23/11":{"revenueVnd":70000,"quantity":2,"orderCount":1},"20/11":{"revenueVnd":450000,"quantity":10,"orderCount":6}},"byChannel":{"online":0,"dineIn":410000,"takeaway":110000},"revenueTrieu":0.52,"sharePercent":3.86,"color":"#23669E"},{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":10,"orderCount":5,"revenueVnd":367000,"byDate":{"24/11":{"revenueVnd":108000,"quantity":3,"orderCount":1},"23/11":{"revenueVnd":72000,"quantity":2,"orderCount":2},"20/11":{"revenueVnd":36000,"quantity":1,"orderCount":1},"19/11":{"revenueVnd":151000,"quantity":4,"orderCount":3}},"byChannel":{"online":151000,"dineIn":72000,"takeaway":144000},"revenueTrieu":0.367,"sharePercent":2.72,"color":"#A85520"},{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":8,"orderCount":6,"revenueVnd":340000,"byDate":{"19/11":{"revenueVnd":340000,"quantity":8,"orderCount":7}},"byChannel":{"online":215000,"dineIn":125000,"takeaway":0},"revenueTrieu":0.34,"sharePercent":2.52,"color":"#5C3114"},{"name":"Bánh bột lọc 20c","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"orderCount":2,"revenueVnd":330000,"byDate":{"21/11":{"revenueVnd":165000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":165000,"quantity":1,"orderCount":1}},"byChannel":{"online":165000,"dineIn":0,"takeaway":165000},"revenueTrieu":0.33,"sharePercent":2.45,"color":"#488A7A"},{"name":"Cơm Bò kho lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":9,"orderCount":4,"revenueVnd":315000,"byDate":{"22/11":{"revenueVnd":315000,"quantity":9,"orderCount":4}},"byChannel":{"online":0,"dineIn":0,"takeaway":315000},"revenueTrieu":0.315,"sharePercent":2.34,"color":"#B85A3A"},{"name":"Cacao Latte (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":12,"orderCount":1,"revenueVnd":300000,"byDate":{"19/11":{"revenueVnd":300000,"quantity":12,"orderCount":1}},"byChannel":{"online":300000,"dineIn":0,"takeaway":0},"revenueTrieu":0.3,"sharePercent":2.23,"color":"#6D4C3D"},{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":7,"orderCount":7,"revenueVnd":295000,"byDate":{"24/11":{"revenueVnd":295000,"quantity":7,"orderCount":7}},"byChannel":{"online":0,"dineIn":260000,"takeaway":35000},"revenueTrieu":0.295,"sharePercent":2.19,"color":"#3E7A5E"},{"name":"Cơm Gà xào sả ớt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":6,"orderCount":4,"revenueVnd":280000,"byDate":{"24/11":{"revenueVnd":280000,"quantity":6,"orderCount":4}},"byChannel":{"online":0,"dineIn":245000,"takeaway":35000},"revenueTrieu":0.28,"sharePercent":2.08,"color":"#C47335"},{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":7,"orderCount":4,"revenueVnd":250000,"byDate":{"21/11":{"revenueVnd":250000,"quantity":7,"orderCount":5}},"byChannel":{"online":0,"dineIn":200000,"takeaway":50000},"revenueTrieu":0.25,"sharePercent":1.85,"color":"#2E6B22"},{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":10,"orderCount":6,"revenueVnd":245000,"byDate":{"21/11":{"revenueVnd":245000,"quantity":10,"orderCount":6}},"byChannel":{"online":0,"dineIn":210000,"takeaway":35000},"revenueTrieu":0.245,"sharePercent":1.82,"color":"#2B7BBB"},{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":6,"orderCount":6,"revenueVnd":240000,"byDate":{"19/11":{"revenueVnd":115000,"quantity":3,"orderCount":3},"18/11":{"revenueVnd":125000,"quantity":3,"orderCount":3}},"byChannel":{"online":0,"dineIn":240000,"takeaway":0},"revenueTrieu":0.24,"sharePercent":1.78,"color":"#D97724"},{"name":"Cơm Gà ta om nấm hương","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":4,"orderCount":2,"revenueVnd":236000,"byDate":{"18/11":{"revenueVnd":236000,"quantity":4,"orderCount":2}},"byChannel":{"online":236000,"dineIn":0,"takeaway":0},"revenueTrieu":0.236,"sharePercent":1.75,"color":"#8E3B24"},{"name":"Canh Cà bung","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"orderCount":2,"revenueVnd":230000,"byDate":{"21/11":{"revenueVnd":115000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":115000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":230000},"revenueTrieu":0.23,"sharePercent":1.71,"color":"#6BA353"},{"name":"Cơm Chân giò luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":4,"orderCount":2,"revenueVnd":220000,"byDate":{"19/11":{"revenueVnd":110000,"quantity":2,"orderCount":1},"18/11":{"revenueVnd":110000,"quantity":2,"orderCount":1}},"byChannel":{"online":110000,"dineIn":110000,"takeaway":0},"revenueTrieu":0.22,"sharePercent":1.63,"color":"#C88A2B"},{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":14,"orderCount":12,"revenueVnd":210000,"byDate":{"24/11":{"revenueVnd":45000,"quantity":3,"orderCount":2},"23/11":{"revenueVnd":15000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":60000,"quantity":4,"orderCount":3},"20/11":{"revenueVnd":75000,"quantity":5,"orderCount":5},"19/11":{"revenueVnd":15000,"quantity":1,"orderCount":1}},"byChannel":{"online":15000,"dineIn":45000,"takeaway":150000},"revenueTrieu":0.21,"sharePercent":1.56,"color":"#3B842D"},{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":6,"orderCount":5,"revenueVnd":210000,"byDate":{"23/11":{"revenueVnd":210000,"quantity":6,"orderCount":5}},"byChannel":{"online":0,"dineIn":175000,"takeaway":35000},"revenueTrieu":0.21,"sharePercent":1.56,"color":"#23669E"},{"name":"Cơm Thịt rang cháy cạnh","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":4,"orderCount":4,"revenueVnd":200000,"byDate":{"18/11":{"revenueVnd":200000,"quantity":4,"orderCount":4}},"byChannel":{"online":0,"dineIn":200000,"takeaway":0},"revenueTrieu":0.2,"sharePercent":1.48,"color":"#A85520"},{"name":"Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"orderCount":1,"revenueVnd":195000,"byDate":{"18/11":{"revenueVnd":195000,"quantity":1,"orderCount":1}},"byChannel":{"online":195000,"dineIn":0,"takeaway":0},"revenueTrieu":0.195,"sharePercent":1.45,"color":"#5C3114"},{"name":"Cơm Chả lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":4,"orderCount":3,"revenueVnd":190000,"byDate":{"23/11":{"revenueVnd":190000,"quantity":4,"orderCount":3}},"byChannel":{"online":0,"dineIn":190000,"takeaway":0},"revenueTrieu":0.19,"sharePercent":1.41,"color":"#488A7A"},{"name":"Nhài Sữa Kem Trứng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":5,"orderCount":4,"revenueVnd":189000,"byDate":{"24/11":{"revenueVnd":36000,"quantity":1,"orderCount":1},"22/11":{"revenueVnd":72000,"quantity":2,"orderCount":1},"18/11":{"revenueVnd":36000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":45000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":36000,"takeaway":153000},"revenueTrieu":0.189,"sharePercent":1.4,"color":"#B85A3A"},{"name":"Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"orderCount":1,"revenueVnd":185000,"byDate":{"17/11":{"revenueVnd":185000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":185000,"takeaway":0},"revenueTrieu":0.185,"sharePercent":1.37,"color":"#6D4C3D"},{"name":"Trà Sen Vàng Củ Năng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":5,"orderCount":4,"revenueVnd":180000,"byDate":{"24/11":{"revenueVnd":36000,"quantity":1,"orderCount":1},"22/11":{"revenueVnd":36000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":72000,"quantity":2,"orderCount":1},"19/11":{"revenueVnd":36000,"quantity":1,"orderCount":1}},"byChannel":{"online":36000,"dineIn":0,"takeaway":144000},"revenueTrieu":0.18,"sharePercent":1.34,"color":"#3E7A5E"},{"name":"Cơm Tôm đồng rang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":3,"orderCount":3,"revenueVnd":177000,"byDate":{"18/11":{"revenueVnd":59000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":118000,"quantity":2,"orderCount":2}},"byChannel":{"online":59000,"dineIn":118000,"takeaway":0},"revenueTrieu":0.177,"sharePercent":1.31,"color":"#C47335"},{"name":"Canh chuối đậu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"orderCount":1,"revenueVnd":175000,"byDate":{"18/11":{"revenueVnd":175000,"quantity":1,"orderCount":1}},"byChannel":{"online":175000,"dineIn":0,"takeaway":0},"revenueTrieu":0.175,"sharePercent":1.3,"color":"#2E6B22"},{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":6,"orderCount":5,"revenueVnd":150000,"byDate":{"24/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"23/11":{"revenueVnd":75000,"quantity":3,"orderCount":2},"21/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"18/11":{"revenueVnd":25000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":75000,"takeaway":75000},"revenueTrieu":0.15,"sharePercent":1.11,"color":"#2B7BBB"},{"name":"Cơm Cá kho tộ","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":4,"orderCount":4,"revenueVnd":150000,"byDate":{"20/11":{"revenueVnd":35000,"quantity":1,"orderCount":1},"19/11":{"revenueVnd":115000,"quantity":3,"orderCount":3}},"byChannel":{"online":35000,"dineIn":115000,"takeaway":0},"revenueTrieu":0.15,"sharePercent":1.11,"color":"#D97724"},{"name":"Cá Trắm Kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":130000,"byDate":{"21/11":{"revenueVnd":130000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":130000},"revenueTrieu":0.13,"sharePercent":0.96,"color":"#8E3B24"},{"name":"Trà Sen Vàng Củ Năng (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":2,"revenueVnd":126000,"byDate":{"23/11":{"revenueVnd":42000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":84000,"quantity":2,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":126000},"revenueTrieu":0.126,"sharePercent":0.93,"color":"#6BA353"},{"name":"Bánh Bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":125000,"byDate":{"21/11":{"revenueVnd":125000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":125000},"revenueTrieu":0.125,"sharePercent":0.93,"color":"#C88A2B"},{"name":"Trà Bí Đao (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":6,"orderCount":4,"revenueVnd":120000,"byDate":{"22/11":{"revenueVnd":60000,"quantity":3,"orderCount":2},"21/11":{"revenueVnd":40000,"quantity":2,"orderCount":1},"18/11":{"revenueVnd":20000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":120000},"revenueTrieu":0.12,"sharePercent":0.89,"color":"#3B842D"},{"name":"Pizza Bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"orderCount":1,"revenueVnd":120000,"byDate":{"22/11":{"revenueVnd":120000,"quantity":3,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":120000},"revenueTrieu":0.12,"sharePercent":0.89,"color":"#23669E"},{"name":"Me Đác (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":1,"revenueVnd":120000,"byDate":{"19/11":{"revenueVnd":120000,"quantity":3,"orderCount":1}},"byChannel":{"online":120000,"dineIn":0,"takeaway":0},"revenueTrieu":0.12,"sharePercent":0.89,"color":"#A85520"},{"name":"Trắm kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":120000,"byDate":{"20/11":{"revenueVnd":120000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":120000},"revenueTrieu":0.12,"sharePercent":0.89,"color":"#5C3114"},{"name":"Cơm sườn om trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"orderCount":2,"revenueVnd":115000,"byDate":{"23/11":{"revenueVnd":115000,"quantity":3,"orderCount":2}},"byChannel":{"online":0,"dineIn":115000,"takeaway":0},"revenueTrieu":0.115,"sharePercent":0.85,"color":"#488A7A"},{"name":"Đậu kẹp thịt tẩm hành","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"PHAN","quantity":1,"orderCount":1,"revenueVnd":110000,"byDate":{"17/11":{"revenueVnd":110000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":110000,"takeaway":0},"revenueTrieu":0.11,"sharePercent":0.82,"color":"#B85A3A"},{"name":"Xôi Sắn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":4,"orderCount":4,"revenueVnd":105000,"byDate":{"22/11":{"revenueVnd":30000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":75000,"quantity":3,"orderCount":3}},"byChannel":{"online":0,"dineIn":25000,"takeaway":80000},"revenueTrieu":0.105,"sharePercent":0.78,"color":"#6D4C3D"},{"name":"Me Đác (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":105000,"byDate":{"22/11":{"revenueVnd":35000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":35000,"quantity":1,"orderCount":1},"18/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":105000},"revenueTrieu":0.105,"sharePercent":0.78,"color":"#3E7A5E"},{"name":"Canh su hào suờn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":105000,"byDate":{"21/11":{"revenueVnd":105000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":105000},"revenueTrieu":0.105,"sharePercent":0.78,"color":"#C47335"},{"name":"Thanh Nhài Dẻ Cười (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":97000,"byDate":{"24/11":{"revenueVnd":30000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":37000,"quantity":1,"orderCount":1},"18/11":{"revenueVnd":30000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":97000},"revenueTrieu":0.097,"sharePercent":0.72,"color":"#2E6B22"},{"name":"Bạc Xỉu (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":90000,"byDate":{"24/11":{"revenueVnd":60000,"quantity":2,"orderCount":2},"21/11":{"revenueVnd":30000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":30000,"takeaway":60000},"revenueTrieu":0.09,"sharePercent":0.67,"color":"#2B7BBB"},{"name":"Cafe Muối (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":90000,"byDate":{"22/11":{"revenueVnd":60000,"quantity":2,"orderCount":2},"19/11":{"revenueVnd":30000,"quantity":1,"orderCount":1}},"byChannel":{"online":30000,"dineIn":0,"takeaway":60000},"revenueTrieu":0.09,"sharePercent":0.67,"color":"#D97724"},{"name":"Cafe Sữa (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":88000,"byDate":{"24/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":38000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":63000,"takeaway":25000},"revenueTrieu":0.088,"sharePercent":0.65,"color":"#8E3B24"},{"name":"Cơm Gan chiên mắm tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"orderCount":2,"revenueVnd":80000,"byDate":{"20/11":{"revenueVnd":80000,"quantity":2,"orderCount":2}},"byChannel":{"online":0,"dineIn":80000,"takeaway":0},"revenueTrieu":0.08,"sharePercent":0.59,"color":"#6BA353"},{"name":"Pizza Xúc Xích","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"orderCount":1,"revenueVnd":70000,"byDate":{"22/11":{"revenueVnd":70000,"quantity":2,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":70000},"revenueTrieu":0.07,"sharePercent":0.52,"color":"#C88A2B"},{"name":"Cafe Muối (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":70000,"byDate":{"21/11":{"revenueVnd":35000,"quantity":1,"orderCount":1},"19/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":35000,"dineIn":0,"takeaway":35000},"revenueTrieu":0.07,"sharePercent":0.52,"color":"#3B842D"},{"name":"Trà Vải (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":62000,"byDate":{"20/11":{"revenueVnd":30000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":32000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":32000,"takeaway":30000},"revenueTrieu":0.062,"sharePercent":0.46,"color":"#23669E"},{"name":"Trà Hoa Quả (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"orderCount":3,"revenueVnd":60000,"byDate":{"24/11":{"revenueVnd":20000,"quantity":1,"orderCount":1},"22/11":{"revenueVnd":20000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":20000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":20000,"takeaway":40000},"revenueTrieu":0.06,"sharePercent":0.45,"color":"#A85520"},{"name":"Trà Bí Đao (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":60000,"byDate":{"21/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":35000,"takeaway":25000},"revenueTrieu":0.06,"sharePercent":0.45,"color":"#5C3114"},{"name":"Gần chiên mắm tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":60000,"byDate":{"20/11":{"revenueVnd":60000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":60000},"revenueTrieu":0.06,"sharePercent":0.45,"color":"#488A7A"},{"name":"Bạc Xỉu (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":57000,"byDate":{"22/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":32000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":32000,"takeaway":25000},"revenueTrieu":0.057,"sharePercent":0.42,"color":"#B85A3A"},{"name":"Thanh Nhài Dẻ Cười (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":57000,"byDate":{"18/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":32000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":57000,"takeaway":0},"revenueTrieu":0.057,"sharePercent":0.42,"color":"#6D4C3D"},{"name":"Dâu Tằm (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":53000,"byDate":{"20/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":28000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":53000,"takeaway":0},"revenueTrieu":0.053,"sharePercent":0.39,"color":"#3E7A5E"},{"name":"Dưa Lưới (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":50000,"byDate":{"24/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"21/11":{"revenueVnd":25000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":25000,"takeaway":25000},"revenueTrieu":0.05,"sharePercent":0.37,"color":"#C47335"},{"name":"Phần Gan Chiên cháy tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"orderCount":2,"revenueVnd":50000,"byDate":{"21/11":{"revenueVnd":25000,"quantity":1,"orderCount":1},"20/11":{"revenueVnd":25000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":25000,"takeaway":25000},"revenueTrieu":0.05,"sharePercent":0.37,"color":"#2E6B22"},{"name":"Cafe Sữa (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"orderCount":2,"revenueVnd":48000,"byDate":{"23/11":{"revenueVnd":20000,"quantity":1,"orderCount":1},"17/11":{"revenueVnd":28000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":20000,"takeaway":28000},"revenueTrieu":0.048,"sharePercent":0.36,"color":"#2B7BBB"},{"name":"Trà Vải (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":40000,"byDate":{"23/11":{"revenueVnd":40000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":40000},"revenueTrieu":0.04,"sharePercent":0.3,"color":"#D97724"},{"name":"Olong Kem Trứng Dừa Nướng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":36000,"byDate":{"24/11":{"revenueVnd":36000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":36000,"takeaway":0},"revenueTrieu":0.036,"sharePercent":0.27,"color":"#8E3B24"},{"name":"Cơm Bắp cải cuộn thịt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":35000,"byDate":{"23/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":35000,"takeaway":0},"revenueTrieu":0.035,"sharePercent":0.26,"color":"#6BA353"},{"name":"Trà Khế Quýt (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":35000,"byDate":{"21/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":35000},"revenueTrieu":0.035,"sharePercent":0.26,"color":"#C88A2B"},{"name":"Thanh Nhài Dẻ Cười (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":35000,"byDate":{"20/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":35000,"takeaway":0},"revenueTrieu":0.035,"sharePercent":0.26,"color":"#3B842D"},{"name":"Nhài Sữa Kem Trứng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":35000,"byDate":{"17/11":{"revenueVnd":35000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":35000,"takeaway":0},"revenueTrieu":0.035,"sharePercent":0.26,"color":"#23669E"},{"name":"Dưa Lưới (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":30000,"byDate":{"24/11":{"revenueVnd":30000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":30000,"takeaway":0},"revenueTrieu":0.03,"sharePercent":0.22,"color":"#A85520"},{"name":"Trà Khế Quýt (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":30000,"byDate":{"24/11":{"revenueVnd":30000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":30000,"takeaway":0},"revenueTrieu":0.03,"sharePercent":0.22,"color":"#5C3114"},{"name":"Trà Hoa Quả (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":25000,"byDate":{"23/11":{"revenueVnd":25000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":25000,"takeaway":0},"revenueTrieu":0.025,"sharePercent":0.19,"color":"#488A7A"},{"name":"Cafe Đen (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"orderCount":1,"revenueVnd":18000,"byDate":{"19/11":{"revenueVnd":18000,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":18000,"takeaway":0},"revenueTrieu":0.018,"sharePercent":0.13,"color":"#B85A3A"},{"name":"Trà Bí Đao (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":6,"orderCount":1,"revenueVnd":0,"byDate":{"19/11":{"revenueVnd":0,"quantity":6,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#6D4C3D"},{"name":"Bánh bao","groupKey":"banh_bao","groupName":"Bánh bao","unit":"MON","quantity":3,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":3,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#3E7A5E"},{"name":"Canh khoai tây","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#C47335"},{"name":"Cá bống chiên giòn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#2E6B22"},{"name":"Cá nục kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#2B7BBB"},{"name":"Nửa hộp thịt viên trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#D97724"},{"name":"1/3 hộp gan chiên mắm","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#8E3B24"},{"name":"Bánh bột lọc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"orderCount":1,"revenueVnd":0,"byDate":{"21/11":{"revenueVnd":0,"quantity":1,"orderCount":1}},"byChannel":{"online":0,"dineIn":0,"takeaway":0},"revenueTrieu":0,"sharePercent":0,"color":"#6BA353"}],"invoices":[{"stt":1,"invoiceNo":"240057","date":"24/11","fullDate":"24/11/2026","timeIn":"17:34","timeOut":"17:37","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":258000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Sen Vàng Củ Năng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Nhài Sữa Kem Trứng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Bạc Xỉu (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"price":36000,"amount":108000},{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":2,"price":15000,"amount":30000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":2,"invoiceNo":"240056","date":"24/11","fullDate":"24/11/2026","timeIn":"15:11","timeOut":"15:12","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":3,"invoiceNo":"240055","date":"24/11","fullDate":"24/11/2026","timeIn":"14:28","timeOut":"14:28","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":4,"invoiceNo":"240054","date":"24/11","fullDate":"24/11/2026","timeIn":"13:37","timeOut":"13:38","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":5,"invoiceNo":"HUB.240052","date":"24/11","fullDate":"24/11/2026","timeIn":"13:03","timeOut":"13:04","table":"TB4","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":6,"invoiceNo":"240051","date":"24/11","fullDate":"24/11/2026","timeIn":"13:02","timeOut":"13:03","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":30000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bạc Xỉu (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":7,"invoiceNo":"240048","date":"24/11","fullDate":"24/11/2026","timeIn":"12:58","timeOut":"12:59","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":60000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Sen Vàng Củ Năng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":30000,"amount":60000}]},{"stt":8,"invoiceNo":"240044","date":"24/11","fullDate":"24/11/2026","timeIn":"12:53","timeOut":"12:53","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":90000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Gà xào sả ớt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":45000,"amount":90000}]},{"stt":9,"invoiceNo":"HUB.240039","date":"24/11","fullDate":"24/11/2026","timeIn":"12:41","timeOut":"12:41","table":"TB1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":10,"invoiceNo":"240034","date":"24/11","fullDate":"24/11/2026","timeIn":"12:11","timeOut":"12:11","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":55000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Sen Vàng Củ Năng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Cafe Sữa (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":11,"invoiceNo":"240033","date":"24/11","fullDate":"24/11/2026","timeIn":"12:09","timeOut":"12:10","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":70000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000},{"name":"Cơm Gà xào sả ớt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":12,"invoiceNo":"HUB.240032","date":"24/11","fullDate":"24/11/2026","timeIn":"12:04","timeOut":"12:05","table":"TB1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":140000,"paymentMethod":"Tiền mặt","items":[{"name":"Dưa Lưới (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Cơm Gà xào sả ớt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":55000,"amount":110000}]},{"stt":13,"invoiceNo":"HUB.240031","date":"24/11","fullDate":"24/11/2026","timeIn":"11:48","timeOut":"11:48","table":"TB4","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":70000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Dưa Lưới (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Cơm Gà xào sả ớt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":14,"invoiceNo":"HUB.240023","date":"24/11","fullDate":"24/11/2026","timeIn":"11:20","timeOut":"11:20","table":"TB5","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":30000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Khế Quýt (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":15,"invoiceNo":"240014","date":"24/11","fullDate":"24/11/2026","timeIn":"11:13","timeOut":"11:14","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":55000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":55000,"amount":55000}]},{"stt":16,"invoiceNo":"HUB.240012","date":"24/11","fullDate":"24/11/2026","timeIn":"11:10","timeOut":"11:11","table":"TB3","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":60000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Cơm Thịt kho củ cải","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":17,"invoiceNo":"240011","date":"24/11","fullDate":"24/11/2026","timeIn":"09:49","timeOut":"09:51","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":54000,"paymentMethod":"Tiền mặt","items":[{"name":"Olong Kem Trứng Dừa Nướng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":18,"invoiceNo":"240010","date":"24/11","fullDate":"24/11/2026","timeIn":"09:44","timeOut":"09:44","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":19,"invoiceNo":"240008","date":"24/11","fullDate":"24/11/2026","timeIn":"09:38","timeOut":"09:41","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":36000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":20,"invoiceNo":"240002","date":"24/11","fullDate":"24/11/2026","timeIn":"09:31","timeOut":"09:33","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":15000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":21,"invoiceNo":"240001","date":"24/11","fullDate":"24/11/2026","timeIn":"09:27","timeOut":"09:29","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":50000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Hoa Quả (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000},{"name":"Thanh Nhài Dẻ Cười (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":22,"invoiceNo":"230106","date":"23/11","fullDate":"23/11/2026","timeIn":"20:50","timeOut":"20:51","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":23,"invoiceNo":"230097","date":"23/11","fullDate":"23/11/2026","timeIn":"20:36","timeOut":"20:37","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":18000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":24,"invoiceNo":"230096","date":"23/11","fullDate":"23/11/2026","timeIn":"19:46","timeOut":"19:53","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":25,"invoiceNo":"230088","date":"23/11","fullDate":"23/11/2026","timeIn":"18:16","timeOut":"18:59","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Bắp cải cuộn thịt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":26,"invoiceNo":"230081","date":"23/11","fullDate":"23/11/2026","timeIn":"16:48","timeOut":"16:49","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":43000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":27,"invoiceNo":"230080","date":"23/11","fullDate":"23/11/2026","timeIn":"16:42","timeOut":"16:43","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":60000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Trà Sen Vàng Củ Năng (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":42000,"amount":42000}]},{"stt":28,"invoiceNo":"230075","date":"23/11","fullDate":"23/11/2026","timeIn":"15:10","timeOut":"15:18","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":58000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Vải (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":40000,"amount":40000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":29,"invoiceNo":"230069","date":"23/11","fullDate":"23/11/2026","timeIn":"13:35","timeOut":"14:23","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":36000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000}]},{"stt":30,"invoiceNo":"230074","date":"23/11","fullDate":"23/11/2026","timeIn":"14:04","timeOut":"14:05","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":50000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":25000,"amount":50000}]},{"stt":31,"invoiceNo":"230073","date":"23/11","fullDate":"23/11/2026","timeIn":"13:47","timeOut":"13:52","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":60000,"paymentMethod":"ATM","items":[{"name":"Trà Hoa Quả (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":32,"invoiceNo":"230062","date":"23/11","fullDate":"23/11/2026","timeIn":"13:35","timeOut":"13:47","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":54000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":33,"invoiceNo":"230056","date":"23/11","fullDate":"23/11/2026","timeIn":"12:42","timeOut":"12:42","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"ATM","items":[{"name":"Cơm Chả lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":34,"invoiceNo":"230044","date":"23/11","fullDate":"23/11/2026","timeIn":"12:10","timeOut":"12:30","table":"TB6 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":70000,"paymentMethod":"ATM","items":[{"name":"Cơm sườn om trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":35000,"amount":70000}]},{"stt":35,"invoiceNo":"230034","date":"23/11","fullDate":"23/11/2026","timeIn":"12:17","timeOut":"12:29","table":"TB3 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":70000,"paymentMethod":"ATM","items":[{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":35000,"amount":70000}]},{"stt":36,"invoiceNo":"230040","date":"23/11","fullDate":"23/11/2026","timeIn":"12:28","timeOut":"12:28","table":"TB5 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":90000,"paymentMethod":"ATM","items":[{"name":"Cơm Chả lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":45000,"amount":90000}]},{"stt":37,"invoiceNo":"230047","date":"23/11","fullDate":"23/11/2026","timeIn":"12:27","timeOut":"12:27","table":"TB4 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":70000,"paymentMethod":"ATM","items":[{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":35000,"amount":70000}]},{"stt":38,"invoiceNo":"230021","date":"23/11","fullDate":"23/11/2026","timeIn":"11:53","timeOut":"12:27","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":130000,"paymentMethod":"ATM","items":[{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Cơm Chả lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":55000,"amount":55000},{"name":"Cơm sườn om trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":45000,"amount":45000}]},{"stt":39,"invoiceNo":"230020","date":"23/11","fullDate":"23/11/2026","timeIn":"11:53","timeOut":"12:00","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt nướng xá xíu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":40,"invoiceNo":"230018","date":"23/11","fullDate":"23/11/2026","timeIn":"09:36","timeOut":"09:36","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":20000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Sữa (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000}]},{"stt":41,"invoiceNo":"230009","date":"23/11","fullDate":"23/11/2026","timeIn":"09:01","timeOut":"09:03","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":15000,"paymentMethod":"ATM","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":42,"invoiceNo":"220079","date":"22/11","fullDate":"22/11/2026","timeIn":"20:04","timeOut":"20:07","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":43,"invoiceNo":"220078","date":"22/11","fullDate":"22/11/2026","timeIn":"19:28","timeOut":"19:35","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":190000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Pizza Bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"price":55000,"amount":120000},{"name":"Pizza Xúc Xích","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":45000,"amount":70000}]},{"stt":44,"invoiceNo":"220077","date":"22/11","fullDate":"22/11/2026","timeIn":"19:23","timeOut":"19:25","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Me Đác (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":45,"invoiceNo":"220069","date":"22/11","fullDate":"22/11/2026","timeIn":"17:37","timeOut":"17:37","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":40000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Bí Đao (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":20000,"amount":40000}]},{"stt":46,"invoiceNo":"220067","date":"22/11","fullDate":"22/11/2026","timeIn":"14:42","timeOut":"14:42","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":47,"invoiceNo":"220017","date":"22/11","fullDate":"22/11/2026","timeIn":"14:30","timeOut":"14:41","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":81000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bạc Xỉu (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Trà Hoa Quả (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000}]},{"stt":48,"invoiceNo":"220059","date":"22/11","fullDate":"22/11/2026","timeIn":"14:41","timeOut":"14:41","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":72000,"paymentMethod":"Tiền mặt","items":[{"name":"Nhài Sữa Kem Trứng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":36000,"amount":72000}]},{"stt":49,"invoiceNo":"220050","date":"22/11","fullDate":"22/11/2026","timeIn":"14:41","timeOut":"14:41","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":70000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Bò kho lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":35000,"amount":70000}]},{"stt":50,"invoiceNo":"220043","date":"22/11","fullDate":"22/11/2026","timeIn":"14:40","timeOut":"14:40","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":90000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Bí Đao (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000},{"name":"Cơm Bò kho lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":35000,"amount":70000}]},{"stt":51,"invoiceNo":"220041","date":"22/11","fullDate":"22/11/2026","timeIn":"14:40","timeOut":"14:40","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":70000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Bò kho lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":35000,"amount":70000}]},{"stt":52,"invoiceNo":"220036","date":"22/11","fullDate":"22/11/2026","timeIn":"14:39","timeOut":"14:39","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":105000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Bò kho lá lốt","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"price":35000,"amount":105000}]},{"stt":53,"invoiceNo":"220030","date":"22/11","fullDate":"22/11/2026","timeIn":"14:39","timeOut":"14:39","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"Tiền mặt","items":[{"name":"Xôi Sắn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":30000,"amount":30000}]},{"stt":54,"invoiceNo":"220028","date":"22/11","fullDate":"22/11/2026","timeIn":"14:38","timeOut":"14:38","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Muối (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":55,"invoiceNo":"220022","date":"22/11","fullDate":"22/11/2026","timeIn":"14:37","timeOut":"14:37","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":66000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Cafe Muối (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":56,"invoiceNo":"220009","date":"22/11","fullDate":"22/11/2026","timeIn":"11:43","timeOut":"11:43","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":36000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Sen Vàng Củ Năng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000}]},{"stt":57,"invoiceNo":"210106","date":"21/11","fullDate":"21/11/2026","timeIn":"21:03","timeOut":"21:03","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Muối (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":58,"invoiceNo":"210091","date":"21/11","fullDate":"21/11/2026","timeIn":"18:27","timeOut":"20:02","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":40000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Bí Đao (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":20000,"amount":40000}]},{"stt":59,"invoiceNo":"210104","date":"21/11","fullDate":"21/11/2026","timeIn":"19:33","timeOut":"19:34","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":25000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Xôi Sắn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":25000,"amount":25000}]},{"stt":60,"invoiceNo":"210099","date":"21/11","fullDate":"21/11/2026","timeIn":"18:36","timeOut":"18:51","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":25000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Xôi Sắn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":25000,"amount":25000}]},{"stt":61,"invoiceNo":"210089","date":"21/11","fullDate":"21/11/2026","timeIn":"17:59","timeOut":"18:34","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":62,"invoiceNo":"210087","date":"21/11","fullDate":"21/11/2026","timeIn":"17:33","timeOut":"17:34","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":0,"paymentMethod":"Tiền mặt","items":[{"name":"Canh khoai tây","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"Cá bống chiên giòn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"Cá nục kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"Nửa hộp thịt viên trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"1/3 hộp gan chiên mắm","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"Bánh bột lọc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":0,"amount":0},{"name":"Bánh bao","groupKey":"banh_bao","groupName":"Bánh bao","unit":"MON","quantity":3,"price":0,"amount":0},{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"price":0,"amount":0},{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":0,"amount":0}]},{"stt":63,"invoiceNo":"210081","date":"21/11","fullDate":"21/11/2026","timeIn":"16:45","timeOut":"16:52","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":25000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Trà Bí Đao (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":64,"invoiceNo":"210080","date":"21/11","fullDate":"21/11/2026","timeIn":"16:39","timeOut":"16:40","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":50000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":50000,"amount":50000}]},{"stt":65,"invoiceNo":"210073","date":"21/11","fullDate":"21/11/2026","timeIn":"16:03","timeOut":"16:21","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":130000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Phần Gan Chiên cháy tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":25000,"amount":25000},{"name":"Canh su hào suờn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":105000,"amount":105000}]},{"stt":66,"invoiceNo":"210061","date":"21/11","fullDate":"21/11/2026","timeIn":"14:57","timeOut":"16:02","table":"B03 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":607000,"paymentMethod":"Momo QR đa năng","items":[{"name":"Bánh Bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":125000,"amount":125000},{"name":"Bánh bột lọc 20c","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":165000,"amount":165000},{"name":"Cá Trắm Kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":130000,"amount":130000},{"name":"Canh Cà bung","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":115000,"amount":115000},{"name":"Trà Sen Vàng Củ Năng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":36000,"amount":72000}]},{"stt":67,"invoiceNo":"210072","date":"21/11","fullDate":"21/11/2026","timeIn":"15:43","timeOut":"15:44","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":37000,"paymentMethod":"Tiền mặt","items":[{"name":"Thanh Nhài Dẻ Cười (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":37000}]},{"stt":68,"invoiceNo":"210071","date":"21/11","fullDate":"21/11/2026","timeIn":"15:36","timeOut":"15:36","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":15000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":69,"invoiceNo":"210064","date":"21/11","fullDate":"21/11/2026","timeIn":"15:26","timeOut":"15:36","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Khế Quýt (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":70,"invoiceNo":"210052","date":"21/11","fullDate":"21/11/2026","timeIn":"15:26","timeOut":"15:26","table":"B02 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"Tiền mặt","items":[{"name":"Bạc Xỉu (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":71,"invoiceNo":"210059","date":"21/11","fullDate":"21/11/2026","timeIn":"14:56","timeOut":"14:56","table":"B03 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Me Đác (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":72,"invoiceNo":"210058","date":"21/11","fullDate":"21/11/2026","timeIn":"14:55","timeOut":"14:55","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":73,"invoiceNo":"210033","date":"21/11","fullDate":"21/11/2026","timeIn":"11:55","timeOut":"12:36","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":74,"invoiceNo":"210045","date":"21/11","fullDate":"21/11/2026","timeIn":"12:22","timeOut":"12:23","table":"TB3 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Hoa Quả (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000},{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":75,"invoiceNo":"210039","date":"21/11","fullDate":"21/11/2026","timeIn":"12:06","timeOut":"12:22","table":"TB3 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":50000,"paymentMethod":"Tiền mặt","items":[{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":50000,"amount":50000}]},{"stt":76,"invoiceNo":"210044","date":"21/11","fullDate":"21/11/2026","timeIn":"12:16","timeOut":"12:21","table":"TB4 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":105000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":3,"price":35000,"amount":105000}]},{"stt":77,"invoiceNo":"210032","date":"21/11","fullDate":"21/11/2026","timeIn":"11:43","timeOut":"12:17","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":253000,"paymentMethod":"TRANSFER","items":[{"name":"Cafe Sữa (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":50000,"amount":50000},{"name":"Bún Thang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":2,"price":50000,"amount":100000},{"name":"Cơm rang dưa bò","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000},{"name":"Xôi Sắn","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":25000,"amount":25000}]},{"stt":78,"invoiceNo":"210029","date":"21/11","fullDate":"21/11/2026","timeIn":"11:09","timeOut":"11:36","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":66000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":2,"price":15000,"amount":30000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":2,"price":18000,"amount":36000}]},{"stt":79,"invoiceNo":"210028","date":"21/11","fullDate":"21/11/2026","timeIn":"10:41","timeOut":"10:41","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":25000,"paymentMethod":"Tiền mặt","items":[{"name":"Dưa Lưới (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":80,"invoiceNo":"210019","date":"21/11","fullDate":"21/11/2026","timeIn":"09:19","timeOut":"09:19","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":81,"invoiceNo":"210013","date":"21/11","fullDate":"21/11/2026","timeIn":"09:06","timeOut":"09:07","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":69000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":82,"invoiceNo":"210004","date":"21/11","fullDate":"21/11/2026","timeIn":"07:59","timeOut":"07:59","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":36000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":83,"invoiceNo":"200117","date":"20/11","fullDate":"20/11/2026","timeIn":"18:52","timeOut":"19:27","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":180000,"paymentMethod":"Tiền mặt","items":[{"name":"Trắm kho","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":130000,"amount":120000},{"name":"Gần chiên mắm tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":95000,"amount":60000}]},{"stt":84,"invoiceNo":"200113","date":"20/11","fullDate":"20/11/2026","timeIn":"18:10","timeOut":"18:33","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":80000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Gan chiên mắm tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000},{"name":"Thanh Nhài Dẻ Cười (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":85,"invoiceNo":"200105","date":"20/11","fullDate":"20/11/2026","timeIn":"17:43","timeOut":"17:45","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":54000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":86,"invoiceNo":"200102","date":"20/11","fullDate":"20/11/2026","timeIn":"16:54","timeOut":"16:54","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":87,"invoiceNo":"200098","date":"20/11","fullDate":"20/11/2026","timeIn":"16:45","timeOut":"16:45","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Vải (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":88,"invoiceNo":"200090","date":"20/11","fullDate":"20/11/2026","timeIn":"15:15","timeOut":"15:15","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":165000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh bột lọc 20c","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":165000,"amount":165000}]},{"stt":89,"invoiceNo":"200081","date":"20/11","fullDate":"20/11/2026","timeIn":"13:24","timeOut":"13:52","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":80000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Cá kho tộ","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000},{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":90,"invoiceNo":"200080","date":"20/11","fullDate":"20/11/2026","timeIn":"12:10","timeOut":"12:34","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":105000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Gan chiên mắm tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000},{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":35000,"amount":70000}]},{"stt":91,"invoiceNo":"200076","date":"20/11","fullDate":"20/11/2026","timeIn":"12:08","timeOut":"12:32","table":"TB3 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":92,"invoiceNo":"200060","date":"20/11","fullDate":"20/11/2026","timeIn":"11:34","timeOut":"12:15","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":115000,"paymentMethod":"TRANSFER","items":[{"name":"Phần Gan Chiên cháy tỏi","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":25000,"amount":25000},{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":45000,"amount":90000}]},{"stt":93,"invoiceNo":"200069","date":"20/11","fullDate":"20/11/2026","timeIn":"11:54","timeOut":"12:09","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":90000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":45000,"amount":90000}]},{"stt":94,"invoiceNo":"200061","date":"20/11","fullDate":"20/11/2026","timeIn":"11:40","timeOut":"11:52","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":378000,"paymentMethod":"TRANSFER","items":[{"name":"Canh Cà bung","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":115000,"amount":115000},{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Trà Sen Vàng Củ Năng (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":42000,"amount":84000},{"name":"Cơm Thịt viên ôm trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":55000,"amount":110000}]},{"stt":95,"invoiceNo":"200058","date":"20/11","fullDate":"20/11/2026","timeIn":"11:16","timeOut":"11:17","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":15000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":96,"invoiceNo":"200056","date":"20/11","fullDate":"20/11/2026","timeIn":"11:13","timeOut":"11:13","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":15000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":97,"invoiceNo":"200048","date":"20/11","fullDate":"20/11/2026","timeIn":"11:05","timeOut":"11:05","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":98,"invoiceNo":"200047","date":"20/11","fullDate":"20/11/2026","timeIn":"11:05","timeOut":"11:05","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":99,"invoiceNo":"200038","date":"20/11","fullDate":"20/11/2026","timeIn":"11:04","timeOut":"11:04","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":100,"invoiceNo":"200037","date":"20/11","fullDate":"20/11/2026","timeIn":"10:58","timeOut":"10:58","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":15000,"paymentMethod":"Tiền mặt","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000}]},{"stt":101,"invoiceNo":"200032","date":"20/11","fullDate":"20/11/2026","timeIn":"10:11","timeOut":"10:11","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":102,"invoiceNo":"200031","date":"20/11","fullDate":"20/11/2026","timeIn":"10:08","timeOut":"10:08","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":103,"invoiceNo":"200025","date":"20/11","fullDate":"20/11/2026","timeIn":"10:06","timeOut":"10:06","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":104,"invoiceNo":"200024","date":"20/11","fullDate":"20/11/2026","timeIn":"09:15","timeOut":"09:16","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":25000,"paymentMethod":"Tiền mặt","items":[{"name":"Dâu Tằm (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":105,"invoiceNo":"200015","date":"20/11","fullDate":"20/11/2026","timeIn":"09:08","timeOut":"09:08","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":106,"invoiceNo":"200013","date":"20/11","fullDate":"20/11/2026","timeIn":"08:31","timeOut":"08:31","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":33000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":107,"invoiceNo":"200012","date":"20/11","fullDate":"20/11/2026","timeIn":"08:21","timeOut":"08:21","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":108,"invoiceNo":"200008","date":"20/11","fullDate":"20/11/2026","timeIn":"08:14","timeOut":"08:15","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":18000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000}]},{"stt":109,"invoiceNo":"190066","date":"19/11","fullDate":"19/11/2026","timeIn":"19:53","timeOut":"19:54","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":110,"invoiceNo":"190057","date":"19/11","fullDate":"19/11/2026","timeIn":"17:58","timeOut":"18:32","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Cá kho tộ","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":111,"invoiceNo":"190048","date":"19/11","fullDate":"19/11/2026","timeIn":"17:57","timeOut":"18:17","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":112,"invoiceNo":"190040","date":"19/11","fullDate":"19/11/2026","timeIn":"16:59","timeOut":"17:14","table":"OL02 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":99000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Bánh Bao Cút Thịt","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":15000,"amount":15000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":1,"price":18000,"amount":18000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":2,"price":18000,"amount":36000}]},{"stt":113,"invoiceNo":"190038","date":"19/11","fullDate":"19/11/2026","timeIn":"16:28","timeOut":"17:14","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":1968000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Bí Đao (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":6,"price":15000,"amount":0},{"name":"Cacao Latte (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":12,"price":25000,"amount":300000},{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":13,"price":30000,"amount":390000},{"name":"Trà Sen Vàng Củ Năng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":15,"price":30000,"amount":450000},{"name":"Bánh bao Xá Xíu","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":15,"price":18000,"amount":270000},{"name":"Bánh Bao Xúc Xích","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":15,"price":18000,"amount":270000},{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":16,"price":18000,"amount":288000}]},{"stt":114,"invoiceNo":"190044","date":"19/11","fullDate":"19/11/2026","timeIn":"17:00","timeOut":"17:00","table":"OL03 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":70000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000},{"name":"Cơm Cá kho tộ","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":115,"invoiceNo":"190036","date":"19/11","fullDate":"19/11/2026","timeIn":"16:26","timeOut":"16:26","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":116,"invoiceNo":"190035","date":"19/11","fullDate":"19/11/2026","timeIn":"16:26","timeOut":"16:26","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Cá kho tộ","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"MON","quantity":1,"price":35000,"amount":35000}]},{"stt":117,"invoiceNo":"190034","date":"19/11","fullDate":"19/11/2026","timeIn":"16:19","timeOut":"16:20","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":288000,"paymentMethod":"TRANSFER","items":[{"name":"Bánh Bao Bò Ngô","groupKey":"banh_bao","groupName":"Bánh bao","unit":"CAI","quantity":16,"price":18000,"amount":288000}]},{"stt":118,"invoiceNo":"190029","date":"19/11","fullDate":"19/11/2026","timeIn":"14:01","timeOut":"14:01","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":18000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Đen (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":18000,"amount":18000}]},{"stt":119,"invoiceNo":"190025","date":"19/11","fullDate":"19/11/2026","timeIn":"13:31","timeOut":"13:32","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":115000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000},{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000},{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":120,"invoiceNo":"190020","date":"19/11","fullDate":"19/11/2026","timeIn":"13:13","timeOut":"13:13","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":55000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":55000,"amount":55000}]},{"stt":121,"invoiceNo":"190013","date":"19/11","fullDate":"19/11/2026","timeIn":"12:40","timeOut":"12:40","table":"OL02 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":90000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":45000,"amount":90000}]},{"stt":122,"invoiceNo":"190017","date":"19/11","fullDate":"19/11/2026","timeIn":"12:39","timeOut":"12:39","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt kho trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":123,"invoiceNo":"190011","date":"19/11","fullDate":"19/11/2026","timeIn":"11:42","timeOut":"12:11","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":110000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Chân giò luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":55000,"amount":110000}]},{"stt":124,"invoiceNo":"190010","date":"19/11","fullDate":"19/11/2026","timeIn":"10:39","timeOut":"10:39","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Muối (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":125,"invoiceNo":"190001","date":"19/11","fullDate":"19/11/2026","timeIn":"10:35","timeOut":"10:39","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":337000,"paymentMethod":"TRANSFER","items":[{"name":"Me Đác (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":3,"price":40000,"amount":120000},{"name":"Trà Sen Vàng Củ Năng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":36000,"amount":72000},{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":43000},{"name":"Trà Sữa Cốm Dẻo (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000},{"name":"Cafe Muối (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":126,"invoiceNo":"180080","date":"18/11","fullDate":"18/11/2026","timeIn":"19:44","timeOut":"19:44","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Me Đác (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":127,"invoiceNo":"180071","date":"18/11","fullDate":"18/11/2026","timeIn":"19:33","timeOut":"19:34","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":30000,"paymentMethod":"Tiền mặt","items":[{"name":"Thanh Nhài Dẻ Cười (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000}]},{"stt":128,"invoiceNo":"180068","date":"18/11","fullDate":"18/11/2026","timeIn":"18:29","timeOut":"18:38","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":129,"invoiceNo":"","date":"18/11","fullDate":"18/11/2026","timeIn":"17:49","timeOut":"17:50","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":36000,"paymentMethod":"Tiền mặt","items":[{"name":"Nhài Sữa Kem Trứng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":36000,"amount":36000}]},{"stt":130,"invoiceNo":"180060","date":"18/11","fullDate":"18/11/2026","timeIn":"16:29","timeOut":"16:29","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":20000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Bí Đao (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":20000,"amount":20000}]},{"stt":131,"invoiceNo":"180057","date":"18/11","fullDate":"18/11/2026","timeIn":"13:46","timeOut":"13:46","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt rang cháy cạnh","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":132,"invoiceNo":"180028","date":"18/11","fullDate":"18/11/2026","timeIn":"12:56","timeOut":"13:36","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt rang cháy cạnh","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":133,"invoiceNo":"180054","date":"18/11","fullDate":"18/11/2026","timeIn":"13:34","timeOut":"13:34","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":55000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt rang cháy cạnh","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":55000,"amount":55000}]},{"stt":134,"invoiceNo":"180046","date":"18/11","fullDate":"18/11/2026","timeIn":"13:22","timeOut":"13:23","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":80000,"paymentMethod":"Tiền mặt","items":[{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":30000,"amount":30000},{"name":"Thanh Nhài Dẻ Cười (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000},{"name":"Cafe Muối (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":25000,"amount":25000}]},{"stt":135,"invoiceNo":"180045","date":"18/11","fullDate":"18/11/2026","timeIn":"13:13","timeOut":"13:13","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":60000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Sữa Cốm Dẻo (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":2,"price":30000,"amount":60000}]},{"stt":136,"invoiceNo":"180037","date":"18/11","fullDate":"18/11/2026","timeIn":"13:12","timeOut":"13:12","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":45000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":45000,"amount":45000}]},{"stt":137,"invoiceNo":"180026","date":"18/11","fullDate":"18/11/2026","timeIn":"11:46","timeOut":"11:47","table":"TB2 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":110000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Chân giò luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":2,"price":55000,"amount":110000}]},{"stt":138,"invoiceNo":"180014","date":"18/11","fullDate":"18/11/2026","timeIn":"11:28","timeOut":"11:28","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":55000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Thịt rang cháy cạnh","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":55000,"amount":55000}]},{"stt":139,"invoiceNo":"180013","date":"18/11","fullDate":"18/11/2026","timeIn":"11:18","timeOut":"11:18","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"Tiền mặt","items":[{"name":"Cơm Thịt luộc","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":35000,"amount":35000}]},{"stt":140,"invoiceNo":"180011","date":"18/11","fullDate":"18/11/2026","timeIn":"10:58","timeOut":"11:01","table":"OL02 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":354000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":3,"price":59000,"amount":177000},{"name":"Cơm Tôm đồng rang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Gà ta om nấm hương","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":141,"invoiceNo":"180003","date":"18/11","fullDate":"18/11/2026","timeIn":"10:55","timeOut":"11:01","table":"OL01 - Bán Online","channelKey":"online","channelName":"Bán online","totalVnd":960000,"paymentMethod":"TRANSFER","items":[{"name":"Canh chuối đậu","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"price":175000,"amount":175000},{"name":"Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"price":195000,"amount":195000},{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":3,"price":59000,"amount":177000},{"name":"Cơm Gà ta om nấm hương","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":3,"price":59000,"amount":177000},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":4,"price":59000,"amount":236000}]},{"stt":142,"invoiceNo":"170120","date":"17/11","fullDate":"17/11/2026","timeIn":"19:30","timeOut":"19:30","table":"TB1 - Bán Tại Chỗ","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":35000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Bí Đao (L)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":143,"invoiceNo":"170102","date":"17/11","fullDate":"17/11/2026","timeIn":"13:01","timeOut":"19:22","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":177000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Tôm đồng rang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":144,"invoiceNo":"170113","date":"17/11","fullDate":"17/11/2026","timeIn":"17:30","timeOut":"17:31","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":45000,"paymentMethod":"Tiền mặt","items":[{"name":"Nhài Sữa Kem Trứng (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":45000,"amount":45000}]},{"stt":145,"invoiceNo":"170110","date":"17/11","fullDate":"17/11/2026","timeIn":"17:04","timeOut":"17:04","table":"B01 - Bán Mang Về","channelKey":"takeaway","channelName":"Bán mang về","totalVnd":28000,"paymentMethod":"Tiền mặt","items":[{"name":"Cafe Sữa (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":28000,"amount":28000}]},{"stt":146,"invoiceNo":"170109","date":"17/11","fullDate":"17/11/2026","timeIn":"13:38","timeOut":"13:39","table":"B05 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":91000,"paymentMethod":"TRANSFER","items":[{"name":"Bạc Xỉu (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":32000,"amount":32000},{"name":"Cơm Tôm đồng rang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":147,"invoiceNo":"170095","date":"17/11","fullDate":"17/11/2026","timeIn":"12:41","timeOut":"12:41","table":"B04 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":59000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":148,"invoiceNo":"170091","date":"17/11","fullDate":"17/11/2026","timeIn":"12:38","timeOut":"12:39","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":38000,"paymentMethod":"TRANSFER","items":[{"name":"Cafe Sữa (M)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":38000,"amount":38000}]},{"stt":149,"invoiceNo":"170084","date":"17/11","fullDate":"17/11/2026","timeIn":"12:34","timeOut":"12:35","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":28000,"paymentMethod":"TRANSFER","items":[{"name":"Dâu Tằm (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":28000,"amount":28000}]},{"stt":150,"invoiceNo":"170082","date":"17/11","fullDate":"17/11/2026","timeIn":"12:30","timeOut":"12:30","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":67000,"paymentMethod":"TRANSFER","items":[{"name":"Trà Vải (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":32000,"amount":32000},{"name":"Nhài Sữa Kem Trứng (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":35000,"amount":35000}]},{"stt":151,"invoiceNo":"170072","date":"17/11","fullDate":"17/11/2026","timeIn":"12:15","timeOut":"12:29","table":"B04 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":59000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":152,"invoiceNo":"170068","date":"17/11","fullDate":"17/11/2026","timeIn":"12:04","timeOut":"12:29","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":118000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":153,"invoiceNo":"170054","date":"17/11","fullDate":"17/11/2026","timeIn":"11:39","timeOut":"12:00","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":118000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Cơm Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":154,"invoiceNo":"170061","date":"17/11","fullDate":"17/11/2026","timeIn":"11:51","timeOut":"11:52","table":"B05 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":354000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000},{"name":"Đậu kẹp thịt tẩm hành","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"PHAN","quantity":1,"price":110000,"amount":110000},{"name":"Nọng rang dừa trứng cút","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"HOP","quantity":1,"price":185000,"amount":185000}]},{"stt":155,"invoiceNo":"170042","date":"17/11","fullDate":"17/11/2026","timeIn":"11:19","timeOut":"11:37","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":59000,"paymentMethod":"TRANSFER","items":[{"name":"Cơm Bò sốt vang","groupKey":"com_mon","groupName":"Cơm & Món ăn","unit":"SUAT","quantity":1,"price":59000,"amount":59000}]},{"stt":156,"invoiceNo":"170011","date":"17/11","fullDate":"17/11/2026","timeIn":"10:18","timeOut":"10:20","table":"B02 - Tầng 1","channelKey":"dineIn","channelName":"Bán tại chỗ","totalVnd":32000,"paymentMethod":"TRANSFER","items":[{"name":"Thanh Nhài Dẻ Cười (S)","groupKey":"do_uong","groupName":"Đồ uống (Trà & Cafe)","unit":"LY","quantity":1,"price":32000,"amount":32000}]}]};

  // Cấu hình 3 kênh doanh thu (Hình thức bán)
  var CHANNEL_CONFIG = {
    online: {
      key: 'online',
      label: 'Bán online',
      fullLabel: 'Bán online (OL01 – OL03)',
      subLabel: 'Đơn hàng Online / App giao hàng',
      color: '#2B7BBB',
      colorLight: 'rgba(43, 123, 187, 0.14)',
      colorBorder: 'rgba(43, 123, 187, 0.35)',
      gradientStart: '#388FD4',
      gradientEnd: '#23669E'
    },
    dineIn: {
      key: 'dineIn',
      label: 'Bán tại chỗ',
      fullLabel: 'Bán tại chỗ (Tại bàn / Tầng 1)',
      subLabel: 'Phục vụ tại bàn TB1–TB6 & B02–B05 Tầng 1',
      color: '#2E6B22',
      colorLight: 'rgba(46, 107, 34, 0.14)',
      colorBorder: 'rgba(46, 107, 34, 0.35)',
      gradientStart: '#3B842D',
      gradientEnd: '#24551A'
    },
    takeaway: {
      key: 'takeaway',
      label: 'Bán mang về',
      fullLabel: 'Bán mang về (B01 – B03)',
      subLabel: 'Khách mua mang về tại quầy Mộc Giang',
      color: '#D97724',
      colorLight: 'rgba(217, 119, 36, 0.15)',
      colorBorder: 'rgba(217, 119, 36, 0.38)',
      gradientStart: '#E88835',
      gradientEnd: '#C06316'
    }
  };

  // Cấu hình 3 nhóm món ăn & đồ uống
  var DISH_GROUP_CONFIG = {
    com_mon: {
      key: 'com_mon',
      name: 'Cơm & Món ăn',
      shortName: 'Cơm & Món ăn',
      color: '#2E6B22',
      colorLight: 'rgba(46, 107, 34, 0.13)',
      colorBorder: 'rgba(46, 107, 34, 0.32)'
    },
    do_uong: {
      key: 'do_uong',
      name: 'Đồ uống (Trà & Cafe)',
      shortName: 'Đồ uống',
      color: '#2B7BBB',
      colorLight: 'rgba(43, 123, 187, 0.13)',
      colorBorder: 'rgba(43, 123, 187, 0.32)'
    },
    banh_bao: {
      key: 'banh_bao',
      name: 'Bánh bao',
      shortName: 'Bánh bao',
      color: '#D97724',
      colorLight: 'rgba(217, 119, 36, 0.14)',
      colorBorder: 'rgba(217, 119, 36, 0.35)'
    }
  };

  var DISH_PALETTE = [
    '#2E6B22', '#2B7BBB', '#D97724', '#8E3B24', '#5B8C3E',
    '#C88A2B', '#23669E', '#B85A3A', '#3E7A5E', '#7A441E',
    '#488A7A', '#A85520', '#6D4C3D', '#3B842D', '#C47335'
  ];

  var DAY_NAMES = {
    '17/11': 'Thứ Ba, 17/11/2026',
    '18/11': 'Thứ Tư, 18/11/2026',
    '19/11': 'Thứ Năm, 19/11/2026',
    '20/11': 'Thứ Sáu, 20/11/2026',
    '21/11': 'Thứ Bảy, 21/11/2026',
    '22/11': 'Chủ Nhật, 22/11/2026',
    '23/11': 'Thứ Hai, 23/11/2026',
    '24/11': 'Thứ Ba, 24/11/2026'
  };

  // Trạng thái giao diện Doanh thu
  var currentState = {
    activeTab: 'channel', // 'channel' (Doanh thu theo hình thức) | 'dish' (Doanh thu theo món)
    // Tab 1 state
    channelPeriod: 'all8days', // 'all8days' | 'last7days' | 'week17_23'
    highlightedChannel: null, // 'online' | 'dineIn' | 'takeaway' | null
    channelPieStyle: 'pie', // 'pie' | 'donut'
    invoiceSearch: '',
    invoiceChannelFilter: 'all',
    invoiceDateFilter: 'all',
    showAllInvoices: false,
    // Tab 2 state
    dishGroupFilter: 'all', // 'all' | 'com_mon' | 'do_uong' | 'banh_bao'
    dishDateFilter: 'all', // 'all' | '17/11'..'24/11'
    dishChartMode: 'top10', // 'top10' | 'top15' | 'groups'
    dishPieStyle: 'donut', // 'pie' | 'donut'
    dishSearch: '',
    dishSortBy: 'revenue', // 'revenue' | 'quantity'
    highlightedDishKey: null
  };

  /**
   * Định dạng số tiền VNĐ (ví dụ: 13 480 000 VNĐ hoặc 13.480.000 đ)
   */
  function formatVnd(val, withUnit) {
    var n = Math.round(Number(val) || 0);
    var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return withUnit ? (s + ' VNĐ') : s;
  }

  /**
   * Định dạng số tiền Triệu VNĐ (ví dụ: 13,48 hoặc 1,308)
   */
  function formatMillion(val, decimals) {
    var num = Number(val) || 0;
    var d = typeof decimals === 'number' ? decimals : (Math.abs(num) > 0 && Math.abs(num) < 1 ? 3 : 2);
    return num.toFixed(d).replace('.', ',');
  }

  /**
   * Lấy nguồn dữ liệu POS thực tế (ưu tiên từ window.MocGiangData.revenue nếu có đầy đủ invoices & byDish,
   * hoặc dùng EMBEDDED_POS_DATA đã được trích xuất chính xác 100% từ data/revenue_pos_2026_11.csv)
   */
  function getPosSource() {
    var ext = window.MocGiangData && window.MocGiangData.revenue;
    if (ext && Array.isArray(ext.invoices) && ext.invoices.length > 0 && Array.isArray(ext.byDish) && ext.byDish.length > 0) {
      var dailySource = Array.isArray(ext.allDays) && ext.allDays.length >= 8
        ? ext.allDays
        : (Array.isArray(ext.daily) && ext.daily.length >= 8 ? ext.daily : EMBEDDED_POS_DATA.daily);
      return {
        daily: dailySource,
        byDish: ext.byDish,
        invoices: ext.invoices
      };
    }
    return EMBEDDED_POS_DATA;
  }

  /**
   * Lấy dữ liệu theo kỳ cho Tab 1 (Doanh thu theo hình thức)
   */
  function getChannelPeriodDataset(periodKey) {
    var src = getPosSource();
    var allDaily = src.daily || EMBEDDED_POS_DATA.daily;
    var allInvoices = src.invoices || EMBEDDED_POS_DATA.invoices;

    var allowedDates = ['17/11', '18/11', '19/11', '20/11', '21/11', '22/11', '23/11', '24/11'];
    var label = 'Tất cả (17/11 – 24/11/2026)';
    var xAxisTitle = 'Trục X: Ngày thực tế từ POS (17/11 – 24/11/2026)';
    var periodNote = 'Dữ liệu thực tế 8 ngày (17/11/2026 – 24/11/2026) từ hệ thống POS Mộc Giang';

    if (periodKey === 'last7days') {
      allowedDates = ['18/11', '19/11', '20/11', '21/11', '22/11', '23/11', '24/11'];
      label = '7 ngày gần nhất (18/11 – 24/11)';
      xAxisTitle = 'Trục X: 7 ngày gần nhất (18/11 – 24/11/2026)';
      periodNote = '7 ngày gần nhất (18/11/2026 – 24/11/2026)';
    } else if (periodKey === 'week17_23') {
      allowedDates = ['17/11', '18/11', '19/11', '20/11', '21/11', '22/11', '23/11'];
      label = 'Tuần 17/11 – 23/11';
      xAxisTitle = 'Trục X: Tuần 17/11 – 23/11/2026';
      periodNote = '7 ngày từ Thứ Ba 17/11 đến Thứ Hai 23/11/2026';
    }

    var dateSet = {};
    allowedDates.forEach(function (d) { dateSet[d] = true; });

    var items = allDaily.filter(function (row) {
      return !!dateSet[row.date];
    }).map(function (row) {
      var oVnd = row.onlineVnd != null ? Number(row.onlineVnd) : Math.round((Number(row.online) || 0) * 1000000);
      var dVnd = row.dineInVnd != null ? Number(row.dineInVnd) : Math.round((Number(row.dineIn) || 0) * 1000000);
      var tVnd = row.takeawayVnd != null ? Number(row.takeawayVnd) : Math.round((Number(row.takeaway) || 0) * 1000000);
      var totVnd = oVnd + dVnd + tVnd;
      var ordCount = Number(row.orderCount != null ? row.orderCount : row.orders) || 0;
      return {
        date: row.date,
        fullDate: DAY_NAMES[row.date] || row.fullDate || (row.date + '/2026'),
        onlineVnd: oVnd,
        dineInVnd: dVnd,
        takeawayVnd: tVnd,
        totalVnd: totVnd,
        online: oVnd / 1000000,
        dineIn: dVnd / 1000000,
        takeaway: tVnd / 1000000,
        total: totVnd / 1000000,
        orderCount: ordCount,
        onlineOrders: row.onlineOrders || 0,
        dineInOrders: row.dineInOrders || 0,
        takeawayOrders: row.takeawayOrders || 0
      };
    });

    var filteredInvoices = allInvoices.filter(function (inv) {
      return !!dateSet[inv.date];
    });

    // Tính yMax phù hợp để biểu đồ cột nhóm cao rõ nét (max cột là ~3,087 triệu VNĐ -> yMax = 3,5 tr, bước 0,5 tr)
    var maxBarTrieu = 0.5;
    items.forEach(function (it) {
      maxBarTrieu = Math.max(maxBarTrieu, it.online, it.dineIn, it.takeaway);
    });
    var yStep = maxBarTrieu <= 1.5 ? 0.25 : 0.5;
    var yMax = Math.ceil((maxBarTrieu + 0.15) / yStep) * yStep;

    return {
      id: periodKey,
      label: label,
      xAxisTitle: xAxisTitle,
      periodNote: periodNote,
      yMax: yMax,
      yStep: yStep,
      items: items,
      invoices: filteredInvoices
    };
  }

  /**
   * Tính toán tổng hợp KPI & tỷ trọng % cho Tab 1 (Doanh thu theo hình thức)
   */
  function computeChannelSummary(dataset) {
    var items = dataset.items || [];
    var invoices = dataset.invoices || [];
    var onlineVnd = 0;
    var dineInVnd = 0;
    var takeawayVnd = 0;
    var totalOrders = 0;

    items.forEach(function (it) {
      onlineVnd += it.onlineVnd;
      dineInVnd += it.dineInVnd;
      takeawayVnd += it.takeawayVnd;
      totalOrders += it.orderCount;
    });

    var onlineOrders = 0;
    var dineInOrders = 0;
    var takeawayOrders = 0;
    invoices.forEach(function (inv) {
      if (inv.channelKey === 'online') onlineOrders++;
      else if (inv.channelKey === 'takeaway') takeawayOrders++;
      else dineInOrders++;
    });

    var grandTotalVnd = onlineVnd + dineInVnd + takeawayVnd;
    var pctOnline = grandTotalVnd > 0 ? Math.round((onlineVnd / grandTotalVnd) * 1000) / 10 : 0;
    var pctDineIn = grandTotalVnd > 0 ? Math.round((dineInVnd / grandTotalVnd) * 1000) / 10 : 0;
    var pctTakeaway = grandTotalVnd > 0 ? Math.round((100 - pctOnline - pctDineIn) * 10) / 10 : 0;

    return {
      totalVnd: grandTotalVnd,
      onlineVnd: onlineVnd,
      dineInVnd: dineInVnd,
      takeawayVnd: takeawayVnd,
      total: grandTotalVnd / 1000000,
      online: onlineVnd / 1000000,
      dineIn: dineInVnd / 1000000,
      takeaway: takeawayVnd / 1000000,
      pctOnline: pctOnline,
      pctDineIn: pctDineIn,
      pctTakeaway: pctTakeaway,
      orders: totalOrders || invoices.length,
      onlineOrders: onlineOrders,
      dineInOrders: dineInOrders,
      takeawayOrders: takeawayOrders,
      avgPerDayVnd: items.length > 0 ? Math.round(grandTotalVnd / items.length) : 0,
      avgPerDayTrieu: items.length > 0 ? (grandTotalVnd / 1000000 / items.length) : 0
    };
  }

  /**
   * Tính toán dữ liệu món ăn theo bộ lọc (Nhóm món + Ngày) cho Tab 2 (Doanh thu theo món)
   */
  function getFilteredDishData() {
    var src = getPosSource();
    var allInvoices = src.invoices || EMBEDDED_POS_DATA.invoices;
    var dateFilter = currentState.dishDateFilter;
    var groupFilter = currentState.dishGroupFilter;

    // Tổng hợp trực tiếp từ danh sách hóa đơn để bộ lọc Ngày và Nhóm món chính xác tuyệt đối 100%
    var dishMap = {};
    var groupMap = {
      com_mon: {
        key: 'com_mon',
        name: DISH_GROUP_CONFIG.com_mon.name,
        color: DISH_GROUP_CONFIG.com_mon.color,
        quantity: 0,
        orderCount: 0,
        revenueVnd: 0
      },
      do_uong: {
        key: 'do_uong',
        name: DISH_GROUP_CONFIG.do_uong.name,
        color: DISH_GROUP_CONFIG.do_uong.color,
        quantity: 0,
        orderCount: 0,
        revenueVnd: 0
      },
      banh_bao: {
        key: 'banh_bao',
        name: DISH_GROUP_CONFIG.banh_bao.name,
        color: DISH_GROUP_CONFIG.banh_bao.color,
        quantity: 0,
        orderCount: 0,
        revenueVnd: 0
      }
    };

    var totalAllGroupsVnd = 0;
    var totalFilteredVnd = 0;
    var totalFilteredQty = 0;
    var matchingInvoiceCount = 0;

    allInvoices.forEach(function (inv) {
      if (dateFilter !== 'all' && inv.date !== dateFilter) {
        return;
      }
      var hasMatchingItemInInv = false;
      var seenDishInOrder = {};
      var seenGroupInOrder = {};

      (inv.items || []).forEach(function (it) {
        var gk = it.groupKey || 'com_mon';
        var amt = Number(it.amount != null ? it.amount : it.revenueVnd) || 0;
        var qty = Number(it.quantity) || 0;

        totalAllGroupsVnd += amt;
        if (groupMap[gk]) {
          groupMap[gk].quantity += qty;
          groupMap[gk].revenueVnd += amt;
          if (!seenGroupInOrder[gk]) {
            groupMap[gk].orderCount += 1;
            seenGroupInOrder[gk] = true;
          }
        }

        if (groupFilter !== 'all' && gk !== groupFilter) {
          return;
        }

        hasMatchingItemInInv = true;
        totalFilteredVnd += amt;
        totalFilteredQty += qty;

        if (!dishMap[it.name]) {
          dishMap[it.name] = {
            name: it.name,
            groupKey: gk,
            groupName: (DISH_GROUP_CONFIG[gk] && DISH_GROUP_CONFIG[gk].name) || 'Cơm & Món ăn',
            unit: it.unit || 'MON',
            quantity: 0,
            orderCount: 0,
            revenueVnd: 0
          };
        }
        var dEntry = dishMap[it.name];
        dEntry.quantity += qty;
        dEntry.revenueVnd += amt;
        if (!seenDishInOrder[it.name]) {
          dEntry.orderCount += 1;
          seenDishInOrder[it.name] = true;
        }
      });

      if (hasMatchingItemInInv) {
        matchingInvoiceCount++;
      }
    });

    var dishes = Object.keys(dishMap).map(function (k) { return dishMap[k]; });
    dishes.sort(function (a, b) {
      return (b.revenueVnd - a.revenueVnd) || (b.quantity - a.quantity);
    });

    dishes.forEach(function (d, idx) {
      d.rank = idx + 1;
      d.revenueTrieu = d.revenueVnd / 1000000;
      d.sharePercent = totalFilteredVnd > 0 ? Math.round((d.revenueVnd / totalFilteredVnd) * 10000) / 100 : 0;
      d.color = DISH_PALETTE[idx % DISH_PALETTE.length];
    });

    var groupsArr = ['com_mon', 'do_uong', 'banh_bao'].map(function (gk) {
      var g = groupMap[gk];
      g.revenueTrieu = g.revenueVnd / 1000000;
      g.sharePercent = totalAllGroupsVnd > 0 ? Math.round((g.revenueVnd / totalAllGroupsVnd) * 10000) / 100 : 0;
      return g;
    });

    // Tìm món doanh thu cao nhất & món bán chạy nhất theo số lượng
    var bestRevenueDish = dishes.length > 0 ? dishes[0] : null;
    var bestQtyDish = null;
    dishes.forEach(function (d) {
      if (!bestQtyDish || d.quantity > bestQtyDish.quantity || (d.quantity === bestQtyDish.quantity && d.revenueVnd > bestQtyDish.revenueVnd)) {
        bestQtyDish = d;
      }
    });

    return {
      dishes: dishes,
      groups: groupsArr,
      groupMap: groupMap,
      totalFilteredVnd: totalFilteredVnd,
      totalFilteredTrieu: totalFilteredVnd / 1000000,
      totalFilteredQty: totalFilteredQty,
      totalAllGroupsVnd: totalAllGroupsVnd,
      matchingInvoiceCount: matchingInvoiceCount,
      bestRevenueDish: bestRevenueDish,
      bestQtyDish: bestQtyDish
    };
  }

  /**
   * Tạo đường dẫn SVG cho lát cắt biểu đồ tròn (Pie / Donut slice)
   */
  function createPieSlicePath(cx, cy, rOuter, rInner, startAngleDeg, endAngleDeg) {
    var sweep = endAngleDeg - startAngleDeg;
    if (sweep >= 359.99) {
      endAngleDeg = startAngleDeg + 359.98;
    }
    var rad = Math.PI / 180;
    var startRad = (startAngleDeg - 90) * rad;
    var endRad = (endAngleDeg - 90) * rad;

    var x1Out = cx + rOuter * Math.cos(startRad);
    var y1Out = cy + rOuter * Math.sin(startRad);
    var x2Out = cx + rOuter * Math.cos(endRad);
    var y2Out = cy + rOuter * Math.sin(endRad);

    var largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    if (rInner <= 0) {
      return [
        'M', cx, cy,
        'L', x1Out.toFixed(2), y1Out.toFixed(2),
        'A', rOuter, rOuter, 0, largeArc, 1, x2Out.toFixed(2), y2Out.toFixed(2),
        'Z'
      ].join(' ');
    }

    var x1In = cx + rInner * Math.cos(endRad);
    var y1In = cy + rInner * Math.sin(endRad);
    var x2In = cx + rInner * Math.cos(startRad);
    var y2In = cy + rInner * Math.sin(startRad);

    return [
      'M', x1Out.toFixed(2), y1Out.toFixed(2),
      'A', rOuter, rOuter, 0, largeArc, 1, x2Out.toFixed(2), y2Out.toFixed(2),
      'L', x1In.toFixed(2), y1In.toFixed(2),
      'A', rInner, rInner, 0, largeArc, 0, x2In.toFixed(2), y2In.toFixed(2),
      'Z'
    ].join(' ');
  }

  /**
   * TAB 1 — Dựng SVG Biểu đồ cột nhóm 3 cột (Vertical Grouped Bar Chart) theo ngày
   */
  function buildChannelGroupedBarSVG(dataset) {
    var items = dataset.items || [];
    var yMax = dataset.yMax || 3.5;
    var yStep = dataset.yStep || 0.5;
    var numTicks = Math.round(yMax / yStep);

    var svgWidth = 740;
    var svgHeight = 375;
    var padLeft = 74;
    var padRight = 24;
    var padTop = 36;
    var padBottom = 64;

    var plotW = svgWidth - padLeft - padRight;
    var plotH = svgHeight - padTop - padBottom;
    var groupCount = items.length || 1;
    var groupSlotW = plotW / groupCount;

    var barWidth = Math.min(22, Math.max(12, Math.floor((groupSlotW * 0.72) / 3)));
    var barGap = Math.max(3, Math.floor(barWidth * 0.2));
    var totalClusterW = barWidth * 3 + barGap * 2;

    var hl = currentState.highlightedChannel;

    var defs = [
      '<defs>',
      '  <linearGradient id="rev-grad-online" x1="0" y1="0" x2="0" y2="1">',
      '    <stop offset="0%" stop-color="' + CHANNEL_CONFIG.online.gradientStart + '"/>',
      '    <stop offset="100%" stop-color="' + CHANNEL_CONFIG.online.gradientEnd + '"/>',
      '  </linearGradient>',
      '  <linearGradient id="rev-grad-dineIn" x1="0" y1="0" x2="0" y2="1">',
      '    <stop offset="0%" stop-color="' + CHANNEL_CONFIG.dineIn.gradientStart + '"/>',
      '    <stop offset="100%" stop-color="' + CHANNEL_CONFIG.dineIn.gradientEnd + '"/>',
      '  </linearGradient>',
      '  <linearGradient id="rev-grad-takeaway" x1="0" y1="0" x2="0" y2="1">',
      '    <stop offset="0%" stop-color="' + CHANNEL_CONFIG.takeaway.gradientStart + '"/>',
      '    <stop offset="100%" stop-color="' + CHANNEL_CONFIG.takeaway.gradientEnd + '"/>',
      '  </linearGradient>',
      '</defs>'
    ].join('');

    var gridLines = [];
    for (var i = 0; i <= numTicks; i++) {
      var val = Math.round(i * yStep * 100) / 100;
      var ratio = val / yMax;
      var yPos = padTop + plotH - ratio * plotH;
      var isZero = i === 0;
      var yLabel = val === 0 ? '0 tr' : (formatMillion(val, yStep < 0.5 ? 2 : 1) + ' tr');
      gridLines.push(
        '<g class="rev-y-tick">',
        '  <line x1="' + padLeft + '" y1="' + yPos.toFixed(1) + '" x2="' + (svgWidth - padRight) + '" y2="' + yPos.toFixed(1) + '" stroke="' + (isZero ? '#C8BCA6' : '#E6DEC8') + '" stroke-width="' + (isZero ? '1.5' : '1') + '"/>',
        '  <text x="' + (padLeft - 10) + '" y="' + (yPos + 4).toFixed(1) + '" text-anchor="end" class="rev-axis-label-y">' + yLabel + '</text>',
        '</g>'
      );
    }

    var yAxisHeader = '<text x="' + padLeft + '" y="18" class="rev-axis-unit-title">▲ Trục Y: Số tiền (Đơn vị: Triệu VNĐ)</text>';

    var barGroups = [];
    var channelsOrder = ['online', 'dineIn', 'takeaway'];

    items.forEach(function (item, idx) {
      var groupCenterX = padLeft + idx * groupSlotW + groupSlotW / 2;
      var clusterStartX = groupCenterX - totalClusterW / 2;
      var dayTotalVnd = item.totalVnd || 0;

      barGroups.push(
        '<g class="rev-bar-cluster" data-index="' + idx + '" data-date="' + item.date + '">',
        '  <rect class="rev-cluster-hover-bg" x="' + (padLeft + idx * groupSlotW + 3).toFixed(1) + '" y="' + padTop + '" width="' + (groupSlotW - 6).toFixed(1) + '" height="' + plotH + '" rx="6" fill="transparent"/>'
      );

      channelsOrder.forEach(function (chKey, cIdx) {
        var rawTrieu = Number(item[chKey]) || 0;
        var rawVnd = Number(item[chKey + 'Vnd']) || 0;
        var isZeroVal = rawVnd === 0;
        var barH = isZeroVal ? 3 : Math.max(6, (Math.min(rawTrieu, yMax) / yMax) * plotH);
        var barX = clusterStartX + cIdx * (barWidth + barGap);
        var barY = padTop + plotH - barH;
        var cfg = CHANNEL_CONFIG[chKey];
        var pctOfDay = dayTotalVnd > 0 ? ((rawVnd / dayTotalVnd) * 100).toFixed(1).replace('.', ',') : '0,0';
        var dimmedClass = (hl && hl !== chKey) ? ' is-dimmed' : '';

        barGroups.push(
          '  <g class="rev-single-bar-wrap' + dimmedClass + '" data-channel="' + chKey + '" data-date="' + item.date + '" data-fulldate="' + item.fullDate + '" data-label="' + cfg.label + '" data-vnd="' + formatVnd(rawVnd, true) + '" data-trieu="' + formatMillion(rawTrieu, 3) + '" data-pct="' + pctOfDay + '" data-daytotalvnd="' + formatVnd(dayTotalVnd, true) + '" data-dayorders="' + item.orderCount + '">',
          '    <rect class="rev-bar-rect" x="' + barX.toFixed(1) + '" y="' + barY.toFixed(1) + '" width="' + barWidth + '" height="' + barH.toFixed(1) + '" rx="3" fill="' + (isZeroVal ? 'rgba(180,165,148,0.28)' : 'url(#rev-grad-' + chKey + ')') + '" stroke="' + (isZeroVal ? '#C8BCA6' : cfg.color) + '" stroke-width="0.6"/>',
          (!isZeroVal
            ? '    <text x="' + (barX + barWidth / 2).toFixed(1) + '" y="' + (barY - 5).toFixed(1) + '" text-anchor="middle" class="rev-bar-val-text" fill="' + cfg.color + '">' + formatMillion(rawTrieu, 2) + '</text>'
            : ''),
          '  </g>'
        );
      });

      barGroups.push(
        '  <text x="' + groupCenterX.toFixed(1) + '" y="' + (padTop + plotH + 22) + '" text-anchor="middle" class="rev-axis-label-x">' + item.date + '</text>',
        '  <text x="' + groupCenterX.toFixed(1) + '" y="' + (padTop + plotH + 36) + '" text-anchor="middle" class="rev-axis-sub-x">' + item.orderCount + ' đơn</text>',
        '</g>'
      );
    });

    var xAxisFooter = '<text x="' + (padLeft + plotW / 2).toFixed(1) + '" y="' + (svgHeight - 8) + '" text-anchor="middle" class="rev-axis-x-title">' + (dataset.xAxisTitle || 'Trục X: Ngày') + '</text>';

    return [
      '<svg class="rev-grouped-bar-svg" viewBox="0 0 ' + svgWidth + ' ' + svgHeight + '" role="img" aria-label="Biểu đồ cột nhóm doanh thu 3 kênh Nhà hàng Mộc Giang">',
      defs,
      yAxisHeader,
      gridLines.join(''),
      barGroups.join(''),
      xAxisFooter,
      '</svg>'
    ].join('');
  }

  /**
   * TAB 1 — Dựng SVG Biểu đồ tròn (Pie / Donut Chart) cơ cấu % theo hình thức bán
   */
  function buildChannelPieSVG(summary) {
    var slices = [
      {
        key: 'dineIn',
        label: CHANNEL_CONFIG.dineIn.label,
        vnd: summary.dineInVnd,
        trieu: summary.dineIn,
        pct: summary.pctDineIn,
        orders: summary.dineInOrders,
        color: CHANNEL_CONFIG.dineIn.color
      },
      {
        key: 'online',
        label: CHANNEL_CONFIG.online.label,
        vnd: summary.onlineVnd,
        trieu: summary.online,
        pct: summary.pctOnline,
        orders: summary.onlineOrders,
        color: CHANNEL_CONFIG.online.color
      },
      {
        key: 'takeaway',
        label: CHANNEL_CONFIG.takeaway.label,
        vnd: summary.takeawayVnd,
        trieu: summary.takeaway,
        pct: summary.pctTakeaway,
        orders: summary.takeawayOrders,
        color: CHANNEL_CONFIG.takeaway.color
      }
    ];

    var size = 266;
    var cx = size / 2;
    var cy = size / 2;
    var rOuter = 110;
    var rInner = currentState.channelPieStyle === 'donut' ? 50 : 0;
    var labelRadius = currentState.channelPieStyle === 'donut' ? 80 : 66;

    var currentAngle = 0;
    var paths = [];
    var labels = [];
    var hl = currentState.highlightedChannel;

    slices.forEach(function (slice) {
      if (slice.pct <= 0) return;
      var sweep = Math.max(1, (slice.pct / 100) * 360);
      var startAngle = currentAngle;
      var endAngle = currentAngle + sweep;
      var midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;

      var isHighlighted = hl === slice.key;
      var isDimmed = hl && hl !== slice.key;
      var offsetDist = isHighlighted ? 6 : 0;
      var midRad = (midAngle - 90) * (Math.PI / 180);
      var tx = (offsetDist * Math.cos(midRad)).toFixed(2);
      var ty = (offsetDist * Math.sin(midRad)).toFixed(2);

      var pathData = createPieSlicePath(cx, cy, rOuter, rInner, startAngle, endAngle);

      paths.push(
        '<path class="rev-pie-slice' + (isDimmed ? ' is-dimmed' : '') + (isHighlighted ? ' is-active' : '') + '" ',
        '  d="' + pathData + '" ',
        '  fill="' + slice.color + '" ',
        '  stroke="#FFFFFF" stroke-width="2.5" ',
        '  transform="translate(' + tx + ',' + ty + ')" ',
        '  data-channel="' + slice.key + '" ',
        '  data-label="' + slice.label + '" ',
        '  data-vnd="' + formatVnd(slice.vnd, true) + '" ',
        '  data-trieu="' + formatMillion(slice.trieu, 3) + '" ',
        '  data-orders="' + slice.orders + '" ',
        '  data-pct="' + formatMillion(slice.pct, 1) + '"/>'
      );

      var lx = cx + (labelRadius + offsetDist) * Math.cos(midRad);
      var ly = cy + (labelRadius + offsetDist) * Math.sin(midRad);

      labels.push(
        '<g class="rev-pie-slice-label" pointer-events="none">',
        '  <text x="' + lx.toFixed(1) + '" y="' + (ly - 3).toFixed(1) + '" text-anchor="middle" class="rev-pie-pct-text">' + formatMillion(slice.pct, 1) + '%</text>',
        '  <text x="' + lx.toFixed(1) + '" y="' + (ly + 11).toFixed(1) + '" text-anchor="middle" class="rev-pie-name-text">' + slice.label + '</text>',
        '</g>'
      );
    });

    var centerBadge = '';
    if (currentState.channelPieStyle === 'donut') {
      centerBadge = [
        '<g class="rev-donut-center" pointer-events="none">',
        '  <circle cx="' + cx + '" cy="' + cy + '" r="' + (rInner - 2) + '" fill="var(--rev-card-bg, #FFFFFF)"/>',
        '  <text x="' + cx + '" y="' + (cy - 3) + '" text-anchor="middle" class="rev-donut-total-val">' + formatMillion(summary.total, 2) + '</text>',
        '  <text x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle" class="rev-donut-total-unit">Triệu VNĐ</text>',
        '</g>'
      ].join('');
    }

    return [
      '<svg class="rev-pie-svg" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Biểu đồ tròn cơ cấu phần trăm doanh thu Mộc Giang">',
      paths.join(''),
      labels.join(''),
      centerBadge,
      '</svg>'
    ].join('');
  }

  /**
   * TAB 2 — Dựng SVG Biểu đồ cột Doanh thu theo món (hoặc theo 3 nhóm món chính)
   */
  function buildDishBarChartSVG(dishData) {
    var mode = currentState.dishChartMode;
    var items = [];
    var xAxisTitle = 'Trục X: Top món ăn & đồ uống có doanh thu cao nhất';

    if (mode === 'groups') {
      items = (dishData.groups || []).map(function (g) {
        return {
          key: g.key,
          name: g.name,
          shortName: g.name,
          groupName: g.name,
          quantity: g.quantity,
          orderCount: g.orderCount,
          revenueVnd: g.revenueVnd,
          revenueTrieu: g.revenueTrieu,
          sharePercent: g.sharePercent,
          color: g.color
        };
      });
      xAxisTitle = 'Trục X: 3 Nhóm thực đơn chính tại Nhà hàng Mộc Giang';
    } else {
      var limit = mode === 'top15' ? 15 : 10;
      items = (dishData.dishes || []).filter(function (d) { return d.revenueVnd > 0; }).slice(0, limit).map(function (d) {
        var short = d.name.length > 18 ? (d.name.slice(0, 17) + '…') : d.name;
        return {
          key: d.name,
          name: d.name,
          shortName: short,
          groupName: d.groupName,
          quantity: d.quantity,
          orderCount: d.orderCount,
          revenueVnd: d.revenueVnd,
          revenueTrieu: d.revenueTrieu,
          sharePercent: d.sharePercent,
          color: d.color
        };
      });
      xAxisTitle = 'Trục X: Top ' + items.length + ' món ăn & thức uống có doanh thu cao nhất';
    }

    if (items.length === 0) {
      return '<div style="padding:48px;text-align:center;color:var(--rev-text-muted);">Không có dữ liệu món ăn trong bộ lọc này.</div>';
    }

    var maxTrieu = 0.2;
    items.forEach(function (it) {
      maxTrieu = Math.max(maxTrieu, it.revenueTrieu);
    });

    var yStep = maxTrieu <= 0.5 ? 0.1 : (maxTrieu <= 1.2 ? 0.2 : (maxTrieu <= 3 ? 0.5 : 1.5));
    var yMax = Math.ceil((maxTrieu + yStep * 0.35) / yStep) * yStep;
    var numTicks = Math.round(yMax / yStep);

    var svgWidth = 740;
    var svgHeight = 395;
    var padLeft = 74;
    var padRight = 22;
    var padTop = 36;
    var padBottom = mode === 'groups' ? 68 : 98;

    var plotW = svgWidth - padLeft - padRight;
    var plotH = svgHeight - padTop - padBottom;
    var slotW = plotW / items.length;
    var barW = mode === 'groups' ? Math.min(76, Math.floor(slotW * 0.45)) : Math.min(36, Math.max(18, Math.floor(slotW * 0.58)));

    var gridLines = [];
    for (var i = 0; i <= numTicks; i++) {
      var val = Math.round(i * yStep * 100) / 100;
      var ratio = val / yMax;
      var yPos = padTop + plotH - ratio * plotH;
      var isZero = i === 0;
      var yLabel = val === 0 ? '0 tr' : (formatMillion(val, yStep < 0.2 ? 2 : 1) + ' tr');
      gridLines.push(
        '<g class="rev-y-tick">',
        '  <line x1="' + padLeft + '" y1="' + yPos.toFixed(1) + '" x2="' + (svgWidth - padRight) + '" y2="' + yPos.toFixed(1) + '" stroke="' + (isZero ? '#C8BCA6' : '#E6DEC8') + '" stroke-width="' + (isZero ? '1.5' : '1') + '"/>',
        '  <text x="' + (padLeft - 10) + '" y="' + (yPos + 4).toFixed(1) + '" text-anchor="end" class="rev-axis-label-y">' + yLabel + '</text>',
        '</g>'
      );
    }

    var yAxisHeader = '<text x="' + padLeft + '" y="18" class="rev-axis-unit-title">▲ Trục Y: Doanh thu món (Đơn vị: Triệu VNĐ)</text>';

    var bars = [];
    items.forEach(function (it, idx) {
      var cx = padLeft + idx * slotW + slotW / 2;
      var bx = cx - barW / 2;
      var bh = Math.max(5, (Math.min(it.revenueTrieu, yMax) / yMax) * plotH);
      var by = padTop + plotH - bh;
      var labelY = padTop + plotH + 16;

      bars.push(
        '<g class="rev-dish-bar-wrap" data-dish-name="' + it.name.replace(/"/g, '&quot;') + '" data-dish-group="' + it.groupName + '" data-dish-qty="' + it.quantity + '" data-dish-orders="' + it.orderCount + '" data-dish-vnd="' + formatVnd(it.revenueVnd, true) + '" data-dish-trieu="' + formatMillion(it.revenueTrieu, 3) + '" data-dish-pct="' + formatMillion(it.sharePercent, 2) + '" data-dish-color="' + it.color + '">',
        '  <rect class="rev-bar-rect" x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + barW + '" height="' + bh.toFixed(1) + '" rx="4" fill="' + it.color + '"/>',
        '  <text x="' + cx.toFixed(1) + '" y="' + (by - 15).toFixed(1) + '" text-anchor="middle" class="rev-bar-val-text" fill="' + it.color + '">' + formatMillion(it.revenueTrieu, 2) + ' tr</text>',
        '  <text x="' + cx.toFixed(1) + '" y="' + (by - 4).toFixed(1) + '" text-anchor="middle" class="rev-axis-sub-x" fill="var(--rev-text-muted)">(' + it.quantity + ' SL)</text>',
        (mode === 'groups'
          ? '  <text x="' + cx.toFixed(1) + '" y="' + (labelY + 6) + '" text-anchor="middle" class="rev-axis-label-x">' + it.shortName + '</text>'
          : '  <text x="' + cx.toFixed(1) + '" y="' + labelY + '" text-anchor="end" transform="rotate(-28 ' + cx.toFixed(1) + ' ' + labelY + ')" class="rev-dish-x-label">' + it.shortName + '</text>'),
        '</g>'
      );
    });

    var xAxisFooter = '<text x="' + (padLeft + plotW / 2).toFixed(1) + '" y="' + (svgHeight - 6) + '" text-anchor="middle" class="rev-axis-x-title">' + xAxisTitle + '</text>';

    return [
      '<svg class="rev-grouped-bar-svg" viewBox="0 0 ' + svgWidth + ' ' + svgHeight + '" role="img" aria-label="Biểu đồ cột doanh thu theo món Nhà hàng Mộc Giang">',
      yAxisHeader,
      gridLines.join(''),
      bars.join(''),
      xAxisFooter,
      '</svg>'
    ].join('');
  }

  /**
   * TAB 2 — Dựng dữ liệu lát cắt & SVG Biểu đồ tròn Tỷ trọng Doanh thu theo món (%)
   */
  function buildDishPieDataAndSVG(dishData) {
    var mode = currentState.dishChartMode;
    var slices = [];
    var totalVnd = dishData.totalFilteredVnd || 0;

    if (mode === 'groups' && currentState.dishGroupFilter === 'all') {
      totalVnd = dishData.totalAllGroupsVnd || 0;
      slices = (dishData.groups || []).map(function (g) {
        return {
          key: g.key,
          label: g.name,
          quantity: g.quantity,
          vnd: g.revenueVnd,
          trieu: g.revenueTrieu,
          pct: g.sharePercent,
          color: g.color
        };
      });
    } else {
      var positiveDishes = (dishData.dishes || []).filter(function (d) { return d.revenueVnd > 0; });
      var topCount = 6;
      var topDishes = positiveDishes.slice(0, topCount);
      var restDishes = positiveDishes.slice(topCount);

      var sumTopPct = 0;
      var sumTopVnd = 0;
      var sumTopQty = 0;

      topDishes.forEach(function (d, idx) {
        var pct = totalVnd > 0 ? Math.round((d.revenueVnd / totalVnd) * 1000) / 10 : 0;
        sumTopPct += pct;
        sumTopVnd += d.revenueVnd;
        sumTopQty += d.quantity;
        slices.push({
          key: d.name,
          label: d.name,
          quantity: d.quantity,
          vnd: d.revenueVnd,
          trieu: d.revenueTrieu,
          pct: pct,
          color: DISH_PALETTE[idx % DISH_PALETTE.length]
        });
      });

      if (restDishes.length > 0 && (totalVnd - sumTopVnd) > 0) {
        var restVnd = totalVnd - sumTopVnd;
        var restQty = (dishData.totalFilteredQty || 0) - sumTopQty;
        var restPct = Math.max(0.1, Math.round((100 - sumTopPct) * 10) / 10);
        slices.push({
          key: '__others__',
          label: 'Các món khác (' + restDishes.length + ' món)',
          quantity: restQty,
          vnd: restVnd,
          trieu: restVnd / 1000000,
          pct: restPct,
          color: '#A3907C'
        });
      }
    }

    var size = 266;
    var cx = size / 2;
    var cy = size / 2;
    var rOuter = 110;
    var rInner = currentState.dishPieStyle === 'donut' ? 50 : 0;
    var labelRadius = currentState.dishPieStyle === 'donut' ? 81 : 68;

    var currentAngle = 0;
    var paths = [];
    var labels = [];

    slices.forEach(function (slice) {
      if (slice.pct <= 0) return;
      var sweep = Math.max(1.5, (slice.pct / 100) * 360);
      var startAngle = currentAngle;
      var endAngle = currentAngle + sweep;
      var midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;

      var midRad = (midAngle - 90) * (Math.PI / 180);
      var pathData = createPieSlicePath(cx, cy, rOuter, rInner, startAngle, endAngle);

      paths.push(
        '<path class="rev-dish-pie-slice" ',
        '  d="' + pathData + '" ',
        '  fill="' + slice.color + '" ',
        '  stroke="#FFFFFF" stroke-width="2" ',
        '  data-label="' + slice.label.replace(/"/g, '&quot;') + '" ',
        '  data-qty="' + slice.quantity + '" ',
        '  data-vnd="' + formatVnd(slice.vnd, true) + '" ',
        '  data-trieu="' + formatMillion(slice.trieu, 3) + '" ',
        '  data-pct="' + formatMillion(slice.pct, 1) + '" ',
        '  data-color="' + slice.color + '"/>'
      );

      if (slice.pct >= 4.2) {
        var lx = cx + labelRadius * Math.cos(midRad);
        var ly = cy + labelRadius * Math.sin(midRad);
        labels.push(
          '<g class="rev-pie-slice-label" pointer-events="none">',
          '  <text x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) + '" text-anchor="middle" class="rev-pie-pct-text" style="font-size:11.5px;">' + formatMillion(slice.pct, 1) + '%</text>',
          '</g>'
        );
      }
    });

    var centerBadge = '';
    if (currentState.dishPieStyle === 'donut') {
      centerBadge = [
        '<g class="rev-donut-center" pointer-events="none">',
        '  <circle cx="' + cx + '" cy="' + cy + '" r="' + (rInner - 2) + '" fill="var(--rev-card-bg, #FFFFFF)"/>',
        '  <text x="' + cx + '" y="' + (cy - 3) + '" text-anchor="middle" class="rev-donut-total-val">' + formatMillion(totalVnd / 1000000, 2) + '</text>',
        '  <text x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle" class="rev-donut-total-unit">Triệu VNĐ</text>',
        '</g>'
      ].join('');
    }

    var svgHtml = [
      '<svg class="rev-pie-svg" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Biểu đồ tròn cơ cấu doanh thu theo món Mộc Giang">',
      paths.join(''),
      labels.join(''),
      centerBadge,
      '</svg>'
    ].join('');

    return {
      slices: slices,
      totalVnd: totalVnd,
      svgHtml: svgHtml
    };
  }

  /**
   * Xác định kênh chủ đạo trong một ngày
   */
  function getDominantChannel(item) {
    var o = Number(item.onlineVnd) || 0;
    var d = Number(item.dineInVnd) || 0;
    var t = Number(item.takeawayVnd) || 0;
    var total = o + d + t || 1;

    if (d >= o && d >= t) {
      return { cfg: CHANNEL_CONFIG.dineIn, pct: ((d / total) * 100).toFixed(1).replace('.', ',') };
    }
    if (o >= d && o >= t) {
      return { cfg: CHANNEL_CONFIG.online, pct: ((o / total) * 100).toFixed(1).replace('.', ',') };
    }
    return { cfg: CHANNEL_CONFIG.takeaway, pct: ((t / total) * 100).toFixed(1).replace('.', ',') };
  }

  /**
   * Đồng bộ trạng thái active trên menu con bên thanh Sidebar trái
   */
  function syncSidebarRevenueSubnav() {
    var tab = currentState.activeTab;
    if (typeof window.syncRevenueSidebarActive === 'function') {
      window.syncRevenueSidebarActive(tab);
    }
    var navChannel = document.getElementById('nav-revenue-channel');
    var navDish = document.getElementById('nav-revenue-dish');
    if (navChannel) {
      navChannel.classList.toggle('active', tab === 'channel');
    }
    if (navDish) {
      navDish.classList.toggle('active', tab === 'dish');
    }
  }

  /**
   * Hàm chuyển đổi giữa 2 phân mục Doanh thu ('channel' | 'dish')
   */
  window.switchRevenueTab = function (tab) {
    if (tab === 'channel' || tab === 'dish') {
      currentState.activeTab = tab;
    }
    syncSidebarRevenueSubnav();
    window.renderRevenue();
  };

  /**
   * Inject CSS chuyên biệt cho cả 2 tab Doanh thu
   */
  function ensureRevenueStyles() {
    if (document.getElementById('mg-revenue-styles')) {
      return;
    }
    var style = document.createElement('style');
    style.id = 'mg-revenue-styles';
    style.textContent = [
      '#view-revenue {',
      '  --rev-card-bg: #FFFFFF;',
      '  --rev-card-border: #E6DEC8;',
      '  --rev-text-main: #2C180A;',
      '  --rev-text-muted: #6E5A49;',
      '  --rev-bg-soft: #FBF7EE;',
      '  --rev-bg-row-alt: #FAF5EA;',
      '  color: var(--rev-text-main);',
      '}',
      'body.dark-mode #view-revenue, [data-theme="dark"] #view-revenue {',
      '  --rev-card-bg: #24160D;',
      '  --rev-card-border: #422A1B;',
      '  --rev-text-main: #F7EFE2;',
      '  --rev-text-muted: #C2AF9B;',
      '  --rev-bg-soft: #1B1009;',
      '  --rev-bg-row-alt: #2B1B10;',
      '}',
      '.rev-container {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 18px;',
      '  padding-bottom: 28px;',
      '}',
      '/* Top Sub-Navigation Bar (Doanh thu theo hình thức | Doanh thu theo món) */',
      '.rev-subnav-bar {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 12px 18px;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 12px;',
      '  box-shadow: 0 2px 8px rgba(61, 31, 13, 0.04);',
      '}',
      '.rev-subnav-tabs {',
      '  display: inline-flex;',
      '  flex-wrap: wrap;',
      '  gap: 8px;',
      '}',
      '.rev-subnav-tab {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 9px;',
      '  padding: 10px 18px;',
      '  border-radius: 10px;',
      '  border: 1px solid var(--rev-card-border);',
      '  background: var(--rev-bg-soft);',
      '  color: var(--rev-text-main);',
      '  font-size: 0.9rem;',
      '  font-weight: 700;',
      '  cursor: pointer;',
      '  transition: all 0.18s ease;',
      '}',
      '.rev-subnav-tab:hover {',
      '  border-color: #2E6B22;',
      '  transform: translateY(-1px);',
      '}',
      '.rev-subnav-tab.active {',
      '  background: linear-gradient(135deg, #2E6B22 0%, #3A7D2C 100%);',
      '  color: #FFFFFF;',
      '  border-color: #2E6B22;',
      '  box-shadow: 0 4px 12px rgba(46, 107, 34, 0.25);',
      '}',
      '.rev-subnav-pill {',
      '  font-size: 0.73rem;',
      '  font-weight: 700;',
      '  padding: 2px 8px;',
      '  border-radius: 999px;',
      '  background: rgba(255, 255, 255, 0.2);',
      '}',
      '.rev-subnav-tab:not(.active) .rev-subnav-pill {',
      '  background: rgba(61, 31, 13, 0.08);',
      '  color: var(--rev-text-muted);',
      '}',
      '.rev-pos-source-badge {',
      '  font-size: 0.78rem;',
      '  font-weight: 600;',
      '  color: var(--rev-text-muted);',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '}',
      '.rev-header-card {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 18px 22px;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 16px;',
      '  box-shadow: 0 2px 10px rgba(61, 31, 13, 0.05);',
      '}',
      '.rev-header-title-group h2 {',
      '  margin: 0 0 5px 0;',
      '  font-size: 1.3rem;',
      '  font-weight: 800;',
      '  color: var(--rev-text-main);',
      '  display: flex;',
      '  align-items: center;',
      '  flex-wrap: wrap;',
      '  gap: 10px;',
      '}',
      '.rev-header-badge {',
      '  font-size: 0.75rem;',
      '  font-weight: 700;',
      '  padding: 3px 10px;',
      '  border-radius: 999px;',
      '  background: rgba(46, 107, 34, 0.12);',
      '  color: #2E6B22;',
      '  border: 1px solid rgba(46, 107, 34, 0.28);',
      '}',
      '.rev-header-subtitle {',
      '  margin: 0;',
      '  font-size: 0.88rem;',
      '  color: var(--rev-text-muted);',
      '}',
      '.rev-period-switcher {',
      '  display: inline-flex;',
      '  background: var(--rev-bg-soft);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 10px;',
      '  padding: 4px;',
      '  gap: 4px;',
      '  flex-wrap: wrap;',
      '}',
      '.rev-period-btn {',
      '  border: none;',
      '  background: transparent;',
      '  color: var(--rev-text-muted);',
      '  font-size: 0.82rem;',
      '  font-weight: 600;',
      '  padding: 7px 13px;',
      '  border-radius: 7px;',
      '  cursor: pointer;',
      '  transition: all 0.16s ease;',
      '}',
      '.rev-period-btn:hover {',
      '  color: var(--rev-text-main);',
      '  background: rgba(61, 31, 13, 0.05);',
      '}',
      '.rev-period-btn.active {',
      '  background: #2E6B22;',
      '  color: #FFFFFF;',
      '  box-shadow: 0 2px 6px rgba(46, 107, 34, 0.28);',
      '}',
      '/* Dish Filter Bar */',
      '.rev-filter-toolbar {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 14px 18px;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 14px;',
      '}',
      '.rev-filter-group {',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  gap: 8px;',
      '}',
      '.rev-filter-label {',
      '  font-size: 0.8rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-muted);',
      '  margin-right: 2px;',
      '}',
      '.rev-select-input, .rev-search-input {',
      '  background: var(--rev-bg-soft);',
      '  border: 1px solid var(--rev-card-border);',
      '  color: var(--rev-text-main);',
      '  border-radius: 8px;',
      '  padding: 7px 12px;',
      '  font-size: 0.84rem;',
      '  font-weight: 600;',
      '  font-family: inherit;',
      '}',
      '.rev-search-input {',
      '  min-width: 220px;',
      '}',
      '/* 4 KPI Cards */',
      '.rev-kpi-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(4, minmax(0, 1fr));',
      '  gap: 16px;',
      '}',
      '@media (max-width: 1100px) {',
      '  .rev-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
      '}',
      '@media (max-width: 600px) {',
      '  .rev-kpi-grid { grid-template-columns: 1fr; }',
      '}',
      '.rev-kpi-card {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 16px 18px;',
      '  position: relative;',
      '  overflow: hidden;',
      '  box-shadow: 0 2px 8px rgba(61, 31, 13, 0.04);',
      '  transition: transform 0.18s ease, box-shadow 0.18s ease;',
      '}',
      '.rev-kpi-card[data-toggle-channel] {',
      '  cursor: pointer;',
      '}',
      '.rev-kpi-card:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 6px 16px rgba(61, 31, 13, 0.08);',
      '}',
      '.rev-kpi-card.is-highlighted {',
      '  outline: 2px solid #2E6B22;',
      '}',
      '.rev-kpi-top {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  margin-bottom: 8px;',
      '  gap: 6px;',
      '}',
      '.rev-kpi-label {',
      '  font-size: 0.83rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-muted);',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 7px;',
      '}',
      '.rev-kpi-dot {',
      '  width: 10px;',
      '  height: 10px;',
      '  border-radius: 3px;',
      '  display: inline-block;',
      '  flex-shrink: 0;',
      '}',
      '.rev-kpi-pct-pill {',
      '  font-size: 0.76rem;',
      '  font-weight: 700;',
      '  padding: 2px 8px;',
      '  border-radius: 999px;',
      '  white-space: nowrap;',
      '}',
      '.rev-kpi-value-row {',
      '  display: flex;',
      '  align-items: baseline;',
      '  gap: 6px;',
      '  margin-bottom: 4px;',
      '}',
      '.rev-kpi-value {',
      '  font-size: 1.55rem;',
      '  font-weight: 800;',
      '  letter-spacing: -0.02em;',
      '  color: var(--rev-text-main);',
      '}',
      '.rev-kpi-unit {',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-muted);',
      '}',
      '.rev-kpi-subvnd {',
      '  font-size: 0.8rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-main);',
      '  margin-bottom: 6px;',
      '}',
      '.rev-kpi-foot {',
      '  font-size: 0.77rem;',
      '  color: var(--rev-text-muted);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '}',
      '.rev-kpi-bar-track {',
      '  margin-top: 9px;',
      '  height: 5px;',
      '  background: var(--rev-bg-soft);',
      '  border-radius: 999px;',
      '  overflow: hidden;',
      '}',
      '.rev-kpi-bar-fill {',
      '  height: 100%;',
      '  border-radius: 999px;',
      '  transition: width 0.35s ease;',
      '}',
      '/* Main 2-column chart layout */',
      '.rev-chart-split {',
      '  display: grid;',
      '  grid-template-columns: 1.42fr 1fr;',
      '  gap: 20px;',
      '  align-items: stretch;',
      '}',
      '@media (max-width: 1080px) {',
      '  .rev-chart-split { grid-template-columns: 1fr; }',
      '}',
      '.rev-chart-card {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 20px 22px;',
      '  display: flex;',
      '  flex-direction: column;',
      '  justify-content: space-between;',
      '  box-shadow: 0 2px 10px rgba(61, 31, 13, 0.04);',
      '  position: relative;',
      '}',
      '.rev-card-head {',
      '  display: flex;',
      '  align-items: flex-start;',
      '  justify-content: space-between;',
      '  flex-wrap: wrap;',
      '  gap: 12px;',
      '  margin-bottom: 14px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '  padding-bottom: 12px;',
      '}',
      '.rev-card-head h3 {',
      '  margin: 0 0 4px 0;',
      '  font-size: 1.05rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-main);',
      '}',
      '.rev-card-head p {',
      '  margin: 0;',
      '  font-size: 0.81rem;',
      '  color: var(--rev-text-muted);',
      '}',
      '.rev-chart-unit-tag {',
      '  font-size: 0.76rem;',
      '  font-weight: 700;',
      '  padding: 5px 10px;',
      '  border-radius: 8px;',
      '  background: var(--rev-bg-soft);',
      '  border: 1px solid var(--rev-card-border);',
      '  color: var(--rev-text-main);',
      '  white-space: nowrap;',
      '}',
      '/* SVG Bar Charts */',
      '.rev-bar-chart-stage {',
      '  width: 100%;',
      '  overflow-x: auto;',
      '  position: relative;',
      '}',
      '.rev-grouped-bar-svg {',
      '  width: 100%;',
      '  height: auto;',
      '  min-width: 560px;',
      '  display: block;',
      '  font-family: inherit;',
      '}',
      '.rev-axis-unit-title {',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-axis-label-y {',
      '  font-size: 11px;',
      '  font-weight: 600;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-axis-label-x {',
      '  font-size: 11.5px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-main);',
      '}',
      '.rev-axis-sub-x {',
      '  font-size: 9.8px;',
      '  font-weight: 600;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-dish-x-label {',
      '  font-size: 10.5px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-main);',
      '}',
      '.rev-axis-x-title {',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-bar-cluster:hover .rev-cluster-hover-bg {',
      '  fill: rgba(61, 31, 13, 0.04);',
      '}',
      '.rev-single-bar-wrap, .rev-dish-bar-wrap {',
      '  cursor: pointer;',
      '  transition: opacity 0.2s ease;',
      '}',
      '.rev-single-bar-wrap.is-dimmed {',
      '  opacity: 0.25;',
      '}',
      '.rev-single-bar-wrap:hover .rev-bar-rect, .rev-dish-bar-wrap:hover .rev-bar-rect {',
      '  filter: brightness(1.08);',
      '  stroke-width: 1.5px;',
      '}',
      '.rev-bar-val-text {',
      '  font-size: 10px;',
      '  font-weight: 700;',
      '}',
      '/* Bottom Legend under Bar Chart */',
      '.rev-bar-legend {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  flex-wrap: wrap;',
      '  gap: 18px;',
      '  margin-top: 12px;',
      '  padding-top: 12px;',
      '  border-top: 1px dashed var(--rev-card-border);',
      '}',
      '.rev-legend-item {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  font-size: 0.85rem;',
      '  font-weight: 600;',
      '  color: var(--rev-text-main);',
      '  cursor: pointer;',
      '  padding: 5px 10px;',
      '  border-radius: 8px;',
      '  border: 1px solid transparent;',
      '  transition: all 0.15s ease;',
      '  user-select: none;',
      '}',
      '.rev-legend-item:hover {',
      '  background: var(--rev-bg-soft);',
      '  border-color: var(--rev-card-border);',
      '}',
      '.rev-legend-item.is-active {',
      '  background: var(--rev-bg-soft);',
      '  border-color: var(--rev-text-main);',
      '}',
      '.rev-legend-item.is-dimmed {',
      '  opacity: 0.45;',
      '}',
      '.rev-legend-swatch {',
      '  width: 13px;',
      '  height: 13px;',
      '  border-radius: 3px;',
      '  display: inline-block;',
      '}',
      '/* Pie Chart & Breakdown Table */',
      '.rev-pie-layout {',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: center;',
      '  gap: 14px;',
      '}',
      '.rev-pie-svg-wrap {',
      '  width: 235px;',
      '  height: 235px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '}',
      '.rev-pie-svg {',
      '  width: 100%;',
      '  height: 100%;',
      '  overflow: visible;',
      '}',
      '.rev-pie-slice, .rev-dish-pie-slice {',
      '  cursor: pointer;',
      '  transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;',
      '}',
      '.rev-pie-slice:hover, .rev-dish-pie-slice:hover {',
      '  filter: brightness(1.08);',
      '}',
      '.rev-pie-slice.is-dimmed {',
      '  opacity: 0.3;',
      '}',
      '.rev-pie-pct-text {',
      '  font-size: 12.5px;',
      '  font-weight: 800;',
      '  fill: #FFFFFF;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.48);',
      '}',
      '.rev-pie-name-text {',
      '  font-size: 10px;',
      '  font-weight: 700;',
      '  fill: #FFFFFF;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.48);',
      '}',
      '.rev-donut-total-val {',
      '  font-size: 16px;',
      '  font-weight: 800;',
      '  fill: var(--rev-text-main);',
      '}',
      '.rev-donut-total-unit {',
      '  font-size: 10px;',
      '  font-weight: 600;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-pie-mode-toggle {',
      '  display: inline-flex;',
      '  background: var(--rev-bg-soft);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 8px;',
      '  padding: 2px;',
      '}',
      '.rev-pie-mode-btn {',
      '  border: none;',
      '  background: transparent;',
      '  font-size: 0.75rem;',
      '  font-weight: 600;',
      '  color: var(--rev-text-muted);',
      '  padding: 4px 9px;',
      '  border-radius: 6px;',
      '  cursor: pointer;',
      '}',
      '.rev-pie-mode-btn.active {',
      '  background: var(--rev-card-bg);',
      '  color: var(--rev-text-main);',
      '  box-shadow: 0 1px 3px rgba(0,0,0,0.08);',
      '}',
      '.rev-pie-table {',
      '  width: 100%;',
      '  border-collapse: collapse;',
      '  font-size: 0.83rem;',
      '}',
      '.rev-pie-table th {',
      '  text-align: left;',
      '  font-size: 0.74rem;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.03em;',
      '  color: var(--rev-text-muted);',
      '  padding: 6px 8px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '}',
      '.rev-pie-table td {',
      '  padding: 8px 8px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '  font-weight: 600;',
      '}',
      '.rev-pie-table tr.rev-pie-row {',
      '  cursor: pointer;',
      '  transition: background 0.15s ease;',
      '}',
      '.rev-pie-table tr.rev-pie-row:hover, .rev-pie-table tr.rev-pie-row.is-active {',
      '  background: var(--rev-bg-soft);',
      '}',
      '.rev-pie-table tfoot td {',
      '  font-weight: 800;',
      '  background: var(--rev-bg-soft);',
      '  border-bottom: none;',
      '}',
      '/* Tables */',
      '.rev-table-card {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 20px 22px;',
      '  box-shadow: 0 2px 10px rgba(61, 31, 13, 0.04);',
      '}',
      '.rev-table-wrap {',
      '  width: 100%;',
      '  overflow-x: auto;',
      '}',
      '.rev-detail-table {',
      '  width: 100%;',
      '  border-collapse: collapse;',
      '  font-size: 0.86rem;',
      '}',
      '.rev-detail-table th {',
      '  background: var(--rev-bg-soft);',
      '  color: var(--rev-text-main);',
      '  font-weight: 700;',
      '  padding: 10px 12px;',
      '  text-align: left;',
      '  border-bottom: 2px solid var(--rev-card-border);',
      '  white-space: nowrap;',
      '}',
      '.rev-detail-table td {',
      '  padding: 10px 12px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '  color: var(--rev-text-main);',
      '  vertical-align: middle;',
      '}',
      '.rev-detail-table tbody tr:nth-child(even) {',
      '  background: var(--rev-bg-row-alt);',
      '}',
      '.rev-detail-table tbody tr:hover {',
      '  background: rgba(46, 107, 34, 0.07);',
      '}',
      '.rev-detail-table tfoot td {',
      '  background: var(--rev-bg-soft);',
      '  font-weight: 800;',
      '  padding: 12px 12px;',
      '  border-top: 2px solid var(--rev-card-border);',
      '}',
      '.rev-num-col {',
      '  text-align: right !important;',
      '  font-variant-numeric: tabular-nums;',
      '}',
      '.rev-channel-badge {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '  padding: 3px 10px;',
      '  border-radius: 999px;',
      '  font-size: 0.76rem;',
      '  font-weight: 700;',
      '  white-space: nowrap;',
      '}',
      '.rev-rank-badge {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  width: 26px;',
      '  height: 26px;',
      '  border-radius: 7px;',
      '  font-size: 0.78rem;',
      '  font-weight: 800;',
      '  background: var(--rev-bg-soft);',
      '  color: var(--rev-text-main);',
      '  border: 1px solid var(--rev-card-border);',
      '}',
      '.rev-rank-badge.rank-1 { background: #2E6B22; color: #FFFFFF; border-color: #2E6B22; }',
      '.rev-rank-badge.rank-2 { background: #2B7BBB; color: #FFFFFF; border-color: #2B7BBB; }',
      '.rev-rank-badge.rank-3 { background: #D97724; color: #FFFFFF; border-color: #D97724; }',
      '.rev-share-bar-cell {',
      '  min-width: 145px;',
      '}',
      '.rev-share-bar-wrap {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '}',
      '.rev-share-track {',
      '  flex: 1;',
      '  height: 7px;',
      '  background: var(--rev-bg-soft);',
      '  border-radius: 999px;',
      '  overflow: hidden;',
      '  border: 1px solid var(--rev-card-border);',
      '}',
      '.rev-share-fill {',
      '  height: 100%;',
      '  border-radius: 999px;',
      '}',
      '.rev- floating-tooltip, .rev-floating-tooltip {',
      '  position: fixed;',
      '  z-index: 9999;',
      '  pointer-events: none;',
      '  background: #2C180A;',
      '  color: #FFFFFF;',
      '  padding: 10px 14px;',
      '  border-radius: 10px;',
      '  font-size: 0.8rem;',
      '  line-height: 1.45;',
      '  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);',
      '  border: 1px solid rgba(255, 255, 255, 0.14);',
      '  opacity: 0;',
      '  transform: translateY(4px);',
      '  transition: opacity 0.12s ease, transform 0.12s ease;',
      '}',
      '.rev-floating-tooltip.visible {',
      '  opacity: 1;',
      '  transform: translateY(0);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /**
   * Tạo hoặc lấy phần tử Tooltip nổi
   */
  function getOrCreateTooltip() {
    var tip = document.getElementById('mg-revenue-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'mg-revenue-tooltip';
      tip.className = 'rev-floating-tooltip';
      document.body.appendChild(tip);
    }
    return tip;
  }

  /**
   * Dựng HTML cho Thanh chuyển đổi 2 phân mục Doanh thu ở đầu trang
   */
  function buildTopSubnavBar() {
    var isChannel = currentState.activeTab === 'channel';
    return [
      '<div class="rev-subnav-bar mg-card">',
      '  <div class="rev-subnav-tabs" role="tablist" aria-label="Phân mục Quản lý Doanh thu">',
      '    <button type="button" class="rev-subnav-tab ' + (isChannel ? 'active' : '') + '" data-switch-rev-tab="channel">',
      '      <span>📊 1. Doanh thu theo hình thức</span>',
      '      <span class="rev-subnav-pill">Tại chỗ · Mang về · Online</span>',
      '    </button>',
      '    <button type="button" class="rev-subnav-tab ' + (!isChannel ? 'active' : '') + '" data-switch-rev-tab="dish">',
      '      <span>🍱 2. Doanh thu theo món</span>',
      '      <span class="rev-subnav-pill">80 món · Cơm · Đồ uống · Bánh bao</span>',
      '    </button>',
      '  </div>',
      '  <div class="rev-pos-source-badge">',
      '    <span style="width:8px;height:8px;border-radius:50%;background:#2E6B22;display:inline-block;"></span>',
      '    <span>Dữ liệu POS thực tế: <strong>156 hóa đơn</strong> (17/11 – 24/11/2026) · Tổng <strong>13.480.000 VNĐ</strong></span>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /**
   * TAB 1 HTML — Doanh thu theo hình thức (Bán tại chỗ · Bán mang về · Bán online)
   */
  function buildChannelTabHTML() {
    var dataset = getChannelPeriodDataset(currentState.channelPeriod);
    var summary = computeChannelSummary(dataset);
    var hl = currentState.highlightedChannel;

    var barChartSVG = buildChannelGroupedBarSVG(dataset);
    var pieChartSVG = buildChannelPieSVG(summary);

    // Bảng tổng hợp theo ngày
    var dailyRowsHtml = (dataset.items || []).map(function (item) {
      var dom = getDominantChannel(item);
      return [
        '<tr>',
        '  <td>',
        '    <div style="font-weight:700;">' + item.date + '/2026</div>',
        '    <div style="font-size:0.75rem;color:var(--rev-text-muted);">' + item.fullDate + '</div>',
        '  </td>',
        '  <td class="rev-num-col" style="font-weight:700;">' + item.orderCount + ' đơn</td>',
        '  <td class="rev-num-col">',
        '    <div style="color:' + CHANNEL_CONFIG.online.color + ';font-weight:700;">' + formatMillion(item.online, 3) + ' tr</div>',
        '    <div style="font-size:0.74rem;color:var(--rev-text-muted);">' + formatVnd(item.onlineVnd, true) + '</div>',
        '  </td>',
        '  <td class="rev-num-col">',
        '    <div style="color:' + CHANNEL_CONFIG.dineIn.color + ';font-weight:700;">' + formatMillion(item.dineIn, 3) + ' tr</div>',
        '    <div style="font-size:0.74rem;color:var(--rev-text-muted);">' + formatVnd(item.dineInVnd, true) + '</div>',
        '  </td>',
        '  <td class="rev-num-col">',
        '    <div style="color:' + CHANNEL_CONFIG.takeaway.color + ';font-weight:700;">' + formatMillion(item.takeaway, 3) + ' tr</div>',
        '    <div style="font-size:0.74rem;color:var(--rev-text-muted);">' + formatVnd(item.takeawayVnd, true) + '</div>',
        '  </td>',
        '  <td class="rev-num-col">',
        '    <div style="font-weight:800;font-size:0.92rem;">' + formatMillion(item.total, 3) + ' tr</div>',
        '    <div style="font-size:0.75rem;font-weight:700;color:#2E6B22;">' + formatVnd(item.totalVnd, true) + '</div>',
        '  </td>',
        '  <td>',
        '    <span class="rev-channel-badge" style="background:' + dom.cfg.colorLight + ';color:' + dom.cfg.color + ';border:1px solid ' + dom.cfg.colorBorder + ';">',
        '      <span style="width:7px;height:7px;border-radius:50%;background:' + dom.cfg.color + ';display:inline-block;"></span>',
        '      ' + dom.cfg.label + ' (' + dom.pct + '%)',
        '    </span>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('');

    // Lọc danh sách 156 hóa đơn POS thực tế
    var q = (currentState.invoiceSearch || '').trim().toLowerCase();
    var chFilter = currentState.invoiceChannelFilter;
    var dtFilter = currentState.invoiceDateFilter;

    var matchingInvoices = (dataset.invoices || []).filter(function (inv) {
      if (chFilter !== 'all' && inv.channelKey !== chFilter) return false;
      if (dtFilter !== 'all' && inv.date !== dtFilter) return false;
      if (q) {
        var inNo = (inv.invoiceNo || '').toLowerCase();
        var tb = (inv.table || '').toLowerCase();
        var itemsText = (inv.items || []).map(function (i) { return i.name; }).join(' ').toLowerCase();
        if (inNo.indexOf(q) === -1 && tb.indexOf(q) === -1 && itemsText.indexOf(q) === -1) {
          return false;
        }
      }
      return true;
    });

    var visibleInvoices = currentState.showAllInvoices ? matchingInvoices : matchingInvoices.slice(0, 15);
    var invoiceRowsHtml = visibleInvoices.map(function (inv) {
      var cfg = CHANNEL_CONFIG[inv.channelKey] || CHANNEL_CONFIG.dineIn;
      var itemsSummary = (inv.items || []).map(function (it) {
        return it.name + ' (x' + it.quantity + ')';
      }).join(', ');
      return [
        '<tr>',
        '  <td style="font-weight:700;">#' + inv.stt + '</td>',
        '  <td><code style="font-weight:700;background:var(--rev-bg-soft);padding:2px 6px;border-radius:5px;">' + inv.invoiceNo + '</code></td>',
        '  <td>' + inv.fullDate + ' · ' + inv.timeIn + '</td>',
        '  <td>' + inv.table + '</td>',
        '  <td>',
        '    <span class="rev-channel-badge" style="background:' + cfg.colorLight + ';color:' + cfg.color + ';border:1px solid ' + cfg.colorBorder + ';">' + cfg.label + '</span>',
        '  </td>',
        '  <td style="max-width:320px;font-size:0.8rem;color:var(--rev-text-muted);">' + itemsSummary + '</td>',
        '  <td class="rev-num-col" style="font-weight:800;">' + formatVnd(inv.totalVnd, true) + '</td>',
        '  <td style="font-size:0.78rem;">' + (inv.paymentMethod || 'Tiền mặt') + '</td>',
        '</tr>'
      ].join('');
    }).join('');

    return [
      '<!-- Header Bar Tab 1 -->',
      '<div class="rev-header-card mg-card">',
      '  <div class="rev-header-title-group">',
      '    <h2>',
      '      <span>Doanh thu theo hình thức — Nhà hàng Mộc Giang</span>',
      '      <span class="rev-header-badge">POS Thực Tế · 199 Hoàng Cầu</span>',
      '    </h2>',
      '    <p class="rev-header-subtitle">Thống kê doanh thu thực tế theo 3 hình thức: <strong>Bán tại chỗ</strong> · <strong>Bán mang về</strong> · <strong>Bán online</strong> (Đơn vị: Triệu VNĐ & VNĐ)</p>',
      '  </div>',
      '  <div class="rev-period-switcher" role="tablist" aria-label="Bộ lọc thời gian doanh thu POS">',
      '    <button type="button" class="rev-period-btn ' + (currentState.channelPeriod === 'all8days' ? 'active' : '') + '" data-channel-period="all8days">Tất cả (17/11 – 24/11/2026)</button>',
      '    <button type="button" class="rev-period-btn ' + (currentState.channelPeriod === 'last7days' ? 'active' : '') + '" data-channel-period="last7days">7 ngày gần nhất (18/11 – 24/11)</button>',
      '    <button type="button" class="rev-period-btn ' + (currentState.channelPeriod === 'week17_23' ? 'active' : '') + '" data-channel-period="week17_23">Tuần 17/11 – 23/11</button>',
      '  </div>',
      '</div>',

      '<!-- 4 KPI Cards Tab 1 -->',
      '<div class="rev-kpi-grid">',
      '  <div class="rev-kpi-card mg-card" style="border-top: 4px solid #3D1F0D;">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#3D1F0D;"></span>Tổng doanh thu thực tế</span>',
      '      <span class="rev-kpi-pct-pill" style="background:rgba(61,31,13,0.1);color:#3D1F0D;">100%</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value">' + formatMillion(summary.total, 3) + '</span>',
      '      <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd"> Chính xác: ' + formatVnd(summary.totalVnd, true) + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span style="color:#2E6B22;font-weight:700;">TB: ' + formatVnd(summary.avgPerDayVnd, true) + '/ngày</span>',
      '      <span><strong>' + summary.orders + '</strong> hóa đơn</span>',
      '    </div>',
      '    <div class="rev-kpi-bar-track">',
      '      <div class="rev-kpi-bar-fill" style="width:100%;background:linear-gradient(90deg, #2E6B22 0%, #2B7BBB 55%, #D97724 100%);"></div>',
      '    </div>',
      '  </div>',

      '  <div class="rev-kpi-card mg-card ' + (hl === 'dineIn' ? 'is-highlighted' : '') + '" data-toggle-channel="dineIn" style="border-top: 4px solid ' + CHANNEL_CONFIG.dineIn.color + ';" title="Bấm để lọc riêng kênh Bán tại chỗ">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';"></span>' + CHANNEL_CONFIG.dineIn.fullLabel + '</span>',
      '      <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.dineIn.colorLight + ';color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.pctDineIn, 1) + '%</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.dineIn, 3) + '</span>',
      '      <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd">' + formatVnd(summary.dineInVnd, true) + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Tỷ trọng: <strong>' + formatMillion(summary.pctDineIn, 1) + '%</strong></span>',
      '      <span><strong>' + summary.dineInOrders + '</strong> hóa đơn</span>',
      '    </div>',
      '    <div class="rev-kpi-bar-track">',
      '      <div class="rev-kpi-bar-fill" style="width:' + summary.pctDineIn + '%;background:' + CHANNEL_CONFIG.dineIn.color + ';"></div>',
      '    </div>',
      '  </div>',

      '  <div class="rev-kpi-card mg-card ' + (hl === 'online' ? 'is-highlighted' : '') + '" data-toggle-channel="online" style="border-top: 4px solid ' + CHANNEL_CONFIG.online.color + ';" title="Bấm để lọc riêng kênh Bán online">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';"></span>' + CHANNEL_CONFIG.online.fullLabel + '</span>',
      '      <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.online.colorLight + ';color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.pctOnline, 1) + '%</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.online, 3) + '</span>',
      '      <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd">' + formatVnd(summary.onlineVnd, true) + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Tỷ trọng: <strong>' + formatMillion(summary.pctOnline, 1) + '%</strong></span>',
      '      <span><strong>' + summary.onlineOrders + '</strong> hóa đơn</span>',
      '    </div>',
      '    <div class="rev-kpi-bar-track">',
      '      <div class="rev-kpi-bar-fill" style="width:' + summary.pctOnline + '%;background:' + CHANNEL_CONFIG.online.color + ';"></div>',
      '    </div>',
      '  </div>',

      '  <div class="rev-kpi-card mg-card ' + (hl === 'takeaway' ? 'is-highlighted' : '') + '" data-toggle-channel="takeaway" style="border-top: 4px solid ' + CHANNEL_CONFIG.takeaway.color + ';" title="Bấm để lọc riêng kênh Bán mang về">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';"></span>' + CHANNEL_CONFIG.takeaway.fullLabel + '</span>',
      '      <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.takeaway.colorLight + ';color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.pctTakeaway, 1) + '%</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.takeaway, 3) + '</span>',
      '      <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd">' + formatVnd(summary.takeawayVnd, true) + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Tỷ trọng: <strong>' + formatMillion(summary.pctTakeaway, 1) + '%</strong></span>',
      '      <span><strong>' + summary.takeawayOrders + '</strong> hóa đơn</span>',
      '    </div>',
      '    <div class="rev-kpi-bar-track">',
      '      <div class="rev-kpi-bar-fill" style="width:' + summary.pctTakeaway + '%;background:' + CHANNEL_CONFIG.takeaway.color + ';"></div>',
      '    </div>',
      '  </div>',
      '</div>',

      '<!-- 2-Column Chart Section Tab 1 -->',
      '<div class="chart-split-grid rev-chart-split">',
      '  <!-- Left: Vertical Grouped Bar Chart -->',
      '  <div class="rev-chart-card mg-card">',
      '    <div class="rev-card-head">',
      '      <div>',
      '        <h3>Biểu đồ cột nhóm Doanh thu theo 3 hình thức (Vertical Grouped Bar Chart)</h3>',
      '        <p>Ba cột đứng cạnh nhau theo từng ngày: <strong>Bán online</strong> · <strong>Bán tại chỗ</strong> · <strong>Bán mang về</strong></p>',
      '      </div>',
      '      <span class="rev-chart-unit-tag">Đơn vị: Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-bar-chart-stage">',
      barChartSVG,
      '    </div>',
      '    <div class="rev-bar-legend" aria-label="Chú thích 3 kênh doanh thu">',
      '      <div class="rev-legend-item ' + (hl === 'online' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="online">',
      '        <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.online.color + ';"></span>',
      '        <span>Bán online (' + formatMillion(summary.online, 3) + ' tr · ' + formatMillion(summary.pctOnline, 1) + '%)</span>',
      '      </div>',
      '      <div class="rev-legend-item ' + (hl === 'dineIn' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="dineIn">',
      '        <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.dineIn.color + ';"></span>',
      '        <span>Bán tại chỗ (' + formatMillion(summary.dineIn, 3) + ' tr · ' + formatMillion(summary.pctDineIn, 1) + '%)</span>',
      '      </div>',
      '      <div class="rev-legend-item ' + (hl === 'takeaway' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="takeaway">',
      '        <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.takeaway.color + ';"></span>',
      '        <span>Bán mang về (' + formatMillion(summary.takeaway, 3) + ' tr · ' + formatMillion(summary.pctTakeaway, 1) + '%)</span>',
      '      </div>',
      (hl ? '<button type="button" class="rev-pie-mode-btn active" data-toggle-channel="' + hl + '">✕ Bỏ lọc</button>' : ''),
      '    </div>',
      '  </div>',

      '  <!-- Right: Pie / Donut Chart -->',
      '  <div class="rev-chart-card mg-card">',
      '    <div class="rev-card-head">',
      '      <div>',
      '        <h3>Biểu đồ tròn Cơ cấu Doanh thu theo hình thức (%)</h3>',
      '        <p>Tỷ trọng phần trăm từng kênh bán hàng thực tế</p>',
      '      </div>',
      '      <div class="rev-pie-mode-toggle" role="group">',
      '        <button type="button" class="rev-pie-mode-btn ' + (currentState.channelPieStyle === 'pie' ? 'active' : '') + '" data-channel-piemode="pie">Biểu đồ tròn</button>',
      '        <button type="button" class="rev-pie-mode-btn ' + (currentState.channelPieStyle === 'donut' ? 'active' : '') + '" data-channel-piemode="donut">Donut</button>',
      '      </div>',
      '    </div>',
      '    <div class="rev-pie-layout">',
      '      <div class="rev-pie-svg-wrap">',
      pieChartSVG,
      '      </div>',
      '      <table class="rev-pie-table" aria-label="Bảng tỷ trọng doanh thu theo hình thức">',
      '        <thead>',
      '          <tr>',
      '            <th>Hình thức bán</th>',
      '            <th class="rev-num-col">Số đơn</th>',
      '            <th class="rev-num-col">Doanh thu (VNĐ / Triệu)</th>',
      '            <th class="rev-num-col">Tỷ trọng</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody>',
      '          <tr class="rev-pie-row ' + (hl === 'dineIn' ? 'is-active' : '') + '" data-toggle-channel="dineIn">',
      '            <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';margin-right:7px;"></span><strong>Bán tại chỗ</strong></td>',
      '            <td class="rev-num-col">' + summary.dineInOrders + '</td>',
      '            <td class="rev-num-col"><div style="color:' + CHANNEL_CONFIG.dineIn.color + ';font-weight:700;">' + formatVnd(summary.dineInVnd, true) + '</div><div style="font-size:0.73rem;color:var(--rev-text-muted);">' + formatMillion(summary.dineIn, 3) + ' triệu</div></td>',
      '            <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.dineIn.colorLight + ';color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.pctDineIn, 1) + '%</span></td>',
      '          </tr>',
      '          <tr class="rev-pie-row ' + (hl === 'online' ? 'is-active' : '') + '" data-toggle-channel="online">',
      '            <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';margin-right:7px;"></span><strong>Bán online</strong></td>',
      '            <td class="rev-num-col">' + summary.onlineOrders + '</td>',
      '            <td class="rev-num-col"><div style="color:' + CHANNEL_CONFIG.online.color + ';font-weight:700;">' + formatVnd(summary.onlineVnd, true) + '</div><div style="font-size:0.73rem;color:var(--rev-text-muted);">' + formatMillion(summary.online, 3) + ' triệu</div></td>',
      '            <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.online.colorLight + ';color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.pctOnline, 1) + '%</span></td>',
      '          </tr>',
      '          <tr class="rev-pie-row ' + (hl === 'takeaway' ? 'is-active' : '') + '" data-toggle-channel="takeaway">',
      '            <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';margin-right:7px;"></span><strong>Bán mang về</strong></td>',
      '            <td class="rev-num-col">' + summary.takeawayOrders + '</td>',
      '            <td class="rev-num-col"><div style="color:' + CHANNEL_CONFIG.takeaway.color + ';font-weight:700;">' + formatVnd(summary.takeawayVnd, true) + '</div><div style="font-size:0.73rem;color:var(--rev-text-muted);">' + formatMillion(summary.takeaway, 3) + ' triệu</div></td>',
      '            <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.takeaway.colorLight + ';color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.pctTakeaway, 1) + '%</span></td>',
      '          </tr>',
      '        </tbody>',
      '        <tfoot>',
      '          <tr>',
      '            <td>Tổng cộng</td>',
      '            <td class="rev-num-col">' + summary.orders + ' đơn</td>',
      '            <td class="rev-num-col">' + formatVnd(summary.totalVnd, true) + ' (' + formatMillion(summary.total, 3) + ' tr)</td>',
      '            <td class="rev-num-col">100,0%</td>',
      '          </tr>',
      '        </tfoot>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>',

      '<!-- Bảng chi tiết doanh thu theo ngày -->',
      '<div class="rev-table-card mg-card">',
      '  <div class="rev-card-head">',
      '    <div>',
      '      <h3>Bảng tổng hợp Doanh thu theo ngày & hình thức bán</h3>',
      '      <p>' + dataset.periodNote + ' · Trung bình <strong>' + formatVnd(summary.avgPerDayVnd, true) + '</strong> (' + formatMillion(summary.avgPerDayTrieu, 3) + ' triệu) / ngày</p>',
      '    </div>',
      '    <span class="rev-chart-unit-tag">Tổng: ' + formatVnd(summary.totalVnd, true) + ' (' + formatMillion(summary.total, 3) + ' Triệu VNĐ)</span>',
      '  </div>',
      '  <div class="rev-table-wrap">',
      '    <table class="rev-detail-table">',
      '      <thead>',
      '        <tr>',
      '          <th>Ngày</th>',
      '          <th class="rev-num-col">Số hóa đơn</th>',
      '          <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';margin-right:6px;"></span>Bán online</th>',
      '          <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';margin-right:6px;"></span>Bán tại chỗ</th>',
      '          <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';margin-right:6px;"></span>Bán mang về</th>',
      '          <th class="rev-num-col">Tổng cộng</th>',
      '          <th>Hình thức chủ đạo</th>',
      '        </tr>',
      '      </thead>',
      '      <tbody>',
      dailyRowsHtml,
      '      </tbody>',
      '      <tfoot>',
      '        <tr>',
      '          <td>TỔNG CỘNG (' + dataset.label + ')</td>',
      '          <td class="rev-num-col">' + summary.orders + ' đơn</td>',
      '          <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.online.color + ';">' + formatVnd(summary.onlineVnd, true) + ' (' + formatMillion(summary.pctOnline, 1) + '%)</td>',
      '          <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatVnd(summary.dineInVnd, true) + ' (' + formatMillion(summary.pctDineIn, 1) + '%)</td>',
      '          <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatVnd(summary.takeawayVnd, true) + ' (' + formatMillion(summary.pctTakeaway, 1) + '%)</td>',
      '          <td class="rev-num-col" style="color:#2E6B22;">' + formatVnd(summary.totalVnd, true) + ' (' + formatMillion(summary.total, 3) + ' tr)</td>',
      '          <td><strong>Bán tại chỗ (' + formatMillion(summary.pctDineIn, 1) + '%)</strong></td>',
      '        </tr>',
      '      </tfoot>',
      '    </table>',
      '  </div>',
      '</div>',

      '<!-- Bảng tra cứu 156 hóa đơn POS thực tế -->',
      '<div class="rev-table-card mg-card">',
      '  <div class="rev-card-head">',
      '    <div>',
      '      <h3>Danh sách Hóa đơn POS thực tế (' + matchingInvoices.length + ' hóa đơn)</h3>',
      '      <p>Chi tiết từng đơn hàng, bàn phục vụ, các món đã gọi và phương thức thanh toán</p>',
      '    </div>',
      '    <div class="rev-filter-group">',
      '      <input type="search" id="rev-invoice-search" class="rev-search-input" placeholder="Tìm số HĐ, bàn, tên món..." value="' + (currentState.invoiceSearch || '').replace(/"/g, '&quot;') + '"/>',
      '      <select id="rev-invoice-channel-filter" class="rev-select-input" aria-label="Lọc theo hình thức bán">',
      '        <option value="all" ' + (currentState.invoiceChannelFilter === 'all' ? 'selected' : '') + '>Tất cả hình thức</option>',
      '        <option value="dineIn" ' + (currentState.invoiceChannelFilter === 'dineIn' ? 'selected' : '') + '>Bán tại chỗ</option>',
      '        <option value="takeaway" ' + (currentState.invoiceChannelFilter === 'takeaway' ? 'selected' : '') + '>Bán mang về</option>',
      '        <option value="online" ' + (currentState.invoiceChannelFilter === 'online' ? 'selected' : '') + '>Bán online</option>',
      '      </select>',
      '    </div>',
      '  </div>',
      '  <div class="rev-table-wrap">',
      '    <table class="rev-detail-table">',
      '      <thead>',
      '        <tr>',
      '          <th>STT</th>',
      '          <th>Số HĐ</th>',
      '          <th>Ngày & Giờ</th>',
      '          <th>Bàn / Kênh</th>',
      '          <th>Hình thức</th>',
      '          <th>Chi tiết món gọi</th>',
      '          <th class="rev-num-col">Tổng hóa đơn</th>',
      '          <th>Thanh toán</th>',
      '        </tr>',
      '      </thead>',
      '      <tbody>',
      invoiceRowsHtml,
      '      </tbody>',
      '    </table>',
      '  </div>',
      (matchingInvoices.length > 15
        ? '<div style="margin-top:14px;text-align:center;">' +
          '  <button type="button" id="rev-toggle-all-invoices" class="rev-subnav-tab" style="padding:8px 18px;font-size:0.84rem;">' +
          (currentState.showAllInvoices ? '▲ Thu gọn danh sách hóa đơn' : ('▼ Xem toàn bộ ' + matchingInvoices.length + ' hóa đơn POS')) +
          '  </button>' +
          '</div>'
        : ''),
      '</div>'
    ].join('\n');
  }

  /**
   * TAB 2 HTML — Doanh thu theo món (Thống kê doanh thu từng món ăn & thức uống)
   */
  function buildDishTabHTML() {
    var dishData = getFilteredDishData();
    var barChartSVG = buildDishBarChartSVG(dishData);
    var pieResult = buildDishPieDataAndSVG(dishData);

    var bestRev = dishData.bestRevenueDish;
    var bestQty = dishData.bestQtyDish;
    var gMap = dishData.groupMap;

    // Lọc & sắp xếp bảng xếp hạng chi tiết các món
    var q = (currentState.dishSearch || '').trim().toLowerCase();
    var tableDishes = (dishData.dishes || []).filter(function (d) {
      if (!q) return true;
      return d.name.toLowerCase().indexOf(q) !== -1 || d.groupName.toLowerCase().indexOf(q) !== -1;
    }).slice();

    if (currentState.dishSortBy === 'quantity') {
      tableDishes.sort(function (a, b) {
        return (b.quantity - a.quantity) || (b.revenueVnd - a.revenueVnd);
      });
    }

    var dishTableRowsHtml = tableDishes.map(function (d, idx) {
      var rankNum = idx + 1;
      var rankClass = rankNum <= 3 ? (' rank-' + rankNum) : '';
      var gCfg = DISH_GROUP_CONFIG[d.groupKey] || DISH_GROUP_CONFIG.com_mon;
      var unitLabel = d.unit === 'LY' ? 'Ly' : (d.unit === 'CAI' ? 'Cái' : 'Phần/Món');

      return [
        '<tr>',
        '  <td><span class="rev-rank-badge' + rankClass + '">' + rankNum + '</span></td>',
        '  <td>',
        '    <div style="font-weight:700;display:flex;align-items:center;gap:7px;">',
        '      <span class="rev-kpi-dot" style="background:' + d.color + ';"></span>',
        '      <span>' + d.name + '</span>',
        '    </div>',
        '  </td>',
        '  <td>',
        '    <span class="rev-channel-badge" style="background:' + gCfg.colorLight + ';color:' + gCfg.color + ';border:1px solid ' + gCfg.colorBorder + ';">' + gCfg.name + '</span>',
        '  </td>',
        '  <td>' + unitLabel + '</td>',
        '  <td class="rev-num-col" style="font-weight:800;">' + d.quantity + '</td>',
        '  <td class="rev-num-col">' + d.orderCount + ' đơn</td>',
        '  <td class="rev-num-col" style="font-weight:800;color:' + gCfg.color + ';">' + formatVnd(d.revenueVnd, true) + '</td>',
        '  <td class="rev-num-col" style="font-weight:700;">' + formatMillion(d.revenueTrieu, 3) + ' tr</td>',
        '  <td class="rev-share-bar-cell">',
        '    <div class="rev-share-bar-wrap">',
        '      <div class="rev-share-track">',
        '        <div class="rev-share-fill" style="width:' + Math.min(100, d.sharePercent * 3.5) + '%;background:' + d.color + ';"></div>',
        '      </div>',
        '      <span style="font-weight:700;font-size:0.8rem;min-width:44px;text-align:right;">' + formatMillion(d.sharePercent, 2) + '%</span>',
        '    </div>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('');

    var pieLegendRowsHtml = (pieResult.slices || []).map(function (s) {
      return [
        '<tr class="rev-pie-row">',
        '  <td><span class="rev-kpi-dot" style="background:' + s.color + ';margin-right:7px;"></span><strong>' + s.label + '</strong></td>',
        '  <td class="rev-num-col">' + s.quantity + '</td>',
        '  <td class="rev-num-col"><div style="font-weight:700;color:' + s.color + ';">' + formatVnd(s.vnd, true) + '</div><div style="font-size:0.72rem;color:var(--rev-text-muted);">' + formatMillion(s.trieu, 3) + ' triệu</div></td>',
        '  <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:rgba(46,107,34,0.1);color:var(--rev-text-main);">' + formatMillion(s.pct, 1) + '%</span></td>',
        '</tr>'
      ].join('');
    }).join('');

    var datesList = ['17/11', '18/11', '19/11', '20/11', '21/11', '22/11', '23/11', '24/11'];
    var dateOptionsHtml = ['<option value="all" ' + (currentState.dishDateFilter === 'all' ? 'selected' : '') + '>Tất cả các ngày (17/11 – 24/11)</option>']
      .concat(datesList.map(function (d) {
        return '<option value="' + d + '" ' + (currentState.dishDateFilter === d ? 'selected' : '') + '>Ngày ' + d + '/2026</option>';
      })).join('');

    return [
      '<!-- Header Bar Tab 2 -->',
      '<div class="rev-header-card mg-card">',
      '  <div class="rev-header-title-group">',
      '    <h2>',
      '      <span>Doanh thu theo món — Nhà hàng Mộc Giang</span>',
      '      <span class="rev-header-badge">' + dishData.dishes.length + ' món thực đơn</span>',
      '    </h2>',
      '    <p class="rev-header-subtitle">Phân tích doanh thu & sản lượng bán của từng món ăn, đồ uống và bánh bao (Đơn vị: Triệu VNĐ & VNĐ)</p>',
      '  </div>',
      '  <div class="rev-period-switcher" role="tablist" aria-label="Chế độ xem biểu đồ món">',
      '    <button type="button" class="rev-period-btn ' + (currentState.dishChartMode === 'top10' ? 'active' : '') + '" data-dish-chartmode="top10">Top 10 món cao nhất</button>',
      '    <button type="button" class="rev-period-btn ' + (currentState.dishChartMode === 'top15' ? 'active' : '') + '" data-dish-chartmode="top15">Top 15 món</button>',
      '    <button type="button" class="rev-period-btn ' + (currentState.dishChartMode === 'groups' ? 'active' : '') + '" data-dish-chartmode="groups">Theo 3 nhóm món chính</button>',
      '  </div>',
      '</div>',

      '<!-- Filter Toolbar Tab 2 (Lọc theo Nhóm món & Ngày) -->',
      '<div class="rev-filter-toolbar mg-card">',
      '  <div class="rev-filter-group">',
      '    <span class="rev-filter-label">Nhóm thực đơn:</span>',
      '    <div class="rev-period-switcher">',
      '      <button type="button" class="rev-period-btn ' + (currentState.dishGroupFilter === 'all' ? 'active' : '') + '" data-dish-group="all">Tất cả các món (' + formatMillion(dishData.totalAllGroupsVnd / 1000000, 2) + ' tr)</button>',
      '      <button type="button" class="rev-period-btn ' + (currentState.dishGroupFilter === 'com_mon' ? 'active' : '') + '" data-dish-group="com_mon">🍚 Cơm & Món ăn (' + formatMillion((gMap.com_mon.revenueVnd || 0) / 1000000, 2) + ' tr)</button>',
      '      <button type="button" class="rev-period-btn ' + (currentState.dishGroupFilter === 'do_uong' ? 'active' : '') + '" data-dish-group="do_uong">🧋 Đồ uống (' + formatMillion((gMap.do_uong.revenueVnd || 0) / 1000000, 2) + ' tr)</button>',
      '      <button type="button" class="rev-period-btn ' + (currentState.dishGroupFilter === 'banh_bao' ? 'active' : '') + '" data-dish-group="banh_bao">🥟 Bánh bao (' + formatMillion((gMap.banh_bao.revenueVnd || 0) / 1000000, 2) + ' tr)</button>',
      '    </div>',
      '  </div>',
      '  <div class="rev-filter-group">',
      '    <label for="rev-dish-date-select" class="rev-filter-label">Ngày bán:</label>',
      '    <select id="rev-dish-date-select" class="rev-select-input">' + dateOptionsHtml + '</select>',
      '  </div>',
      '</div>',

      '<!-- 4 KPI Cards Tab 2 -->',
      '<div class="rev-kpi-grid">',
      '  <!-- KPI 1: Tổng doanh thu các món -->',
      '  <div class="rev-kpi-card mg-card" style="border-top: 4px solid #3D1F0D;">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#3D1F0D;"></span>Tổng doanh thu các món</span>',
      '      <span class="rev-kpi-pct-pill" style="background:rgba(61,31,13,0.1);color:#3D1F0D;">' + dishData.dishes.length + ' món</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value">' + formatMillion(dishData.totalFilteredTrieu, 3) + '</span>',
      '      <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd">' + formatVnd(dishData.totalFilteredVnd, true) + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Trên <strong>' + dishData.matchingInvoiceCount + '</strong> hóa đơn POS</span>',
      '      <span>100% tỷ trọng</span>',
      '    </div>',
      '  </div>',

      '  <!-- KPI 2: Món doanh thu số 1 (Best Seller) -->',
      '  <div class="rev-kpi-card mg-card" style="border-top: 4px solid #2E6B22;">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#2E6B22;"></span>Món doanh thu số 1 (Best Seller)</span>',
      '      <span class="rev-kpi-pct-pill" style="background:rgba(46,107,34,0.14);color:#2E6B22;">#1 Doanh thu</span>',
      '    </div>',
      '    <div style="font-size:1.05rem;font-weight:800;color:#2E6B22;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + (bestRev ? bestRev.name : '') + '">' + (bestRev ? bestRev.name : '—') + '</div>',
      '    <div class="rev-kpi-subvnd">' + (bestRev ? (formatVnd(bestRev.revenueVnd, true) + ' (' + formatMillion(bestRev.revenueTrieu, 3) + ' tr)') : '0 VNĐ') + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Đã bán: <strong>' + (bestRev ? bestRev.quantity : 0) + '</strong> · ' + (bestRev ? bestRev.orderCount : 0) + ' đơn</span>',
      '      <span>Chiếm <strong>' + (bestRev ? formatMillion(bestRev.sharePercent, 1) : '0') + '%</strong></span>',
      '    </div>',
      '  </div>',

      '  <!-- KPI 3: Món bán chạy nhất theo số lượng -->',
      '  <div class="rev-kpi-card mg-card" style="border-top: 4px solid #D97724;">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#D97724;"></span>Bán chạy nhất theo số lượng</span>',
      '      <span class="rev-kpi-pct-pill" style="background:rgba(217,119,36,0.15);color:#D97724;">#1 Số lượng</span>',
      '    </div>',
      '    <div style="font-size:1.05rem;font-weight:800;color:#D97724;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + (bestQty ? bestQty.name : '') + '">' + (bestQty ? bestQty.name : '—') + '</div>',
      '    <div class="rev-kpi-subvnd">Số lượng: <strong>' + (bestQty ? bestQty.quantity : 0) + '</strong> cái/phần (' + (bestQty ? formatVnd(bestQty.revenueVnd, true) : '0 VNĐ') + ')</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>Nhóm: ' + (bestQty ? bestQty.groupName : '—') + '</span>',
      '      <span><strong>' + (bestQty ? bestQty.orderCount : 0) + '</strong> lượt gọi</span>',
      '    </div>',
      '  </div>',

      '  <!-- KPI 4: Tổng số lượng món/ly/cái bán ra -->',
      '  <div class="rev-kpi-card mg-card" style="border-top: 4px solid #2B7BBB;">',
      '    <div class="rev-kpi-top">',
      '      <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#2B7BBB;"></span>Tổng số lượng món bán ra</span>',
      '      <span class="rev-kpi-pct-pill" style="background:rgba(43,123,187,0.14);color:#2B7BBB;">Sản lượng</span>',
      '    </div>',
      '    <div class="rev-kpi-value-row">',
      '      <span class="rev-kpi-value" style="color:#2B7BBB;">' + dishData.totalFilteredQty + '</span>',
      '      <span class="rev-kpi-unit">Món / Ly / Cái</span>',
      '    </div>',
      '    <div class="rev-kpi-subvnd">Cơm & Món: ' + gMap.com_mon.quantity + ' · Đồ uống: ' + gMap.do_uong.quantity + ' · Bánh bao: ' + gMap.banh_bao.quantity + '</div>',
      '    <div class="rev-kpi-foot">',
      '      <span>3 nhóm thực đơn Mộc Giang</span>',
      '      <span>199 Hoàng Cầu</span>',
      '    </div>',
      '  </div>',
      '</div>',

      '<!-- 2-Column Chart Section Tab 2 -->',
      '<div class="chart-split-grid rev-chart-split">',
      '  <!-- Left: Dish Bar Chart -->',
      '  <div class="rev-chart-card mg-card">',
      '    <div class="rev-card-head">',
      '      <div>',
      '        <h3>Biểu đồ cột Doanh thu theo món (Đơn vị: Triệu VNĐ)</h3>',
      '        <p>Trục X: Tên món / Nhóm món · Trục Y: Doanh thu quy đổi Triệu VNĐ kèm số lượng bán (SL)</p>',
      '      </div>',
      '      <span class="rev-chart-unit-tag">Đơn vị: Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-bar-chart-stage">',
      barChartSVG,
      '    </div>',
      '    <div class="rev-bar-legend">',
      '      <div class="rev-legend-item" data-dish-group="com_mon"><span class="rev-legend-swatch" style="background:#2E6B22;"></span><span>Cơm & Món ăn (' + formatVnd(gMap.com_mon.revenueVnd, true) + ' · 55,2%)</span></div>',
      '      <div class="rev-legend-item" data-dish-group="do_uong"><span class="rev-legend-swatch" style="background:#2B7BBB;"></span><span>Đồ uống Trà & Cafe (' + formatVnd(gMap.do_uong.revenueVnd, true) + ' · 29,2%)</span></div>',
      '      <div class="rev-legend-item" data-dish-group="banh_bao"><span class="rev-legend-swatch" style="background:#D97724;"></span><span>Bánh bao (' + formatVnd(gMap.banh_bao.revenueVnd, true) + ' · 15,6%)</span></div>',
      '    </div>',
      '  </div>',

      '  <!-- Right: Dish Pie / Donut Chart -->',
      '  <div class="rev-chart-card mg-card">',
      '    <div class="rev-card-head">',
      '      <div>',
      '        <h3>Biểu đồ tròn Tỷ trọng Doanh thu theo món (%)</h3>',
      '        <p>Cơ cấu phần trăm đóng góp doanh thu của các món dẫn đầu</p>',
      '      </div>',
      '      <div class="rev-pie-mode-toggle" role="group">',
      '        <button type="button" class="rev-pie-mode-btn ' + (currentState.dishPieStyle === 'pie' ? 'active' : '') + '" data-dish-piemode="pie">Biểu đồ tròn</button>',
      '        <button type="button" class="rev-pie-mode-btn ' + (currentState.dishPieStyle === 'donut' ? 'active' : '') + '" data-dish-piemode="donut">Donut</button>',
      '      </div>',
      '    </div>',
      '    <div class="rev-pie-layout">',
      '      <div class="rev-pie-svg-wrap">',
      pieResult.svgHtml,
      '      </div>',
      '      <table class="rev-pie-table" aria-label="Bảng cơ cấu doanh thu theo món">',
      '        <thead>',
      '          <tr>',
      '            <th>Tên món / Nhóm</th>',
      '            <th class="rev-num-col">SL</th>',
      '            <th class="rev-num-col">Doanh thu</th>',
      '            <th class="rev-num-col">Tỷ trọng</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody>',
      pieLegendRowsHtml,
      '        </tbody>',
      '        <tfoot>',
      '          <tr>',
      '            <td>Tổng cộng</td>',
      '            <td class="rev-num-col">' + dishData.totalFilteredQty + '</td>',
      '            <td class="rev-num-col">' + formatVnd(pieResult.totalVnd, true) + '</td>',
      '            <td class="rev-num-col">100,0%</td>',
      '          </tr>',
      '        </tfoot>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>',

      '<!-- Bottom Table: Bảng xếp hạng chi tiết toàn bộ các món -->',
      '<div class="rev-table-card mg-card">',
      '  <div class="rev-card-head">',
      '    <div>',
      '      <h3>Bảng xếp hạng chi tiết Doanh thu theo món (' + tableDishes.length + ' món)</h3>',
      '      <p>Thống kê đầy đủ số lượng bán, số đơn xuất hiện, doanh thu VNĐ, quy đổi Triệu VNĐ và thanh tỷ trọng %</p>',
      '    </div>',
      '    <div class="rev-filter-group">',
      '      <input type="search" id="rev-dish-search" class="rev-search-input" placeholder="Tìm tên món ăn, trà, cafe, bánh bao..." value="' + (currentState.dishSearch || '').replace(/"/g, '&quot;') + '"/>',
      '      <select id="rev-dish-sort" class="rev-select-input" aria-label="Sắp xếp món theo">',
      '        <option value="revenue" ' + (currentState.dishSortBy === 'revenue' ? 'selected' : '') + '>Sắp xếp: Doanh thu cao → thấp</option>',
      '        <option value="quantity" ' + (currentState.dishSortBy === 'quantity' ? 'selected' : '') + '>Sắp xếp: Số lượng bán cao → thấp</option>',
      '      </select>',
      '    </div>',
      '  </div>',
      '  <div class="rev-table-wrap">',
      '    <table class="rev-detail-table">',
      '      <thead>',
      '        <tr>',
      '          <th>Hạng</th>',
      '          <th>Tên món</th>',
      '          <th>Nhóm món</th>',
      '          <th>Đơn vị</th>',
      '          <th class="rev-num-col">Số lượng bán</th>',
      '          <th class="rev-num-col">Số đơn</th>',
      '          <th class="rev-num-col">Doanh thu (VNĐ)</th>',
      '          <th class="rev-num-col">Quy đổi (Triệu VNĐ)</th>',
      '          <th>Tỷ trọng (%)</th>',
      '        </tr>',
      '      </thead>',
      '      <tbody>',
      dishTableRowsHtml,
      '      </tbody>',
      '      <tfoot>',
      '        <tr>',
      '          <td colspan="4">TỔNG CỘNG (' + tableDishes.length + ' món hiển thị)</td>',
      '          <td class="rev-num-col">' + dishData.totalFilteredQty + '</td>',
      '          <td class="rev-num-col">' + dishData.matchingInvoiceCount + ' đơn</td>',
      '          <td class="rev-num-col" style="color:#2E6B22;">' + formatVnd(dishData.totalFilteredVnd, true) + '</td>',
      '          <td class="rev-num-col">' + formatMillion(dishData.totalFilteredTrieu, 3) + ' Triệu VNĐ</td>',
      '          <td><strong>100,0%</strong></td>',
      '        </tr>',
      '      </tfoot>',
      '    </table>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /**
   * Gắn toàn bộ sự kiện tương tác cho cả 2 tab Doanh thu
   */
  function attachRevenueEvents(container) {
    // 1. Chuyển đổi giữa 2 sub-tab: Doanh thu theo hình thức ('channel') và Doanh thu theo món ('dish')
    var tabBtns = container.querySelectorAll('[data-switch-rev-tab]');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-switch-rev-tab');
        if (tab && tab !== currentState.activeTab) {
          window.switchRevenueTab(tab);
        }
      });
    });

    // 2. Sự kiện Tab 1 (Doanh thu theo hình thức)
    var periodBtns = container.querySelectorAll('[data-channel-period]');
    periodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-channel-period');
        if (p && p !== currentState.channelPeriod) {
          currentState.channelPeriod = p;
          window.renderRevenue();
        }
      });
    });

    var channelPieBtns = container.querySelectorAll('[data-channel-piemode]');
    channelPieBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.getAttribute('data-channel-piemode');
        if (m && m !== currentState.channelPieStyle) {
          currentState.channelPieStyle = m;
          window.renderRevenue();
        }
      });
    });

    var channelToggles = container.querySelectorAll('[data-toggle-channel]');
    channelToggles.forEach(function (el) {
      el.addEventListener('click', function () {
        var ch = el.getAttribute('data-toggle-channel');
        if (!ch) return;
        currentState.highlightedChannel = currentState.highlightedChannel === ch ? null : ch;
        window.renderRevenue();
      });
    });

    var invSearch = container.querySelector('#rev-invoice-search');
    if (invSearch) {
      invSearch.addEventListener('input', function () {
        currentState.invoiceSearch = invSearch.value;
        var pos = invSearch.selectionStart;
        window.renderRevenue();
        var newInput = document.getElementById('rev-invoice-search');
        if (newInput) {
          newInput.focus();
          try { newInput.setSelectionRange(pos, pos); } catch (e) {}
        }
      });
    }

    var invChSelect = container.querySelector('#rev-invoice-channel-filter');
    if (invChSelect) {
      invChSelect.addEventListener('change', function () {
        currentState.invoiceChannelFilter = invChSelect.value;
        window.renderRevenue();
      });
    }

    var btnToggleInv = container.querySelector('#rev-toggle-all-invoices');
    if (btnToggleInv) {
      btnToggleInv.addEventListener('click', function () {
        currentState.showAllInvoices = !currentState.showAllInvoices;
        window.renderRevenue();
      });
    }

    // 3. Sự kiện Tab 2 (Doanh thu theo món)
    var dishModeBtns = container.querySelectorAll('[data-dish-chartmode]');
    dishModeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.getAttribute('data-dish-chartmode');
        if (m && m !== currentState.dishChartMode) {
          currentState.dishChartMode = m;
          window.renderRevenue();
        }
      });
    });

    var dishGroupBtns = container.querySelectorAll('[data-dish-group]');
    dishGroupBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var g = btn.getAttribute('data-dish-group');
        if (g) {
          currentState.dishGroupFilter = currentState.dishGroupFilter === g && g !== 'all' ? 'all' : g;
          window.renderRevenue();
        }
      });
    });

    var dishDateSelect = container.querySelector('#rev-dish-date-select');
    if (dishDateSelect) {
      dishDateSelect.addEventListener('change', function () {
        currentState.dishDateFilter = dishDateSelect.value;
        window.renderRevenue();
      });
    }

    var dishPieBtns = container.querySelectorAll('[data-dish-piemode]');
    dishPieBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.getAttribute('data-dish-piemode');
        if (m && m !== currentState.dishPieStyle) {
          currentState.dishPieStyle = m;
          window.renderRevenue();
        }
      });
    });

    var dishSearch = container.querySelector('#rev-dish-search');
    if (dishSearch) {
      dishSearch.addEventListener('input', function () {
        currentState.dishSearch = dishSearch.value;
        var pos = dishSearch.selectionStart;
        window.renderRevenue();
        var newInput = document.getElementById('rev-dish-search');
        if (newInput) {
          newInput.focus();
          try { newInput.setSelectionRange(pos, pos); } catch (e) {}
        }
      });
    }

    var dishSort = container.querySelector('#rev-dish-sort');
    if (dishSort) {
      dishSort.addEventListener('change', function () {
        currentState.dishSortBy = dishSort.value;
        window.renderRevenue();
      });
    }

    // 4. Floating Tooltip cho cả 2 tab
    var tooltip = getOrCreateTooltip();

    function moveTooltip(e) {
      var x = e.clientX + 14;
      var y = e.clientY - 14;
      if (x + 250 > window.innerWidth) {
        x = e.clientX - 255;
      }
      if (y + 130 > window.innerHeight) {
        y = e.clientY - 130;
      }
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    // Tooltip cột Tab 1
    var barEls = container.querySelectorAll('.rev-single-bar-wrap');
    barEls.forEach(function (bar) {
      bar.addEventListener('mouseenter', function (e) {
        var fullDate = bar.getAttribute('data-fulldate');
        var label = bar.getAttribute('data-label');
        var vnd = bar.getAttribute('data-vnd');
        var trieu = bar.getAttribute('data-trieu');
        var pct = bar.getAttribute('data-pct');
        var dayTotalVnd = bar.getAttribute('data-daytotalvnd');
        var dayOrders = bar.getAttribute('data-dayorders');
        var ch = bar.getAttribute('data-channel');
        var color = (CHANNEL_CONFIG[ch] && CHANNEL_CONFIG[ch].color) || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="font-weight:700;margin-bottom:4px;color:#F4EDE0;">' + fullDate + ' (' + dayOrders + ' đơn)</div>',
          '<div style="display:flex;align-items:center;gap:6px;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>' + label + ': <strong>' + vnd + '</strong> (' + trieu + ' tr · ' + pct + '%)</span>',
          '</div>',
          '<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.15);font-size:0.75rem;color:#D6C7B2;">',
          '  Tổng doanh thu ngày: <strong>' + dayTotalVnd + '</strong>',
          '</div>'
        ].join('');
        tooltip.classList.add('visible');
        moveTooltip(e);
      });
      bar.addEventListener('mousemove', moveTooltip);
      bar.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });
    });

    // Tooltip Pie Tab 1
    var pieSlices = container.querySelectorAll('.rev-pie-slice');
    pieSlices.forEach(function (slice) {
      slice.addEventListener('mouseenter', function (e) {
        var label = slice.getAttribute('data-label');
        var vnd = slice.getAttribute('data-vnd');
        var trieu = slice.getAttribute('data-trieu');
        var orders = slice.getAttribute('data-orders');
        var pct = slice.getAttribute('data-pct');
        var ch = slice.getAttribute('data-channel');
        var color = (CHANNEL_CONFIG[ch] && CHANNEL_CONFIG[ch].color) || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:3px;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>Hình thức: ' + label + '</span>',
          '</div>',
          '<div>Doanh thu: <strong>' + vnd + '</strong> (' + trieu + ' triệu VNĐ)</div>',
          '<div>Số hóa đơn: <strong>' + orders + ' đơn</strong> · Tỷ trọng: <strong>' + pct + '%</strong></div>'
        ].join('');
        tooltip.classList.add('visible');
        moveTooltip(e);
      });
      slice.addEventListener('mousemove', moveTooltip);
      slice.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });
      slice.addEventListener('click', function () {
        var ch = slice.getAttribute('data-channel');
        currentState.highlightedChannel = currentState.highlightedChannel === ch ? null : ch;
        tooltip.classList.remove('visible');
        window.renderRevenue();
      });
    });

    // Tooltip cột món ăn Tab 2
    var dishBars = container.querySelectorAll('.rev-dish-bar-wrap');
    dishBars.forEach(function (bar) {
      bar.addEventListener('mouseenter', function (e) {
        var name = bar.getAttribute('data-dish-name');
        var group = bar.getAttribute('data-dish-group');
        var qty = bar.getAttribute('data-dish-qty');
        var orders = bar.getAttribute('data-dish-orders');
        var vnd = bar.getAttribute('data-dish-vnd');
        var trieu = bar.getAttribute('data-dish-trieu');
        var pct = bar.getAttribute('data-dish-pct');
        var color = bar.getAttribute('data-dish-color') || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:4px;color:#F4EDE0;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>' + name + '</span>',
          '</div>',
          '<div style="font-size:0.76rem;color:#D6C7B2;margin-bottom:3px;">Nhóm: ' + group + '</div>',
          '<div>Doanh thu: <strong>' + vnd + '</strong> (' + trieu + ' triệu VNĐ)</div>',
          '<div>Số lượng bán: <strong>' + qty + '</strong> · Xuất hiện trong <strong>' + orders + ' đơn</strong></div>',
          '<div>Tỷ trọng: <strong>' + pct + '%</strong></div>'
        ].join('');
        tooltip.classList.add('visible');
        moveTooltip(e);
      });
      bar.addEventListener('mousemove', moveTooltip);
      bar.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });
    });

    // Tooltip Pie món ăn Tab 2
    var dishPieSlices = container.querySelectorAll('.rev-dish-pie-slice');
    dishPieSlices.forEach(function (slice) {
      slice.addEventListener('mouseenter', function (e) {
        var label = slice.getAttribute('data-label');
        var qty = slice.getAttribute('data-qty');
        var vnd = slice.getAttribute('data-vnd');
        var trieu = slice.getAttribute('data-trieu');
        var pct = slice.getAttribute('data-pct');
        var color = slice.getAttribute('data-color') || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:3px;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>' + label + '</span>',
          '</div>',
          '<div>Doanh thu: <strong>' + vnd + '</strong> (' + trieu + ' triệu VNĐ)</div>',
          '<div>Số lượng bán: <strong>' + qty + '</strong> · Tỷ trọng: <strong>' + pct + '%</strong></div>'
        ].join('');
        tooltip.classList.add('visible');
        moveTooltip(e);
      });
      slice.addEventListener('mousemove', moveTooltip);
      slice.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });
    });
  }

  /**
   * Hàm chính render giao diện Quản lý Doanh thu vào #view-revenue
   */
  window.renderRevenue = function (optionalTab) {
    if (optionalTab === 'channel' || optionalTab === 'dish') {
      currentState.activeTab = optionalTab;
    }
    ensureRevenueStyles();
    syncSidebarRevenueSubnav();

    var container = document.getElementById('view-revenue');
    if (!container) {
      return;
    }

    var subnavHtml = buildTopSubnavBar();
    var bodyHtml = currentState.activeTab === 'dish' ? buildDishTabHTML() : buildChannelTabHTML();

    container.innerHTML = [
      '<div class="rev-container">',
      subnavHtml,
      bodyHtml,
      '</div>'
    ].join('\n');

    attachRevenueEvents(container);
  };

  // Tự động khởi tạo khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.renderRevenue();
    });
  } else {
    window.renderRevenue();
  }
})();
