/**
 * Nhà hàng Mộc Giang — Quản lý Doanh thu (js/revenue.js)
 * Hiển thị duy nhất 1 tab Doanh thu gồm:
 *  - 4 thẻ KPI tổng hợp (Tổng doanh thu, Bán tại chỗ, Bán online, Bán mang về)
 *  - Biểu đồ cột nhóm 3 cột (Vertical Grouped Bar Chart): Bán online, Bán tại chỗ, Bán mang về (Đơn vị: Triệu VNĐ)
 *  - Biểu đồ tròn (Pie Chart): Cơ cấu tỷ trọng % từng kênh doanh thu
 *  - Bảng chi tiết doanh thu theo ngày / kỳ
 */
(function () {
  'use strict';

  // Bảng màu chuẩn theo đặc tả cho 3 kênh doanh thu
  var CHANNEL_CONFIG = {
    online: {
      key: 'online',
      label: 'Bán online',
      fullLabel: 'Bán online (App / Web)',
      subLabel: 'GrabFood · ShopeeFood · Website Mộc Giang',
      color: '#2B7BBB',
      colorLight: 'rgba(43, 123, 187, 0.14)',
      colorBorder: 'rgba(43, 123, 187, 0.35)',
      gradientStart: '#388FD4',
      gradientEnd: '#23669E'
    },
    dineIn: {
      key: 'dineIn',
      label: 'Bán tại chỗ',
      fullLabel: 'Bán tại chỗ (Dine-in)',
      subLabel: 'Phục vụ tại 199 Hoàng Cầu, Đống Đa',
      color: '#2E6B22',
      colorLight: 'rgba(46, 107, 34, 0.14)',
      colorBorder: 'rgba(46, 107, 34, 0.35)',
      gradientStart: '#3B842D',
      gradientEnd: '#24551A'
    },
    takeaway: {
      key: 'takeaway',
      label: 'Bán mang về',
      fullLabel: 'Bán mang về (Takeaway)',
      subLabel: 'Khách mua trực tiếp tại quầy & đặt gọi trước',
      color: '#D97724',
      colorLight: 'rgba(217, 119, 36, 0.15)',
      colorBorder: 'rgba(217, 119, 36, 0.38)',
      gradientStart: '#E88835',
      gradientEnd: '#C06316'
    }
  };

  // Dữ liệu mặc định chuẩn Nhà hàng Mộc Giang (Đơn vị: Triệu VNĐ)
  var DEFAULT_PERIOD_DATASETS = {
    '7days': {
      id: '7days',
      label: '7 ngày qua (17/11 – 23/11)',
      xAxisTitle: 'Trục X: Ngày (17/11 – 23/11/2026)',
      periodNote: 'Tuần 47–48 · Tháng 11/2026',
      growthText: '+14,2% so với 7 ngày trước',
      totalOrders: 412,
      yMax: 25,
      yStep: 5,
      items: [
        { date: '17/11', fullDate: 'Thứ Ba, 17/11/2026', online: 5.4, dineIn: 10.8, takeaway: 3.6, orders: 52, note: 'Bữa trưa văn phòng Hoàng Cầu đông khách' },
        { date: '18/11', fullDate: 'Thứ Tư, 18/11/2026', online: 6.1, dineIn: 11.5, takeaway: 4.0, orders: 56, note: 'Đặt combo cơm nhà & trà thảo mộc tăng' },
        { date: '19/11', fullDate: 'Thứ Năm, 19/11/2026', online: 5.8, dineIn: 12.2, takeaway: 3.9, orders: 55, note: '2 đoàn khách công ty đặt bàn buổi trưa' },
        { date: '20/11', fullDate: 'Thứ Sáu, 20/11/2026', online: 7.4, dineIn: 15.6, takeaway: 5.1, orders: 68, note: 'Tiệc tri ân 20/11 & đơn giao hàng cao điểm' },
        { date: '21/11', fullDate: 'Thứ Bảy, 21/11/2026', online: 8.2, dineIn: 18.4, takeaway: 5.8, orders: 74, note: 'Cuối tuần gia đình dùng bữa tối kín bàn' },
        { date: '22/11', fullDate: 'Chủ Nhật, 22/11/2026', online: 7.9, dineIn: 17.2, takeaway: 5.4, orders: 65, note: 'Khách gia đình & đơn mang về cuối tuần' },
        { date: '23/11', fullDate: 'Thứ Hai, 23/11/2026', online: 6.4, dineIn: 13.1, takeaway: 4.3, orders: 42, note: 'Đầu tuần ổn định, 3 bàn tiệc đặt trước' }
      ]
    },
    'weekly': {
      id: 'weekly',
      label: 'Theo tuần (Tháng 11/2026)',
      xAxisTitle: 'Trục X: Các tuần trong Tháng 11/2026',
      periodNote: 'Lũy kế Tháng 11/2026 (01/11 – 23/11/2026)',
      growthText: '+16,8% so với cùng kỳ Tháng 10/2026',
      totalOrders: 1420,
      yMax: 80,
      yStep: 16,
      items: [
        { date: 'Tuần 1 (01–07/11)', fullDate: 'Tuần 1 · 01/11 – 07/11/2026', online: 32.4, dineIn: 61.8, takeaway: 21.6, orders: 345, note: 'Khởi động menu mùa thu đông Mộc Giang' },
        { date: 'Tuần 2 (08–14/11)', fullDate: 'Tuần 2 · 08/11 – 14/11/2026', online: 35.2, dineIn: 66.4, takeaway: 23.1, orders: 368, note: 'Tăng trưởng đơn App GrabFood & ShopeeFood' },
        { date: 'Tuần 3 (15–21/11)', fullDate: 'Tuần 3 · 15/11 – 21/11/2026', online: 41.8, dineIn: 76.5, takeaway: 27.3, orders: 432, note: 'Tuần lễ 20/11 bùng nổ đặt bàn & tiệc' },
        { date: 'Tuần 4 (22–23/11)', fullDate: 'Tuần 4 · 22/11 – 23/11/2026', online: 28.1, dineIn: 52.8, takeaway: 19.5, orders: 275, note: 'Đang diễn ra (cập nhật đến tối 23/11)' }
      ]
    },
    'monthly': {
      id: 'monthly',
      label: 'Theo tháng (6 tháng cuối 2026)',
      xAxisTitle: 'Trục X: Tháng (Tháng 6 – Tháng 11/2026)',
      periodNote: '6 tháng gần nhất · Năm tài chính 2026',
      growthText: '+21,5% tăng trưởng trung bình 6 tháng',
      totalOrders: 7890,
      yMax: 300,
      yStep: 50,
      items: [
        { date: 'Tháng 06/2026', fullDate: 'Tháng 06/2026', online: 108.5, dineIn: 210.4, takeaway: 74.2, orders: 1180, note: 'Cao điểm đồ uống giải nhiệt mùa hè' },
        { date: 'Tháng 07/2026', fullDate: 'Tháng 07/2026', online: 114.2, dineIn: 218.0, takeaway: 78.6, orders: 1235, note: 'Ra mắt combo cơm trưa văn phòng mới' },
        { date: 'Tháng 08/2026', fullDate: 'Tháng 08/2026', online: 119.8, dineIn: 226.5, takeaway: 81.4, orders: 1290, note: 'Chương trình ưu đãi khách hàng thân thiết' },
        { date: 'Tháng 09/2026', fullDate: 'Tháng 09/2026', online: 125.0, dineIn: 238.2, takeaway: 85.1, orders: 1345, note: 'Mùa tựu trường & liên hoan gia đình' },
        { date: 'Tháng 10/2026', fullDate: 'Tháng 10/2026', online: 131.6, dineIn: 249.8, takeaway: 89.4, orders: 1420, note: 'Lễ 20/10 doanh thu tại chỗ đạt đỉnh' },
        { date: 'Tháng 11/2026', fullDate: 'Tháng 11/2026 (Lũy kế)', online: 137.5, dineIn: 257.5, takeaway: 91.5, orders: 1420, note: 'Lũy kế 486,5 triệu VNĐ (đạt 94% kế hoạch tháng)' }
      ]
    }
  };

  var currentState = {
    period: '7days',
    highlightedChannel: null, // 'online' | 'dineIn' | 'takeaway' | null
    pieStyle: 'pie' // 'pie' | 'donut'
  };

  /**
   * Định dạng số tiền Triệu VNĐ theo chuẩn tiếng Việt (dấu phẩy thập phân)
   */
  function formatMillion(val, decimals) {
    var d = typeof decimals === 'number' ? decimals : 1;
    var num = Number(val) || 0;
    return num.toFixed(d).replace('.', ',');
  }

  /**
   * Lấy dữ liệu doanh thu theo kỳ, ưu tiên tích hợp từ window.MocGiangData nếu có
   */
  function getPeriodData(periodKey) {
    var fallback = DEFAULT_PERIOD_DATASETS[periodKey] || DEFAULT_PERIOD_DATASETS['7days'];
    var ext = window.MocGiangData && window.MocGiangData.revenue;
    if (!ext) {
      return fallback;
    }

    // Nếu window.MocGiangData.revenue có periods[periodKey] đúng cấu trúc thì sử dụng
    if (ext.periods && ext.periods[periodKey] && Array.isArray(ext.periods[periodKey].items)) {
      return ext.periods[periodKey];
    }

    // Nếu window.MocGiangData.revenue có last7Days (7 ngày: 17/11 - 23/11) và đang xem '7days'
    if (periodKey === '7days' && Array.isArray(ext.last7Days) && ext.last7Days.length > 0) {
      var dailyLookup = {};
      if (Array.isArray(ext.daily)) {
        ext.daily.forEach(function (d) {
          dailyLookup[d.date] = d;
        });
      }
      var mapped7 = ext.last7Days.map(function (row) {
        var o = Number(row.online) || 0;
        var d = Number(row.dineIn) || 0;
        var t = Number(row.takeaway) || 0;
        var detail = dailyLookup[row.date] || {};
        return {
          date: row.date,
          fullDate: (row.dayLabel ? row.dayLabel + ', ' : '') + (row.fullDate || row.date + '/2026'),
          online: o,
          dineIn: d,
          takeaway: t,
          orders: row.orders || detail.orders || Math.round((o + d + t) * 2.8),
          note: row.note || detail.note || 'Hoạt động kinh doanh tại 199 Hoàng Cầu'
        };
      });
      return {
        id: '7days',
        label: fallback.label,
        xAxisTitle: fallback.xAxisTitle,
        periodNote: fallback.periodNote,
        growthText: fallback.growthText,
        totalOrders: 427,
        yMax: 20,
        yStep: 5,
        items: mapped7
      };
    }

    // Nếu window.MocGiangData.revenue có weekly (4 tuần Tháng 11/2026 = 486,5 triệu VNĐ)
    if (periodKey === 'weekly' && Array.isArray(ext.weekly) && ext.weekly.length > 0) {
      var weekNotes = [
        'Khởi động menu mùa thu đông Mộc Giang',
        'Tăng trưởng đơn App GrabFood & ShopeeFood',
        'Tuần lễ 20/11 bùng nổ đặt bàn & tiệc',
        'Đang diễn ra (cập nhật đến tối 23/11)'
      ];
      var mappedW = ext.weekly.map(function (row, idx) {
        var o = Number(row.online) || 0;
        var d = Number(row.dineIn) || 0;
        var t = Number(row.takeaway) || 0;
        return {
          date: row.date,
          fullDate: row.date + '/2026',
          online: o,
          dineIn: d,
          takeaway: t,
          orders: row.orders || Math.round((o + d + t) * 2.92),
          note: row.note || weekNotes[idx] || 'Tổng hợp doanh thu tuần tại 199 Hoàng Cầu'
        };
      });
      return {
        id: 'weekly',
        label: fallback.label,
        xAxisTitle: fallback.xAxisTitle,
        periodNote: fallback.periodNote,
        growthText: fallback.growthText,
        totalOrders: 1420,
        yMax: 100,
        yStep: 20,
        items: mappedW
      };
    }

    return fallback;
  }

  /**
   * Tính toán tổng hợp KPI & tỷ trọng % từ danh sách items
   */
  function computeSummary(dataset) {
    var items = dataset.items || [];
    var sumOnline = 0;
    var sumDineIn = 0;
    var sumTakeaway = 0;
    var sumOrders = 0;

    items.forEach(function (item) {
      sumOnline += Number(item.online) || 0;
      sumDineIn += Number(item.dineIn) || 0;
      sumTakeaway += Number(item.takeaway) || 0;
      sumOrders += Number(item.orders) || 0;
    });

    sumOnline = Math.round(sumOnline * 10) / 10;
    sumDineIn = Math.round(sumDineIn * 10) / 10;
    sumTakeaway = Math.round(sumTakeaway * 10) / 10;
    var grandTotal = Math.round((sumOnline + sumDineIn + sumTakeaway) * 10) / 10;

    var pctOnline = grandTotal > 0 ? Math.round((sumOnline / grandTotal) * 1000) / 10 : 0;
    var pctDineIn = grandTotal > 0 ? Math.round((sumDineIn / grandTotal) * 1000) / 10 : 0;
    // Đảm bảo tổng 3 tỷ trọng = 100,0%
    var pctTakeaway = grandTotal > 0 ? Math.round((100 - pctOnline - pctDineIn) * 10) / 10 : 0;

    return {
      total: grandTotal,
      online: sumOnline,
      dineIn: sumDineIn,
      takeaway: sumTakeaway,
      pctOnline: pctOnline,
      pctDineIn: pctDineIn,
      pctTakeaway: pctTakeaway,
      orders: sumOrders || dataset.totalOrders || 412,
      avgPerPoint: items.length > 0 ? Math.round((grandTotal / items.length) * 10) / 10 : 0
    };
  }

  /**
   * Tạo đường dẫn SVG cho lát cắt biểu đồ tròn (Pie / Donut slice)
   */
  function createPieSlicePath(cx, cy, rOuter, rInner, startAngleDeg, endAngleDeg) {
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
   * Dựng SVG Biểu đồ cột nhóm 3 cột (Vertical Grouped Bar Chart)
   * Mô phỏng trực tiếp cấu trúc "Vertical Grouped Bar Chart" với 3 cột đứng cạnh nhau tại mỗi mốc X
   */
  function buildGroupedBarChartSVG(dataset) {
    var items = dataset.items || [];
    var yMax = dataset.yMax || 25;
    var yStep = dataset.yStep || 5;
    var numTicks = Math.round(yMax / yStep);

    var svgWidth = 720;
    var svgHeight = 370;
    var padLeft = 72;
    var padRight = 24;
    var padTop = 34;
    var padBottom = 64;

    var plotW = svgWidth - padLeft - padRight;
    var plotH = svgHeight - padTop - padBottom;
    var groupCount = items.length || 1;
    var groupSlotW = plotW / groupCount;

    // Kích thước 3 cột đứng cạnh nhau trong mỗi nhóm
    var barWidth = Math.min(24, Math.max(13, Math.floor((groupSlotW * 0.68) / 3)));
    var barGap = Math.max(4, Math.floor(barWidth * 0.22));
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

    // Vẽ đường kẻ ngang (Horizontal Gridlines) & nhãn trục Y (Triệu VNĐ)
    var gridLines = [];
    for (var i = 0; i <= numTicks; i++) {
      var val = i * yStep;
      var ratio = val / yMax;
      var yPos = padTop + plotH - ratio * plotH;
      var isZero = i === 0;
      gridLines.push(
        '<g class="rev-y-tick">',
        '  <line x1="' + padLeft + '" y1="' + yPos.toFixed(1) + '" x2="' + (svgWidth - padRight) + '" y2="' + yPos.toFixed(1) + '" stroke="' + (isZero ? '#C8Bca6' : '#E6DEC8') + '" stroke-width="' + (isZero ? '1.5' : '1') + '" ' + (isZero ? '' : 'stroke-dasharray="0"') + '/>',
        '  <text x="' + (padLeft - 10) + '" y="' + (yPos + 4).toFixed(1) + '" text-anchor="end" class="rev-axis-label-y">' + val + ' tr</text>',
        '</g>'
      );
    }

    // Nhãn đơn vị trục Y ở góc trên bên trái
    var yAxisHeader = '<text x="' + padLeft + '" y="18" class="rev-axis-unit-title">▲ Trục Y: Số tiền (Đơn vị: Triệu VNĐ)</text>';

    // Vẽ từng cụm 3 cột đứng cạnh nhau cho mỗi mốc trên trục X
    var barGroups = [];
    var channelsOrder = ['online', 'dineIn', 'takeaway'];

    items.forEach(function (item, idx) {
      var groupCenterX = padLeft + idx * groupSlotW + groupSlotW / 2;
      var clusterStartX = groupCenterX - totalClusterW / 2;
      var dayTotal = (Number(item.online) || 0) + (Number(item.dineIn) || 0) + (Number(item.takeaway) || 0);

      // Nền hover nhẹ cho cả cụm ngày
      barGroups.push(
        '<g class="rev-bar-cluster" data-index="' + idx + '" data-date="' + item.date + '">',
        '  <rect class="rev-cluster-hover-bg" x="' + (padLeft + idx * groupSlotW + 4).toFixed(1) + '" y="' + padTop + '" width="' + (groupSlotW - 8).toFixed(1) + '" height="' + plotH + '" rx="6" fill="transparent"/>'
      );

      channelsOrder.forEach(function (chKey, cIdx) {
        var rawVal = Number(item[chKey]) || 0;
        var barH = Math.max(3, (Math.min(rawVal, yMax) / yMax) * plotH);
        var barX = clusterStartX + cIdx * (barWidth + barGap);
        var barY = padTop + plotH - barH;
        var cfg = CHANNEL_CONFIG[chKey];
        var pctOfDay = dayTotal > 0 ? ((rawVal / dayTotal) * 100).toFixed(1).replace('.', ',') : '0,0';
        var dimmedClass = (hl && hl !== chKey) ? ' is-dimmed' : '';

        barGroups.push(
          '  <g class="rev-single-bar-wrap' + dimmedClass + '" data-channel="' + chKey + '" data-date="' + item.date + '" data-fulldate="' + (item.fullDate || item.date) + '" data-label="' + cfg.label + '" data-value="' + formatMillion(rawVal, 1) + '" data-pct="' + pctOfDay + '" data-daytotal="' + formatMillion(dayTotal, 1) + '">',
          '    <rect class="rev-bar-rect" x="' + barX.toFixed(1) + '" y="' + barY.toFixed(1) + '" width="' + barWidth + '" height="' + barH.toFixed(1) + '" rx="3.5" fill="url(#rev-grad-' + chKey + ')" stroke="' + cfg.color + '" stroke-width="0.5"/>',
          '    <text x="' + (barX + barWidth / 2).toFixed(1) + '" y="' + (barY - 6).toFixed(1) + '" text-anchor="middle" class="rev-bar-val-text" fill="' + cfg.color + '">' + formatMillion(rawVal, 1) + '</text>',
          '  </g>'
        );
      });

      // Nhãn ngày/mốc thời gian dưới trục X
      barGroups.push(
        '  <text x="' + groupCenterX.toFixed(1) + '" y="' + (padTop + plotH + 24) + '" text-anchor="middle" class="rev-axis-label-x">' + item.date + '</text>',
        '</g>'
      );
    });

    // Nhãn tiêu đề trục X ở dưới cùng
    var xAxisFooter = '<text x="' + (padLeft + plotW / 2).toFixed(1) + '" y="' + (svgHeight - 10) + '" text-anchor="middle" class="rev-axis-x-title">' + (dataset.xAxisTitle || 'Trục X: Ngày') + '</text>';

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
   * Dựng SVG Biểu đồ tròn (Pie / Donut Chart) hiển thị tỷ lệ % từng kênh doanh thu
   */
  function buildPieChartSVG(summary) {
    var slices = [
      {
        key: 'online',
        label: CHANNEL_CONFIG.online.label,
        value: summary.online,
        pct: summary.pctOnline,
        color: CHANNEL_CONFIG.online.color
      },
      {
        key: 'dineIn',
        label: CHANNEL_CONFIG.dineIn.label,
        value: summary.dineIn,
        pct: summary.pctDineIn,
        color: CHANNEL_CONFIG.dineIn.color
      },
      {
        key: 'takeaway',
        label: CHANNEL_CONFIG.takeaway.label,
        value: summary.takeaway,
        pct: summary.pctTakeaway,
        color: CHANNEL_CONFIG.takeaway.color
      }
    ];

    var size = 270;
    var cx = size / 2;
    var cy = size / 2;
    var rOuter = 112;
    var rInner = currentState.pieStyle === 'donut' ? 50 : 0;
    var labelRadius = currentState.pieStyle === 'donut' ? 82 : 68;

    var currentAngle = 0;
    var paths = [];
    var labels = [];
    var hl = currentState.highlightedChannel;

    slices.forEach(function (slice) {
      var sweep = Math.max(0.5, (slice.pct / 100) * 360);
      var startAngle = currentAngle;
      var endAngle = currentAngle + sweep;
      var midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;

      // Hiệu ứng tách nhẹ lát cắt khi đang được chọn/highlight
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
        '  data-value="' + formatMillion(slice.value, 1) + '" ',
        '  data-pct="' + formatMillion(slice.pct, 1) + '"/>'
      );

      // Tọa độ nhãn % hiển thị trực tiếp trên từng lát cắt
      var lx = cx + (labelRadius + offsetDist) * Math.cos(midRad);
      var ly = cy + (labelRadius + offsetDist) * Math.sin(midRad);

      labels.push(
        '<g class="rev-pie-slice-label" pointer-events="none">',
        '  <text x="' + lx.toFixed(1) + '" y="' + (ly - 4).toFixed(1) + '" text-anchor="middle" class="rev-pie-pct-text">' + formatMillion(slice.pct, 1) + '%</text>',
        '  <text x="' + lx.toFixed(1) + '" y="' + (ly + 11).toFixed(1) + '" text-anchor="middle" class="rev-pie-name-text">' + slice.label + '</text>',
        '</g>'
      );
    });

    var centerBadge = '';
    if (currentState.pieStyle === 'donut') {
      centerBadge = [
        '<g class="rev-donut-center" pointer-events="none">',
        '  <circle cx="' + cx + '" cy="' + cy + '" r="' + (rInner - 2) + '" fill="var(--rev-card-bg, #FFFFFF)"/>',
        '  <text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" class="rev-donut-total-val">' + formatMillion(summary.total, 1) + '</text>',
        '  <text x="' + cx + '" y="' + (cy + 13) + '" text-anchor="middle" class="rev-donut-total-unit">Triệu VNĐ</text>',
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
   * Xác định kênh chủ đạo trong một ngày / kỳ
   */
  function getDominantChannel(item) {
    var o = Number(item.online) || 0;
    var d = Number(item.dineIn) || 0;
    var t = Number(item.takeaway) || 0;
    var total = o + d + t || 1;

    if (d >= o && d >= t) {
      return {
        cfg: CHANNEL_CONFIG.dineIn,
        pct: ((d / total) * 100).toFixed(1).replace('.', ',')
      };
    }
    if (o >= d && o >= t) {
      return {
        cfg: CHANNEL_CONFIG.online,
        pct: ((o / total) * 100).toFixed(1).replace('.', ',')
      };
    }
    return {
      cfg: CHANNEL_CONFIG.takeaway,
      pct: ((t / total) * 100).toFixed(1).replace('.', ',')
    };
  }

  /**
   * Inject CSS chuyên biệt cho trang Doanh thu
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
      '  gap: 20px;',
      '  padding-bottom: 28px;',
      '}',
      '.rev-header-card {',
      '  background: var(--rev-card-bg);',
      '  border: 1px solid var(--rev-card-border);',
      '  border-radius: 14px;',
      '  padding: 20px 24px;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 16px;',
      '  box-shadow: 0 2px 10px rgba(61, 31, 13, 0.05);',
      '}',
      '.rev-header-title-group h2 {',
      '  margin: 0 0 6px 0;',
      '  font-size: 1.35rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-main);',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 10px;',
      '}',
      '.rev-header-badge {',
      '  font-size: 0.75rem;',
      '  font-weight: 600;',
      '  padding: 3px 10px;',
      '  border-radius: 999px;',
      '  background: rgba(46, 107, 34, 0.12);',
      '  color: #2E6B22;',
      '  border: 1px solid rgba(46, 107, 34, 0.28);',
      '}',
      '.rev-header-subtitle {',
      '  margin: 0;',
      '  font-size: 0.9rem;',
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
      '  font-size: 0.84rem;',
      '  font-weight: 600;',
      '  padding: 8px 14px;',
      '  border-radius: 7px;',
      '  cursor: pointer;',
      '  transition: all 0.18s ease;',
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
      '  padding: 18px 20px;',
      '  position: relative;',
      '  overflow: hidden;',
      '  box-shadow: 0 2px 8px rgba(61, 31, 13, 0.04);',
      '  transition: transform 0.18s ease, box-shadow 0.18s ease;',
      '}',
      '.rev-kpi-card[data-channel] {',
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
      '  margin-bottom: 10px;',
      '}',
      '.rev-kpi-label {',
      '  font-size: 0.86rem;',
      '  font-weight: 600;',
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
      '}',
      '.rev-kpi-pct-pill {',
      '  font-size: 0.78rem;',
      '  font-weight: 700;',
      '  padding: 3px 9px;',
      '  border-radius: 999px;',
      '}',
      '.rev-kpi-value-row {',
      '  display: flex;',
      '  align-items: baseline;',
      '  gap: 6px;',
      '  margin-bottom: 6px;',
      '}',
      '.rev-kpi-value {',
      '  font-size: 1.65rem;',
      '  font-weight: 800;',
      '  letter-spacing: -0.02em;',
      '  color: var(--rev-text-main);',
      '}',
      '.rev-kpi-unit {',
      '  font-size: 0.85rem;',
      '  font-weight: 600;',
      '  color: var(--rev-text-muted);',
      '}',
      '.rev-kpi-foot {',
      '  font-size: 0.78rem;',
      '  color: var(--rev-text-muted);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '}',
      '.rev-kpi-bar-track {',
      '  margin-top: 10px;',
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
      '  grid-template-columns: 1.45fr 1fr;',
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
      '  gap: 12px;',
      '  margin-bottom: 14px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '  padding-bottom: 12px;',
      '}',
      '.rev-card-head h3 {',
      '  margin: 0 0 4px 0;',
      '  font-size: 1.08rem;',
      '  font-weight: 700;',
      '  color: var(--rev-text-main);',
      '}',
      '.rev-card-head p {',
      '  margin: 0;',
      '  font-size: 0.82rem;',
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
      '/* SVG Grouped Bar Chart styles */',
      '.rev-bar-chart-stage {',
      '  width: 100%;',
      '  overflow-x: auto;',
      '  position: relative;',
      '}',
      '.rev-grouped-bar-svg {',
      '  width: 100%;',
      '  height: auto;',
      '  min-width: 540px;',
      '  display: block;',
      '  font-family: inherit;',
      '}',
      '.rev-axis-unit-title {',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-axis-label-y {',
      '  font-size: 11.5px;',
      '  font-weight: 600;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-axis-label-x {',
      '  font-size: 12px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-main);',
      '}',
      '.rev-axis-x-title {',
      '  font-size: 11.5px;',
      '  font-weight: 700;',
      '  fill: var(--rev-text-muted);',
      '}',
      '.rev-bar-cluster:hover .rev-cluster-hover-bg {',
      '  fill: rgba(61, 31, 13, 0.04);',
      '}',
      '.rev-single-bar-wrap {',
      '  cursor: pointer;',
      '  transition: opacity 0.2s ease;',
      '}',
      '.rev-single-bar-wrap.is-dimmed {',
      '  opacity: 0.25;',
      '}',
      '.rev-single-bar-wrap:hover .rev-bar-rect {',
      '  filter: brightness(1.08);',
      '  stroke-width: 1.5px;',
      '}',
      '.rev-bar-val-text {',
      '  font-size: 10.5px;',
      '  font-weight: 700;',
      '}',
      '/* Legend under Grouped Bar Chart (modeled after Vertical Grouped Bar Chart reference) */',
      '.rev-bar-legend {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  flex-wrap: wrap;',
      '  gap: 22px;',
      '  margin-top: 12px;',
      '  padding-top: 12px;',
      '  border-top: 1px dashed var(--rev-card-border);',
      '}',
      '.rev-legend-item {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  font-size: 0.88rem;',
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
      '  width: 14px;',
      '  height: 14px;',
      '  border-radius: 3px;',
      '  display: inline-block;',
      '}',
      '/* Pie Chart & Breakdown Table */',
      '.rev-pie-layout {',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: center;',
      '  gap: 16px;',
      '}',
      '.rev-pie-svg-wrap {',
      '  width: 245px;',
      '  height: 245px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '}',
      '.rev-pie-svg {',
      '  width: 100%;',
      '  height: 100%;',
      '  overflow: visible;',
      '}',
      '.rev-pie-slice {',
      '  cursor: pointer;',
      '  transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;',
      '}',
      '.rev-pie-slice:hover {',
      '  filter: brightness(1.07);',
      '}',
      '.rev-pie-slice.is-dimmed {',
      '  opacity: 0.3;',
      '}',
      '.rev-pie-pct-text {',
      '  font-size: 13px;',
      '  font-weight: 800;',
      '  fill: #FFFFFF;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);',
      '}',
      '.rev-pie-name-text {',
      '  font-size: 10.5px;',
      '  font-weight: 700;',
      '  fill: #FFFFFF;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);',
      '}',
      '.rev-donut-total-val {',
      '  font-size: 17px;',
      '  font-weight: 800;',
      '  fill: var(--rev-text-main);',
      '}',
      '.rev-donut-total-unit {',
      '  font-size: 10.5px;',
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
      '  font-size: 0.85rem;',
      '}',
      '.rev-pie-table th {',
      '  text-align: left;',
      '  font-size: 0.76rem;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.03em;',
      '  color: var(--rev-text-muted);',
      '  padding: 7px 10px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '}',
      '.rev-pie-table td {',
      '  padding: 9px 10px;',
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
      '/* Daily Detail Table */',
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
      '  font-size: 0.88rem;',
      '}',
      '.rev-detail-table th {',
      '  background: var(--rev-bg-soft);',
      '  color: var(--rev-text-main);',
      '  font-weight: 700;',
      '  padding: 11px 14px;',
      '  text-align: left;',
      '  border-bottom: 2px solid var(--rev-card-border);',
      '  white-space: nowrap;',
      '}',
      '.rev-detail-table td {',
      '  padding: 11px 14px;',
      '  border-bottom: 1px solid var(--rev-card-border);',
      '  color: var(--rev-text-main);',
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
      '  padding: 12px 14px;',
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
      '  padding: 4px 10px;',
      '  border-radius: 999px;',
      '  font-size: 0.78rem;',
      '  font-weight: 700;',
      '}',
      '/* Floating Tooltip */',
      '.rev-floating-tooltip {',
      '  position: fixed;',
      '  z-index: 9999;',
      '  pointer-events: none;',
      '  background: #2C180A;',
      '  color: #FFFFFF;',
      '  padding: 10px 14px;',
      '  border-radius: 10px;',
      '  font-size: 0.8rem;',
      '  line-height: 1.45;',
      '  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);',
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
   * Gắn sự kiện tương tác cho bộ lọc kỳ, biểu đồ cột nhóm và biểu đồ tròn
   */
  function attachRevenueEvents(container) {
    // 1. Chuyển đổi kỳ báo cáo (7 ngày qua | Theo tuần | Theo tháng)
    var periodBtns = container.querySelectorAll('.rev-period-btn');
    periodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newPeriod = btn.getAttribute('data-period');
        if (newPeriod && newPeriod !== currentState.period) {
          currentState.period = newPeriod;
          window.renderRevenue();
        }
      });
    });

    // 2. Chuyển đổi kiểu Biểu đồ tròn (Hình tròn Pie / Vành khuyên Donut)
    var pieModeBtns = container.querySelectorAll('.rev-pie-mode-btn');
    pieModeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-piemode');
        if (mode && mode !== currentState.pieStyle) {
          currentState.pieStyle = mode;
          window.renderRevenue();
        }
      });
    });

    // 3. Click vào Legend, KPI card, hoặc dòng trong bảng Pie để lọc/highlight kênh doanh thu
    var channelToggles = container.querySelectorAll('[data-toggle-channel]');
    channelToggles.forEach(function (el) {
      el.addEventListener('click', function () {
        var ch = el.getAttribute('data-toggle-channel');
        if (!ch) return;
        currentState.highlightedChannel = currentState.highlightedChannel === ch ? null : ch;
        window.renderRevenue();
      });
    });

    // 4. Tooltip tương tác khi rê chuột lên cột hoặc lát cắt biểu đồ tròn
    var tooltip = getOrCreateTooltip();

    function moveTooltip(e) {
      var x = e.clientX + 14;
      var y = e.clientY - 14;
      if (x + 230 > window.innerWidth) {
        x = e.clientX - 235;
      }
      if (y + 110 > window.innerHeight) {
        y = e.clientY - 110;
      }
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    var barEls = container.querySelectorAll('.rev-single-bar-wrap');
    barEls.forEach(function (bar) {
      bar.addEventListener('mouseenter', function (e) {
        var fullDate = bar.getAttribute('data-fulldate');
        var label = bar.getAttribute('data-label');
        var val = bar.getAttribute('data-value');
        var pct = bar.getAttribute('data-pct');
        var dayTotal = bar.getAttribute('data-daytotal');
        var ch = bar.getAttribute('data-channel');
        var color = (CHANNEL_CONFIG[ch] && CHANNEL_CONFIG[ch].color) || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="font-weight:700;margin-bottom:4px;color:#F4EDE0;">' + fullDate + '</div>',
          '<div style="display:flex;align-items:center;gap:6px;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>' + label + ': <strong>' + val + ' triệu VNĐ</strong> (' + pct + '%)</span>',
          '</div>',
          '<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.15);font-size:0.75rem;color:#D6C7B2;">',
          '  Tổng doanh thu mốc này: <strong>' + dayTotal + ' triệu VNĐ</strong>',
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

    var pieSlices = container.querySelectorAll('.rev-pie-slice');
    pieSlices.forEach(function (slice) {
      slice.addEventListener('mouseenter', function (e) {
        var label = slice.getAttribute('data-label');
        var val = slice.getAttribute('data-value');
        var pct = slice.getAttribute('data-pct');
        var ch = slice.getAttribute('data-channel');
        var color = (CHANNEL_CONFIG[ch] && CHANNEL_CONFIG[ch].color) || '#2E6B22';

        tooltip.innerHTML = [
          '<div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:3px;">',
          '  <span style="width:10px;height:10px;border-radius:2px;background:' + color + ';display:inline-block;"></span>',
          '  <span>Kênh: ' + label + '</span>',
          '</div>',
          '<div>Doanh thu: <strong>' + val + ' triệu VNĐ</strong></div>',
          '<div>Tỷ trọng cơ cấu: <strong>' + pct + '%</strong> tổng doanh thu</div>'
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
  }

  /**
   * Hàm chính render giao diện Quản lý Doanh thu vào #view-revenue
   */
  window.renderRevenue = function () {
    ensureRevenueStyles();
    var container = document.getElementById('view-revenue');
    if (!container) {
      return;
    }

    var dataset = getPeriodData(currentState.period);
    var summary = computeSummary(dataset);
    var hl = currentState.highlightedChannel;

    var barChartSVG = buildGroupedBarChartSVG(dataset);
    var pieChartSVG = buildPieChartSVG(summary);

    // Dựng các hàng dữ liệu cho bảng chi tiết doanh thu theo ngày/kỳ
    var detailRowsHtml = (dataset.items || []).map(function (item) {
      var o = Number(item.online) || 0;
      var d = Number(item.dineIn) || 0;
      var t = Number(item.takeaway) || 0;
      var rowTotal = o + d + t;
      var dom = getDominantChannel(item);

      return [
        '<tr>',
        '  <td>',
        '    <div style="font-weight:700;">' + item.date + '</div>',
        '    <div style="font-size:0.76rem;color:var(--rev-text-muted);">' + (item.note || item.fullDate || '') + '</div>',
        '  </td>',
        '  <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.online.color + ';font-weight:700;">' + formatMillion(o, 1) + ' tr</td>',
        '  <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.dineIn.color + ';font-weight:700;">' + formatMillion(d, 1) + ' tr</td>',
        '  <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.takeaway.color + ';font-weight:700;">' + formatMillion(t, 1) + ' tr</td>',
        '  <td class="rev-num-col" style="font-weight:800;">' + formatMillion(rowTotal, 1) + ' tr</td>',
        '  <td>',
        '    <span class="rev-channel-badge" style="background:' + dom.cfg.colorLight + ';color:' + dom.cfg.color + ';border:1px solid ' + dom.cfg.colorBorder + ';">',
        '      <span style="width:7px;height:7px;border-radius:50%;background:' + dom.cfg.color + ';display:inline-block;"></span>',
        '      ' + dom.cfg.label + ' (' + dom.pct + '%)',
        '    </span>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('');

    container.innerHTML = [
      '<div class="rev-container">',
      '  <!-- 1. Header Bar -->',
      '  <div class="rev-header-card mg-card">',
      '    <div class="rev-header-title-group">',
      '      <h2>',
      '        <span>Quản lý Doanh thu — Nhà hàng Mộc Giang</span>',
      '        <span class="rev-header-badge">199 Hoàng Cầu · Đống Đa</span>',
      '      </h2>',
      '      <p class="rev-header-subtitle">Thống kê doanh thu theo 3 kênh: <strong>Bán online</strong> · <strong>Bán tại chỗ</strong> · <strong>Bán mang về</strong> (Đơn vị: Triệu VNĐ)</p>',
      '    </div>',
      '    <div class="rev-period-switcher" role="tablist" aria-label="Bộ lọc thời gian doanh thu">',
      '      <button type="button" class="rev-period-btn ' + (currentState.period === '7days' ? 'active' : '') + '" data-period="7days">7 ngày qua</button>',
      '      <button type="button" class="rev-period-btn ' + (currentState.period === 'weekly' ? 'active' : '') + '" data-period="weekly">Theo tuần (Tháng 11/2026)</button>',
      '      <button type="button" class="rev-period-btn ' + (currentState.period === 'monthly' ? 'active' : '') + '" data-period="monthly">Theo tháng</button>',
      '    </div>',
      '  </div>',

      '  <!-- 2. 4 KPI Summary Cards -->',
      '  <div class="rev-kpi-grid">',
      '    <!-- KPI 1: Tổng doanh thu -->',
      '    <div class="rev-kpi-card mg-card" style="border-top: 4px solid #3D1F0D;">',
      '      <div class="rev-kpi-top">',
      '        <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:#3D1F0D;"></span>Tổng doanh thu</span>',
      '        <span class="rev-kpi-pct-pill" style="background:rgba(61,31,13,0.1);color:#3D1F0D;">100%</span>',
      '      </div>',
      '      <div class="rev-kpi-value-row">',
      '        <span class="rev-kpi-value">' + formatMillion(summary.total, 1) + '</span>',
      '        <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '      </div>',
      '      <div class="rev-kpi-foot">',
      '        <span style="color:#2E6B22;font-weight:700;">' + (dataset.growthText || '+14,2% kỳ trước') + '</span>',
      '        <span>' + summary.orders.toLocaleString('vi-VN') + ' đơn</span>',
      '      </div>',
      '      <div class="rev-kpi-bar-track">',
      '        <div class="rev-kpi-bar-fill" style="width:100%;background:linear-gradient(90deg, #2B7BBB 0%, #2E6B22 55%, #D97724 100%);"></div>',
      '      </div>',
      '    </div>',

      '    <!-- KPI 2: Bán tại chỗ (Dine-in) -->',
      '    <div class="rev-kpi-card mg-card ' + (hl === 'dineIn' ? 'is-highlighted' : '') + '" data-channel="dineIn" data-toggle-channel="dineIn" style="border-top: 4px solid ' + CHANNEL_CONFIG.dineIn.color + ';" title="Bấm để lọc riêng kênh Bán tại chỗ">',
      '      <div class="rev-kpi-top">',
      '        <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';"></span>' + CHANNEL_CONFIG.dineIn.fullLabel + '</span>',
      '        <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.dineIn.colorLight + ';color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.pctDineIn, 1) + '%</span>',
      '      </div>',
      '      <div class="rev-kpi-value-row">',
      '        <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.dineIn, 1) + '</span>',
      '        <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '      </div>',
      '      <div class="rev-kpi-foot">',
      '        <span>Tỷ trọng: <strong>' + formatMillion(summary.pctDineIn, 1) + '%</strong> tổng thu</span>',
      '        <span>Kênh chủ lực</span>',
      '      </div>',
      '      <div class="rev-kpi-bar-track">',
      '        <div class="rev-kpi-bar-fill" style="width:' + summary.pctDineIn + '%;background:' + CHANNEL_CONFIG.dineIn.color + ';"></div>',
      '      </div>',
      '    </div>',

      '    <!-- KPI 3: Bán online (App / Web) -->',
      '    <div class="rev-kpi-card mg-card ' + (hl === 'online' ? 'is-highlighted' : '') + '" data-channel="online" data-toggle-channel="online" style="border-top: 4px solid ' + CHANNEL_CONFIG.online.color + ';" title="Bấm để lọc riêng kênh Bán online">',
      '      <div class="rev-kpi-top">',
      '        <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';"></span>' + CHANNEL_CONFIG.online.fullLabel + '</span>',
      '        <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.online.colorLight + ';color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.pctOnline, 1) + '%</span>',
      '      </div>',
      '      <div class="rev-kpi-value-row">',
      '        <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.online, 1) + '</span>',
      '        <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '      </div>',
      '      <div class="rev-kpi-foot">',
      '        <span>Tỷ trọng: <strong>' + formatMillion(summary.pctOnline, 1) + '%</strong> tổng thu</span>',
      '        <span>App & Web</span>',
      '      </div>',
      '      <div class="rev-kpi-bar-track">',
      '        <div class="rev-kpi-bar-fill" style="width:' + summary.pctOnline + '%;background:' + CHANNEL_CONFIG.online.color + ';"></div>',
      '      </div>',
      '    </div>',

      '    <!-- KPI 4: Bán mang về (Takeaway) -->',
      '    <div class="rev-kpi-card mg-card ' + (hl === 'takeaway' ? 'is-highlighted' : '') + '" data-channel="takeaway" data-toggle-channel="takeaway" style="border-top: 4px solid ' + CHANNEL_CONFIG.takeaway.color + ';" title="Bấm để lọc riêng kênh Bán mang về">',
      '      <div class="rev-kpi-top">',
      '        <span class="rev-kpi-label"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';"></span>' + CHANNEL_CONFIG.takeaway.fullLabel + '</span>',
      '        <span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.takeaway.colorLight + ';color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.pctTakeaway, 1) + '%</span>',
      '      </div>',
      '      <div class="rev-kpi-value-row">',
      '        <span class="rev-kpi-value" style="color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.takeaway, 1) + '</span>',
      '        <span class="rev-kpi-unit">Triệu VNĐ</span>',
      '      </div>',
      '      <div class="rev-kpi-foot">',
      '        <span>Tỷ trọng: <strong>' + formatMillion(summary.pctTakeaway, 1) + '%</strong> tổng thu</span>',
      '        <span>Quầy takeaway</span>',
      '      </div>',
      '      <div class="rev-kpi-bar-track">',
      '        <div class="rev-kpi-bar-fill" style="width:' + summary.pctTakeaway + '%;background:' + CHANNEL_CONFIG.takeaway.color + ';"></div>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <!-- 3. Main 2-Column Chart Layout: Left Grouped Bar Chart + Right Pie Chart -->',
      '  <div class="chart-split-grid rev-chart-split">',
      '    <!-- Left Card: Biểu đồ cột nhóm 3 cột (Vertical Grouped Bar Chart) -->',
      '    <div class="rev-chart-card mg-card">',
      '      <div class="rev-card-head">',
      '        <div>',
      '          <h3>Biểu đồ cột nhóm Doanh thu theo 3 kênh (Vertical Grouped Bar Chart)</h3>',
      '          <p>Ba cột đứng cạnh nhau với 3 màu riêng biệt: <strong>Bán online</strong> · <strong>Bán tại chỗ</strong> · <strong>Bán mang về</strong></p>',
      '        </div>',
      '        <span class="rev-chart-unit-tag">Đơn vị: Triệu VNĐ</span>',
      '      </div>',
      '      <div class="rev-bar-chart-stage">',
      barChartSVG,
      '      </div>',
      '      <!-- Chú thích (Legend) chuẩn dưới biểu đồ cột nhóm -->',
      '      <div class="rev-bar-legend" aria-label="Chú thích 3 kênh doanh thu">',
      '        <div class="rev-legend-item ' + (hl === 'online' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="online" title="Bấm để làm nổi bật cột Bán online">',
      '          <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.online.color + ';"></span>',
      '          <span>Bán online (' + formatMillion(summary.online, 1) + ' tr)</span>',
      '        </div>',
      '        <div class="rev-legend-item ' + (hl === 'dineIn' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="dineIn" title="Bấm để làm nổi bật cột Bán tại chỗ">',
      '          <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.dineIn.color + ';"></span>',
      '          <span>Bán tại chỗ (' + formatMillion(summary.dineIn, 1) + ' tr)</span>',
      '        </div>',
      '        <div class="rev-legend-item ' + (hl === 'takeaway' ? 'is-active' : (hl ? 'is-dimmed' : '')) + '" data-toggle-channel="takeaway" title="Bấm để làm nổi bật cột Bán mang về">',
      '          <span class="rev-legend-swatch" style="background:' + CHANNEL_CONFIG.takeaway.color + ';"></span>',
      '          <span>Bán mang về (' + formatMillion(summary.takeaway, 1) + ' tr)</span>',
      '        </div>',
      (hl ? '<button type="button" class="rev-pie-mode-btn active" data-toggle-channel="' + hl + '" style="margin-left:6px;">✕ Bỏ lọc</button>' : ''),
      '      </div>',
      '    </div>',

      '    <!-- Right Card: Biểu đồ tròn (Pie Chart — Cơ cấu Doanh thu %) -->',
      '    <div class="rev-chart-card mg-card">',
      '      <div class="rev-card-head">',
      '        <div>',
      '          <h3>Biểu đồ tròn Cơ cấu Doanh thu (%)</h3>',
      '          <p>Tỷ lệ phần trăm đóng góp của từng kênh doanh thu</p>',
      '        </div>',
      '        <div class="rev-pie-mode-toggle" role="group" aria-label="Kiểu biểu đồ tròn">',
      '          <button type="button" class="rev-pie-mode-btn ' + (currentState.pieStyle === 'pie' ? 'active' : '') + '" data-piemode="pie">Biểu đồ tròn</button>',
      '          <button type="button" class="rev-pie-mode-btn ' + (currentState.pieStyle === 'donut' ? 'active' : '') + '" data-piemode="donut">Donut</button>',
      '        </div>',
      '      </div>',
      '      <div class="rev-pie-layout">',
      '        <div class="rev-pie-svg-wrap">',
      pieChartSVG,
      '        </div>',
      '        <table class="rev-pie-table" aria-label="Bảng tỷ trọng doanh thu theo kênh">',
      '          <thead>',
      '            <tr>',
      '              <th>Kênh doanh thu</th>',
      '              <th class="rev-num-col">Số tiền (Triệu VNĐ)</th>',
      '              <th class="rev-num-col">Tỷ trọng (%)</th>',
      '            </tr>',
      '          </thead>',
      '          <tbody>',
      '            <tr class="rev-pie-row ' + (hl === 'online' ? 'is-active' : '') + '" data-toggle-channel="online">',
      '              <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';margin-right:8px;"></span><strong>Bán online</strong></td>',
      '              <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.online, 1) + ' triệu</td>',
      '              <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.online.colorLight + ';color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.pctOnline, 1) + '%</span></td>',
      '            </tr>',
      '            <tr class="rev-pie-row ' + (hl === 'dineIn' ? 'is-active' : '') + '" data-toggle-channel="dineIn">',
      '              <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';margin-right:8px;"></span><strong>Bán tại chỗ</strong></td>',
      '              <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.dineIn, 1) + ' triệu</td>',
      '              <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.dineIn.colorLight + ';color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.pctDineIn, 1) + '%</span></td>',
      '            </tr>',
      '            <tr class="rev-pie-row ' + (hl === 'takeaway' ? 'is-active' : '') + '" data-toggle-channel="takeaway">',
      '              <td><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';margin-right:8px;"></span><strong>Bán mang về</strong></td>',
      '              <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.takeaway, 1) + ' triệu</td>',
      '              <td class="rev-num-col"><span class="rev-kpi-pct-pill" style="background:' + CHANNEL_CONFIG.takeaway.colorLight + ';color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.pctTakeaway, 1) + '%</span></td>',
      '            </tr>',
      '          </tbody>',
      '          <tfoot>',
      '            <tr>',
      '              <td>Tổng cộng</td>',
      '              <td class="rev-num-col">' + formatMillion(summary.total, 1) + ' triệu</td>',
      '              <td class="rev-num-col">100,0%</td>',
      '            </tr>',
      '          </tfoot>',
      '        </table>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <!-- 4. Bảng chi tiết doanh thu theo ngày / kỳ -->',
      '  <div class="rev-table-card mg-card">',
      '    <div class="rev-card-head">',
      '      <div>',
      '        <h3>Bảng chi tiết Doanh thu theo ngày & kênh bán hàng</h3>',
      '        <p>' + (dataset.periodNote || '') + ' · Trung bình <strong>' + formatMillion(summary.avgPerPoint, 1) + ' triệu VNĐ</strong> / mốc thời gian</p>',
      '      </div>',
      '      <span class="rev-chart-unit-tag">Tổng: ' + formatMillion(summary.total, 1) + ' Triệu VNĐ</span>',
      '    </div>',
      '    <div class="rev-table-wrap">',
      '      <table class="rev-detail-table">',
      '        <thead>',
      '          <tr>',
      '            <th>Ngày / Thời gian</th>',
      '            <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.online.color + ';margin-right:6px;"></span>Bán online (Triệu VNĐ)</th>',
      '            <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.dineIn.color + ';margin-right:6px;"></span>Bán tại chỗ (Triệu VNĐ)</th>',
      '            <th class="rev-num-col"><span class="rev-kpi-dot" style="background:' + CHANNEL_CONFIG.takeaway.color + ';margin-right:6px;"></span>Bán mang về (Triệu VNĐ)</th>',
      '            <th class="rev-num-col">Tổng cộng (Triệu VNĐ)</th>',
      '            <th>Kênh chủ đạo</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody>',
      detailRowsHtml,
      '        </tbody>',
      '        <tfoot>',
      '          <tr>',
      '            <td>TỔNG CỘNG (' + dataset.label + ')</td>',
      '            <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.online.color + ';">' + formatMillion(summary.online, 1) + ' tr (' + formatMillion(summary.pctOnline, 1) + '%)</td>',
      '            <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.dineIn.color + ';">' + formatMillion(summary.dineIn, 1) + ' tr (' + formatMillion(summary.pctDineIn, 1) + '%)</td>',
      '            <td class="rev-num-col" style="color:' + CHANNEL_CONFIG.takeaway.color + ';">' + formatMillion(summary.takeaway, 1) + ' tr (' + formatMillion(summary.pctTakeaway, 1) + '%)</td>',
      '            <td class="rev-num-col" style="font-size:0.96rem;">' + formatMillion(summary.total, 1) + ' Triệu VNĐ</td>',
      '            <td><strong>Bán tại chỗ (' + formatMillion(summary.pctDineIn, 1) + '%)</strong></td>',
      '          </tr>',
      '        </tfoot>',
      '      </table>',
      '    </div>',
      '  </div>',
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
