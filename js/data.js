/**
 * Mộc Giang Restaurant Management — Core Dataset, Brand Constants & Google Form/Drive Integration
 * Brand: Mộc Giang - Hương vị cơm nhà - Đậm đà ly nước
 * Address: 199 Hoàng Cầu, Đống Đa, Hà Nội | Hotline: 096 3689077
 * Chart monetary figures are in Triệu VNĐ (Million VND) for November 2026;
 * Form inputs are in VNĐ (e.g. "20 000", "1 000 000") and automatically converted to Triệu VNĐ.
 */
(function () {
  'use strict';

  const SPREADSHEET_ID = '14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE';
  const DRIVE_FOLDER_ID = '1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2';
  const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit';
  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/' + DRIVE_FOLDER_ID;
  const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/gviz/tq?tqx=out:csv&sheet=Sheet1';

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

  /**
   * Parses a VND input string or number (e.g. "20 000", "1 000 000", "9.800.000", 1000000)
   * into exact VND integer and Triệu VNĐ float (keeping up to 4 decimals so 20 000 VND = 0.02 Triệu VNĐ).
   */
  function parseVndInput(raw) {
    if (raw === null || raw === undefined || raw === '') {
      return {
        vnd: 0,
        trieu: 0,
        formattedVnd: '0',
        formattedVndWithUnit: '0 VNĐ',
        formattedTrieu: '0,00',
        formattedTrieuWithUnit: '0,00 Triệu VNĐ'
      };
    }

    let vnd = 0;
    if (typeof raw === 'number' && !isNaN(raw)) {
      // If a small decimal < 1000 is passed directly as trieu, check context; otherwise treat as VND integer
      vnd = Math.round(raw);
    } else {
      const str = String(raw).trim();
      const digitsOnly = str.replace(/[^\d]/g, '');
      vnd = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    }

    const trieu = Math.round((vnd / 1000000) * 10000) / 10000;
    const formattedVnd = String(vnd).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const decimals = (trieu > 0 && trieu < 0.1) ? 2 : (Math.round(trieu * 100) !== Math.round(trieu * 10) * 10 ? 2 : 2);
    const formattedTrieu = trieu.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 3
    });

    return {
      vnd: vnd,
      trieu: trieu,
      formattedVnd: formattedVnd,
      formattedVndWithUnit: formattedVnd + ' VNĐ',
      formattedTrieu: formattedTrieu,
      formattedTrieuWithUnit: formattedTrieu + ' Triệu VNĐ'
    };
  }

  window.parseVndInput = parseVndInput;

  // Generate an SVG Data URI receipt thumbnail so every entry has a viewable receipt preview
  function createReceiptSvgDataUri(title, amountFormattedVnd, dateStr, personName, code) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="540" viewBox="0 0 420 540">' +
      '<rect width="420" height="540" fill="#FBF7EE" rx="16"/>' +
      '<rect x="16" y="16" width="388" height="508" fill="#FFFFFF" stroke="#D8CEB8" stroke-width="2" rx="12"/>' +
      '<rect x="16" y="16" width="388" height="86" fill="#3D1F0D" rx="12"/>' +
      '<text x="210" y="52" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="bold">NHÀ HÀNG MỘC GIANG</text>' +
      '<text x="210" y="78" text-anchor="middle" fill="#EAB354" font-family="Arial, sans-serif" font-size="12">199 Hoàng Cầu, Đống Đa, Hà Nội · 096 3689077</text>' +
      '<text x="210" y="136" text-anchor="middle" fill="#2E6B22" font-family="Arial, sans-serif" font-size="17" font-weight="bold">HÓA ĐƠN / MINH CHỨNG CHI PHÍ</text>' +
      '<line x1="40" y1="154" x2="380" y2="154" stroke="#E6DEC8" stroke-dasharray="4 4"/>' +
      '<text x="44" y="188" fill="#6E5D4F" font-family="Arial, sans-serif" font-size="13">Mã chứng từ:</text>' +
      '<text x="376" y="188" text-anchor="end" fill="#24160D" font-family="Arial, sans-serif" font-size="13" font-weight="bold">' + code + '</text>' +
      '<text x="44" y="220" fill="#6E5D4F" font-family="Arial, sans-serif" font-size="13">Ngày phát sinh:</text>' +
      '<text x="376" y="220" text-anchor="end" fill="#24160D" font-family="Arial, sans-serif" font-size="13" font-weight="bold">' + dateStr + '</text>' +
      '<text x="44" y="252" fill="#6E5D4F" font-family="Arial, sans-serif" font-size="13">Người lập phiếu:</text>' +
      '<text x="376" y="252" text-anchor="end" fill="#24160D" font-family="Arial, sans-serif" font-size="13" font-weight="bold">' + personName + '</text>' +
      '<text x="44" y="284" fill="#6E5D4F" font-family="Arial, sans-serif" font-size="13">Hạng mục chi:</text>' +
      '<text x="376" y="284" text-anchor="end" fill="#2E6B22" font-family="Arial, sans-serif" font-size="13" font-weight="bold">' + title + '</text>' +
      '<rect x="40" y="316" width="340" height="84" fill="#F4EDE0" stroke="#E6DEC8" rx="10"/>' +
      '<text x="210" y="344" text-anchor="middle" fill="#5C3114" font-family="Arial, sans-serif" font-size="12" font-weight="bold">SỐ TIỀN THANH TOÁN (VNĐ)</text>' +
      '<text x="210" y="380" text-anchor="middle" fill="#2E6B22" font-family="Arial, sans-serif" font-size="24" font-weight="bold">' + amountFormattedVnd + ' VNĐ</text>' +
      '<circle cx="315" cy="455" r="36" fill="none" stroke="#C93B2B" stroke-width="2.5" stroke-dasharray="3 2"/>' +
      '<text x="315" y="452" text-anchor="middle" fill="#C93B2B" font-family="Arial, sans-serif" font-size="10" font-weight="bold">ĐÃ ĐỐI SOÁT</text>' +
      '<text x="315" y="466" text-anchor="middle" fill="#C93B2B" font-family="Arial, sans-serif" font-size="9">MỘC GIANG</text>' +
      '<text x="44" y="460" fill="#7A6A5C" font-family="Arial, sans-serif" font-size="11">Lưu trữ: Google Drive Mộc Giang</text>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Daily Revenue Data (November 2026, Unit: Triệu VNĐ)
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

  const revenueLast7Days = [
    { date: '17/11', fullDate: '17/11/2026', dayLabel: 'Thứ 3', online: 5.8, dineIn: 9.8, takeaway: 3.9, total: 19.5 },
    { date: '18/11', fullDate: '18/11/2026', dayLabel: 'Thứ 4', online: 6.1, dineIn: 10.6, takeaway: 4.1, total: 20.8 },
    { date: '19/11', fullDate: '19/11/2026', dayLabel: 'Thứ 5', online: 5.9, dineIn: 10.4, takeaway: 4.0, total: 20.3 },
    { date: '20/11', fullDate: '20/11/2026', dayLabel: 'Thứ 6', online: 7.8, dineIn: 15.6, takeaway: 5.4, total: 28.8 },
    { date: '21/11', fullDate: '21/11/2026', dayLabel: 'Thứ 7', online: 7.2, dineIn: 14.1, takeaway: 5.1, total: 26.4 },
    { date: '22/11', fullDate: '22/11/2026', dayLabel: 'CN', online: 6.7, dineIn: 13.0, takeaway: 4.7, total: 24.4 },
    { date: '23/11', fullDate: '23/11/2026', dayLabel: 'Thứ 2', online: 5.6, dineIn: 10.2, takeaway: 4.2, total: 20.0 }
  ];

  const revenueWeekly = [
    { date: 'Tuần 1 (01-07/11)', online: 41.6, dineIn: 73.9, takeaway: 28.7, total: 144.2 },
    { date: 'Tuần 2 (08-14/11)', online: 43.7, dineIn: 76.0, takeaway: 29.6, total: 149.3 },
    { date: 'Tuần 3 (15-21/11)', online: 45.6, dineIn: 82.0, takeaway: 31.7, total: 159.3 },
    { date: 'Đầu Tuần 4 (22-23/11)', online: 10.2, dineIn: 16.2, takeaway: 7.3, total: 33.7 }
  ];

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

  // Fixed Expenses (Chi phí cố định — Total: 118.0 Triệu VNĐ = 118 000 000 VNĐ)
  const fixedExpensesByDay = [
    { date: '01/11', fullDate: '01/11/2026', amount: 49.56, value: 49.56, amountVnd: 49560000, formattedVnd: '49 560 000', fullName: 'Nguyễn Minh Quản Lý', category: 'Thuê mặt bằng (199 Hoàng Cầu)', note: 'Thanh toán tiền thuê mặt bằng tháng 11/2026 (Tầng 1–3)' },
    { date: '03/11', fullDate: '03/11/2026', amount: 5.44, value: 5.44, amountVnd: 5440000, formattedVnd: '5 440 000', fullName: 'Nguyễn Thu Hà', category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí gia hạn iPOS, chữ ký số, cáp quang Viettel doanh nghiệp' },
    { date: '05/11', fullDate: '05/11/2026', amount: 18.50, value: 18.50, amountVnd: 18500000, formattedVnd: '18 500 000', fullName: 'Nguyễn Minh Quản Lý', category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Tạm ứng lương đợt 1 cho Bếp trưởng, Bếp chính & Quản lý ca' },
    { date: '08/11', fullDate: '08/11/2026', amount: 4.20, value: 4.20, amountVnd: 4200000, formattedVnd: '4 200 000', fullName: 'Nguyễn Thu Hà', category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Phí vệ sinh môi trường, bảo vệ trông xe phố Hoàng Cầu' },
    { date: '10/11', fullDate: '10/11/2026', amount: 6.48, value: 6.48, amountVnd: 6480000, formattedVnd: '6 480 000', fullName: 'Trần Quốc Tuấn', category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Bảo dưỡng hệ thống hút mùi bếp, tủ đông & nồi cơm niêu công nghiệp' },
    { date: '15/11', fullDate: '15/11/2026', amount: 20.44, value: 20.44, amountVnd: 20440000, formattedVnd: '20 440 000', fullName: 'Nguyễn Minh Quản Lý', category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Quyết toán lương cố định đợt 2 & phụ cấp trách nhiệm' },
    { date: '18/11', fullDate: '18/11/2026', amount: 4.00, value: 4.00, amountVnd: 4000000, formattedVnd: '4 000 000', fullName: 'Nguyễn Thu Hà', category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí duy trì hệ thống đặt bàn Web & tổng đài CSKH 096 3689077' },
    { date: '20/11', fullDate: '20/11/2026', amount: 6.50, value: 6.50, amountVnd: 6500000, formattedVnd: '6 500 000', fullName: 'Trần Quốc Tuấn', category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Trích khấu hao tài sản cố định & điều hòa trung tâm tháng 11' },
    { date: '23/11', fullDate: '23/11/2026', amount: 2.88, value: 2.88, amountVnd: 2880000, formattedVnd: '2 880 000', fullName: 'Nguyễn Minh Quản Lý', category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Bảo hiểm cháy nổ định kỳ & kiểm định an toàn thực phẩm' }
  ];

  const fixedExpensesCategories = [
    {
      id: 'rent',
      name: 'Thuê mặt bằng (199 Hoàng Cầu)',
      shortName: 'Thuê mặt bằng 199 Hoàng Cầu',
      amount: 49.56,
      value: 49.56,
      amountVnd: 49560000,
      formattedVnd: '49 560 000',
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
      amountVnd: 38940000,
      formattedVnd: '38 940 000',
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
      amountVnd: 12980000,
      formattedVnd: '12 980 000',
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
      amountVnd: 9440000,
      formattedVnd: '9 440 000',
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
      amountVnd: 7080000,
      formattedVnd: '7 080 000',
      percentage: 6,
      percent: 6,
      color: '#8C5A3C',
      description: 'BHXH nhân sự chính thức, phí PCCC, an ninh & rác thải đô thị'
    }
  ];

  // Variable Expenses (Chi phí biến động — 3 danh mục: Suất cơm, Đồ uống, Bánh bao)
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
        { date: '23/11', fullDate: '23/11/2026', dayLabel: 'Thứ 2', doUong: 5.6, suatCom: 10.2, banhBao: 4.2, amount: 20.0, value: 20.0, category: 'Suất cơm', note: 'Đầu tuần nhập nguyên liệu Suất cơm (gồm 1 000 000 VNĐ rau sạch), Đồ uống (gồm 20 000 VNĐ lá dứa) & Bánh bao' }
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

  const variableExpensesByDay = variableExpensesWeeks.week_17_23.days;

  const variableExpensesCategories = [
    {
      id: 'suatCom',
      key: 'suatCom',
      name: 'Suất cơm',
      shortName: 'Suất cơm',
      amount: 83.7,
      value: 83.7,
      amountVnd: 83700000,
      formattedVnd: '83 700 000',
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
      amountVnd: 45100000,
      formattedVnd: '45 100 000',
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
      amountVnd: 31400000,
      formattedVnd: '31 400 000',
      percentage: 19.6,
      percent: 20,
      color: '#D97724',
      description: 'Chi phí bột, nhân thịt trứng cút & hấp bánh bao thủ công mỗi ngày'
    }
  ];

  // Initial Google Sheet / Form entries (exact mirror of the 32 rows written to Sheet1!A2:I33)
  const initialGoogleFormEntries = [
    // Fixed Expenses (9 rows)
    { id: 'GF-01', timestamp: '01/11/2026 08:30:00', fullName: 'Nguyễn Minh Quản Lý', date: '01/11/2026', shortDate: '01/11', amountRaw: '49 560 000', amountVnd: 49560000, amountFormattedVnd: '49 560 000', amountTrieu: 49.56, expenseType: 'Chi phí cố định', category: 'Thuê mặt bằng (199 Hoàng Cầu)', note: 'Thanh toán tiền thuê mặt bằng tháng 11/2026 tại 199 Hoàng Cầu', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-02', timestamp: '03/11/2026 09:15:00', fullName: 'Nguyễn Thu Hà', date: '03/11/2026', shortDate: '03/11', amountRaw: '5 440 000', amountVnd: 5440000, amountFormattedVnd: '5 440 000', amountTrieu: 5.44, expenseType: 'Chi phí cố định', category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí gia hạn iPOS + chữ ký số + cáp quang Viettel doanh nghiệp', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-03', timestamp: '05/11/2026 10:00:00', fullName: 'Nguyễn Minh Quản Lý', date: '05/11/2026', shortDate: '05/11', amountRaw: '18 500 000', amountVnd: 18500000, amountFormattedVnd: '18 500 000', amountTrieu: 18.50, expenseType: 'Chi phí cố định', category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Tạm ứng lương cố định đợt 1 cho Bếp trưởng và Quản lý ca', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-04', timestamp: '08/11/2026 14:20:00', fullName: 'Nguyễn Thu Hà', date: '08/11/2026', shortDate: '08/11', amountRaw: '4 200 000', amountVnd: 4200000, amountFormattedVnd: '4 200 000', amountTrieu: 4.20, expenseType: 'Chi phí cố định', category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Phí vệ sinh môi trường và bảo vệ trông xe phố Hoàng Cầu', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-05', timestamp: '10/11/2026 11:10:00', fullName: 'Trần Quốc Tuấn', date: '10/11/2026', shortDate: '10/11', amountRaw: '6 480 000', amountVnd: 6480000, amountFormattedVnd: '6 480 000', amountTrieu: 6.48, expenseType: 'Chi phí cố định', category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Bảo dưỡng hệ thống hút mùi bếp và nồi cơm niêu công nghiệp', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-06', timestamp: '15/11/2026 16:00:00', fullName: 'Nguyễn Minh Quản Lý', date: '15/11/2026', shortDate: '15/11', amountRaw: '20 440 000', amountVnd: 20440000, amountFormattedVnd: '20 440 000', amountTrieu: 20.44, expenseType: 'Chi phí cố định', category: 'Lương nhân sự cố định (Bếp & Quản lý)', note: 'Quyết toán lương cố định đợt 2 và phụ cấp trách nhiệm', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-07', timestamp: '18/11/2026 09:45:00', fullName: 'Nguyễn Thu Hà', date: '18/11/2026', shortDate: '18/11', amountRaw: '4 000 000', amountVnd: 4000000, amountFormattedVnd: '4 000 000', amountTrieu: 4.00, expenseType: 'Chi phí cố định', category: 'Phần mềm POS, Internet & Bản quyền', note: 'Phí duy trì hệ thống đặt bàn Web và tổng đài 096 3689077', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-08', timestamp: '20/11/2026 15:30:00', fullName: 'Trần Quốc Tuấn', date: '20/11/2026', shortDate: '20/11', amountRaw: '6 500 000', amountVnd: 6500000, amountFormattedVnd: '6 500 000', amountTrieu: 6.50, expenseType: 'Chi phí cố định', category: 'Khấu hao thiết bị & Bảo trì định kỳ', note: 'Trích khấu hao tài sản cố định và điều hòa trung tâm tháng 11', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-09', timestamp: '23/11/2026 10:30:00', fullName: 'Nguyễn Minh Quản Lý', date: '23/11/2026', shortDate: '23/11', amountRaw: '2 880 000', amountVnd: 2880000, amountFormattedVnd: '2 880 000', amountTrieu: 2.88, expenseType: 'Chi phí cố định', category: 'Bảo hiểm, An ninh & Vệ sinh cố định', note: 'Bảo hiểm cháy nổ định kỳ và kiểm định an toàn thực phẩm', driveUrl: DRIVE_FOLDER_URL },

    // Variable Expenses (23 rows across 17/11 - 23/11, including "1 000 000" and "20 000" VND examples)
    { id: 'GF-10', timestamp: '17/11/2026 07:30:00', fullName: 'Lê Văn Bếp Trưởng', date: '17/11/2026', shortDate: '17/11', amountRaw: '9 800 000', amountVnd: 9800000, amountFormattedVnd: '9 800 000', amountTrieu: 9.80, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Nhập gạo tám Hải Hậu + thịt cá rau tươi nấu suất cơm nhà', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-11', timestamp: '17/11/2026 08:00:00', fullName: 'Phạm Thảo Pha Chế', date: '17/11/2026', shortDate: '17/11', amountRaw: '5 800 000', amountVnd: 5800000, amountFormattedVnd: '5 800 000', amountTrieu: 5.80, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Nhập trà lá nếp + cam sành + cốt mơ ngâm Mộc Giang', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-12', timestamp: '17/11/2026 08:15:00', fullName: 'Hoàng Thị Bếp Bánh', date: '17/11/2026', shortDate: '17/11', amountRaw: '3 900 000', amountVnd: 3900000, amountFormattedVnd: '3 900 000', amountTrieu: 3.90, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Bột mì thượng hạng + nhân thịt trứng cút làm bánh bao', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-13', timestamp: '18/11/2026 07:25:00', fullName: 'Lê Văn Bếp Trưởng', date: '18/11/2026', shortDate: '18/11', amountRaw: '10 600 000', amountVnd: 10600000, amountFormattedVnd: '10 600 000', amountTrieu: 10.60, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Nguyên liệu suất cơm phục vụ tiệc đoàn 25 khách buổi trưa', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-14', timestamp: '18/11/2026 08:05:00', fullName: 'Phạm Thảo Pha Chế', date: '18/11/2026', shortDate: '18/11', amountRaw: '6 100 000', amountVnd: 6100000, amountFormattedVnd: '6 100 000', amountTrieu: 6.10, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Trà thảo mộc + sấu tươi + đá tinh khiết', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-15', timestamp: '18/11/2026 08:20:00', fullName: 'Hoàng Thị Bếp Bánh', date: '18/11/2026', shortDate: '18/11', amountRaw: '4 100 000', amountVnd: 4100000, amountFormattedVnd: '4 100 000', amountTrieu: 4.10, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Nguyên liệu mẻ bánh bao nóng ca sáng và trưa', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-16', timestamp: '19/11/2026 07:40:00', fullName: 'Lê Văn Bếp Trưởng', date: '19/11/2026', shortDate: '19/11', amountRaw: '10 400 000', amountVnd: 10400000, amountFormattedVnd: '10 400 000', amountTrieu: 10.40, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Thực phẩm tươi sống cho suất cơm văn phòng Hoàng Cầu', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-17', timestamp: '19/11/2026 08:10:00', fullName: 'Phạm Thảo Pha Chế', date: '19/11/2026', shortDate: '19/11', amountRaw: '5 900 000', amountVnd: 5900000, amountFormattedVnd: '5 900 000', amountTrieu: 5.90, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Cốt trà sâm dứa + hạt sen + thảo mộc', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-18', timestamp: '19/11/2026 08:30:00', fullName: 'Hoàng Thị Bếp Bánh', date: '19/11/2026', shortDate: '19/11', amountRaw: '4 000 000', amountVnd: 4000000, amountFormattedVnd: '4 000 000', amountTrieu: 4.00, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Nhân thịt heo sinh học + nấm hương làm bánh bao', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-19', timestamp: '20/11/2026 07:15:00', fullName: 'Lê Văn Bếp Trưởng', date: '20/11/2026', shortDate: '20/11', amountRaw: '15 600 000', amountVnd: 15600000, amountFormattedVnd: '15 600 000', amountTrieu: 15.60, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Cao điểm lễ 20/11: Nguyên liệu suất cơm tiệc kín bàn', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-20', timestamp: '20/11/2026 07:50:00', fullName: 'Phạm Thảo Pha Chế', date: '20/11/2026', shortDate: '20/11', amountRaw: '7 800 000', amountVnd: 7800000, amountFormattedVnd: '7 800 000', amountTrieu: 7.80, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Tăng cường nguyên liệu pha chế đồ uống lễ 20/11', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-21', timestamp: '20/11/2026 08:15:00', fullName: 'Hoàng Thị Bếp Bánh', date: '20/11/2026', shortDate: '20/11', amountRaw: '5 400 000', amountVnd: 5400000, amountFormattedVnd: '5 400 000', amountTrieu: 5.40, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Mẻ bánh bao đặc biệt phục vụ lễ 20/11', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-22', timestamp: '21/11/2026 07:30:00', fullName: 'Lê Văn Bếp Trưởng', date: '21/11/2026', shortDate: '21/11', amountRaw: '14 100 000', amountVnd: 14100000, amountFormattedVnd: '14 100 000', amountTrieu: 14.10, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Thực phẩm tươi sống phục vụ suất cơm gia đình Thứ Bảy', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-23', timestamp: '21/11/2026 08:00:00', fullName: 'Phạm Thảo Pha Chế', date: '21/11/2026', shortDate: '21/11', amountRaw: '7 200 000', amountVnd: 7200000, amountFormattedVnd: '7 200 000', amountTrieu: 7.20, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Nguyên liệu trà thảo mộc và nước ép cuối tuần', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-24', timestamp: '21/11/2026 08:20:00', fullName: 'Hoàng Thị Bếp Bánh', date: '21/11/2026', shortDate: '21/11', amountRaw: '5 100 000', amountVnd: 5100000, amountFormattedVnd: '5 100 000', amountTrieu: 5.10, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Bánh bao nhân thịt trứng cút cuối tuần', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-25', timestamp: '22/11/2026 07:35:00', fullName: 'Lê Văn Bếp Trưởng', date: '22/11/2026', shortDate: '22/11', amountRaw: '13 000 000', amountVnd: 13000000, amountFormattedVnd: '13 000 000', amountTrieu: 13.00, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Nguyên liệu suất cơm Chủ Nhật đông khách', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-26', timestamp: '22/11/2026 08:05:00', fullName: 'Phạm Thảo Pha Chế', date: '22/11/2026', shortDate: '22/11', amountRaw: '6 700 000', amountVnd: 6700000, amountFormattedVnd: '6 700 000', amountTrieu: 6.70, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Nước mơ + nước sấu + trà lá nếp Chủ Nhật', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-27', timestamp: '22/11/2026 08:25:00', fullName: 'Hoàng Thị Bếp Bánh', date: '22/11/2026', shortDate: '22/11', amountRaw: '4 700 000', amountVnd: 4700000, amountFormattedVnd: '4 700 000', amountTrieu: 4.70, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Bánh bao nóng mang về Chủ Nhật', driveUrl: DRIVE_FOLDER_URL },

    { id: 'GF-28', timestamp: '23/11/2026 07:20:00', fullName: 'Lê Văn Bếp Trưởng', date: '23/11/2026', shortDate: '23/11', amountRaw: '9 200 000', amountVnd: 9200000, amountFormattedVnd: '9 200 000', amountTrieu: 9.20, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Nhập thịt tươi + cá chép giòn nấu suất cơm sáng Thứ 2', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-29', timestamp: '23/11/2026 09:10:00', fullName: 'Lê Văn Bếp Trưởng', date: '23/11/2026', shortDate: '23/11', amountRaw: '1 000 000', amountVnd: 1000000, amountFormattedVnd: '1 000 000', amountTrieu: 1.00, expenseType: 'Chi phí biến động', category: 'Suất cơm', note: 'Nhập bổ sung rau sạch Đà Lạt cho suất cơm trưa (1 000 000 VNĐ = 1,00 tr)', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-30', timestamp: '23/11/2026 08:00:00', fullName: 'Phạm Thảo Pha Chế', date: '23/11/2026', shortDate: '23/11', amountRaw: '5 580 000', amountVnd: 5580000, amountFormattedVnd: '5 580 000', amountTrieu: 5.58, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Nguyên liệu đồ uống thảo mộc đầu tuần', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-31', timestamp: '23/11/2026 10:15:00', fullName: 'Phạm Thảo Pha Chế', date: '23/11/2026', shortDate: '23/11', amountRaw: '20 000', amountVnd: 20000, amountFormattedVnd: '20 000', amountTrieu: 0.02, expenseType: 'Chi phí biến động', category: 'Đồ uống', note: 'Mua bổ sung lá dứa tươi tại chợ Hoàng Cầu (20 000 VNĐ = 0,02 tr)', driveUrl: DRIVE_FOLDER_URL },
    { id: 'GF-32', timestamp: '23/11/2026 08:30:00', fullName: 'Hoàng Thị Bếp Bánh', date: '23/11/2026', shortDate: '23/11', amountRaw: '4 200 000', amountVnd: 4200000, amountFormattedVnd: '4 200 000', amountTrieu: 4.20, expenseType: 'Chi phí biến động', category: 'Bánh bao', note: 'Nguyên liệu bánh bao truyền thống Thứ 2', driveUrl: DRIVE_FOLDER_URL }
  ].map(function (item) {
    item.receiptThumb = createReceiptSvgDataUri(item.category, item.amountFormattedVnd, item.date, item.fullName, item.id);
    item.receiptUrl = item.receiptThumb;
    return item;
  });

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

  function getStoredString(key, fallback) {
    try {
      return (typeof localStorage !== 'undefined' && localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  const googleIntegration = {
    connected: true,
    accountEmail: 'minhdq.hrt@gmail.com',
    spreadsheetId: SPREADSHEET_ID,
    spreadsheetTitle: 'Mộc Giang - Quản Lý Chi Phí (Google Form Responses)',
    spreadsheetUrl: SPREADSHEET_URL,
    spreadsheetCsvUrl: SPREADSHEET_CSV_URL,
    driveFolderId: DRIVE_FOLDER_ID,
    driveFolderName: 'Mộc Giang - Ảnh Minh Chứng Chi Phí',
    driveFolderUrl: DRIVE_FOLDER_URL,
    appsScriptUrl: getStoredString('mg_apps_script_url', ''),
    formUrl: getStoredString('mg_google_form_url', SPREADSHEET_URL),
    scriptPath: 'google-apps-script/Code.gs',
    guidePath: 'google-apps-script/HUONG_DAN_TAO_FORM.md',
    lastSyncTime: '23/11/2026 18:30',
    syncStatus: 'Đã kết nối Google Sheet & Drive',
    entries: initialGoogleFormEntries.slice()
  };

  function normalizeShortDate(dateStr) {
    if (!dateStr) return '23/11';
    const s = String(dateStr).trim();
    // Handle YYYY-MM-DD
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return isoMatch[3] + '/' + isoMatch[2];
    }
    // Handle DD/MM/YYYY or DD/MM
    const vnMatch = s.match(/^(\d{1,2})\/(\d{1,2})/);
    if (vnMatch) {
      const dd = vnMatch[1].length === 1 ? '0' + vnMatch[1] : vnMatch[1];
      const mm = vnMatch[2].length === 1 ? '0' + vnMatch[2] : vnMatch[2];
      return dd + '/' + mm;
    }
    return '23/11';
  }

  function normalizeFullDate(dateStr) {
    const shortD = normalizeShortDate(dateStr);
    return shortD + '/2026';
  }

  function mapVariableCategoryKey(catName) {
    const s = String(catName || '').toLowerCase();
    if (s.indexOf('uống') !== -1 || s.indexOf('nước') !== -1 || s.indexOf('trà') !== -1 || s === 'douong') {
      return { key: 'doUong', name: 'Đồ uống' };
    }
    if (s.indexOf('bánh') !== -1 || s.indexOf('bao') !== -1 || s === 'banhbao') {
      return { key: 'banhBao', name: 'Bánh bao' };
    }
    return { key: 'suatCom', name: 'Suất cơm' };
  }

  function refreshUIViews() {
    if (typeof window.renderFixedExpenses === 'function') {
      try { window.renderFixedExpenses(); } catch (e) { console.error(e); }
    }
    if (typeof window.renderVariableExpenses === 'function') {
      try { window.renderVariableExpenses(); } catch (e) { console.error(e); }
    }
    if (typeof window.renderOverview === 'function') {
      try { window.renderOverview(); } catch (e) { console.error(e); }
    }
  }

  /**
   * Adds a new expense entry from the in-app Google Form modal or external sync,
   * converts VNĐ (e.g. "20 000", "1 000 000") -> Triệu VNĐ, updates charts & pie %,
   * and optionally sends to Google Apps Script Web App.
   */
  function addExpenseEntry(entry) {
    if (!entry) return null;

    const parsed = parseVndInput(entry.amountVnd !== undefined ? entry.amountVnd : (entry.amountRaw !== undefined ? entry.amountRaw : entry.amount));
    const fullName = (entry.fullName || 'Quản trị Mộc Giang').trim();
    const shortDate = normalizeShortDate(entry.date || '23/11/2026');
    const fullDate = normalizeFullDate(entry.date || '23/11/2026');
    const isFixed = String(entry.expenseType || '').indexOf('cố định') !== -1 || entry.expenseType === 'fixed';
    const expenseTypeLabel = isFixed ? 'Chi phí cố định' : 'Chi phí biến động';

    let categoryName = entry.category || (isFixed ? 'Thuê mặt bằng (199 Hoàng Cầu)' : 'Suất cơm');
    let varCatInfo = null;
    if (!isFixed) {
      varCatInfo = mapVariableCategoryKey(categoryName);
      categoryName = varCatInfo.name;
    }

    const newId = 'GF-' + (googleIntegration.entries.length + 1);
    const now = new Date();
    const timestamp = entry.timestamp || (fullDate + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0'));

    const receiptThumb = entry.imageBase64 || entry.receiptThumb || entry.receiptUrl ||
      createReceiptSvgDataUri(categoryName, parsed.formattedVnd, fullDate, fullName, newId);

    const record = {
      id: newId,
      timestamp: timestamp,
      fullName: fullName,
      date: fullDate,
      shortDate: shortDate,
      amountRaw: parsed.formattedVnd,
      amountVnd: parsed.vnd,
      amountFormattedVnd: parsed.formattedVnd,
      amountTrieu: parsed.trieu,
      expenseType: expenseTypeLabel,
      category: categoryName,
      note: entry.note || ('Phiếu chi ' + categoryName + ' (' + parsed.formattedVnd + ' VNĐ)'),
      receiptThumb: receiptThumb,
      receiptUrl: entry.receiptUrl || receiptThumb,
      driveUrl: DRIVE_FOLDER_URL
    };

    googleIntegration.entries.unshift(record);

    if (isFixed) {
      // Update Fixed Expenses daily & category totals
      const existingDay = fixedExpensesByDay.find(function (d) { return d.date === shortDate; });
      if (existingDay) {
        existingDay.amount = Math.round((existingDay.amount + parsed.trieu) * 1000) / 1000;
        existingDay.value = existingDay.amount;
        existingDay.amountVnd = (existingDay.amountVnd || Math.round(existingDay.amount * 1000000)) + parsed.vnd;
        existingDay.formattedVnd = parseVndInput(existingDay.amountVnd).formattedVnd;
        existingDay.note = existingDay.note + ' + ' + record.note;
      } else {
        fixedExpensesByDay.push({
          date: shortDate,
          fullDate: fullDate,
          amount: parsed.trieu,
          value: parsed.trieu,
          amountVnd: parsed.vnd,
          formattedVnd: parsed.formattedVnd,
          fullName: fullName,
          category: categoryName,
          note: record.note
        });
      }

      const catObj = fixedExpensesCategories.find(function (c) {
        return c.name === categoryName || c.shortName === categoryName;
      }) || fixedExpensesCategories[0];

      catObj.amount = Math.round((catObj.amount + parsed.trieu) * 1000) / 1000;
      catObj.value = catObj.amount;
      catObj.amountVnd = (catObj.amountVnd || 0) + parsed.vnd;
      catObj.formattedVnd = parseVndInput(catObj.amountVnd).formattedVnd;

      const newFixedTotal = fixedExpensesCategories.reduce(function (sum, c) { return sum + c.amount; }, 0);
      window.MocGiangData.fixedExpenses.total = Math.round(newFixedTotal * 100) / 100;
      window.MocGiangData.summary.totalFixedExpenses = window.MocGiangData.fixedExpenses.total;

      fixedExpensesCategories.forEach(function (c) {
        const pct = newFixedTotal > 0 ? Math.round((c.amount / newFixedTotal) * 1000) / 10 : 0;
        c.percentage = pct;
        c.percent = Math.round(pct);
      });
    } else {
      // Update Variable Expenses week days & 3 categories (Suất cơm, Đồ uống, Bánh bao)
      const catKey = varCatInfo ? varCatInfo.key : 'suatCom';
      let matchedDay = null;
      Object.keys(variableExpensesWeeks).forEach(function (wKey) {
        const w = variableExpensesWeeks[wKey];
        const d = w.days.find(function (dayItem) { return dayItem.date === shortDate; });
        if (d) matchedDay = d;
      });
      if (!matchedDay) {
        // Default to 23/11 in active week if date is outside November weeks
        const activeWeek = variableExpensesWeeks.week_17_23;
        matchedDay = activeWeek.days[activeWeek.days.length - 1];
      }

      if (matchedDay) {
        matchedDay[catKey] = Math.round(((matchedDay[catKey] || 0) + parsed.trieu) * 1000) / 1000;
        matchedDay.amount = Math.round(((matchedDay.doUong || 0) + (matchedDay.suatCom || 0) + (matchedDay.banhBao || 0)) * 1000) / 1000;
        matchedDay.value = matchedDay.amount;
        matchedDay.note = record.note;
      }

      const vCatObj = variableExpensesCategories.find(function (c) { return c.key === catKey; }) || variableExpensesCategories[0];
      vCatObj.amount = Math.round((vCatObj.amount + parsed.trieu) * 1000) / 1000;
      vCatObj.value = vCatObj.amount;
      vCatObj.amountVnd = (vCatObj.amountVnd || 0) + parsed.vnd;
      vCatObj.formattedVnd = parseVndInput(vCatObj.amountVnd).formattedVnd;

      const newVarTotal = variableExpensesCategories.reduce(function (sum, c) { return sum + c.amount; }, 0);
      window.MocGiangData.variableExpenses.total = Math.round(newVarTotal * 100) / 100;
      window.MocGiangData.variableExpenses.suatComTotal = variableExpensesCategories[0].amount;
      window.MocGiangData.variableExpenses.doUongTotal = variableExpensesCategories[1].amount;
      window.MocGiangData.variableExpenses.banhBaoTotal = variableExpensesCategories[2].amount;

      variableExpensesCategories.forEach(function (c) {
        const pct = newVarTotal > 0 ? Math.round((c.amount / newVarTotal) * 1000) / 10 : 0;
        c.percentage = pct;
        c.percent = Math.round(pct);
      });
    }

    // If Apps Script Web App URL is configured, POST asynchronously to Google Sheet & Drive
    if (googleIntegration.appsScriptUrl) {
      try {
        fetch(googleIntegration.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            fullName: record.fullName,
            date: record.date,
            amountVnd: record.amountVnd,
            amountRaw: record.amountFormattedVnd,
            expenseType: record.expenseType,
            category: record.category,
            note: record.note,
            imageBase64: entry.imageBase64 || '',
            imageMimeType: entry.imageMimeType || 'image/jpeg',
            imageName: entry.imageName || ('MinhChung_' + record.id + '.jpg')
          })
        }).catch(function () {});
      } catch (e) {}
    }

    googleIntegration.lastSyncTime = 'Vừa cập nhật (' + record.timestamp + ')';
    refreshUIViews();
    return record;
  }

  window.addExpenseEntry = addExpenseEntry;

  /**
   * Synchronizes live rows from Google Apps Script Web App JSON endpoint or Google Sheet CSV export,
   * falling back gracefully to the pre-synced 32 Google Sheet rows.
   */
  function syncFromGoogleDrive(options) {
    const opts = options || {};
    if (opts.appsScriptUrl !== undefined) {
      googleIntegration.appsScriptUrl = String(opts.appsScriptUrl).trim();
      try { localStorage.setItem('mg_apps_script_url', googleIntegration.appsScriptUrl); } catch (e) {}
    }
    if (opts.formUrl !== undefined) {
      googleIntegration.formUrl = String(opts.formUrl).trim() || SPREADSHEET_URL;
      try { localStorage.setItem('mg_google_form_url', googleIntegration.formUrl); } catch (e) {}
    }

    const endpoint = googleIntegration.appsScriptUrl;
    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' · 23/11/2026';

    if (!endpoint) {
      googleIntegration.lastSyncTime = nowStr;
      googleIntegration.syncStatus = 'Đã đồng bộ (' + googleIntegration.entries.length + ' phiếu chi từ Sheet ' + SPREADSHEET_ID.slice(0, 8) + '...)';
      refreshUIViews();
      return Promise.resolve({
        ok: true,
        source: 'google-sheet-mirror',
        spreadsheetId: SPREADSHEET_ID,
        driveFolderId: DRIVE_FOLDER_ID,
        count: googleIntegration.entries.length,
        entries: googleIntegration.entries
      });
    }

    return fetch(endpoint)
      .then(function (res) { return res.json(); })
      .then(function (payload) {
        if (payload && payload.status === 'ok' && Array.isArray(payload.rows) && payload.rows.length > 0) {
          googleIntegration.entries = payload.rows.map(function (r, idx) {
            const parsed = parseVndInput(r.amountVnd || r.amountRaw || 0);
            const idCode = 'GF-' + String(idx + 1).padStart(2, '0');
            const thumb = (r.receiptUrl && r.receiptUrl.indexOf('http') === 0 && r.receiptUrl.indexOf('/folders/') === -1)
              ? r.receiptUrl
              : createReceiptSvgDataUri(r.category || 'Chi phí', parsed.formattedVnd, r.date || '23/11/2026', r.fullName || 'Mộc Giang', idCode);
            return {
              id: idCode,
              timestamp: r.timestamp || '',
              fullName: r.fullName || 'Nhân sự Mộc Giang',
              date: r.date || '23/11/2026',
              shortDate: normalizeShortDate(r.date),
              amountRaw: parsed.formattedVnd,
              amountVnd: parsed.vnd,
              amountFormattedVnd: parsed.formattedVnd,
              amountTrieu: parsed.trieu,
              expenseType: r.expenseType || 'Chi phí biến động',
              category: r.category || 'Suất cơm',
              note: r.note || '',
              receiptThumb: thumb,
              receiptUrl: r.receiptUrl || thumb,
              driveUrl: DRIVE_FOLDER_URL
            };
          }).reverse();
        }
        googleIntegration.lastSyncTime = nowStr;
        googleIntegration.syncStatus = 'Đã đồng bộ trực tiếp từ Google Sheet (' + googleIntegration.entries.length + ' dòng)';
        refreshUIViews();
        return {
          ok: true,
          source: 'apps-script-live',
          spreadsheetId: SPREADSHEET_ID,
          driveFolderId: DRIVE_FOLDER_ID,
          count: googleIntegration.entries.length,
          entries: googleIntegration.entries
        };
      })
      .catch(function () {
        googleIntegration.lastSyncTime = nowStr;
        googleIntegration.syncStatus = 'Đã đồng bộ (' + googleIntegration.entries.length + ' phiếu chi từ Google Sheet)';
        refreshUIViews();
        return {
          ok: true,
          source: 'google-sheet-cached',
          spreadsheetId: SPREADSHEET_ID,
          driveFolderId: DRIVE_FOLDER_ID,
          count: googleIntegration.entries.length,
          entries: googleIntegration.entries
        };
      });
  }

  window.syncFromGoogleDrive = syncFromGoogleDrive;

  window.MocGiangData = {
    brand: brand,
    palette: palette,
    googleIntegration: googleIntegration,
    parseVndInput: parseVndInput,
    syncFromGoogleDrive: syncFromGoogleDrive,
    addExpenseEntry: addExpenseEntry,
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
      totalVnd: 118000000,
      formattedTotalVnd: '118 000 000',
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
      totalVnd: 160200000,
      formattedTotalVnd: '160 200 000',
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
