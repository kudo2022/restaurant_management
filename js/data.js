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

  // Real POS Revenue Dataset (156 orders from 17/11/2026 to 24/11/2026 — Total: 13 480 000 VNĐ = 13.48 Triệu VNĐ)
  const posRevenueData = {
  "total": 13.48,
  "totalTrieu": 13.48,
  "totalVnd": 13480000,
  "formattedTotalVnd": "13 480 000",
  "totalOrders": 156,
  "totalItemsSold": 409,
  "dateRangeLabel": "17/11/2026 – 24/11/2026",
  "unit": "Triệu VNĐ",
  "growth": "156 hóa đơn POS thực tế",
  "channels": [
    {
      "id": "dineIn",
      "key": "dineIn",
      "name": "Bán tại chỗ",
      "fullName": "Bán tại chỗ (Phục vụ tại bàn TB1–TB6 & Tầng 1)",
      "amountVnd": 4909000,
      "formattedVnd": "4 909 000",
      "amount": 4.909,
      "value": 4.909,
      "percentage": 36.4,
      "percent": 36,
      "color": "#2E6B22",
      "orders": 76
    },
    {
      "id": "online",
      "key": "online",
      "name": "Bán online",
      "fullName": "Bán online (OL01 · OL02 · OL03)",
      "amountVnd": 4566000,
      "formattedVnd": "4 566 000",
      "amount": 4.566,
      "value": 4.566,
      "percentage": 33.9,
      "percent": 34,
      "color": "#2B7BBB",
      "orders": 13
    },
    {
      "id": "takeaway",
      "key": "takeaway",
      "name": "Bán mang về",
      "fullName": "Bán mang về (B01 · B02 · B03)",
      "amountVnd": 4005000,
      "formattedVnd": "4 005 000",
      "amount": 4.005,
      "value": 4.005,
      "percentage": 29.7,
      "percent": 30,
      "color": "#D97724",
      "orders": 67
    }
  ],
  "categories": [
    {
      "id": "dineIn",
      "key": "dineIn",
      "name": "Bán tại chỗ",
      "fullName": "Bán tại chỗ (Phục vụ tại bàn TB1–TB6 & Tầng 1)",
      "amountVnd": 4909000,
      "formattedVnd": "4 909 000",
      "amount": 4.909,
      "value": 4.909,
      "percentage": 36.4,
      "percent": 36,
      "color": "#2E6B22",
      "orders": 76
    },
    {
      "id": "online",
      "key": "online",
      "name": "Bán online",
      "fullName": "Bán online (OL01 · OL02 · OL03)",
      "amountVnd": 4566000,
      "formattedVnd": "4 566 000",
      "amount": 4.566,
      "value": 4.566,
      "percentage": 33.9,
      "percent": 34,
      "color": "#2B7BBB",
      "orders": 13
    },
    {
      "id": "takeaway",
      "key": "takeaway",
      "name": "Bán mang về",
      "fullName": "Bán mang về (B01 · B02 · B03)",
      "amountVnd": 4005000,
      "formattedVnd": "4 005 000",
      "amount": 4.005,
      "value": 4.005,
      "percentage": 29.7,
      "percent": 30,
      "color": "#D97724",
      "orders": 67
    }
  ],
  "allDays": [
    {
      "date": "17/11",
      "fullDate": "17/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 1235000,
      "takeawayVnd": 73000,
      "totalVnd": 1308000,
      "onlineOrders": 0,
      "dineInOrders": 13,
      "takeawayOrders": 2,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · B02/B04/B05 Tầng 1 & Bán mang về",
      "online": 0,
      "dineIn": 1.235,
      "takeaway": 0.073,
      "total": 1.308,
      "formattedTotalVnd": "1 308 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "1 235 000",
      "formattedTakeawayVnd": "73 000"
    },
    {
      "date": "18/11",
      "fullDate": "18/11/2026",
      "dayLabel": "Thứ 4",
      "onlineVnd": 1314000,
      "dineInVnd": 611000,
      "takeawayVnd": 85000,
      "totalVnd": 2010000,
      "onlineOrders": 2,
      "dineInOrders": 11,
      "takeawayOrders": 3,
      "orderCount": 16,
      "orders": 16,
      "note": "16 hóa đơn · Đơn hàng Online (960k + 354k) & khách tại bàn",
      "online": 1.314,
      "dineIn": 0.611,
      "takeaway": 0.085,
      "total": 2.01,
      "formattedTotalVnd": "2 010 000",
      "formattedOnlineVnd": "1 314 000",
      "formattedDineInVnd": "611 000",
      "formattedTakeawayVnd": "85 000"
    },
    {
      "date": "19/11",
      "fullDate": "19/11/2026",
      "dayLabel": "Thứ 5",
      "onlineVnd": 3087000,
      "dineInVnd": 338000,
      "takeawayVnd": 0,
      "totalVnd": 3425000,
      "onlineOrders": 10,
      "dineInOrders": 7,
      "takeawayOrders": 0,
      "orderCount": 17,
      "orders": 17,
      "note": "17 hóa đơn · Đỉnh doanh thu Online (1,968 tr đơn khai trương)",
      "online": 3.087,
      "dineIn": 0.338,
      "takeaway": 0,
      "total": 3.425,
      "formattedTotalVnd": "3 425 000",
      "formattedOnlineVnd": "3 087 000",
      "formattedDineInVnd": "338 000",
      "formattedTakeawayVnd": "0"
    },
    {
      "date": "20/11",
      "fullDate": "20/11/2026",
      "dayLabel": "Thứ 6",
      "onlineVnd": 165000,
      "dineInVnd": 540000,
      "takeawayVnd": 912000,
      "totalVnd": 1617000,
      "onlineOrders": 1,
      "dineInOrders": 7,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Lễ 20/11 đông đơn mang về & tại chỗ",
      "online": 0.165,
      "dineIn": 0.54,
      "takeaway": 0.912,
      "total": 1.617,
      "formattedTotalVnd": "1 617 000",
      "formattedOnlineVnd": "165 000",
      "formattedDineInVnd": "540 000",
      "formattedTakeawayVnd": "912 000"
    },
    {
      "date": "21/11",
      "fullDate": "21/11/2026",
      "dayLabel": "Thứ 7",
      "onlineVnd": 0,
      "dineInVnd": 589000,
      "takeawayVnd": 1272000,
      "totalVnd": 1861000,
      "onlineOrders": 0,
      "dineInOrders": 8,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Cuối tuần cao điểm Bán mang về (607k đơn lớn)",
      "online": 0,
      "dineIn": 0.589,
      "takeaway": 1.272,
      "total": 1.861,
      "formattedTotalVnd": "1 861 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "589 000",
      "formattedTakeawayVnd": "1 272 000"
    },
    {
      "date": "22/11",
      "fullDate": "22/11/2026",
      "dayLabel": "CN",
      "onlineVnd": 0,
      "dineInVnd": 0,
      "takeawayVnd": 951000,
      "totalVnd": 951000,
      "onlineOrders": 0,
      "dineInOrders": 0,
      "takeawayOrders": 15,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · Chủ nhật tập trung đơn Bán mang về B01/B02",
      "online": 0,
      "dineIn": 0,
      "takeaway": 0.951,
      "total": 0.951,
      "formattedTotalVnd": "951 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "0",
      "formattedTakeawayVnd": "951 000"
    },
    {
      "date": "23/11",
      "fullDate": "23/11/2026",
      "dayLabel": "Thứ 2",
      "onlineVnd": 0,
      "dineInVnd": 768000,
      "takeawayVnd": 261000,
      "totalVnd": 1029000,
      "onlineOrders": 0,
      "dineInOrders": 14,
      "takeawayOrders": 6,
      "orderCount": 20,
      "orders": 20,
      "note": "20 hóa đơn · Đầu tuần khách ăn trưa tại bàn TB1–TB6",
      "online": 0,
      "dineIn": 0.768,
      "takeaway": 0.261,
      "total": 1.029,
      "formattedTotalVnd": "1 029 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "768 000",
      "formattedTakeawayVnd": "261 000"
    },
    {
      "date": "24/11",
      "fullDate": "24/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 828000,
      "takeawayVnd": 451000,
      "totalVnd": 1279000,
      "onlineOrders": 0,
      "dineInOrders": 16,
      "takeawayOrders": 5,
      "orderCount": 21,
      "orders": 21,
      "note": "21 hóa đơn · Cơm trưa văn phòng & Trà/Bánh bao chiều",
      "online": 0,
      "dineIn": 0.828,
      "takeaway": 0.451,
      "total": 1.279,
      "formattedTotalVnd": "1 279 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "828 000",
      "formattedTakeawayVnd": "451 000"
    }
  ],
  "daily": [
    {
      "date": "17/11",
      "fullDate": "17/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 1235000,
      "takeawayVnd": 73000,
      "totalVnd": 1308000,
      "onlineOrders": 0,
      "dineInOrders": 13,
      "takeawayOrders": 2,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · B02/B04/B05 Tầng 1 & Bán mang về",
      "online": 0,
      "dineIn": 1.235,
      "takeaway": 0.073,
      "total": 1.308,
      "formattedTotalVnd": "1 308 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "1 235 000",
      "formattedTakeawayVnd": "73 000"
    },
    {
      "date": "18/11",
      "fullDate": "18/11/2026",
      "dayLabel": "Thứ 4",
      "onlineVnd": 1314000,
      "dineInVnd": 611000,
      "takeawayVnd": 85000,
      "totalVnd": 2010000,
      "onlineOrders": 2,
      "dineInOrders": 11,
      "takeawayOrders": 3,
      "orderCount": 16,
      "orders": 16,
      "note": "16 hóa đơn · Đơn hàng Online (960k + 354k) & khách tại bàn",
      "online": 1.314,
      "dineIn": 0.611,
      "takeaway": 0.085,
      "total": 2.01,
      "formattedTotalVnd": "2 010 000",
      "formattedOnlineVnd": "1 314 000",
      "formattedDineInVnd": "611 000",
      "formattedTakeawayVnd": "85 000"
    },
    {
      "date": "19/11",
      "fullDate": "19/11/2026",
      "dayLabel": "Thứ 5",
      "onlineVnd": 3087000,
      "dineInVnd": 338000,
      "takeawayVnd": 0,
      "totalVnd": 3425000,
      "onlineOrders": 10,
      "dineInOrders": 7,
      "takeawayOrders": 0,
      "orderCount": 17,
      "orders": 17,
      "note": "17 hóa đơn · Đỉnh doanh thu Online (1,968 tr đơn khai trương)",
      "online": 3.087,
      "dineIn": 0.338,
      "takeaway": 0,
      "total": 3.425,
      "formattedTotalVnd": "3 425 000",
      "formattedOnlineVnd": "3 087 000",
      "formattedDineInVnd": "338 000",
      "formattedTakeawayVnd": "0"
    },
    {
      "date": "20/11",
      "fullDate": "20/11/2026",
      "dayLabel": "Thứ 6",
      "onlineVnd": 165000,
      "dineInVnd": 540000,
      "takeawayVnd": 912000,
      "totalVnd": 1617000,
      "onlineOrders": 1,
      "dineInOrders": 7,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Lễ 20/11 đông đơn mang về & tại chỗ",
      "online": 0.165,
      "dineIn": 0.54,
      "takeaway": 0.912,
      "total": 1.617,
      "formattedTotalVnd": "1 617 000",
      "formattedOnlineVnd": "165 000",
      "formattedDineInVnd": "540 000",
      "formattedTakeawayVnd": "912 000"
    },
    {
      "date": "21/11",
      "fullDate": "21/11/2026",
      "dayLabel": "Thứ 7",
      "onlineVnd": 0,
      "dineInVnd": 589000,
      "takeawayVnd": 1272000,
      "totalVnd": 1861000,
      "onlineOrders": 0,
      "dineInOrders": 8,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Cuối tuần cao điểm Bán mang về (607k đơn lớn)",
      "online": 0,
      "dineIn": 0.589,
      "takeaway": 1.272,
      "total": 1.861,
      "formattedTotalVnd": "1 861 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "589 000",
      "formattedTakeawayVnd": "1 272 000"
    },
    {
      "date": "22/11",
      "fullDate": "22/11/2026",
      "dayLabel": "CN",
      "onlineVnd": 0,
      "dineInVnd": 0,
      "takeawayVnd": 951000,
      "totalVnd": 951000,
      "onlineOrders": 0,
      "dineInOrders": 0,
      "takeawayOrders": 15,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · Chủ nhật tập trung đơn Bán mang về B01/B02",
      "online": 0,
      "dineIn": 0,
      "takeaway": 0.951,
      "total": 0.951,
      "formattedTotalVnd": "951 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "0",
      "formattedTakeawayVnd": "951 000"
    },
    {
      "date": "23/11",
      "fullDate": "23/11/2026",
      "dayLabel": "Thứ 2",
      "onlineVnd": 0,
      "dineInVnd": 768000,
      "takeawayVnd": 261000,
      "totalVnd": 1029000,
      "onlineOrders": 0,
      "dineInOrders": 14,
      "takeawayOrders": 6,
      "orderCount": 20,
      "orders": 20,
      "note": "20 hóa đơn · Đầu tuần khách ăn trưa tại bàn TB1–TB6",
      "online": 0,
      "dineIn": 0.768,
      "takeaway": 0.261,
      "total": 1.029,
      "formattedTotalVnd": "1 029 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "768 000",
      "formattedTakeawayVnd": "261 000"
    },
    {
      "date": "24/11",
      "fullDate": "24/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 828000,
      "takeawayVnd": 451000,
      "totalVnd": 1279000,
      "onlineOrders": 0,
      "dineInOrders": 16,
      "takeawayOrders": 5,
      "orderCount": 21,
      "orders": 21,
      "note": "21 hóa đơn · Cơm trưa văn phòng & Trà/Bánh bao chiều",
      "online": 0,
      "dineIn": 0.828,
      "takeaway": 0.451,
      "total": 1.279,
      "formattedTotalVnd": "1 279 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "828 000",
      "formattedTakeawayVnd": "451 000"
    }
  ],
  "byDay": [
    {
      "date": "17/11",
      "fullDate": "17/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 1235000,
      "takeawayVnd": 73000,
      "totalVnd": 1308000,
      "onlineOrders": 0,
      "dineInOrders": 13,
      "takeawayOrders": 2,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · B02/B04/B05 Tầng 1 & Bán mang về",
      "online": 0,
      "dineIn": 1.235,
      "takeaway": 0.073,
      "total": 1.308,
      "formattedTotalVnd": "1 308 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "1 235 000",
      "formattedTakeawayVnd": "73 000"
    },
    {
      "date": "18/11",
      "fullDate": "18/11/2026",
      "dayLabel": "Thứ 4",
      "onlineVnd": 1314000,
      "dineInVnd": 611000,
      "takeawayVnd": 85000,
      "totalVnd": 2010000,
      "onlineOrders": 2,
      "dineInOrders": 11,
      "takeawayOrders": 3,
      "orderCount": 16,
      "orders": 16,
      "note": "16 hóa đơn · Đơn hàng Online (960k + 354k) & khách tại bàn",
      "online": 1.314,
      "dineIn": 0.611,
      "takeaway": 0.085,
      "total": 2.01,
      "formattedTotalVnd": "2 010 000",
      "formattedOnlineVnd": "1 314 000",
      "formattedDineInVnd": "611 000",
      "formattedTakeawayVnd": "85 000"
    },
    {
      "date": "19/11",
      "fullDate": "19/11/2026",
      "dayLabel": "Thứ 5",
      "onlineVnd": 3087000,
      "dineInVnd": 338000,
      "takeawayVnd": 0,
      "totalVnd": 3425000,
      "onlineOrders": 10,
      "dineInOrders": 7,
      "takeawayOrders": 0,
      "orderCount": 17,
      "orders": 17,
      "note": "17 hóa đơn · Đỉnh doanh thu Online (1,968 tr đơn khai trương)",
      "online": 3.087,
      "dineIn": 0.338,
      "takeaway": 0,
      "total": 3.425,
      "formattedTotalVnd": "3 425 000",
      "formattedOnlineVnd": "3 087 000",
      "formattedDineInVnd": "338 000",
      "formattedTakeawayVnd": "0"
    },
    {
      "date": "20/11",
      "fullDate": "20/11/2026",
      "dayLabel": "Thứ 6",
      "onlineVnd": 165000,
      "dineInVnd": 540000,
      "takeawayVnd": 912000,
      "totalVnd": 1617000,
      "onlineOrders": 1,
      "dineInOrders": 7,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Lễ 20/11 đông đơn mang về & tại chỗ",
      "online": 0.165,
      "dineIn": 0.54,
      "takeaway": 0.912,
      "total": 1.617,
      "formattedTotalVnd": "1 617 000",
      "formattedOnlineVnd": "165 000",
      "formattedDineInVnd": "540 000",
      "formattedTakeawayVnd": "912 000"
    },
    {
      "date": "21/11",
      "fullDate": "21/11/2026",
      "dayLabel": "Thứ 7",
      "onlineVnd": 0,
      "dineInVnd": 589000,
      "takeawayVnd": 1272000,
      "totalVnd": 1861000,
      "onlineOrders": 0,
      "dineInOrders": 8,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Cuối tuần cao điểm Bán mang về (607k đơn lớn)",
      "online": 0,
      "dineIn": 0.589,
      "takeaway": 1.272,
      "total": 1.861,
      "formattedTotalVnd": "1 861 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "589 000",
      "formattedTakeawayVnd": "1 272 000"
    },
    {
      "date": "22/11",
      "fullDate": "22/11/2026",
      "dayLabel": "CN",
      "onlineVnd": 0,
      "dineInVnd": 0,
      "takeawayVnd": 951000,
      "totalVnd": 951000,
      "onlineOrders": 0,
      "dineInOrders": 0,
      "takeawayOrders": 15,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · Chủ nhật tập trung đơn Bán mang về B01/B02",
      "online": 0,
      "dineIn": 0,
      "takeaway": 0.951,
      "total": 0.951,
      "formattedTotalVnd": "951 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "0",
      "formattedTakeawayVnd": "951 000"
    },
    {
      "date": "23/11",
      "fullDate": "23/11/2026",
      "dayLabel": "Thứ 2",
      "onlineVnd": 0,
      "dineInVnd": 768000,
      "takeawayVnd": 261000,
      "totalVnd": 1029000,
      "onlineOrders": 0,
      "dineInOrders": 14,
      "takeawayOrders": 6,
      "orderCount": 20,
      "orders": 20,
      "note": "20 hóa đơn · Đầu tuần khách ăn trưa tại bàn TB1–TB6",
      "online": 0,
      "dineIn": 0.768,
      "takeaway": 0.261,
      "total": 1.029,
      "formattedTotalVnd": "1 029 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "768 000",
      "formattedTakeawayVnd": "261 000"
    },
    {
      "date": "24/11",
      "fullDate": "24/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 828000,
      "takeawayVnd": 451000,
      "totalVnd": 1279000,
      "onlineOrders": 0,
      "dineInOrders": 16,
      "takeawayOrders": 5,
      "orderCount": 21,
      "orders": 21,
      "note": "21 hóa đơn · Cơm trưa văn phòng & Trà/Bánh bao chiều",
      "online": 0,
      "dineIn": 0.828,
      "takeaway": 0.451,
      "total": 1.279,
      "formattedTotalVnd": "1 279 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "828 000",
      "formattedTakeawayVnd": "451 000"
    }
  ],
  "last7Days": [
    {
      "date": "18/11",
      "fullDate": "18/11/2026",
      "dayLabel": "Thứ 4",
      "onlineVnd": 1314000,
      "dineInVnd": 611000,
      "takeawayVnd": 85000,
      "totalVnd": 2010000,
      "onlineOrders": 2,
      "dineInOrders": 11,
      "takeawayOrders": 3,
      "orderCount": 16,
      "orders": 16,
      "note": "16 hóa đơn · Đơn hàng Online (960k + 354k) & khách tại bàn",
      "online": 1.314,
      "dineIn": 0.611,
      "takeaway": 0.085,
      "total": 2.01,
      "formattedTotalVnd": "2 010 000",
      "formattedOnlineVnd": "1 314 000",
      "formattedDineInVnd": "611 000",
      "formattedTakeawayVnd": "85 000"
    },
    {
      "date": "19/11",
      "fullDate": "19/11/2026",
      "dayLabel": "Thứ 5",
      "onlineVnd": 3087000,
      "dineInVnd": 338000,
      "takeawayVnd": 0,
      "totalVnd": 3425000,
      "onlineOrders": 10,
      "dineInOrders": 7,
      "takeawayOrders": 0,
      "orderCount": 17,
      "orders": 17,
      "note": "17 hóa đơn · Đỉnh doanh thu Online (1,968 tr đơn khai trương)",
      "online": 3.087,
      "dineIn": 0.338,
      "takeaway": 0,
      "total": 3.425,
      "formattedTotalVnd": "3 425 000",
      "formattedOnlineVnd": "3 087 000",
      "formattedDineInVnd": "338 000",
      "formattedTakeawayVnd": "0"
    },
    {
      "date": "20/11",
      "fullDate": "20/11/2026",
      "dayLabel": "Thứ 6",
      "onlineVnd": 165000,
      "dineInVnd": 540000,
      "takeawayVnd": 912000,
      "totalVnd": 1617000,
      "onlineOrders": 1,
      "dineInOrders": 7,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Lễ 20/11 đông đơn mang về & tại chỗ",
      "online": 0.165,
      "dineIn": 0.54,
      "takeaway": 0.912,
      "total": 1.617,
      "formattedTotalVnd": "1 617 000",
      "formattedOnlineVnd": "165 000",
      "formattedDineInVnd": "540 000",
      "formattedTakeawayVnd": "912 000"
    },
    {
      "date": "21/11",
      "fullDate": "21/11/2026",
      "dayLabel": "Thứ 7",
      "onlineVnd": 0,
      "dineInVnd": 589000,
      "takeawayVnd": 1272000,
      "totalVnd": 1861000,
      "onlineOrders": 0,
      "dineInOrders": 8,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Cuối tuần cao điểm Bán mang về (607k đơn lớn)",
      "online": 0,
      "dineIn": 0.589,
      "takeaway": 1.272,
      "total": 1.861,
      "formattedTotalVnd": "1 861 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "589 000",
      "formattedTakeawayVnd": "1 272 000"
    },
    {
      "date": "22/11",
      "fullDate": "22/11/2026",
      "dayLabel": "CN",
      "onlineVnd": 0,
      "dineInVnd": 0,
      "takeawayVnd": 951000,
      "totalVnd": 951000,
      "onlineOrders": 0,
      "dineInOrders": 0,
      "takeawayOrders": 15,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · Chủ nhật tập trung đơn Bán mang về B01/B02",
      "online": 0,
      "dineIn": 0,
      "takeaway": 0.951,
      "total": 0.951,
      "formattedTotalVnd": "951 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "0",
      "formattedTakeawayVnd": "951 000"
    },
    {
      "date": "23/11",
      "fullDate": "23/11/2026",
      "dayLabel": "Thứ 2",
      "onlineVnd": 0,
      "dineInVnd": 768000,
      "takeawayVnd": 261000,
      "totalVnd": 1029000,
      "onlineOrders": 0,
      "dineInOrders": 14,
      "takeawayOrders": 6,
      "orderCount": 20,
      "orders": 20,
      "note": "20 hóa đơn · Đầu tuần khách ăn trưa tại bàn TB1–TB6",
      "online": 0,
      "dineIn": 0.768,
      "takeaway": 0.261,
      "total": 1.029,
      "formattedTotalVnd": "1 029 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "768 000",
      "formattedTakeawayVnd": "261 000"
    },
    {
      "date": "24/11",
      "fullDate": "24/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 828000,
      "takeawayVnd": 451000,
      "totalVnd": 1279000,
      "onlineOrders": 0,
      "dineInOrders": 16,
      "takeawayOrders": 5,
      "orderCount": 21,
      "orders": 21,
      "note": "21 hóa đơn · Cơm trưa văn phòng & Trà/Bánh bao chiều",
      "online": 0,
      "dineIn": 0.828,
      "takeaway": 0.451,
      "total": 1.279,
      "formattedTotalVnd": "1 279 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "828 000",
      "formattedTakeawayVnd": "451 000"
    }
  ],
  "week17To23": [
    {
      "date": "17/11",
      "fullDate": "17/11/2026",
      "dayLabel": "Thứ 3",
      "onlineVnd": 0,
      "dineInVnd": 1235000,
      "takeawayVnd": 73000,
      "totalVnd": 1308000,
      "onlineOrders": 0,
      "dineInOrders": 13,
      "takeawayOrders": 2,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · B02/B04/B05 Tầng 1 & Bán mang về",
      "online": 0,
      "dineIn": 1.235,
      "takeaway": 0.073,
      "total": 1.308,
      "formattedTotalVnd": "1 308 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "1 235 000",
      "formattedTakeawayVnd": "73 000"
    },
    {
      "date": "18/11",
      "fullDate": "18/11/2026",
      "dayLabel": "Thứ 4",
      "onlineVnd": 1314000,
      "dineInVnd": 611000,
      "takeawayVnd": 85000,
      "totalVnd": 2010000,
      "onlineOrders": 2,
      "dineInOrders": 11,
      "takeawayOrders": 3,
      "orderCount": 16,
      "orders": 16,
      "note": "16 hóa đơn · Đơn hàng Online (960k + 354k) & khách tại bàn",
      "online": 1.314,
      "dineIn": 0.611,
      "takeaway": 0.085,
      "total": 2.01,
      "formattedTotalVnd": "2 010 000",
      "formattedOnlineVnd": "1 314 000",
      "formattedDineInVnd": "611 000",
      "formattedTakeawayVnd": "85 000"
    },
    {
      "date": "19/11",
      "fullDate": "19/11/2026",
      "dayLabel": "Thứ 5",
      "onlineVnd": 3087000,
      "dineInVnd": 338000,
      "takeawayVnd": 0,
      "totalVnd": 3425000,
      "onlineOrders": 10,
      "dineInOrders": 7,
      "takeawayOrders": 0,
      "orderCount": 17,
      "orders": 17,
      "note": "17 hóa đơn · Đỉnh doanh thu Online (1,968 tr đơn khai trương)",
      "online": 3.087,
      "dineIn": 0.338,
      "takeaway": 0,
      "total": 3.425,
      "formattedTotalVnd": "3 425 000",
      "formattedOnlineVnd": "3 087 000",
      "formattedDineInVnd": "338 000",
      "formattedTakeawayVnd": "0"
    },
    {
      "date": "20/11",
      "fullDate": "20/11/2026",
      "dayLabel": "Thứ 6",
      "onlineVnd": 165000,
      "dineInVnd": 540000,
      "takeawayVnd": 912000,
      "totalVnd": 1617000,
      "onlineOrders": 1,
      "dineInOrders": 7,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Lễ 20/11 đông đơn mang về & tại chỗ",
      "online": 0.165,
      "dineIn": 0.54,
      "takeaway": 0.912,
      "total": 1.617,
      "formattedTotalVnd": "1 617 000",
      "formattedOnlineVnd": "165 000",
      "formattedDineInVnd": "540 000",
      "formattedTakeawayVnd": "912 000"
    },
    {
      "date": "21/11",
      "fullDate": "21/11/2026",
      "dayLabel": "Thứ 7",
      "onlineVnd": 0,
      "dineInVnd": 589000,
      "takeawayVnd": 1272000,
      "totalVnd": 1861000,
      "onlineOrders": 0,
      "dineInOrders": 8,
      "takeawayOrders": 18,
      "orderCount": 26,
      "orders": 26,
      "note": "26 hóa đơn · Cuối tuần cao điểm Bán mang về (607k đơn lớn)",
      "online": 0,
      "dineIn": 0.589,
      "takeaway": 1.272,
      "total": 1.861,
      "formattedTotalVnd": "1 861 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "589 000",
      "formattedTakeawayVnd": "1 272 000"
    },
    {
      "date": "22/11",
      "fullDate": "22/11/2026",
      "dayLabel": "CN",
      "onlineVnd": 0,
      "dineInVnd": 0,
      "takeawayVnd": 951000,
      "totalVnd": 951000,
      "onlineOrders": 0,
      "dineInOrders": 0,
      "takeawayOrders": 15,
      "orderCount": 15,
      "orders": 15,
      "note": "15 hóa đơn · Chủ nhật tập trung đơn Bán mang về B01/B02",
      "online": 0,
      "dineIn": 0,
      "takeaway": 0.951,
      "total": 0.951,
      "formattedTotalVnd": "951 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "0",
      "formattedTakeawayVnd": "951 000"
    },
    {
      "date": "23/11",
      "fullDate": "23/11/2026",
      "dayLabel": "Thứ 2",
      "onlineVnd": 0,
      "dineInVnd": 768000,
      "takeawayVnd": 261000,
      "totalVnd": 1029000,
      "onlineOrders": 0,
      "dineInOrders": 14,
      "takeawayOrders": 6,
      "orderCount": 20,
      "orders": 20,
      "note": "20 hóa đơn · Đầu tuần khách ăn trưa tại bàn TB1–TB6",
      "online": 0,
      "dineIn": 0.768,
      "takeaway": 0.261,
      "total": 1.029,
      "formattedTotalVnd": "1 029 000",
      "formattedOnlineVnd": "0",
      "formattedDineInVnd": "768 000",
      "formattedTakeawayVnd": "261 000"
    }
  ],
  "byDish": [
    {
      "name": "Bánh Bao Bò Ngô",
      "groupKey": "banh_bao",
      "groupName": "Bánh bao",
      "unit": "CAI",
      "quantity": 40,
      "orderCount": 10,
      "revenueVnd": 720000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 18000,
          "orders": 1
        },
        "22/11": {
          "quantity": 2,
          "revenueVnd": 36000,
          "orders": 2
        },
        "21/11": {
          "quantity": 2,
          "revenueVnd": 36000,
          "orders": 2
        },
        "20/11": {
          "quantity": 3,
          "revenueVnd": 54000,
          "orders": 3
        },
        "19/11": {
          "quantity": 32,
          "revenueVnd": 576000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 576000,
        "dineInVnd": 18000,
        "takeawayVnd": 126000,
        "onlineQty": 32,
        "dineInQty": 1,
        "takeawayQty": 7
      },
      "rank": 1,
      "formattedVnd": "720 000",
      "revenueTrieu": 0.72,
      "sharePercent": 5.34,
      "color": "#2E6B22"
    },
    {
      "name": "Cơm Bò sốt vang",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 11,
      "orderCount": 7,
      "revenueVnd": 649000,
      "byDate": {
        "18/11": {
          "quantity": 6,
          "revenueVnd": 354000,
          "orders": 2
        },
        "17/11": {
          "quantity": 5,
          "revenueVnd": 295000,
          "orders": 5
        }
      },
      "byChannel": {
        "onlineVnd": 354000,
        "dineInVnd": 295000,
        "takeawayVnd": 0,
        "onlineQty": 6,
        "dineInQty": 5,
        "takeawayQty": 0
      },
      "rank": 2,
      "formattedVnd": "649 000",
      "revenueTrieu": 0.649,
      "sharePercent": 4.81,
      "color": "#2B7BBB"
    },
    {
      "name": "Bánh Bao Xúc Xích",
      "groupKey": "banh_bao",
      "groupName": "Bánh bao",
      "unit": "CAI",
      "quantity": 33,
      "orderCount": 18,
      "revenueVnd": 594000,
      "byDate": {
        "24/11": {
          "quantity": 3,
          "revenueVnd": 54000,
          "orders": 3
        },
        "22/11": {
          "quantity": 2,
          "revenueVnd": 36000,
          "orders": 2
        },
        "21/11": {
          "quantity": 6,
          "revenueVnd": 108000,
          "orders": 5
        },
        "20/11": {
          "quantity": 6,
          "revenueVnd": 108000,
          "orders": 6
        },
        "19/11": {
          "quantity": 16,
          "revenueVnd": 288000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 288000,
        "dineInVnd": 90000,
        "takeawayVnd": 216000,
        "onlineQty": 16,
        "dineInQty": 5,
        "takeawayQty": 12
      },
      "rank": 3,
      "formattedVnd": "594 000",
      "revenueTrieu": 0.594,
      "sharePercent": 4.41,
      "color": "#D97724"
    },
    {
      "name": "Cơm Nọng rang dừa trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 10,
      "orderCount": 7,
      "revenueVnd": 590000,
      "byDate": {
        "18/11": {
          "quantity": 5,
          "revenueVnd": 295000,
          "orders": 2
        },
        "17/11": {
          "quantity": 5,
          "revenueVnd": 295000,
          "orders": 5
        }
      },
      "byChannel": {
        "onlineVnd": 295000,
        "dineInVnd": 295000,
        "takeawayVnd": 0,
        "onlineQty": 5,
        "dineInQty": 5,
        "takeawayQty": 0
      },
      "rank": 4,
      "formattedVnd": "590 000",
      "revenueTrieu": 0.59,
      "sharePercent": 4.38,
      "color": "#3D1F0D"
    },
    {
      "name": "Bánh bao Xá Xíu",
      "groupKey": "banh_bao",
      "groupName": "Bánh bao",
      "unit": "CAI",
      "quantity": 32,
      "orderCount": 17,
      "revenueVnd": 576000,
      "byDate": {
        "24/11": {
          "quantity": 3,
          "revenueVnd": 54000,
          "orders": 3
        },
        "23/11": {
          "quantity": 4,
          "revenueVnd": 72000,
          "orders": 4
        },
        "22/11": {
          "quantity": 2,
          "revenueVnd": 36000,
          "orders": 2
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 18000,
          "orders": 1
        },
        "20/11": {
          "quantity": 5,
          "revenueVnd": 90000,
          "orders": 5
        },
        "19/11": {
          "quantity": 17,
          "revenueVnd": 306000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 306000,
        "dineInVnd": 54000,
        "takeawayVnd": 216000,
        "onlineQty": 17,
        "dineInQty": 3,
        "takeawayQty": 12
      },
      "rank": 5,
      "formattedVnd": "576 000",
      "revenueTrieu": 0.576,
      "sharePercent": 4.27,
      "color": "#6BA353"
    },
    {
      "name": "Trà Sữa Cốm Dẻo (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 19,
      "orderCount": 6,
      "revenueVnd": 570000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        },
        "20/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        },
        "19/11": {
          "quantity": 14,
          "revenueVnd": 420000,
          "orders": 2
        },
        "18/11": {
          "quantity": 3,
          "revenueVnd": 90000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 420000,
        "dineInVnd": 120000,
        "takeawayVnd": 30000,
        "onlineQty": 14,
        "dineInQty": 4,
        "takeawayQty": 1
      },
      "rank": 6,
      "formattedVnd": "570 000",
      "revenueTrieu": 0.57,
      "sharePercent": 4.23,
      "color": "#C88A2B"
    },
    {
      "name": "Trà Sen Vàng Củ Năng (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 18,
      "orderCount": 3,
      "revenueVnd": 540000,
      "byDate": {
        "24/11": {
          "quantity": 3,
          "revenueVnd": 90000,
          "orders": 2
        },
        "19/11": {
          "quantity": 15,
          "revenueVnd": 450000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 450000,
        "dineInVnd": 60000,
        "takeawayVnd": 30000,
        "onlineQty": 15,
        "dineInQty": 2,
        "takeawayQty": 1
      },
      "rank": 7,
      "formattedVnd": "540 000",
      "revenueTrieu": 0.54,
      "sharePercent": 4.01,
      "color": "#1E5F8A"
    },
    {
      "name": "Cơm Thịt viên ôm trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 12,
      "orderCount": 7,
      "revenueVnd": 520000,
      "byDate": {
        "23/11": {
          "quantity": 2,
          "revenueVnd": 70000,
          "orders": 1
        },
        "20/11": {
          "quantity": 10,
          "revenueVnd": 450000,
          "orders": 6
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 410000,
        "takeawayVnd": 110000,
        "onlineQty": 0,
        "dineInQty": 10,
        "takeawayQty": 2
      },
      "rank": 8,
      "formattedVnd": "520 000",
      "revenueTrieu": 0.52,
      "sharePercent": 3.86,
      "color": "#8C4A27"
    },
    {
      "name": "Trà Sữa Cốm Dẻo (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 10,
      "orderCount": 5,
      "revenueVnd": 367000,
      "byDate": {
        "24/11": {
          "quantity": 3,
          "revenueVnd": 108000,
          "orders": 1
        },
        "23/11": {
          "quantity": 2,
          "revenueVnd": 72000,
          "orders": 2
        },
        "20/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        },
        "19/11": {
          "quantity": 4,
          "revenueVnd": 151000,
          "orders": 3
        }
      },
      "byChannel": {
        "onlineVnd": 151000,
        "dineInVnd": 72000,
        "takeawayVnd": 144000,
        "onlineQty": 4,
        "dineInQty": 2,
        "takeawayQty": 4
      },
      "rank": 9,
      "formattedVnd": "367 000",
      "revenueTrieu": 0.367,
      "sharePercent": 2.72,
      "color": "#4D8B31"
    },
    {
      "name": "Cơm Thịt kho trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 8,
      "orderCount": 6,
      "revenueVnd": 340000,
      "byDate": {
        "19/11": {
          "quantity": 8,
          "revenueVnd": 340000,
          "orders": 7
        }
      },
      "byChannel": {
        "onlineVnd": 215000,
        "dineInVnd": 125000,
        "takeawayVnd": 0,
        "onlineQty": 5,
        "dineInQty": 3,
        "takeawayQty": 0
      },
      "rank": 10,
      "formattedVnd": "340 000",
      "revenueTrieu": 0.34,
      "sharePercent": 2.52,
      "color": "#B85D19"
    },
    {
      "name": "Bánh bột lọc 20c",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 330000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 165000,
          "orders": 1
        },
        "20/11": {
          "quantity": 1,
          "revenueVnd": 165000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 165000,
        "dineInVnd": 0,
        "takeawayVnd": 165000,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 11,
      "formattedVnd": "330 000",
      "revenueTrieu": 0.33,
      "sharePercent": 2.45,
      "color": "#3A7D2C"
    },
    {
      "name": "Cơm Bò kho lá lốt",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 9,
      "orderCount": 4,
      "revenueVnd": 315000,
      "byDate": {
        "22/11": {
          "quantity": 9,
          "revenueVnd": 315000,
          "orders": 4
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 315000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 9
      },
      "rank": 12,
      "formattedVnd": "315 000",
      "revenueTrieu": 0.315,
      "sharePercent": 2.34,
      "color": "#5C3114"
    },
    {
      "name": "Cacao Latte (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 12,
      "orderCount": 1,
      "revenueVnd": 300000,
      "byDate": {
        "19/11": {
          "quantity": 12,
          "revenueVnd": 300000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 300000,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 12,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 13,
      "formattedVnd": "300 000",
      "revenueTrieu": 0.3,
      "sharePercent": 2.23,
      "color": "#26689E"
    },
    {
      "name": "Cơm Thịt kho củ cải",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 7,
      "orderCount": 7,
      "revenueVnd": 295000,
      "byDate": {
        "24/11": {
          "quantity": 7,
          "revenueVnd": 295000,
          "orders": 7
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 260000,
        "takeawayVnd": 35000,
        "onlineQty": 0,
        "dineInQty": 6,
        "takeawayQty": 1
      },
      "rank": 14,
      "formattedVnd": "295 000",
      "revenueTrieu": 0.295,
      "sharePercent": 2.19,
      "color": "#D16014"
    },
    {
      "name": "Cơm Gà xào sả ớt",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 6,
      "orderCount": 4,
      "revenueVnd": 280000,
      "byDate": {
        "24/11": {
          "quantity": 6,
          "revenueVnd": 280000,
          "orders": 4
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 245000,
        "takeawayVnd": 35000,
        "onlineQty": 0,
        "dineInQty": 5,
        "takeawayQty": 1
      },
      "rank": 15,
      "formattedVnd": "280 000",
      "revenueTrieu": 0.28,
      "sharePercent": 2.08,
      "color": "#5A8F43"
    },
    {
      "name": "Bún Thang",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 7,
      "orderCount": 4,
      "revenueVnd": 250000,
      "byDate": {
        "21/11": {
          "quantity": 7,
          "revenueVnd": 250000,
          "orders": 5
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 200000,
        "takeawayVnd": 50000,
        "onlineQty": 0,
        "dineInQty": 6,
        "takeawayQty": 1
      },
      "rank": 16,
      "formattedVnd": "250 000",
      "revenueTrieu": 0.25,
      "sharePercent": 1.85,
      "color": "#2E6B22"
    },
    {
      "name": "Cơm rang dưa bò",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 10,
      "orderCount": 6,
      "revenueVnd": 245000,
      "byDate": {
        "21/11": {
          "quantity": 10,
          "revenueVnd": 245000,
          "orders": 6
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 210000,
        "takeawayVnd": 35000,
        "onlineQty": 0,
        "dineInQty": 9,
        "takeawayQty": 1
      },
      "rank": 17,
      "formattedVnd": "245 000",
      "revenueTrieu": 0.245,
      "sharePercent": 1.82,
      "color": "#2B7BBB"
    },
    {
      "name": "Cơm Thịt luộc",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 6,
      "orderCount": 6,
      "revenueVnd": 240000,
      "byDate": {
        "19/11": {
          "quantity": 3,
          "revenueVnd": 115000,
          "orders": 3
        },
        "18/11": {
          "quantity": 3,
          "revenueVnd": 125000,
          "orders": 3
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 240000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 6,
        "takeawayQty": 0
      },
      "rank": 18,
      "formattedVnd": "240 000",
      "revenueTrieu": 0.24,
      "sharePercent": 1.78,
      "color": "#D97724"
    },
    {
      "name": "Cơm Gà ta om nấm hương",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 4,
      "orderCount": 2,
      "revenueVnd": 236000,
      "byDate": {
        "18/11": {
          "quantity": 4,
          "revenueVnd": 236000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 236000,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 4,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 19,
      "formattedVnd": "236 000",
      "revenueTrieu": 0.236,
      "sharePercent": 1.75,
      "color": "#3D1F0D"
    },
    {
      "name": "Canh Cà bung",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 230000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 115000,
          "orders": 1
        },
        "20/11": {
          "quantity": 1,
          "revenueVnd": 115000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 230000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 2
      },
      "rank": 20,
      "formattedVnd": "230 000",
      "revenueTrieu": 0.23,
      "sharePercent": 1.71,
      "color": "#6BA353"
    },
    {
      "name": "Cơm Chân giò luộc",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 4,
      "orderCount": 2,
      "revenueVnd": 220000,
      "byDate": {
        "19/11": {
          "quantity": 2,
          "revenueVnd": 110000,
          "orders": 1
        },
        "18/11": {
          "quantity": 2,
          "revenueVnd": 110000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 110000,
        "dineInVnd": 110000,
        "takeawayVnd": 0,
        "onlineQty": 2,
        "dineInQty": 2,
        "takeawayQty": 0
      },
      "rank": 21,
      "formattedVnd": "220 000",
      "revenueTrieu": 0.22,
      "sharePercent": 1.63,
      "color": "#C88A2B"
    },
    {
      "name": "Bánh Bao Cút Thịt",
      "groupKey": "banh_bao",
      "groupName": "Bánh bao",
      "unit": "CAI",
      "quantity": 14,
      "orderCount": 12,
      "revenueVnd": 210000,
      "byDate": {
        "24/11": {
          "quantity": 3,
          "revenueVnd": 45000,
          "orders": 2
        },
        "23/11": {
          "quantity": 1,
          "revenueVnd": 15000,
          "orders": 1
        },
        "21/11": {
          "quantity": 4,
          "revenueVnd": 60000,
          "orders": 3
        },
        "20/11": {
          "quantity": 5,
          "revenueVnd": 75000,
          "orders": 5
        },
        "19/11": {
          "quantity": 1,
          "revenueVnd": 15000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 15000,
        "dineInVnd": 45000,
        "takeawayVnd": 150000,
        "onlineQty": 1,
        "dineInQty": 3,
        "takeawayQty": 10
      },
      "rank": 22,
      "formattedVnd": "210 000",
      "revenueTrieu": 0.21,
      "sharePercent": 1.56,
      "color": "#1E5F8A"
    },
    {
      "name": "Cơm Thịt nướng xá xíu",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 6,
      "orderCount": 5,
      "revenueVnd": 210000,
      "byDate": {
        "23/11": {
          "quantity": 6,
          "revenueVnd": 210000,
          "orders": 5
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 175000,
        "takeawayVnd": 35000,
        "onlineQty": 0,
        "dineInQty": 5,
        "takeawayQty": 1
      },
      "rank": 23,
      "formattedVnd": "210 000",
      "revenueTrieu": 0.21,
      "sharePercent": 1.56,
      "color": "#8C4A27"
    },
    {
      "name": "Cơm Thịt rang cháy cạnh",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 4,
      "orderCount": 4,
      "revenueVnd": 200000,
      "byDate": {
        "18/11": {
          "quantity": 4,
          "revenueVnd": 200000,
          "orders": 4
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 200000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 4,
        "takeawayQty": 0
      },
      "rank": 24,
      "formattedVnd": "200 000",
      "revenueTrieu": 0.2,
      "sharePercent": 1.48,
      "color": "#4D8B31"
    },
    {
      "name": "Bò sốt vang",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "HOP",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 195000,
      "byDate": {
        "18/11": {
          "quantity": 1,
          "revenueVnd": 195000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 195000,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 25,
      "formattedVnd": "195 000",
      "revenueTrieu": 0.195,
      "sharePercent": 1.45,
      "color": "#B85D19"
    },
    {
      "name": "Cơm Chả lá lốt",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 4,
      "orderCount": 3,
      "revenueVnd": 190000,
      "byDate": {
        "23/11": {
          "quantity": 4,
          "revenueVnd": 190000,
          "orders": 3
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 190000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 4,
        "takeawayQty": 0
      },
      "rank": 26,
      "formattedVnd": "190 000",
      "revenueTrieu": 0.19,
      "sharePercent": 1.41,
      "color": "#3A7D2C"
    },
    {
      "name": "Nhài Sữa Kem Trứng (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 5,
      "orderCount": 4,
      "revenueVnd": 189000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        },
        "22/11": {
          "quantity": 2,
          "revenueVnd": 72000,
          "orders": 1
        },
        "18/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 45000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 36000,
        "takeawayVnd": 153000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 4
      },
      "rank": 27,
      "formattedVnd": "189 000",
      "revenueTrieu": 0.189,
      "sharePercent": 1.4,
      "color": "#5C3114"
    },
    {
      "name": "Nọng rang dừa trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "HOP",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 185000,
      "byDate": {
        "17/11": {
          "quantity": 1,
          "revenueVnd": 185000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 185000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 28,
      "formattedVnd": "185 000",
      "revenueTrieu": 0.185,
      "sharePercent": 1.37,
      "color": "#26689E"
    },
    {
      "name": "Trà Sen Vàng Củ Năng (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 5,
      "orderCount": 4,
      "revenueVnd": 180000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        },
        "22/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        },
        "21/11": {
          "quantity": 2,
          "revenueVnd": 72000,
          "orders": 1
        },
        "19/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 36000,
        "dineInVnd": 0,
        "takeawayVnd": 144000,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 4
      },
      "rank": 29,
      "formattedVnd": "180 000",
      "revenueTrieu": 0.18,
      "sharePercent": 1.34,
      "color": "#D16014"
    },
    {
      "name": "Cơm Tôm đồng rang",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 177000,
      "byDate": {
        "18/11": {
          "quantity": 1,
          "revenueVnd": 59000,
          "orders": 1
        },
        "17/11": {
          "quantity": 2,
          "revenueVnd": 118000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 59000,
        "dineInVnd": 118000,
        "takeawayVnd": 0,
        "onlineQty": 1,
        "dineInQty": 2,
        "takeawayQty": 0
      },
      "rank": 30,
      "formattedVnd": "177 000",
      "revenueTrieu": 0.177,
      "sharePercent": 1.31,
      "color": "#5A8F43"
    },
    {
      "name": "Canh chuối đậu",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "HOP",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 175000,
      "byDate": {
        "18/11": {
          "quantity": 1,
          "revenueVnd": 175000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 175000,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 31,
      "formattedVnd": "175 000",
      "revenueTrieu": 0.175,
      "sharePercent": 1.3,
      "color": "#2E6B22"
    },
    {
      "name": "Cafe Muối (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 6,
      "orderCount": 5,
      "revenueVnd": 150000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "23/11": {
          "quantity": 3,
          "revenueVnd": 75000,
          "orders": 2
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "18/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 75000,
        "takeawayVnd": 75000,
        "onlineQty": 0,
        "dineInQty": 3,
        "takeawayQty": 3
      },
      "rank": 32,
      "formattedVnd": "150 000",
      "revenueTrieu": 0.15,
      "sharePercent": 1.11,
      "color": "#2B7BBB"
    },
    {
      "name": "Cơm Cá kho tộ",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 4,
      "orderCount": 4,
      "revenueVnd": 150000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        },
        "19/11": {
          "quantity": 3,
          "revenueVnd": 115000,
          "orders": 3
        }
      },
      "byChannel": {
        "onlineVnd": 35000,
        "dineInVnd": 115000,
        "takeawayVnd": 0,
        "onlineQty": 1,
        "dineInQty": 3,
        "takeawayQty": 0
      },
      "rank": 33,
      "formattedVnd": "150 000",
      "revenueTrieu": 0.15,
      "sharePercent": 1.11,
      "color": "#D97724"
    },
    {
      "name": "Cá Trắm Kho",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 130000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 130000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 130000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 34,
      "formattedVnd": "130 000",
      "revenueTrieu": 0.13,
      "sharePercent": 0.96,
      "color": "#3D1F0D"
    },
    {
      "name": "Trà Sen Vàng Củ Năng (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 2,
      "revenueVnd": 126000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 42000,
          "orders": 1
        },
        "20/11": {
          "quantity": 2,
          "revenueVnd": 84000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 126000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 3
      },
      "rank": 35,
      "formattedVnd": "126 000",
      "revenueTrieu": 0.126,
      "sharePercent": 0.93,
      "color": "#6BA353"
    },
    {
      "name": "Bánh Bò",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 125000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 125000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 125000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 36,
      "formattedVnd": "125 000",
      "revenueTrieu": 0.125,
      "sharePercent": 0.93,
      "color": "#C88A2B"
    },
    {
      "name": "Trà Bí Đao (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 6,
      "orderCount": 4,
      "revenueVnd": 120000,
      "byDate": {
        "22/11": {
          "quantity": 3,
          "revenueVnd": 60000,
          "orders": 2
        },
        "21/11": {
          "quantity": 2,
          "revenueVnd": 40000,
          "orders": 1
        },
        "18/11": {
          "quantity": 1,
          "revenueVnd": 20000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 120000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 6
      },
      "rank": 37,
      "formattedVnd": "120 000",
      "revenueTrieu": 0.12,
      "sharePercent": 0.89,
      "color": "#1E5F8A"
    },
    {
      "name": "Pizza Bò",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 3,
      "orderCount": 1,
      "revenueVnd": 120000,
      "byDate": {
        "22/11": {
          "quantity": 3,
          "revenueVnd": 120000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 120000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 3
      },
      "rank": 38,
      "formattedVnd": "120 000",
      "revenueTrieu": 0.12,
      "sharePercent": 0.89,
      "color": "#8C4A27"
    },
    {
      "name": "Me Đác (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 1,
      "revenueVnd": 120000,
      "byDate": {
        "19/11": {
          "quantity": 3,
          "revenueVnd": 120000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 120000,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 3,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 39,
      "formattedVnd": "120 000",
      "revenueTrieu": 0.12,
      "sharePercent": 0.89,
      "color": "#4D8B31"
    },
    {
      "name": "Trắm kho",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 120000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 120000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 120000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 40,
      "formattedVnd": "120 000",
      "revenueTrieu": 0.12,
      "sharePercent": 0.89,
      "color": "#B85D19"
    },
    {
      "name": "Cơm sườn om trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 3,
      "orderCount": 2,
      "revenueVnd": 115000,
      "byDate": {
        "23/11": {
          "quantity": 3,
          "revenueVnd": 115000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 115000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 3,
        "takeawayQty": 0
      },
      "rank": 41,
      "formattedVnd": "115 000",
      "revenueTrieu": 0.115,
      "sharePercent": 0.85,
      "color": "#3A7D2C"
    },
    {
      "name": "Đậu kẹp thịt tẩm hành",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "PHAN",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 110000,
      "byDate": {
        "17/11": {
          "quantity": 1,
          "revenueVnd": 110000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 110000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 42,
      "formattedVnd": "110 000",
      "revenueTrieu": 0.11,
      "sharePercent": 0.82,
      "color": "#5C3114"
    },
    {
      "name": "Xôi Sắn",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 4,
      "orderCount": 4,
      "revenueVnd": 105000,
      "byDate": {
        "22/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        },
        "21/11": {
          "quantity": 3,
          "revenueVnd": 75000,
          "orders": 3
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 25000,
        "takeawayVnd": 80000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 3
      },
      "rank": 43,
      "formattedVnd": "105 000",
      "revenueTrieu": 0.105,
      "sharePercent": 0.78,
      "color": "#26689E"
    },
    {
      "name": "Me Đác (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 105000,
      "byDate": {
        "22/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        },
        "18/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 105000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 3
      },
      "rank": 44,
      "formattedVnd": "105 000",
      "revenueTrieu": 0.105,
      "sharePercent": 0.78,
      "color": "#D16014"
    },
    {
      "name": "Canh su hào suờn",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 105000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 105000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 105000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 45,
      "formattedVnd": "105 000",
      "revenueTrieu": 0.105,
      "sharePercent": 0.78,
      "color": "#5A8F43"
    },
    {
      "name": "Thanh Nhài Dẻ Cười (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 97000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 37000,
          "orders": 1
        },
        "18/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 97000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 3
      },
      "rank": 46,
      "formattedVnd": "97 000",
      "revenueTrieu": 0.097,
      "sharePercent": 0.72,
      "color": "#2E6B22"
    },
    {
      "name": "Bạc Xỉu (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 90000,
      "byDate": {
        "24/11": {
          "quantity": 2,
          "revenueVnd": 60000,
          "orders": 2
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 30000,
        "takeawayVnd": 60000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 2
      },
      "rank": 47,
      "formattedVnd": "90 000",
      "revenueTrieu": 0.09,
      "sharePercent": 0.67,
      "color": "#2B7BBB"
    },
    {
      "name": "Cafe Muối (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 90000,
      "byDate": {
        "22/11": {
          "quantity": 2,
          "revenueVnd": 60000,
          "orders": 2
        },
        "19/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 30000,
        "dineInVnd": 0,
        "takeawayVnd": 60000,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 2
      },
      "rank": 48,
      "formattedVnd": "90 000",
      "revenueTrieu": 0.09,
      "sharePercent": 0.67,
      "color": "#D97724"
    },
    {
      "name": "Cafe Sữa (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 88000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 38000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 63000,
        "takeawayVnd": 25000,
        "onlineQty": 0,
        "dineInQty": 2,
        "takeawayQty": 1
      },
      "rank": 49,
      "formattedVnd": "88 000",
      "revenueTrieu": 0.088,
      "sharePercent": 0.65,
      "color": "#3D1F0D"
    },
    {
      "name": "Cơm Gan chiên mắm tỏi",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "SUAT",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 80000,
      "byDate": {
        "20/11": {
          "quantity": 2,
          "revenueVnd": 80000,
          "orders": 2
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 80000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 2,
        "takeawayQty": 0
      },
      "rank": 50,
      "formattedVnd": "80 000",
      "revenueTrieu": 0.08,
      "sharePercent": 0.59,
      "color": "#6BA353"
    },
    {
      "name": "Pizza Xúc Xích",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 2,
      "orderCount": 1,
      "revenueVnd": 70000,
      "byDate": {
        "22/11": {
          "quantity": 2,
          "revenueVnd": 70000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 70000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 2
      },
      "rank": 51,
      "formattedVnd": "70 000",
      "revenueTrieu": 0.07,
      "sharePercent": 0.52,
      "color": "#C88A2B"
    },
    {
      "name": "Cafe Muối (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 70000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        },
        "19/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 35000,
        "dineInVnd": 0,
        "takeawayVnd": 35000,
        "onlineQty": 1,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 52,
      "formattedVnd": "70 000",
      "revenueTrieu": 0.07,
      "sharePercent": 0.52,
      "color": "#1E5F8A"
    },
    {
      "name": "Trà Vải (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 62000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 32000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 32000,
        "takeawayVnd": 30000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 53,
      "formattedVnd": "62 000",
      "revenueTrieu": 0.062,
      "sharePercent": 0.46,
      "color": "#8C4A27"
    },
    {
      "name": "Trà Hoa Quả (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 3,
      "orderCount": 3,
      "revenueVnd": 60000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 20000,
          "orders": 1
        },
        "22/11": {
          "quantity": 1,
          "revenueVnd": 20000,
          "orders": 1
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 20000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 20000,
        "takeawayVnd": 40000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 2
      },
      "rank": 54,
      "formattedVnd": "60 000",
      "revenueTrieu": 0.06,
      "sharePercent": 0.45,
      "color": "#4D8B31"
    },
    {
      "name": "Trà Bí Đao (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 60000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 35000,
        "takeawayVnd": 25000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 55,
      "formattedVnd": "60 000",
      "revenueTrieu": 0.06,
      "sharePercent": 0.45,
      "color": "#B85D19"
    },
    {
      "name": "Gần chiên mắm tỏi",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 60000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 60000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 60000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 56,
      "formattedVnd": "60 000",
      "revenueTrieu": 0.06,
      "sharePercent": 0.45,
      "color": "#3A7D2C"
    },
    {
      "name": "Bạc Xỉu (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 57000,
      "byDate": {
        "22/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 32000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 32000,
        "takeawayVnd": 25000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 57,
      "formattedVnd": "57 000",
      "revenueTrieu": 0.057,
      "sharePercent": 0.42,
      "color": "#5C3114"
    },
    {
      "name": "Thanh Nhài Dẻ Cười (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 57000,
      "byDate": {
        "18/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 32000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 57000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 2,
        "takeawayQty": 0
      },
      "rank": 58,
      "formattedVnd": "57 000",
      "revenueTrieu": 0.057,
      "sharePercent": 0.42,
      "color": "#26689E"
    },
    {
      "name": "Dâu Tằm (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 53000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 28000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 53000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 2,
        "takeawayQty": 0
      },
      "rank": 59,
      "formattedVnd": "53 000",
      "revenueTrieu": 0.053,
      "sharePercent": 0.39,
      "color": "#D16014"
    },
    {
      "name": "Dưa Lưới (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 50000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "21/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 25000,
        "takeawayVnd": 25000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 60,
      "formattedVnd": "50 000",
      "revenueTrieu": 0.05,
      "sharePercent": 0.37,
      "color": "#5A8F43"
    },
    {
      "name": "Phần Gan Chiên cháy tỏi",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 50000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        },
        "20/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 25000,
        "takeawayVnd": 25000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 61,
      "formattedVnd": "50 000",
      "revenueTrieu": 0.05,
      "sharePercent": 0.37,
      "color": "#2E6B22"
    },
    {
      "name": "Cafe Sữa (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 2,
      "orderCount": 2,
      "revenueVnd": 48000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 20000,
          "orders": 1
        },
        "17/11": {
          "quantity": 1,
          "revenueVnd": 28000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 20000,
        "takeawayVnd": 28000,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 1
      },
      "rank": 62,
      "formattedVnd": "48 000",
      "revenueTrieu": 0.048,
      "sharePercent": 0.36,
      "color": "#2B7BBB"
    },
    {
      "name": "Trà Vải (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 40000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 40000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 40000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 63,
      "formattedVnd": "40 000",
      "revenueTrieu": 0.04,
      "sharePercent": 0.3,
      "color": "#D97724"
    },
    {
      "name": "Olong Kem Trứng Dừa Nướng (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 36000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 36000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 36000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 64,
      "formattedVnd": "36 000",
      "revenueTrieu": 0.036,
      "sharePercent": 0.27,
      "color": "#3D1F0D"
    },
    {
      "name": "Cơm Bắp cải cuộn thịt",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 35000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 35000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 65,
      "formattedVnd": "35 000",
      "revenueTrieu": 0.035,
      "sharePercent": 0.26,
      "color": "#6BA353"
    },
    {
      "name": "Trà Khế Quýt (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 35000,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 35000,
        "onlineQty": 0,
        "dineInQty": 0,
        "takeawayQty": 1
      },
      "rank": 66,
      "formattedVnd": "35 000",
      "revenueTrieu": 0.035,
      "sharePercent": 0.26,
      "color": "#C88A2B"
    },
    {
      "name": "Thanh Nhài Dẻ Cười (L)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 35000,
      "byDate": {
        "20/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 35000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 67,
      "formattedVnd": "35 000",
      "revenueTrieu": 0.035,
      "sharePercent": 0.26,
      "color": "#1E5F8A"
    },
    {
      "name": "Nhài Sữa Kem Trứng (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 35000,
      "byDate": {
        "17/11": {
          "quantity": 1,
          "revenueVnd": 35000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 35000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 68,
      "formattedVnd": "35 000",
      "revenueTrieu": 0.035,
      "sharePercent": 0.26,
      "color": "#8C4A27"
    },
    {
      "name": "Dưa Lưới (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 30000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 30000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 69,
      "formattedVnd": "30 000",
      "revenueTrieu": 0.03,
      "sharePercent": 0.22,
      "color": "#4D8B31"
    },
    {
      "name": "Trà Khế Quýt (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 30000,
      "byDate": {
        "24/11": {
          "quantity": 1,
          "revenueVnd": 30000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 30000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 70,
      "formattedVnd": "30 000",
      "revenueTrieu": 0.03,
      "sharePercent": 0.22,
      "color": "#B85D19"
    },
    {
      "name": "Trà Hoa Quả (M)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 25000,
      "byDate": {
        "23/11": {
          "quantity": 1,
          "revenueVnd": 25000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 25000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 71,
      "formattedVnd": "25 000",
      "revenueTrieu": 0.025,
      "sharePercent": 0.19,
      "color": "#3A7D2C"
    },
    {
      "name": "Cafe Đen (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 18000,
      "byDate": {
        "19/11": {
          "quantity": 1,
          "revenueVnd": 18000,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 18000,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 72,
      "formattedVnd": "18 000",
      "revenueTrieu": 0.018,
      "sharePercent": 0.13,
      "color": "#5C3114"
    },
    {
      "name": "Trà Bí Đao (S)",
      "groupKey": "do_uong",
      "groupName": "Đồ uống (Trà & Cafe)",
      "unit": "LY",
      "quantity": 6,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "19/11": {
          "quantity": 6,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 6,
        "dineInQty": 0,
        "takeawayQty": 0
      },
      "rank": 73,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#26689E"
    },
    {
      "name": "Bánh bao",
      "groupKey": "banh_bao",
      "groupName": "Bánh bao",
      "unit": "MON",
      "quantity": 3,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 3,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 3,
        "takeawayQty": 0
      },
      "rank": 74,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#D16014"
    },
    {
      "name": "Canh khoai tây",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 75,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#5A8F43"
    },
    {
      "name": "Cá bống chiên giòn",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 76,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#2E6B22"
    },
    {
      "name": "Cá nục kho",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 77,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#2B7BBB"
    },
    {
      "name": "Nửa hộp thịt viên trứng cút",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 78,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#D97724"
    },
    {
      "name": "1/3 hộp gan chiên mắm",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 79,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#3D1F0D"
    },
    {
      "name": "Bánh bột lọc",
      "groupKey": "com_mon",
      "groupName": "Cơm & Món ăn",
      "unit": "MON",
      "quantity": 1,
      "orderCount": 1,
      "revenueVnd": 0,
      "byDate": {
        "21/11": {
          "quantity": 1,
          "revenueVnd": 0,
          "orders": 1
        }
      },
      "byChannel": {
        "onlineVnd": 0,
        "dineInVnd": 0,
        "takeawayVnd": 0,
        "onlineQty": 0,
        "dineInQty": 1,
        "takeawayQty": 0
      },
      "rank": 80,
      "formattedVnd": "0",
      "revenueTrieu": 0,
      "sharePercent": 0,
      "color": "#6BA353"
    }
  ],
  "byDishGroup": [
    {
      "key": "com_mon",
      "groupKey": "com_mon",
      "name": "Cơm & Món ăn",
      "groupName": "Cơm & Món ăn",
      "color": "#2E6B22",
      "dishCount": 41,
      "quantity": 151,
      "orderCount": 77,
      "revenueVnd": 7447000,
      "formattedVnd": "7 447 000",
      "revenueTrieu": 7.447,
      "sharePercent": 55.2,
      "percent": 55
    },
    {
      "key": "do_uong",
      "groupKey": "do_uong",
      "name": "Đồ uống (Trà & Cafe)",
      "groupName": "Đồ uống (Trà & Cafe)",
      "color": "#2B7BBB",
      "dishCount": 34,
      "quantity": 136,
      "orderCount": 63,
      "revenueVnd": 3933000,
      "formattedVnd": "3 933 000",
      "revenueTrieu": 3.933,
      "sharePercent": 29.2,
      "percent": 29
    },
    {
      "key": "banh_bao",
      "groupKey": "banh_bao",
      "name": "Bánh bao",
      "groupName": "Bánh bao",
      "color": "#D97724",
      "dishCount": 5,
      "quantity": 122,
      "orderCount": 41,
      "revenueVnd": 2100000,
      "formattedVnd": "2 100 000",
      "revenueTrieu": 2.1,
      "sharePercent": 15.6,
      "percent": 16
    }
  ],
  "invoices": [
    {
      "stt": 1,
      "invoiceCode": "VVKW4Z7RZRG4F2VUTIU5K9ZU",
      "invoiceNo": "240057",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "17:34",
      "timeOut": "17:37",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 258000,
      "formattedVnd": "258 000",
      "totalTrieu": 0.258,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Sen Vàng Củ Năng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Nhài Sữa Kem Trứng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Bạc Xỉu (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 3,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 108000,
          "revenueTrieu": 0.108
        },
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 2,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 2,
      "invoiceCode": "VVKW4Z7RZRG4F2VUCBLGOKSY",
      "invoiceNo": "240056",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "15:11",
      "timeOut": "15:12",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 3,
      "invoiceCode": "VVKW4Z7RZRG4F2VU5WPE30ER",
      "invoiceNo": "240055",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "14:28",
      "timeOut": "14:28",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 4,
      "invoiceCode": "VVKW4Z7RZRG4F2VTYWEHR0QK",
      "invoiceNo": "240054",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "13:37",
      "timeOut": "13:38",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 5,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWUAGWV9UR5",
      "invoiceNo": "HUB.240052",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "13:03",
      "timeOut": "13:04",
      "table": "TB4",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWUAGWV9UR5-STORE-TB4-2026-11-24 13:03:58]",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 6,
      "invoiceCode": "VVKW4Z7RZRG41IADSL4DBT74",
      "invoiceNo": "240051",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "13:02",
      "timeOut": "13:03",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bạc Xỉu (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 7,
      "invoiceCode": "VVKW4Z7RZRG4F2VTSSDGSN2T",
      "invoiceNo": "240048",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:58",
      "timeOut": "12:59",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 60000,
      "formattedVnd": "60 000",
      "totalTrieu": 0.06,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Sen Vàng Củ Năng (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 60000,
          "revenueTrieu": 0.06
        }
      ]
    },
    {
      "stt": 8,
      "invoiceCode": "VVKW4Z7RZRG4F2VTSEF9IPGG",
      "invoiceNo": "240044",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:53",
      "timeOut": "12:53",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 90000,
      "formattedVnd": "90 000",
      "totalTrieu": 0.09,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Gà xào sả ớt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 90000,
          "revenueTrieu": 0.09
        }
      ]
    },
    {
      "stt": 9,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWU9N7HHKZZ",
      "invoiceNo": "HUB.240039",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:41",
      "timeOut": "12:41",
      "table": "TB1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWU9N7HHKZZ-STORE-TB1-2026-11-24 12:41:04]",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 10,
      "invoiceCode": "VVKW4Z7RZRG4F2VTP41N90RT",
      "invoiceNo": "240034",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:11",
      "timeOut": "12:11",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 55000,
      "formattedVnd": "55 000",
      "totalTrieu": 0.055,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Sen Vàng Củ Năng (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Cafe Sữa (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 11,
      "invoiceCode": "VVKW4Z7RZRG41IADSD3MO84W",
      "invoiceNo": "240033",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:09",
      "timeOut": "12:10",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Cơm Gà xào sả ớt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 12,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWU8CZK78C3",
      "invoiceNo": "HUB.240032",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "12:04",
      "timeOut": "12:05",
      "table": "TB1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 140000,
      "formattedVnd": "140 000",
      "totalTrieu": 0.14,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWU8CZK78C3-STORE-TB1-2026-11-24 12:04:33]",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Dưa Lưới (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Cơm Gà xào sả ớt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 55000,
          "revenueVnd": 110000,
          "revenueTrieu": 0.11
        }
      ]
    },
    {
      "stt": 13,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWU7RRRS3K4",
      "invoiceNo": "HUB.240031",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "11:48",
      "timeOut": "11:48",
      "table": "TB4",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWU7RRRS3K4-STORE-TB4-2026-11-24 11:48:33]",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Dưa Lưới (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Cơm Gà xào sả ớt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 14,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWU6OI8P75F",
      "invoiceNo": "HUB.240023",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "11:20",
      "timeOut": "11:20",
      "table": "TB5",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWU6OI8P75F-STORE-TB5-2026-11-24 11:20:14] 30 đường",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Khế Quýt (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 15,
      "invoiceCode": "VVKW4Z7RZRG4F2VTHLZM8B3B",
      "invoiceNo": "240014",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "11:13",
      "timeOut": "11:14",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 55000,
      "formattedVnd": "55 000",
      "totalTrieu": 0.055,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 55000,
          "revenueVnd": 55000,
          "revenueTrieu": 0.055
        }
      ]
    },
    {
      "stt": 16,
      "invoiceCode": "A2G63QNOOX3G177292ST_MWU6EMUU2BF",
      "invoiceNo": "HUB.240012",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "11:10",
      "timeOut": "11:11",
      "table": "TB3",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 60000,
      "formattedVnd": "60 000",
      "totalTrieu": 0.06,
      "discountVnd": 0,
      "customerName": "",
      "note": "[O2O-ST_MWU6EMUU2BF-STORE-TB3-2026-11-24 11:10:59]",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cafe Muối (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Cơm Thịt kho củ cải",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 17,
      "invoiceCode": "EDT_VVKW4Z7RZRG45FFYD1SN96P_1",
      "invoiceNo": "240011",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "09:49",
      "timeOut": "09:51",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 54000,
      "formattedVnd": "54 000",
      "totalTrieu": 0.054,
      "discountVnd": 0,
      "customerName": "",
      "note": "- Khách yêu cầu sửa đơn",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Olong Kem Trứng Dừa Nướng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 18,
      "invoiceCode": "VVKW4Z7RZRG45FFYBMMKRRD",
      "invoiceNo": "240010",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "09:44",
      "timeOut": "09:44",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 19,
      "invoiceCode": "VVKW4Z7RZRG45FFY9WLLNT0",
      "invoiceNo": "240008",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "09:38",
      "timeOut": "09:41",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 36000,
      "formattedVnd": "36 000",
      "totalTrieu": 0.036,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 20,
      "invoiceCode": "VVKW4Z7RZRG45FFY82V0LE3",
      "invoiceNo": "240002",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "09:31",
      "timeOut": "09:33",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 21,
      "invoiceCode": "VVKW4Z7RZRG41IAFHS8E96S3",
      "invoiceNo": "240001",
      "date": "24/11/2026",
      "shortDate": "24/11",
      "timeIn": "09:27",
      "timeOut": "09:29",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 50000,
      "formattedVnd": "50 000",
      "totalTrieu": 0.05,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Hoa Quả (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        },
        {
          "name": "Thanh Nhài Dẻ Cười (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 22,
      "invoiceCode": "VVKW4Z7RZRG4F18C5F1HRVYU",
      "invoiceNo": "230106",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "20:50",
      "timeOut": "20:51",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt nướng xá xíu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 23,
      "invoiceCode": "VVKW4Z7RZRG4F18C46WJ1NOK",
      "invoiceNo": "230097",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "20:36",
      "timeOut": "20:37",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 24,
      "invoiceCode": "VVKW4Z7RZRG4F18BXBX3U9VT",
      "invoiceNo": "230096",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "19:46",
      "timeOut": "19:53",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cơm Thịt nướng xá xíu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 25,
      "invoiceCode": "VVKW4Z7RZRG4F18BNCR8CQ1F",
      "invoiceNo": "230088",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "18:16",
      "timeOut": "18:59",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Bắp cải cuộn thịt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 26,
      "invoiceCode": "VVKW4Z7RZRG41I4FJ1GE00V1",
      "invoiceNo": "230081",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "16:48",
      "timeOut": "16:49",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 43000,
      "formattedVnd": "43 000",
      "totalTrieu": 0.043,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Cafe Muối (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 27,
      "invoiceCode": "VVKW4Z7RZRG4F18B9XNC3CNU",
      "invoiceNo": "230080",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "16:42",
      "timeOut": "16:43",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 60000,
      "formattedVnd": "60 000",
      "totalTrieu": 0.06,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Trà Sen Vàng Củ Năng (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 42000,
          "revenueVnd": 42000,
          "revenueTrieu": 0.042
        }
      ]
    },
    {
      "stt": 28,
      "invoiceCode": "VVKW4Z7RZRG41I4FHZ82UCCI",
      "invoiceNo": "230075",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "15:10",
      "timeOut": "15:18",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 58000,
      "formattedVnd": "58 000",
      "totalTrieu": 0.058,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Vải (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 40000,
          "revenueVnd": 40000,
          "revenueTrieu": 0.04
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 29,
      "invoiceCode": "VVKW4Z7RZRG4F18AM8Z3HK09",
      "invoiceNo": "230069",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "13:35",
      "timeOut": "14:23",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 36000,
      "formattedVnd": "36 000",
      "totalTrieu": 0.036,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        }
      ]
    },
    {
      "stt": 30,
      "invoiceCode": "VVKW4Z7RZRG41I4FHE2I9QAJ",
      "invoiceNo": "230074",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "14:04",
      "timeOut": "14:05",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 50000,
      "formattedVnd": "50 000",
      "totalTrieu": 0.05,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Cafe Muối (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 50000,
          "revenueTrieu": 0.05
        }
      ]
    },
    {
      "stt": 31,
      "invoiceCode": "VVKW4Z7RZRG4F18AN5ZMJ7UT",
      "invoiceNo": "230073",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "13:47",
      "timeOut": "13:52",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 60000,
      "formattedVnd": "60 000",
      "totalTrieu": 0.06,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Trà Hoa Quả (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Cơm Thịt nướng xá xíu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 32,
      "invoiceCode": "VVKW4Z7RZRG4F18AM8GGDLUF",
      "invoiceNo": "230062",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "13:35",
      "timeOut": "13:47",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 54000,
      "formattedVnd": "54 000",
      "totalTrieu": 0.054,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 33,
      "invoiceCode": "VVKW4Z7RZRG4F18AF2XB083M",
      "invoiceNo": "230056",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "12:42",
      "timeOut": "12:42",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Cơm Chả lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 34,
      "invoiceCode": "VVKW4Z7RZRG4F18ACKZJGIYS",
      "invoiceNo": "230044",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "12:10",
      "timeOut": "12:30",
      "table": "TB6 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "2 chị",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Cơm sườn om trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 35,
      "invoiceCode": "VVKW4Z7RZRG41I4FG7Q8U0HR",
      "invoiceNo": "230034",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "12:17",
      "timeOut": "12:29",
      "table": "TB3 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Cơm Thịt nướng xá xíu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 36,
      "invoiceCode": "VVKW4Z7RZRG45EUCFEDST18",
      "invoiceNo": "230040",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "12:28",
      "timeOut": "12:28",
      "table": "TB5 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 90000,
      "formattedVnd": "90 000",
      "totalTrieu": 0.09,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Cơm Chả lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 90000,
          "revenueTrieu": 0.09
        }
      ]
    },
    {
      "stt": 37,
      "invoiceCode": "VVKW4Z7RZRG41I4FFSKILNTE",
      "invoiceNo": "230047",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "12:27",
      "timeOut": "12:27",
      "table": "TB4 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 38,
      "invoiceCode": "VVKW4Z7RZRG4F18A87RMBNZ1",
      "invoiceNo": "230021",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "11:53",
      "timeOut": "12:27",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 130000,
      "formattedVnd": "130 000",
      "totalTrieu": 0.13,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Cơm Chả lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 55000,
          "revenueVnd": 55000,
          "revenueTrieu": 0.055
        },
        {
          "name": "Cơm sườn om trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 39,
      "invoiceCode": "VVKW4Z7RZRG4F18A87GBTG8W",
      "invoiceNo": "230020",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "11:53",
      "timeOut": "12:00",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt nướng xá xíu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 40,
      "invoiceCode": "VVKW4Z7RZRG41I4H6K4SBEAX",
      "invoiceNo": "230018",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "09:36",
      "timeOut": "09:36",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 20000,
      "formattedVnd": "20 000",
      "totalTrieu": 0.02,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Sữa (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        }
      ]
    },
    {
      "stt": 41,
      "invoiceCode": "VVKW4Z7RZRG41I4GZU7HL9XM",
      "invoiceNo": "230009",
      "date": "23/11/2026",
      "shortDate": "23/11",
      "timeIn": "09:01",
      "timeOut": "09:03",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "ATM",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 42,
      "invoiceCode": "VVKW4Z7RZRG45E8XENM01JW",
      "invoiceNo": "220079",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "20:04",
      "timeOut": "20:07",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 43,
      "invoiceCode": "VVKW4Z7RZRG4EZKSJHQV4AH8",
      "invoiceNo": "220078",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "19:28",
      "timeOut": "19:35",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 190000,
      "formattedVnd": "190 000",
      "totalTrieu": 0.19,
      "discountVnd": 65000,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Pizza Bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "MON",
          "unitPriceVnd": 55000,
          "revenueVnd": 120000,
          "revenueTrieu": 0.12
        },
        {
          "name": "Pizza Xúc Xích",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 45000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 44,
      "invoiceCode": "VVKW4Z7RZRG4EZKSJ488CQGS",
      "invoiceNo": "220077",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "19:23",
      "timeOut": "19:25",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Me Đác (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 45,
      "invoiceCode": "VVKW4Z7RZRG4EZKS4PL6ROBK",
      "invoiceNo": "220069",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "17:37",
      "timeOut": "17:37",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 40000,
      "formattedVnd": "40 000",
      "totalTrieu": 0.04,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Bí Đao (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 40000,
          "revenueTrieu": 0.04
        }
      ]
    },
    {
      "stt": 46,
      "invoiceCode": "VVKW4Z7RZRG4EZKRI05O24L8",
      "invoiceNo": "220067",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:42",
      "timeOut": "14:42",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 47,
      "invoiceCode": "VVKW4Z7RZRG4EZKRH2D9LTGU",
      "invoiceNo": "220017",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:30",
      "timeOut": "14:41",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 81000,
      "formattedVnd": "81 000",
      "totalTrieu": 0.081,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bạc Xỉu (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Trà Hoa Quả (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        }
      ]
    },
    {
      "stt": 48,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHX2IDSWN",
      "invoiceNo": "220059",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:41",
      "timeOut": "14:41",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 72000,
      "formattedVnd": "72 000",
      "totalTrieu": 0.072,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Nhài Sữa Kem Trứng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 72000,
          "revenueTrieu": 0.072
        }
      ]
    },
    {
      "stt": 49,
      "invoiceCode": "VVKW4Z7RZRG41HYH5E20O8IS",
      "invoiceNo": "220050",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:41",
      "timeOut": "14:41",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Bò kho lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 50,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHUES0PKU",
      "invoiceNo": "220043",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:40",
      "timeOut": "14:40",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 90000,
      "formattedVnd": "90 000",
      "totalTrieu": 0.09,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Bí Đao (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        },
        {
          "name": "Cơm Bò kho lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 51,
      "invoiceCode": "VVKW4Z7RZRG41HYH5DXBJS05",
      "invoiceNo": "220041",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:40",
      "timeOut": "14:40",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Bò kho lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 52,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHRXCGC9G",
      "invoiceNo": "220036",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:39",
      "timeOut": "14:39",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 105000,
      "formattedVnd": "105 000",
      "totalTrieu": 0.105,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Bò kho lá lốt",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 105000,
          "revenueTrieu": 0.105
        }
      ]
    },
    {
      "stt": 53,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHREPG3XO",
      "invoiceNo": "220030",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:39",
      "timeOut": "14:39",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Xôi Sắn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 54,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHOP1LHKB",
      "invoiceNo": "220028",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:38",
      "timeOut": "14:38",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Muối (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 55,
      "invoiceCode": "VVKW4Z7RZRG4EZKRHLQ0LQQE",
      "invoiceNo": "220022",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "14:37",
      "timeOut": "14:37",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 66000,
      "formattedVnd": "66 000",
      "totalTrieu": 0.066,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Cafe Muối (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 56,
      "invoiceCode": "VVKW4Z7RZRG4EZKQUVKV8A3O",
      "invoiceNo": "220009",
      "date": "22/11/2026",
      "shortDate": "22/11",
      "timeIn": "11:43",
      "timeOut": "11:43",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 36000,
      "formattedVnd": "36 000",
      "totalTrieu": 0.036,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Sen Vàng Củ Năng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        }
      ]
    },
    {
      "stt": 57,
      "invoiceCode": "VVKW4Z7RZRG41HSIYMFK5OZ9",
      "invoiceNo": "210106",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "21:03",
      "timeOut": "21:03",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Muối (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 58,
      "invoiceCode": "VVKW4Z7RZRG4EXX8Z7JN1IQ5",
      "invoiceNo": "210091",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "18:27",
      "timeOut": "20:02",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 40000,
      "formattedVnd": "40 000",
      "totalTrieu": 0.04,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Bí Đao (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 40000,
          "revenueTrieu": 0.04
        }
      ]
    },
    {
      "stt": 59,
      "invoiceCode": "VVKW4Z7RZRG4EXX97EM89PBE",
      "invoiceNo": "210104",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "19:33",
      "timeOut": "19:34",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 25000,
      "formattedVnd": "25 000",
      "totalTrieu": 0.025,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Xôi Sắn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 60,
      "invoiceCode": "VVKW4Z7RZRG4EXX8ZX6T5B4N",
      "invoiceNo": "210099",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "18:36",
      "timeOut": "18:51",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 25000,
      "formattedVnd": "25 000",
      "totalTrieu": 0.025,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Xôi Sắn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 61,
      "invoiceCode": "VVKW4Z7RZRG4EXX8TA0BEVER",
      "invoiceNo": "210089",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "17:59",
      "timeOut": "18:34",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 62,
      "invoiceCode": "VVKW4Z7RZRG4EXX8RYS78FLX",
      "invoiceNo": "210087",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "17:33",
      "timeOut": "17:34",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 0,
      "formattedVnd": "0",
      "totalTrieu": 0,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Canh khoai tây",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Cá bống chiên giòn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Cá nục kho",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Nửa hộp thịt viên trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "1/3 hộp gan chiên mắm",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Bánh bột lọc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Bánh bao",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 3,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Bún Thang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 0,
          "revenueVnd": 0,
          "revenueTrieu": 0
        }
      ]
    },
    {
      "stt": 63,
      "invoiceCode": "VVKW4Z7RZRG4EXX8L632D0HB",
      "invoiceNo": "210081",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "16:45",
      "timeOut": "16:52",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 25000,
      "formattedVnd": "25 000",
      "totalTrieu": 0.025,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Trà Bí Đao (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 64,
      "invoiceCode": "VVKW4Z7RZRG4EXX8KCFSOR6O",
      "invoiceNo": "210080",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "16:39",
      "timeOut": "16:40",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 50000,
      "formattedVnd": "50 000",
      "totalTrieu": 0.05,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bún Thang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 50000,
          "revenueVnd": 50000,
          "revenueTrieu": 0.05
        }
      ]
    },
    {
      "stt": 65,
      "invoiceCode": "VVKW4Z7RZRG41HSIUT8UU0XB",
      "invoiceNo": "210073",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "16:03",
      "timeOut": "16:21",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 130000,
      "formattedVnd": "130 000",
      "totalTrieu": 0.13,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Phần Gan Chiên cháy tỏi",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Canh su hào suờn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 105000,
          "revenueVnd": 105000,
          "revenueTrieu": 0.105
        }
      ]
    },
    {
      "stt": 66,
      "invoiceCode": "VVKW4Z7RZRG4EXX86NM189IY",
      "invoiceNo": "210061",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "14:57",
      "timeOut": "16:02",
      "table": "B03 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 607000,
      "formattedVnd": "607 000",
      "totalTrieu": 0.607,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Momo QR đa năng",
      "items": [
        {
          "name": "Bánh Bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 125000,
          "revenueVnd": 125000,
          "revenueTrieu": 0.125
        },
        {
          "name": "Bánh bột lọc 20c",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 165000,
          "revenueVnd": 165000,
          "revenueTrieu": 0.165
        },
        {
          "name": "Cá Trắm Kho",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 130000,
          "revenueVnd": 130000,
          "revenueTrieu": 0.13
        },
        {
          "name": "Canh Cà bung",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 115000,
          "revenueVnd": 115000,
          "revenueTrieu": 0.115
        },
        {
          "name": "Trà Sen Vàng Củ Năng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 72000,
          "revenueTrieu": 0.072
        }
      ]
    },
    {
      "stt": 67,
      "invoiceCode": "VVKW4Z7RZRG4EXX8DB4TMOY2",
      "invoiceNo": "210072",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "15:43",
      "timeOut": "15:44",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 37000,
      "formattedVnd": "37 000",
      "totalTrieu": 0.037,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Thanh Nhài Dẻ Cười (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 37000,
          "revenueTrieu": 0.037
        }
      ]
    },
    {
      "stt": 68,
      "invoiceCode": "VVKW4Z7RZRG4EXX8CRN3CF93",
      "invoiceNo": "210071",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "15:36",
      "timeOut": "15:36",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 69,
      "invoiceCode": "VVKW4Z7RZRG4EXX8BZVOSFU7",
      "invoiceNo": "210064",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "15:26",
      "timeOut": "15:36",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Khế Quýt (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 70,
      "invoiceCode": "VVKW4Z7RZRG4EXX86F7E6OZN",
      "invoiceNo": "210052",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "15:26",
      "timeOut": "15:26",
      "table": "B02 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "c Thu",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bạc Xỉu (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 71,
      "invoiceCode": "VVKW4Z7RZRG41HSITGO13GN3",
      "invoiceNo": "210059",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "14:56",
      "timeOut": "14:56",
      "table": "B03 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Me Đác (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 72,
      "invoiceCode": "VVKW4Z7RZRG4EXX86HZ97UPJ",
      "invoiceNo": "210058",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "14:55",
      "timeOut": "14:55",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 73,
      "invoiceCode": "VVKW4Z7RZRG4EXX7JDHK0DZP",
      "invoiceNo": "210033",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "11:55",
      "timeOut": "12:36",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 74,
      "invoiceCode": "VVKW4Z7RZRG41HSIRNN0F9IB",
      "invoiceNo": "210045",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "12:22",
      "timeOut": "12:23",
      "table": "TB3 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Hoa Quả (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        },
        {
          "name": "Cafe Muối (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 75,
      "invoiceCode": "VVKW4Z7RZRG41HSIRZE0QMJI",
      "invoiceNo": "210039",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "12:06",
      "timeOut": "12:22",
      "table": "TB3 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 50000,
      "formattedVnd": "50 000",
      "totalTrieu": 0.05,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bún Thang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 50000,
          "revenueVnd": 50000,
          "revenueTrieu": 0.05
        }
      ]
    },
    {
      "stt": 76,
      "invoiceCode": "VVKW4Z7RZRG4EXX7O0MNMKPG",
      "invoiceNo": "210044",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "12:16",
      "timeOut": "12:21",
      "table": "TB4 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 105000,
      "formattedVnd": "105 000",
      "totalTrieu": 0.105,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 105000,
          "revenueTrieu": 0.105
        }
      ]
    },
    {
      "stt": 77,
      "invoiceCode": "VVKW4Z7RZRG4EXX7IFM1O87E",
      "invoiceNo": "210032",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "11:43",
      "timeOut": "12:17",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 253000,
      "formattedVnd": "253 000",
      "totalTrieu": 0.253,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cafe Sữa (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bún Thang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 50000,
          "revenueVnd": 50000,
          "revenueTrieu": 0.05
        },
        {
          "name": "Bún Thang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "MON",
          "unitPriceVnd": 50000,
          "revenueVnd": 100000,
          "revenueTrieu": 0.1
        },
        {
          "name": "Cơm rang dưa bò",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Xôi Sắn",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 78,
      "invoiceCode": "VVKW4Z7RZRG41HSIRFK77SMI",
      "invoiceNo": "210029",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "11:09",
      "timeOut": "11:36",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 66000,
      "formattedVnd": "66 000",
      "totalTrieu": 0.066,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 2,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 2,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        }
      ]
    },
    {
      "stt": 79,
      "invoiceCode": "VVKW4Z7RZRG4EXX7AIGNFDFW",
      "invoiceNo": "210028",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "10:41",
      "timeOut": "10:41",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 25000,
      "formattedVnd": "25 000",
      "totalTrieu": 0.025,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Dưa Lưới (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 80,
      "invoiceCode": "VVKW4Z7RZRG41HSKH3NM39WG",
      "invoiceNo": "210019",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "09:19",
      "timeOut": "09:19",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 81,
      "invoiceCode": "VVKW4Z7RZRG45DNNNEMKIPW",
      "invoiceNo": "210013",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "09:06",
      "timeOut": "09:07",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 69000,
      "formattedVnd": "69 000",
      "totalTrieu": 0.069,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 82,
      "invoiceCode": "VVKW4Z7RZRG41HSK4T104JQ0",
      "invoiceNo": "210004",
      "date": "21/11/2026",
      "shortDate": "21/11",
      "timeIn": "07:59",
      "timeOut": "07:59",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 36000,
      "formattedVnd": "36 000",
      "totalTrieu": 0.036,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 83,
      "invoiceCode": "VVKW4Z7RZRG4EW9PO6OU6I89",
      "invoiceNo": "200117",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "18:52",
      "timeOut": "19:27",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 180000,
      "formattedVnd": "180 000",
      "totalTrieu": 0.18,
      "discountVnd": 45000,
      "customerName": "",
      "note": "Cô thanh chủ nhà",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trắm kho",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 130000,
          "revenueVnd": 120000,
          "revenueTrieu": 0.12
        },
        {
          "name": "Gần chiên mắm tỏi",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 95000,
          "revenueVnd": 60000,
          "revenueTrieu": 0.06
        }
      ]
    },
    {
      "stt": 84,
      "invoiceCode": "VVKW4Z7RZRG4EW9PLEYAQUKE",
      "invoiceNo": "200113",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "18:10",
      "timeOut": "18:33",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 80000,
      "formattedVnd": "80 000",
      "totalTrieu": 0.08,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Gan chiên mắm tỏi",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        },
        {
          "name": "Thanh Nhài Dẻ Cười (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 85,
      "invoiceCode": "VVKW4Z7RZRG4EW9PG902FCAO",
      "invoiceNo": "200105",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "17:43",
      "timeOut": "17:45",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 54000,
      "formattedVnd": "54 000",
      "totalTrieu": 0.054,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 86,
      "invoiceCode": "VVKW4Z7RZRG41HMKIXR6PIIV",
      "invoiceNo": "200102",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "16:54",
      "timeOut": "16:54",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 87,
      "invoiceCode": "VVKW4Z7RZRG41HMKIVCQM7YX",
      "invoiceNo": "200098",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "16:45",
      "timeOut": "16:45",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Vải (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 88,
      "invoiceCode": "VVKW4Z7RZRG4EW9OYNBLH4KI",
      "invoiceNo": "200090",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "15:15",
      "timeOut": "15:15",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 165000,
      "formattedVnd": "165 000",
      "totalTrieu": 0.165,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh bột lọc 20c",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 165000,
          "revenueVnd": 165000,
          "revenueTrieu": 0.165
        }
      ]
    },
    {
      "stt": 89,
      "invoiceCode": "VVKW4Z7RZRG4EW9OJUTG4OV3",
      "invoiceNo": "200081",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "13:24",
      "timeOut": "13:52",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 80000,
      "formattedVnd": "80 000",
      "totalTrieu": 0.08,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Cá kho tộ",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 90,
      "invoiceCode": "VVKW4Z7RZRG41HMKG5ULSTOC",
      "invoiceNo": "200080",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "12:10",
      "timeOut": "12:34",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 105000,
      "formattedVnd": "105 000",
      "totalTrieu": 0.105,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Gan chiên mắm tỏi",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 70000,
          "revenueTrieu": 0.07
        }
      ]
    },
    {
      "stt": 91,
      "invoiceCode": "VVKW4Z7RZRG41HMKFZRE67M3",
      "invoiceNo": "200076",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "12:08",
      "timeOut": "12:32",
      "table": "TB3 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 92,
      "invoiceCode": "VVKW4Z7RZRG4EW9O5989J398",
      "invoiceNo": "200060",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:34",
      "timeOut": "12:15",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 115000,
      "formattedVnd": "115 000",
      "totalTrieu": 0.115,
      "discountVnd": 0,
      "customerName": "",
      "note": "Gan cháy tỏi 25k",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Phần Gan Chiên cháy tỏi",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 90000,
          "revenueTrieu": 0.09
        }
      ]
    },
    {
      "stt": 93,
      "invoiceCode": "VVKW4Z7RZRG4EW9O61K6R4PR",
      "invoiceNo": "200069",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:54",
      "timeOut": "12:09",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 90000,
      "formattedVnd": "90 000",
      "totalTrieu": 0.09,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 90000,
          "revenueTrieu": 0.09
        }
      ]
    },
    {
      "stt": 94,
      "invoiceCode": "VVKW4Z7RZRG4EW9O5PAJ4MG3",
      "invoiceNo": "200061",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:40",
      "timeOut": "11:52",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 378000,
      "formattedVnd": "378 000",
      "totalTrieu": 0.378,
      "discountVnd": 0,
      "customerName": "",
      "note": "1 canh cà bung",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Canh Cà bung",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 115000,
          "revenueVnd": 115000,
          "revenueTrieu": 0.115
        },
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Trà Sen Vàng Củ Năng (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 42000,
          "revenueVnd": 84000,
          "revenueTrieu": 0.084
        },
        {
          "name": "Cơm Thịt viên ôm trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 110000,
          "revenueTrieu": 0.11
        }
      ]
    },
    {
      "stt": 95,
      "invoiceCode": "VVKW4Z7RZRG41HMKESB9UREB",
      "invoiceNo": "200058",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:16",
      "timeOut": "11:17",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 96,
      "invoiceCode": "VVKW4Z7RZRG4EW9O3MMGUROU",
      "invoiceNo": "200056",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:13",
      "timeOut": "11:13",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 97,
      "invoiceCode": "VVKW4Z7RZRG41HMKF2L2TELO",
      "invoiceNo": "200048",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:05",
      "timeOut": "11:05",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 98,
      "invoiceCode": "VVKW4Z7RZRG45D21I963JEG",
      "invoiceNo": "200047",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:05",
      "timeOut": "11:05",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 99,
      "invoiceCode": "VVKW4Z7RZRG41HMKEUN0MJE6",
      "invoiceNo": "200038",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "11:04",
      "timeOut": "11:04",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 100,
      "invoiceCode": "VVKW4Z7RZRG4EW9NZDZ70KR0",
      "invoiceNo": "200037",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "10:58",
      "timeOut": "10:58",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 15000,
      "formattedVnd": "15 000",
      "totalTrieu": 0.015,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        }
      ]
    },
    {
      "stt": 101,
      "invoiceCode": "VVKW4Z7RZRG4EW9NVRTIBOKX",
      "invoiceNo": "200032",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "10:11",
      "timeOut": "10:11",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 102,
      "invoiceCode": "VVKW4Z7RZRG45D21GGUIBR5",
      "invoiceNo": "200031",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "10:08",
      "timeOut": "10:08",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 103,
      "invoiceCode": "VVKW4Z7RZRG41HMKEDZG5ETF",
      "invoiceNo": "200025",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "10:06",
      "timeOut": "10:06",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 104,
      "invoiceCode": "VVKW4Z7RZRG41HMM4SH9U6ZK",
      "invoiceNo": "200024",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "09:15",
      "timeOut": "09:16",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 25000,
      "formattedVnd": "25 000",
      "totalTrieu": 0.025,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Dâu Tằm (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 105,
      "invoiceCode": "VVKW4Z7RZRG45D2845HBDRR",
      "invoiceNo": "200015",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "09:08",
      "timeOut": "09:08",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 106,
      "invoiceCode": "VVKW4Z7RZRG41HMLYAUDL1CF",
      "invoiceNo": "200013",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "08:31",
      "timeOut": "08:31",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 33000,
      "formattedVnd": "33 000",
      "totalTrieu": 0.033,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 107,
      "invoiceCode": "VVKW4Z7RZRG41HMLXJW100VZ",
      "invoiceNo": "200012",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "08:21",
      "timeOut": "08:21",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 108,
      "invoiceCode": "VVKW4Z7RZRG41HMLX0UJQJ6E",
      "invoiceNo": "200008",
      "date": "20/11/2026",
      "shortDate": "20/11",
      "timeIn": "08:14",
      "timeOut": "08:15",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 109,
      "invoiceCode": "VVKW4Z7RZRG41HGM977E6TNH",
      "invoiceNo": "190066",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "19:53",
      "timeOut": "19:54",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 110,
      "invoiceCode": "VVKW4Z7RZRG4EUM64WB595J9",
      "invoiceNo": "190057",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "17:58",
      "timeOut": "18:32",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "Thanh nhài",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Cá kho tộ",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 111,
      "invoiceCode": "VVKW4Z7RZRG4EUM64UFAL0R4",
      "invoiceNo": "190048",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "17:57",
      "timeOut": "18:17",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "Tặng thanh nhài",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 112,
      "invoiceCode": "VVKW4Z7RZRG4EUM5X7LFFH94",
      "invoiceNo": "190040",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "16:59",
      "timeOut": "17:14",
      "table": "OL02 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 99000,
      "formattedVnd": "99 000",
      "totalTrieu": 0.099,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Bánh Bao Cút Thịt",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 15000,
          "revenueVnd": 15000,
          "revenueTrieu": 0.015
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 1,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 2,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        }
      ]
    },
    {
      "stt": 113,
      "invoiceCode": "VVKW4Z7RZRG4EUM5USNPP1VK",
      "invoiceNo": "190038",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "16:28",
      "timeOut": "17:14",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 1968000,
      "formattedVnd": "1 968 000",
      "totalTrieu": 1.968,
      "discountVnd": 90000,
      "customerName": "",
      "note": "",
      "promoCode": "Mua 1 tặng 1 Mừng Khai Trương",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Bí Đao (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 6,
          "unit": "LY",
          "unitPriceVnd": 15000,
          "revenueVnd": 0,
          "revenueTrieu": 0
        },
        {
          "name": "Cacao Latte (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 12,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 300000,
          "revenueTrieu": 0.3
        },
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 13,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 390000,
          "revenueTrieu": 0.39
        },
        {
          "name": "Trà Sen Vàng Củ Năng (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 15,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 450000,
          "revenueTrieu": 0.45
        },
        {
          "name": "Bánh bao Xá Xíu",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 15,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 270000,
          "revenueTrieu": 0.27
        },
        {
          "name": "Bánh Bao Xúc Xích",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 15,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 270000,
          "revenueTrieu": 0.27
        },
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 16,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 288000,
          "revenueTrieu": 0.288
        }
      ]
    },
    {
      "stt": 114,
      "invoiceCode": "VVKW4Z7RZRG45CGMBUIF656",
      "invoiceNo": "190044",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "17:00",
      "timeOut": "17:00",
      "table": "OL03 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 70000,
      "formattedVnd": "70 000",
      "totalTrieu": 0.07,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Cơm Cá kho tộ",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 115,
      "invoiceCode": "VVKW4Z7RZRG4EUM5UPPP4659",
      "invoiceNo": "190036",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "16:26",
      "timeOut": "16:26",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 116,
      "invoiceCode": "VVKW4Z7RZRG41HGM6OBBD4GV",
      "invoiceNo": "190035",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "16:26",
      "timeOut": "16:26",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Cá kho tộ",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "MON",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 117,
      "invoiceCode": "VVKW4Z7RZRG4EUM5U6WLLNKI",
      "invoiceNo": "190034",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "16:19",
      "timeOut": "16:20",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 288000,
      "formattedVnd": "288 000",
      "totalTrieu": 0.288,
      "discountVnd": 0,
      "customerName": "c Lê Vy",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bánh Bao Bò Ngô",
          "groupKey": "banh_bao",
          "groupName": "Bánh bao",
          "quantity": 16,
          "unit": "CAI",
          "unitPriceVnd": 18000,
          "revenueVnd": 288000,
          "revenueTrieu": 0.288
        }
      ]
    },
    {
      "stt": 118,
      "invoiceCode": "VVKW4Z7RZRG41HGM50O8DQ1U",
      "invoiceNo": "190029",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "14:01",
      "timeOut": "14:01",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 18000,
      "formattedVnd": "18 000",
      "totalTrieu": 0.018,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Đen (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 18000,
          "revenueVnd": 18000,
          "revenueTrieu": 0.018
        }
      ]
    },
    {
      "stt": 119,
      "invoiceCode": "VVKW4Z7RZRG4EUM57Y13EUB7",
      "invoiceNo": "190025",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "13:31",
      "timeOut": "13:32",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 115000,
      "formattedVnd": "115 000",
      "totalTrieu": 0.115,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        },
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        },
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 120,
      "invoiceCode": "VVKW4Z7RZRG4EUM50XR931Q3",
      "invoiceNo": "190020",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "13:13",
      "timeOut": "13:13",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 55000,
      "formattedVnd": "55 000",
      "totalTrieu": 0.055,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 55000,
          "revenueTrieu": 0.055
        }
      ]
    },
    {
      "stt": 121,
      "invoiceCode": "VVKW4Z7RZRG41HGM3GW8KF6X",
      "invoiceNo": "190013",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "12:40",
      "timeOut": "12:40",
      "table": "OL02 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 90000,
      "formattedVnd": "90 000",
      "totalTrieu": 0.09,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 90000,
          "revenueTrieu": 0.09
        }
      ]
    },
    {
      "stt": 122,
      "invoiceCode": "VVKW4Z7RZRG4EUM50ST8QKWO",
      "invoiceNo": "190017",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "12:39",
      "timeOut": "12:39",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt kho trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 123,
      "invoiceCode": "VVKW4Z7RZRG4EUM4TABNSR0M",
      "invoiceNo": "190011",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "11:42",
      "timeOut": "12:11",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 110000,
      "formattedVnd": "110 000",
      "totalTrieu": 0.11,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả, trà dau",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Chân giò luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 110000,
          "revenueTrieu": 0.11
        }
      ]
    },
    {
      "stt": 124,
      "invoiceCode": "VVKW4Z7RZRG4EUM4LFS3GA0Q",
      "invoiceNo": "190010",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "10:39",
      "timeOut": "10:39",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Muối (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 125,
      "invoiceCode": "VVKW4Z7RZRG4EUM4L3QNUEG8",
      "invoiceNo": "190001",
      "date": "19/11/2026",
      "shortDate": "19/11",
      "timeIn": "10:35",
      "timeOut": "10:39",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 337000,
      "formattedVnd": "337 000",
      "totalTrieu": 0.337,
      "discountVnd": 0,
      "customerName": "c Hà An",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Me Đác (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 3,
          "unit": "LY",
          "unitPriceVnd": 40000,
          "revenueVnd": 120000,
          "revenueTrieu": 0.12
        },
        {
          "name": "Trà Sen Vàng Củ Năng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 72000,
          "revenueTrieu": 0.072
        },
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 43000,
          "revenueTrieu": 0.043
        },
        {
          "name": "Trà Sữa Cốm Dẻo (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        },
        {
          "name": "Cafe Muối (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 126,
      "invoiceCode": "VVKW4Z7RZRG4ESYN6R0ASAS8",
      "invoiceNo": "180080",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "19:44",
      "timeOut": "19:44",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Me Đác (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 127,
      "invoiceCode": "VVKW4Z7RZRG4ESYN5X6VA1CM",
      "invoiceNo": "180071",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "19:33",
      "timeOut": "19:34",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 30000,
      "formattedVnd": "30 000",
      "totalTrieu": 0.03,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Thanh Nhài Dẻ Cười (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        }
      ]
    },
    {
      "stt": 128,
      "invoiceCode": "VVKW4Z7RZRG4ESYMWKM60QHJ",
      "invoiceNo": "180068",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "18:29",
      "timeOut": "18:38",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 129,
      "invoiceCode": "VVKW4Z7RZRG4ESYMRQ4JULHU",
      "invoiceNo": "HD-129",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "17:49",
      "timeOut": "17:50",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 36000,
      "formattedVnd": "36 000",
      "totalTrieu": 0.036,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Nhài Sữa Kem Trứng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 36000,
          "revenueVnd": 36000,
          "revenueTrieu": 0.036
        }
      ]
    },
    {
      "stt": 130,
      "invoiceCode": "VVKW4Z7RZRG4ESYMIEFOOR38",
      "invoiceNo": "180060",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "16:29",
      "timeOut": "16:29",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 20000,
      "formattedVnd": "20 000",
      "totalTrieu": 0.02,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Bí Đao (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 20000,
          "revenueVnd": 20000,
          "revenueTrieu": 0.02
        }
      ]
    },
    {
      "stt": 131,
      "invoiceCode": "VVKW4Z7RZRG4ESYLWLZTB3NW",
      "invoiceNo": "180057",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "13:46",
      "timeOut": "13:46",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt rang cháy cạnh",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 132,
      "invoiceCode": "VVKW4Z7RZRG4ESYLPOQ5JFU1",
      "invoiceNo": "180028",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "12:56",
      "timeOut": "13:36",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "Cafe đen",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt rang cháy cạnh",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 133,
      "invoiceCode": "VVKW4Z7RZRG4ESYLVOPVQ5GK",
      "invoiceNo": "180054",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "13:34",
      "timeOut": "13:34",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 55000,
      "formattedVnd": "55 000",
      "totalTrieu": 0.055,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt rang cháy cạnh",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 55000,
          "revenueTrieu": 0.055
        }
      ]
    },
    {
      "stt": 134,
      "invoiceCode": "VVKW4Z7RZRG4ESYLUPQE1I6E",
      "invoiceNo": "180046",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "13:22",
      "timeOut": "13:23",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 80000,
      "formattedVnd": "80 000",
      "totalTrieu": 0.08,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 30000,
          "revenueTrieu": 0.03
        },
        {
          "name": "Thanh Nhài Dẻ Cười (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        },
        {
          "name": "Cafe Muối (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 25000,
          "revenueVnd": 25000,
          "revenueTrieu": 0.025
        }
      ]
    },
    {
      "stt": 135,
      "invoiceCode": "VVKW4Z7RZRG4ESYLU2S0AE1E",
      "invoiceNo": "180045",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "13:13",
      "timeOut": "13:13",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 60000,
      "formattedVnd": "60 000",
      "totalTrieu": 0.06,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Sữa Cốm Dẻo (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 2,
          "unit": "LY",
          "unitPriceVnd": 30000,
          "revenueVnd": 60000,
          "revenueTrieu": 0.06
        }
      ]
    },
    {
      "stt": 136,
      "invoiceCode": "VVKW4Z7RZRG4ESYLTZGI7PGG",
      "invoiceNo": "180037",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "13:12",
      "timeOut": "13:12",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "Thanhnhafi",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 137,
      "invoiceCode": "VVKW4Z7RZRG41HANQWI490O7",
      "invoiceNo": "180026",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "11:46",
      "timeOut": "11:47",
      "table": "TB2 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 110000,
      "formattedVnd": "110 000",
      "totalTrieu": 0.11,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả, dâu, nhài",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Chân giò luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 2,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 110000,
          "revenueTrieu": 0.11
        }
      ]
    },
    {
      "stt": 138,
      "invoiceCode": "VVKW4Z7RZRG4ESYLFQVO0HHN",
      "invoiceNo": "180014",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "11:28",
      "timeOut": "11:28",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 55000,
      "formattedVnd": "55 000",
      "totalTrieu": 0.055,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Thịt rang cháy cạnh",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 55000,
          "revenueVnd": 55000,
          "revenueTrieu": 0.055
        }
      ]
    },
    {
      "stt": 139,
      "invoiceCode": "VVKW4Z7RZRG41HANQPDJ2VAA",
      "invoiceNo": "180013",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "11:18",
      "timeOut": "11:18",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cơm Thịt luộc",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 140,
      "invoiceCode": "VVKW4Z7RZRG4ESYLAC4F1CO7",
      "invoiceNo": "180011",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "10:58",
      "timeOut": "11:01",
      "table": "OL02 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 354000,
      "formattedVnd": "354 000",
      "totalTrieu": 0.354,
      "discountVnd": 0,
      "customerName": "",
      "note": "Khách 12h onl",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 177000,
          "revenueTrieu": 0.177
        },
        {
          "name": "Cơm Tôm đồng rang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Gà ta om nấm hương",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 141,
      "invoiceCode": "VVKW4Z7RZRG4ESYLA3T0C1GH",
      "invoiceNo": "180003",
      "date": "18/11/2026",
      "shortDate": "18/11",
      "timeIn": "10:55",
      "timeOut": "11:01",
      "table": "OL01 - Bán Online",
      "channelKey": "online",
      "channelName": "Bán online",
      "totalVnd": 960000,
      "formattedVnd": "960 000",
      "totalTrieu": 0.96,
      "discountVnd": 0,
      "customerName": "chị thu hiền vụ 1",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Canh chuối đậu",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "HOP",
          "unitPriceVnd": 175000,
          "revenueVnd": 175000,
          "revenueTrieu": 0.175
        },
        {
          "name": "Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "HOP",
          "unitPriceVnd": 195000,
          "revenueVnd": 195000,
          "revenueTrieu": 0.195
        },
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 177000,
          "revenueTrieu": 0.177
        },
        {
          "name": "Cơm Gà ta om nấm hương",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 3,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 177000,
          "revenueTrieu": 0.177
        },
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 4,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 236000,
          "revenueTrieu": 0.236
        }
      ]
    },
    {
      "stt": 142,
      "invoiceCode": "VVKW4Z7RZRG4ERB3T73PFLHA",
      "invoiceNo": "170120",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "19:30",
      "timeOut": "19:30",
      "table": "TB1 - Bán Tại Chỗ",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 35000,
      "formattedVnd": "35 000",
      "totalTrieu": 0.035,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Bí Đao (L)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 143,
      "invoiceCode": "VVKW4Z7RZRG41H4PG5ASEJ5A",
      "invoiceNo": "170102",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "13:01",
      "timeOut": "19:22",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 177000,
      "formattedVnd": "177 000",
      "totalTrieu": 0.177,
      "discountVnd": 0,
      "customerName": "",
      "note": "Trà hoa quả, dâu, nhài",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Tôm đồng rang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 144,
      "invoiceCode": "VVKW4Z7RZRG4ERB3DQVAVOI5",
      "invoiceNo": "170113",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "17:30",
      "timeOut": "17:31",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 45000,
      "formattedVnd": "45 000",
      "totalTrieu": 0.045,
      "discountVnd": 0,
      "customerName": "",
      "note": "Tặng trà đào",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Nhài Sữa Kem Trứng (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 45000,
          "revenueVnd": 45000,
          "revenueTrieu": 0.045
        }
      ]
    },
    {
      "stt": 145,
      "invoiceCode": "VVKW4Z7RZRG45B9R599ROXO",
      "invoiceNo": "170110",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "17:04",
      "timeOut": "17:04",
      "table": "B01 - Bán Mang Về",
      "channelKey": "takeaway",
      "channelName": "Bán mang về",
      "totalVnd": 28000,
      "formattedVnd": "28 000",
      "totalTrieu": 0.028,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "Tiền mặt",
      "items": [
        {
          "name": "Cafe Sữa (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 28000,
          "revenueVnd": 28000,
          "revenueTrieu": 0.028
        }
      ]
    },
    {
      "stt": 146,
      "invoiceCode": "VVKW4Z7RZRG4ERB2JJ2NVRPW",
      "invoiceNo": "170109",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "13:38",
      "timeOut": "13:39",
      "table": "B05 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 91000,
      "formattedVnd": "91 000",
      "totalTrieu": 0.091,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Bạc Xỉu (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 32000,
          "revenueVnd": 32000,
          "revenueTrieu": 0.032
        },
        {
          "name": "Cơm Tôm đồng rang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 147,
      "invoiceCode": "VVKW4Z7RZRG4ERB2C0TETS2F",
      "invoiceNo": "170095",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:41",
      "timeOut": "12:41",
      "table": "B04 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 59000,
      "formattedVnd": "59 000",
      "totalTrieu": 0.059,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 148,
      "invoiceCode": "VVKW4Z7RZRG4ERB2BK4ELKSS",
      "invoiceNo": "170091",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:38",
      "timeOut": "12:39",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 38000,
      "formattedVnd": "38 000",
      "totalTrieu": 0.038,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cafe Sữa (M)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 38000,
          "revenueVnd": 38000,
          "revenueTrieu": 0.038
        }
      ]
    },
    {
      "stt": 149,
      "invoiceCode": "VVKW4Z7RZRG4ERB2BHS42L4P",
      "invoiceNo": "170084",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:34",
      "timeOut": "12:35",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 28000,
      "formattedVnd": "28 000",
      "totalTrieu": 0.028,
      "discountVnd": 0,
      "customerName": "",
      "note": "Tràbis đao",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Dâu Tằm (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 28000,
          "revenueVnd": 28000,
          "revenueTrieu": 0.028
        }
      ]
    },
    {
      "stt": 150,
      "invoiceCode": "VVKW4Z7RZRG4ERB2B6EG2V58",
      "invoiceNo": "170082",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:30",
      "timeOut": "12:30",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 67000,
      "formattedVnd": "67 000",
      "totalTrieu": 0.067,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Trà Vải (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 32000,
          "revenueVnd": 32000,
          "revenueTrieu": 0.032
        },
        {
          "name": "Nhài Sữa Kem Trứng (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 35000,
          "revenueVnd": 35000,
          "revenueTrieu": 0.035
        }
      ]
    },
    {
      "stt": 151,
      "invoiceCode": "VVKW4Z7RZRG4ERB2A0IP78XA",
      "invoiceNo": "170072",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:15",
      "timeOut": "12:29",
      "table": "B04 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 59000,
      "formattedVnd": "59 000",
      "totalTrieu": 0.059,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 152,
      "invoiceCode": "VVKW4Z7RZRG45B9QQS9GD3C",
      "invoiceNo": "170068",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "12:04",
      "timeOut": "12:29",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 118000,
      "formattedVnd": "118 000",
      "totalTrieu": 0.118,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 153,
      "invoiceCode": "VVKW4Z7RZRG4ERB245R8EIES",
      "invoiceNo": "170054",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "11:39",
      "timeOut": "12:00",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 118000,
      "formattedVnd": "118 000",
      "totalTrieu": 0.118,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Cơm Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 154,
      "invoiceCode": "VVKW4Z7RZRG4ERB25304TOS0",
      "invoiceNo": "170061",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "11:51",
      "timeOut": "11:52",
      "table": "B05 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 354000,
      "formattedVnd": "354 000",
      "totalTrieu": 0.354,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        },
        {
          "name": "Đậu kẹp thịt tẩm hành",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "PHAN",
          "unitPriceVnd": 110000,
          "revenueVnd": 110000,
          "revenueTrieu": 0.11
        },
        {
          "name": "Nọng rang dừa trứng cút",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "HOP",
          "unitPriceVnd": 185000,
          "revenueVnd": 185000,
          "revenueTrieu": 0.185
        }
      ]
    },
    {
      "stt": 155,
      "invoiceCode": "VVKW4Z7RZRG4ERB22LN1BRA4",
      "invoiceNo": "170042",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "11:19",
      "timeOut": "11:37",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 59000,
      "formattedVnd": "59 000",
      "totalTrieu": 0.059,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Cơm Bò sốt vang",
          "groupKey": "com_mon",
          "groupName": "Cơm & Món ăn",
          "quantity": 1,
          "unit": "SUAT",
          "unitPriceVnd": 59000,
          "revenueVnd": 59000,
          "revenueTrieu": 0.059
        }
      ]
    },
    {
      "stt": 156,
      "invoiceCode": "VVKW4Z7RZRG4ERB1UTS2KNWF",
      "invoiceNo": "170011",
      "date": "17/11/2026",
      "shortDate": "17/11",
      "timeIn": "10:18",
      "timeOut": "10:20",
      "table": "B02 - Tầng 1",
      "channelKey": "dineIn",
      "channelName": "Bán tại chỗ",
      "totalVnd": 32000,
      "formattedVnd": "32 000",
      "totalTrieu": 0.032,
      "discountVnd": 0,
      "customerName": "",
      "note": "",
      "promoCode": "",
      "paymentMethod": "TRANSFER",
      "items": [
        {
          "name": "Thanh Nhài Dẻ Cười (S)",
          "groupKey": "do_uong",
          "groupName": "Đồ uống (Trà & Cafe)",
          "quantity": 1,
          "unit": "LY",
          "unitPriceVnd": 32000,
          "revenueVnd": 32000,
          "revenueTrieu": 0.032
        }
      ]
    }
  ]
};
  const revenueDaily = posRevenueData.allDays;
  const revenueLast7Days = posRevenueData.last7Days;
  const revenueWeekly = posRevenueData.week17To23;
  const revenueChannels = posRevenueData.channels;

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
    revenue: Object.assign({}, posRevenueData, {
      total: posRevenueData.total,
      totalTrieu: posRevenueData.totalTrieu,
      totalVnd: posRevenueData.totalVnd,
      formattedTotalVnd: posRevenueData.formattedTotalVnd,
      totalOrders: posRevenueData.totalOrders,
      totalItemsSold: posRevenueData.totalItemsSold,
      unit: "Triệu VNĐ",
      growth: "156 hóa đơn POS (17/11 – 24/11/2026)",
      channels: posRevenueData.channels,
      categories: posRevenueData.channels,
      allDays: posRevenueData.allDays,
      daily: posRevenueData.allDays,
      byDay: posRevenueData.allDays,
      last7Days: posRevenueData.last7Days,
      week17To23: posRevenueData.week17To23,
      weekly: posRevenueData.week17To23,
      byDish: posRevenueData.byDish,
      dishes: posRevenueData.byDish,
      byDishGroup: posRevenueData.byDishGroup,
      dishGroups: posRevenueData.byDishGroup,
      invoices: posRevenueData.invoices
    }),
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
