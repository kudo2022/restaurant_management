/**
 * Mộc Giang Restaurant Management — Core Dataset & Brand Constants
 * Brand: Mộc Giang - Hương vị cơm nhà - Đậm đà ly nước
 * Address: 199 Hoàng Cầu, Đống Đa, Hà Nội | Hotline: 096 3689077
 * All monetary figures are in Triệu VNĐ (Million VND) for November 2026.
 */
(function () {
  'use strict';

  const brand = {
    name: 'MỘC GIANG',
    fullName: 'Nhà hàng Mộc Giang',
    internalTitle: 'Nhà hàng Mộc Giang (Nội bộ)',
    tagline: 'Hương vị cơm nhà - Đậm đà ly nước',
    fullBrandTitle: 'Mộc Giang - Hương vị cơm nhà - Đậm đà ly nước',
    address: '199 Hoàng Cầu, Đống Đa, Hà Nội',
    branchShort: '199 Hoàng Cầu',
    hotline: '096 3689077',
    adminUser: 'mocgiang.admin1',
    adminDisplayName: 'Quản trị Mộc Giang',
    adminRole: 'Quản trị nhà hàng',
    currentDate: '2026-11-23',
    currentDateFormatted: 'Thứ Hai, 23/11/2026',
    currentWeekLabel: 'Tuần 48 (23–29/11/2026)',
    monthLabel: 'Tháng 11/2026',
    unit: 'Triệu VNĐ',
    unitShort: 'tr'
  };

  const palette = {
    deepWoodBrown: '#3D1F0D',
    woodBrownDark: '#4E2710',
    coffeeBrown: '#5C3114',
    warmBrown: '#7A441E',
    leafGreen: '#2E6B22',
    leafGreenHover: '#3A7D2C',
    leafGreenLight: '#6BA353',
    leafGreenSoft: '#EAF4E7',
    terracotta: '#D97724',
    warmGold: '#C88A2B',
    onlineBlue: '#2B7BBB',
    dangerRed: '#C93B2B',
    creamBg: '#FBF7EE',
    creamAlt: '#F4EDE0',
    cardWhite: '#FFFFFF',
    borderWarm: '#E6DEC8'
  };

  // Daily Revenue Data (November 2026, Unit: Triệu VNĐ)
  // Channels: online (Bán online), dineIn (Bán tại chỗ), takeaway (Bán mang về)
  const revenueDaily = [
    { date: '01/11', fullDate: '01/11/2026', dayLabel: 'CN', online: 6.4, dineIn: 12.2, takeaway: 4.5, total: 23.1, orders: 68, note: 'Cuối tuần đông khách gia đình' },
    { date: '02/11', fullDate: '02/11/2026', dayLabel: 'T2', online: 5.2, dineIn: 8.8, takeaway: 3.6, total: 17.6, orders: 54, note: 'Cơm trưa văn phòng Hoàng Cầu' },
    { date: '03/11', fullDate: '03/11/2026', dayLabel: 'T3', online: 5.5, dineIn: 9.1, takeaway: 3.8, total: 18.4, orders: 56, note: 'Combo cơm nhà + trà thảo mộc' },
    { date: '04/11', fullDate: '04/11/2026', dayLabel: 'T4', online: 5.8, dineIn: 9.6, takeaway: 3.9, total: 19.3, orders: 59, note: 'Đặt tiệc phòng VIP trưa' },
    { date: '05/11', fullDate: '05/11/2026', dayLabel: 'T5', online: 5.4, dineIn: 9.3, takeaway: 3.7, total: 18.4, orders: 55, note: 'Khách công sở ổn định' },
    { date: '06/11', fullDate: '06/11/2026', dayLabel: 'T6', online: 6.5, dineIn: 11.8, takeaway: 4.4, total: 22.7, orders: 66, note: 'Tiệc liên hoan tối Thứ 6' },
    { date: '07/11', fullDate: '07/11/2026', dayLabel: 'T7', online: 6.8, dineIn: 13.1, takeaway: 4.8, total: 24.7, orders: 72, note: 'Cuối tuần kín bàn tầng 1 & 2' },
    { date: '08/11', fullDate: '08/11/2026', dayLabel: 'CN', online: 6.6, dineIn: 12.7, takeaway: 4.6, total: 23.9, orders: 69, note: 'Khách gia đình & giao hàng' },
    { date: '09/11', fullDate: '09/11/2026', dayLabel: 'T2', online: 5.1, dineIn: 8.9, takeaway: 3.5, total: 17.5, orders: 52, note: 'Đầu tuần ổn định' },
    { date: '10/11', fullDate: '10/11/2026', dayLabel: 'T3', online: 5.6, dineIn: 9.4, takeaway: 3.8, total: 18.8, orders: 57, note: 'Đơn đặt cơm hộp công ty' },
    { date: '11/11', fullDate: '11/11/2026', dayLabel: 'T4', online: 7.4, dineIn: 10.2, takeaway: 4.5, total: 22.1, orders: 67, note: 'Khuyến mãi 11/11 trên App' },
    { date: '12/11', fullDate: '12/11/2026', dayLabel: 'T5', online: 5.7, dineIn: 9.5, takeaway: 3.8, total: 19.0, orders: 58, note: 'Cơm niêu & cá kho tộ bán chạy' },
    { date: '13/11', fullDate: '13/11/2026', dayLabel: 'T6', online: 6.4, dineIn: 11.9, takeaway: 4.5, total: 22.8, orders: 65, note: 'Đặt bàn tối Thứ 6' },
    { date: '14/11', fullDate: '14/11/2026', dayLabel: 'T7', online: 6.9, dineIn: 13.4, takeaway: 4.9, total: 25.2, orders: 74, note: 'Đỉnh doanh thu cuối tuần' },
    { date: '15/11', fullDate: '15/11/2026', dayLabel: 'CN', online: 6.5, dineIn: 12.5, takeaway: 4.6, total: 23.6, orders: 68, note: 'Cơm gia đình cuối tuần' },
    { date: '16/11', fullDate: '16/11/2026', dayLabel: 'T2', online: 5.3, dineIn: 9.0, takeaway: 3.6, total: 17.9, orders: 53, note: 'Khách văn phòng Đống Đa' },
    { date: '17/11', fullDate: '17/11/2026', dayLabel: 'T3', online: 5.8, dineIn: 9.8, takeaway: 3.9, total: 19.5, orders: 58, note: 'Tăng đơn trà sâm dứa & nước mơ' },
    { date: '18/11', fullDate: '18/11/2026', dayLabel: 'T4', online: 6.1, dineIn: 10.6, takeaway: 4.1, total: 20.8, orders: 61, note: 'Đoàn khách 25 người buổi trưa' },
    { date: '19/11', fullDate: '19/11/2026', dayLabel: 'T5', online: 5.9, dineIn: 10.4, takeaway: 4.0, total: 20.3, orders: 60, note: 'Tiệc tri ân giáo viên sớm' },
    { date: '20/11', fullDate: '20/11/2026', dayLabel: 'T6', online: 7.8, dineIn: 15.6, takeaway: 5.4, total: 28.8, orders: 84, note: 'Lễ 20/11 — Kín bàn cả ngày' },
    { date: '21/11', fullDate: '21/11/2026', dayLabel: 'T7', online: 7.2, dineIn: 14.1, takeaway: 5.1, total: 26.4, orders: 76, note: 'Tiệc gia đình cuối tuần' },
    { date: '22/11', fullDate: '22/11/2026', dayLabel: 'CN', online: 6.7, dineIn: 13.0, takeaway: 4.7, total: 24.4, orders: 70, note: 'Đơn online & tại chỗ cao' },
    { date: '23/11', fullDate: '23/11/2026', dayLabel: 'T2', online: 4.5, dineIn: 3.2, takeaway: 3.6, total: 11.3, orders: 18, note: 'Hôm nay (đến 18:30) · 3 tiệc tối sắp đón' }
  ];

  // Last 7 days slice (17/11 - 23/11) for default grouped bar chart view
  const revenueLast7Days = [
    { date: '17/11', fullDate: '17/11/2026', dayLabel: 'Thứ 3', online: 5.8, dineIn: 9.8, takeaway: 3.9, total: 19.5 },
    { date: '18/11', fullDate: '18/11/2026', dayLabel: 'Thứ 4', online: 6.1, dineIn: 10.6, takeaway: 4.1, total: 20.8 },
    { date: '19/11', fullDate: '19/11/2026', dayLabel: 'Thứ 5', online: 5.9, dineIn: 10.4, takeaway: 4.0, total: 20.3 },
    { date: '20/11', fullDate: '20/11/2026', dayLabel: 'Thứ 6', online: 7.8, dineIn: 15.6, takeaway: 5.4, total: 28.8 },
    { date: '21/11', fullDate: '21/11/2026', dayLabel: 'Thứ 7', online: 7.2, dineIn: 14.1, takeaway: 5.1, total: 26.4 },
    { date: '22/11', fullDate: '22/11/2026', dayLabel: 'CN', online: 6.7, dineIn: 13.0, takeaway: 4.7, total: 24.4 },
    { date: '23/11', fullDate: '23/11/2026', dayLabel: 'Thứ 2', online: 5.6, dineIn: 10.2, takeaway: 4.2, total: 20.0 }
  ];

  // Weekly aggregated revenue for November 2026
  const revenueWeekly = [
    { date: 'Tuần 1 (01-07/11)', online: 41.6, dineIn: 73.9, takeaway: 28.7, total: 144.2 },
    { date: 'Tuần 2 (08-14/11)', online: 43.7, dineIn: 76.0, takeaway: 29.6, total: 149.3 },
    { date: 'Tuần 3 (15-21/11)', online: 45.6, dineIn: 82.0, takeaway: 31.7, total: 159.3 },
    { date: 'Đầu Tuần 4 (22-23/11)', online: 10.2, dineIn: 16.2, takeaway: 7.3, total: 33.7 }
  ];

  // Revenue Channel Breakdown (Total: 486.5 Triệu VNĐ)
  const revenueChannels = [
    {
      id: 'dineIn',
      key: 'dineIn',
      name: 'Bán tại chỗ',
      fullName: 'Bán tại chỗ (Phục vụ tại bàn & Tiệc)',
      amount: 248.1,
      value: 248.1,
      percentage: 51.0,
      percent: 51,
      color: '#2E6B22',
      orders: 724
    },
    {
      id: 'online',
      key: 'online',
      name: 'Bán online',
      fullName: 'Bán online (GrabFood, ShopeeFood, Fanpage)',
      amount: 141.1,
      value: 141.1,
      percentage: 29.0,
      percent: 29,
      color: '#2B7BBB',
      orders: 412
    },
    {
      id: 'takeaway',
      key: 'takeaway',
      name: 'Bán mang về',
      fullName: 'Bán mang về (Khách mua trực tiếp tại quầy)',
      amount: 97.3,
      value: 97.3,
      percentage: 20.0,
      percent: 20,
      color: '#D97724',
      orders: 284
    }
  ];

  // Fixed Expenses (Chi phí cố định — Total: 118.0 Triệu VNĐ)
  // X-axis = Ngày, Y-axis = Tiền (Triệu VNĐ)
  const fixedExpensesByDay = [
    { date: '01/11', fullDate: '01/11/2026', amount: 49.56, value: 49.56, category: 'Thuê mặt bằng (199 Hoàng Cầu)', note: 'Thanh toán tiền thuê mặt bằng tháng 11/2026 (Tầng 1–3)' },
    { date: '03/11', fullDate: '03/11/2026', amount: 5.44, value: 5.44, category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí gia hạn iPOS, chữ ký số, cáp quang Viettel doanh nghiệp' },
    { date: '05/11', fullDate: '05/11/2026', amount: 18.50, value: 18.50, category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Tạm ứng lương đợt 1 cho Bếp trưởng, Bếp chính & Quản lý ca' },
    { date: '08/11', fullDate: '08/11/2026', amount: 4.20, value: 4.20, category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Phí vệ sinh môi trường, bảo vệ trông xe phố Hoàng Cầu' },
    { date: '10/11', fullDate: '10/11/2026', amount: 6.48, value: 6.48, category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Bảo dưỡng hệ thống hút mùi bếp, tủ đông & nồi cơm niêu công nghiệp' },
    { date: '15/11', fullDate: '15/11/2026', amount: 20.44, value: 20.44, category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Quyết toán lương cố định đợt 2 & phụ cấp trách nhiệm' },
    { date: '18/11', fullDate: '18/11/2026', amount: 4.00, value: 4.00, category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí duy trì hệ thống đặt bàn Web & tổng đài CSKH 096 3689077' },
    { date: '20/11', fullDate: '20/11/2026', amount: 6.50, value: 6.50, category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Trích khấu hao tài sản cố định & điều hòa trung tâm tháng 11' },
    { date: '23/11', fullDate: '23/11/2026', amount: 2.88, value: 2.88, category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Bảo hiểm cháy nổ định kỳ & kiểm định an toàn thực phẩm' }
  ];

  const fixedExpensesCategories = [
    {
      id: 'rent',
      name: 'Thuê mặt bằng (199 Hoàng Cầu)',
      shortName: 'Thuê mặt bằng 199 Hoàng Cầu',
      amount: 49.56,
      value: 49.56,
      percentage: 42,
      percent: 42,
      color: '#3D1F0D',
      description: 'Mặt bằng 3 tầng tại 199 Hoàng Cầu, Đống Đa, Hà Nội'
    },
    {
      id: 'salary_fixed',
      name: 'Lương nhân sự cố định (Bếp & Quản lý)',
      shortName: 'Lương nhân sự cố định',
      amount: 38.94,
      value: 38.94,
      percentage: 33,
      percent: 33,
      color: '#2E6B22',
      description: 'Bếp trưởng, 4 đầu bếp cơm nhà, 2 pha chế chính, 1 quản lý'
    },
    {
      id: 'depreciation',
      name: 'Khấu hao thiết bị & Bảo trì định kỳ',
      shortName: 'Khấu hao thiết bị bếp',
      amount: 12.98,
      value: 12.98,
      percentage: 11,
      percent: 11,
      color: '#D97724',
      description: 'Khấu hao bếp công nghiệp, tủ mát, máy pha trà & nội thất gỗ'
    },
    {
      id: 'pos_internet',
      name: 'Phần mềm POS, Internet & Bản quyền',
      shortName: 'Phần mềm POS & Internet',
      amount: 9.44,
      value: 9.44,
      percentage: 8,
      percent: 8,
      color: '#2B7BBB',
      description: 'Phần mềm quản lý bán hàng POS, hóa đơn điện tử & cáp quang'
    },
    {
      id: 'insurance_security',
      name: 'Bảo hiểm, An ninh & Vệ sinh cố định',
      shortName: 'Bảo hiểm & Phí định kỳ',
      amount: 7.08,
      value: 7.08,
      percentage: 6,
      percent: 6,
      color: '#8C5A3C',
      description: 'BHXH nhân sự chính thức, phí PCCC, an ninh & rác thải đô thị'
    }
  ];

  // Variable Expenses (Chi phí biến động — 3 danh mục: Suất cơm, Đồ uống, Bánh bao)
  // Hiển thị theo từng tuần (1 tuần = 7 ngày trên trục X), đơn vị: Triệu VNĐ
  const variableExpensesWeeks = {
    'week_17_23': {
      id: 'week_17_23',
      label: 'Tuần 17/11 – 23/11/2026',
      xAxisTitle: 'Trục X: Ngày (17/11 – 23/11/2026)',
      days: [
        { date: '17/11', fullDate: '17/11/2026', dayLabel: 'Thứ 3', doUong: 5.8, suatCom: 9.8, banhBao: 3.9, amount: 19.5, value: 19.5, category: 'Suất cơm', note: 'Chi phí nguyên liệu Suất cơm nhà, Đồ uống thảo mộc & Bánh bao' },
        { date: '18/11', fullDate: '18/11/2026', dayLabel: 'Thứ 4', doUong: 6.1, suatCom: 10.6, banhBao: 4.1, amount: 20.8, value: 20.8, category: 'Suất cơm', note: 'Tăng suất cơm trưa văn phòng Hoàng Cầu & bánh bao nóng' },
        { date: '19/11', fullDate: '19/11/2026', dayLabel: 'Thứ 5', doUong: 5.9, suatCom: 10.4, banhBao: 4.0, amount: 20.3, value: 20.3, category: 'Suất cơm', note: 'Suất cơm đoàn khách công ty, trà thảo mộc & bánh bao nhân thịt' },
        { date: '20/11', fullDate: '20/11/2026', dayLabel: 'Thứ 6', doUong: 7.8, suatCom: 15.6, banhBao: 5.4, amount: 28.8, value: 28.8, category: 'Suất cơm', note: 'Cao điểm lễ 20/11: Suất cơm tiệc, đồ uống & bánh bao tăng mạnh' },
        { date: '21/11', fullDate: '21/11/2026', dayLabel: 'Thứ 7', doUong: 7.2, suatCom: 14.1, banhBao: 5.1, amount: 26.4, value: 26.4, category: 'Suất cơm', note: 'Cuối tuần phục vụ suất cơm gia đình, đồ uống & bánh bao' },
        { date: '22/11', fullDate: '22/11/2026', dayLabel: 'CN', doUong: 6.7, suatCom: 13.0, banhBao: 4.7, amount: 24.4, value: 24.4, category: 'Suất cơm', note: 'Chủ nhật đông khách tại chỗ & đơn bánh bao mang về' },
        { date: '23/11', fullDate: '23/11/2026', dayLabel: 'Thứ 2', doUong: 5.6, suatCom: 10.2, banhBao: 4.2, amount: 20.0, value: 20.0, category: 'Suất cơm', note: 'Đầu tuần nhập nguyên liệu Suất cơm, Đồ uống & Bánh bao tươi' }
      ]
    },
    'week_10_16': {
      id: 'week_10_16',
      label: 'Tuần 10/11 – 16/11/2026',
      xAxisTitle: 'Trục X: Ngày (10/11 – 16/11/2026)',
      days: [
        { date: '10/11', fullDate: '10/11/2026', dayLabel: 'Thứ 3', doUong: 5.2, suatCom: 9.1, banhBao: 3.5, amount: 17.8, value: 17.8, category: 'Suất cơm', note: 'Nguyên liệu suất cơm văn phòng, trà sâm dứa & bánh bao' },
        { date: '11/11', fullDate: '11/11/2026', dayLabel: 'Thứ 4', doUong: 6.4, suatCom: 11.2, banhBao: 4.4, amount: 22.0, value: 22.0, category: 'Suất cơm', note: 'Khuyến mãi 11/11: combo Suất cơm + Đồ uống + Bánh bao' },
        { date: '12/11', fullDate: '12/11/2026', dayLabel: 'Thứ 5', doUong: 5.4, suatCom: 9.5, banhBao: 3.7, amount: 18.6, value: 18.6, category: 'Suất cơm', note: 'Suất cơm niêu cá kho, nước mơ ngâm & bánh bao trứng cút' },
        { date: '13/11', fullDate: '13/11/2026', dayLabel: 'Thứ 6', doUong: 6.2, suatCom: 11.5, banhBao: 4.3, amount: 22.0, value: 22.0, category: 'Suất cơm', note: 'Thứ Sáu tăng suất cơm liên hoan & đồ uống đóng chai' },
        { date: '14/11', fullDate: '14/11/2026', dayLabel: 'Thứ 7', doUong: 6.8, suatCom: 13.2, banhBao: 4.8, amount: 24.8, value: 24.8, category: 'Suất cơm', note: 'Cuối tuần cao điểm suất cơm mâm gia đình & bánh bao' },
        { date: '15/11', fullDate: '15/11/2026', dayLabel: 'CN', doUong: 6.3, suatCom: 12.1, banhBao: 4.5, amount: 22.9, value: 22.9, category: 'Suất cơm', note: 'Chủ nhật phục vụ suất cơm nhà, nước thảo mộc & bánh bao' },
        { date: '16/11', fullDate: '16/11/2026', dayLabel: 'Thứ 2', doUong: 5.1, suatCom: 8.9, banhBao: 3.4, amount: 17.4, value: 17.4, category: 'Suất cơm', note: 'Đầu tuần ổn định 3 nhóm Suất cơm, Đồ uống, Bánh bao' }
      ]
    },
    'week_03_09': {
      id: 'week_03_09',
      label: 'Tuần 03/11 – 09/11/2026',
      xAxisTitle: 'Trục X: Ngày (03/11 – 09/11/2026)',
      days: [
        { date: '03/11', fullDate: '03/11/2026', dayLabel: 'Thứ 3', doUong: 5.0, suatCom: 8.8, banhBao: 3.3, amount: 17.1, value: 17.1, category: 'Suất cơm', note: 'Suất cơm trưa văn phòng, nước sấu & bánh bao truyền thống' },
        { date: '04/11', fullDate: '04/11/2026', dayLabel: 'Thứ 4', doUong: 5.3, suatCom: 9.4, banhBao: 3.6, amount: 18.3, value: 18.3, category: 'Suất cơm', note: 'Đặt suất cơm phòng VIP trưa & trà thảo mộc Mộc Giang' },
        { date: '05/11', fullDate: '05/11/2026', dayLabel: 'Thứ 5', doUong: 5.1, suatCom: 9.0, banhBao: 3.4, amount: 17.5, value: 17.5, category: 'Suất cơm', note: 'Suất cơm nhà, đồ uống giải nhiệt & bánh bao bữa sáng' },
        { date: '06/11', fullDate: '06/11/2026', dayLabel: 'Thứ 6', doUong: 6.0, suatCom: 11.1, banhBao: 4.1, amount: 21.2, value: 21.2, category: 'Suất cơm', note: 'Cuối tuần tăng chi phí suất cơm & đồ uống pha chế' },
        { date: '07/11', fullDate: '07/11/2026', dayLabel: 'Thứ 7', doUong: 6.5, suatCom: 12.6, banhBao: 4.6, amount: 23.7, value: 23.7, category: 'Suất cơm', note: 'Thứ Bảy đông khách: Suất cơm gia đình, Đồ uống & Bánh bao' },
        { date: '08/11', fullDate: '08/11/2026', dayLabel: 'CN', doUong: 6.2, suatCom: 11.9, banhBao: 4.4, amount: 22.5, value: 22.5, category: 'Suất cơm', note: 'Chủ nhật phục vụ suất cơm, trà lá nếp & bánh bao nóng' },
        { date: '09/11', fullDate: '09/11/2026', dayLabel: 'Thứ 2', doUong: 4.9, suatCom: 8.6, banhBao: 3.2, amount: 16.7, value: 16.7, category: 'Suất cơm', note: 'Nhập nguyên liệu đầu tuần cho Suất cơm, Đồ uống, Bánh bao' }
      ]
    }
  };

  // Default 1-week (7 days: 17/11 – 23/11/2026) daily array
  const variableExpensesByDay = variableExpensesWeeks.week_17_23.days;

  // Only 3 variable expense categories: Suất cơm, Đồ uống, Bánh bao
  // For week 17/11 - 23/11 (Total = 160.2 tr; Month total = 174.5 tr)
  const variableExpensesCategories = [
    {
      id: 'suatCom',
      key: 'suatCom',
      name: 'Suất cơm',
      shortName: 'Suất cơm',
      amount: 83.7,
      value: 83.7,
      percentage: 52.2,
      percent: 52,
      color: '#2E6B22',
      description: 'Chi phí nguyên liệu & chế biến các suất cơm nhà Mộc Giang'
    },
    {
      id: 'doUong',
      key: 'doUong',
      name: 'Đồ uống',
      shortName: 'Đồ uống',
      amount: 45.1,
      value: 45.1,
      percentage: 28.2,
      percent: 28,
      color: '#2B7BBB',
      description: 'Chi phí trà thảo mộc, nước mơ, nước sấu, sâm dứa (“Đậm đà ly nước”)'
    },
    {
      id: 'banhBao',
      key: 'banhBao',
      name: 'Bánh bao',
      shortName: 'Bánh bao',
      amount: 31.4,
      value: 31.4,
      percentage: 19.6,
      percent: 20,
      color: '#D97724',
      description: 'Chi phí bột, nhân thịt trứng cút & hấp bánh bao thủ công mỗi ngày'
    }
  ];

  // Overview KPI & Operational Summary
  const overview = {
    greetingDate: 'Thứ Hai, 23/11/2026',
    calendarBadge: {
      dayOfWeek: 'Thứ 2',
      dayNumber: '23',
      monthYear: '11/2026'
    },
    greetingTitle: 'Chào buổi tối, Quản trị Mộc Giang',
    summaryHtml: 'Toàn nhà hàng đạt <strong class="highlight-green">486,5 triệu VNĐ</strong> doanh thu tháng này với <strong>1.420 đơn hàng hoàn thành</strong>. Hôm nay có <strong class="highlight-amber">3 đơn đặt tiệc bàn lớn</strong> và <strong class="highlight-red">2 khoản chi phí cần duyệt</strong>.',
    kpis: [
      {
        id: 'kpi-revenue',
        label: 'Tổng doanh thu tháng 11',
        value: '486,5 tr',
        numericValue: 486.5,
        unit: 'Triệu VNĐ',
        badge: '+14,2% so với T10',
        badgeType: 'positive',
        subtext: 'Bán tại chỗ 51% · Online 29% · Mang về 20%',
        targetView: 'view-revenue',
        accentColor: '#2E6B22'
      },
      {
        id: 'kpi-fixed-expenses',
        label: 'Chi phí cố định',
        value: '118,0 tr',
        numericValue: 118.0,
        unit: 'Triệu VNĐ',
        badge: '24,3% tỷ trọng DT',
        badgeType: 'neutral',
        subtext: 'Thuê mặt bằng 199 Hoàng Cầu chiếm 42%',
        targetView: 'view-expenses-fixed',
        accentColor: '#3D1F0D'
      },
      {
        id: 'kpi-variable-expenses',
        label: 'Chi phí biến động',
        value: '160,2 tr',
        numericValue: 160.2,
        unit: 'Triệu VNĐ',
        badge: 'Suất cơm · Đồ uống · Bánh bao',
        badgeType: 'warning',
        subtext: 'Suất cơm 52% · Đồ uống 28% · Bánh bao 20%',
        targetView: 'view-expenses-variable',
        accentColor: '#D97724'
      },
      {
        id: 'kpi-profit',
        label: 'Lợi nhuận ước tính',
        value: '194,0 tr',
        numericValue: 194.0,
        unit: 'Triệu VNĐ',
        badge: '39,9% biên LN',
        badgeType: 'positive',
        subtext: 'Vượt mục tiêu kế hoạch tháng (+18,5 tr)',
        targetView: 'view-revenue',
        accentColor: '#2B7BBB'
      }
    ],
    donutModes: {
      finance: {
        id: 'finance',
        label: 'Tài chính (Triệu VNĐ)',
        centerValue: '486,5 tr',
        centerSub: 'Tổng quy mô',
        unit: 'tr',
        items: [
          {
            label: 'Doanh thu thuần (Lợi nhuận giữ lại)',
            shortLabel: 'Doanh thu thuần',
            value: 194.0,
            displayValue: '194,0 tr',
            percent: 40,
            color: '#2E6B22',
            highlight: false
          },
          {
            label: 'Chi phí biến động (Suất cơm, Đồ uống, Bánh bao)',
            shortLabel: 'Chi phí biến động',
            value: 174.5,
            displayValue: '174,5 tr',
            percent: 36,
            color: '#D97724',
            highlight: true
          },
          {
            label: 'Chi phí cố định (Mặt bằng, Lương, POS)',
            shortLabel: 'Chi phí cố định',
            value: 118.0,
            displayValue: '118,0 tr',
            percent: 24,
            color: '#3D1F0D',
            highlight: false
          }
        ]
      },
      orders: {
        id: 'orders',
        label: 'Đơn hàng (1.420 đơn)',
        centerValue: '1.420',
        centerSub: 'đơn tháng này',
        unit: 'đơn',
        items: [
          {
            label: 'Đơn hoàn thành (Tại bàn, Online & Mang về)',
            shortLabel: 'Đơn hoàn thành',
            value: 1362,
            displayValue: '1.362 đơn',
            percent: 96,
            color: '#2E6B22',
            highlight: false
          },
          {
            label: 'Đang phục vụ / Chờ duyệt chi & Bàn lớn',
            shortLabel: 'Đang phục vụ',
            value: 18,
            displayValue: '18 đơn',
            percent: 1,
            color: '#C93B2B',
            highlight: true
          },
          {
            label: 'Đặt trước & Tiệc đoàn trong tuần',
            shortLabel: 'Đặt trước',
            value: 40,
            displayValue: '40 đơn',
            percent: 3,
            color: '#2B7BBB',
            highlight: false
          }
        ]
      }
    },
    weeklySchedule: [
      {
        id: 'sch-1',
        day: 'Thứ 2 · 23/11',
        time: '07:30 – 09:30',
        title: 'Kiểm kê kho bếp đầu tuần & Nhập gạo tám Hải Hậu, rau sạch',
        location: 'Kho bếp tầng 1 · 199 Hoàng Cầu',
        tag: 'Kho bếp',
        tagColor: 'green',
        status: 'Đã hoàn thành'
      },
      {
        id: 'sch-2',
        day: 'Thứ 2 · 23/11',
        time: '18:30 – 21:00',
        title: 'Đón 3 đoàn đặt tiệc bàn lớn (42 khách) — Thực đơn Cơm nhà Mộc Giang',
        location: 'Phòng VIP Tầng 2 & Sảnh chính',
        tag: 'Đặt tiệc',
        tagColor: 'amber',
        status: 'Hôm nay'
      },
      {
        id: 'sch-3',
        day: 'Thứ 4 · 25/11',
        time: '11:30 – 13:30',
        title: 'Tiệc đặt trước 35 khách khối Văn phòng Hoàng Cầu (Cơm niêu + Trà thảo mộc)',
        location: 'Tầng 2 · Khu bàn dài Mộc',
        tag: 'Tiệc trưa',
        tagColor: 'blue',
        status: 'Đã cọc 5,0 tr'
      },
      {
        id: 'sch-4',
        day: 'Thứ 6 · 27/11',
        time: '15:00 – 16:30',
        title: 'Thanh toán công nợ Nhà cung cấp rau sạch, thịt tươi & nguyên liệu pha chế',
        location: 'Phòng Quản trị · Duyệt 2 phiếu chi',
        tag: 'Tài chính',
        tagColor: 'brown',
        status: 'Chờ duyệt'
      },
      {
        id: 'sch-5',
        day: 'Thứ 7 · 28/11',
        time: '09:00 – 22:00',
        title: 'Tăng cường 4 nhân sự thời vụ ca cuối tuần & Kiểm tra chất lượng quầy nước',
        location: 'Toàn cơ sở 199 Hoàng Cầu',
        tag: 'Vận hành',
        tagColor: 'green',
        status: 'Đã xếp ca'
      }
    ],
    inventoryAlerts: [
      { item: 'Gạo tám thơm Hải Hậu', stock: 'Còn 85 kg (đủ 4 ngày)', status: 'Ổn định' },
      { item: 'Cốt mơ ngâm & Trà thảo mộc Mộc Giang', stock: 'Còn 18 lít (cần bổ sung Thứ 5)', status: 'Sắp chạm ngưỡng' },
      { item: 'Hộp bã mía 4 ngăn mang về', stock: 'Còn 620 hộp', status: 'Ổn định' }
    ]
  };

  window.MocGiangData = {
    brand: brand,
    palette: palette,
    summary: {
      totalRevenue: 486.5,
      revenueGrowthPercent: 14.2,
      totalFixedExpenses: 118.0,
      fixedExpenseRatio: 24.3,
      totalVariableExpenses: 174.5,
      variableExpenseRatio: 35.9,
      estimatedProfit: 194.0,
      profitMarginPercent: 39.9,
      completedOrders: 1420,
      activeTables: 14,
      totalTables: 22,
      pendingApprovals: 2,
      todayPartyBookings: 3
    },
    revenue: {
      total: 486.5,
      unit: 'Triệu VNĐ',
      growth: '+14,2%',
      channels: revenueChannels,
      categories: revenueChannels,
      daily: revenueDaily,
      last7Days: revenueLast7Days,
      weekly: revenueWeekly,
      byDay: revenueDaily
    },
    fixedExpenses: {
      total: 118.0,
      averagePerDay: 3.93,
      ratioToRevenue: 24.3,
      unit: 'Triệu VNĐ',
      largestCategory: 'Thuê mặt bằng (199 Hoàng Cầu)',
      byDay: fixedExpensesByDay,
      daily: fixedExpensesByDay,
      categories: fixedExpensesCategories,
      byCategory: fixedExpensesCategories
    },
    variableExpenses: {
      total: 160.2,
      monthTotal: 174.5,
      averagePerDay: 22.89,
      ratioToRevenue: 32.9,
      unit: 'Triệu VNĐ',
      suatComTotal: 83.7,
      doUongTotal: 45.1,
      banhBaoTotal: 31.4,
      defaultWeekId: 'week_17_23',
      weeks: variableExpensesWeeks,
      byDay: variableExpensesByDay,
      daily: variableExpensesByDay,
      categories: variableExpensesCategories,
      byCategory: variableExpensesCategories
    },
    overview: overview
  };
})();
