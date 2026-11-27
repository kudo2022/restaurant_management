/**
 * Mộc Giang Restaurant Management — Overview View (Tổng quan)
 * 100% Real Data from POS Dataset (156 invoices: 13 480 000 VNĐ) & Google Sheet Expenses (9 164 000 VNĐ).
 * Displays ONLY 3 core metrics on Overview: Doanh thu · Chi phí · Lợi nhuận (no fixed/variable split on Overview).
 */
(function () {
  'use strict';

  let currentDonutMode = 'finance';

  function injectOverviewStyles() {
    if (document.getElementById('mg-overview-styles')) return;
    const style = document.createElement('style');
    style.id = 'mg-overview-styles';
    style.textContent = `
      .mg-ov-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 4px 0 24px 0;
        color: var(--text-primary, #24160D);
      }

      /* Welcome Hero Card */
      .mg-ov-welcome-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        background: var(--card-bg, #F8F5EE);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 16px;
        padding: 26px 30px;
        box-shadow: 0 2px 10px rgba(61, 31, 13, 0.04);
      }

      .mg-ov-welcome-left {
        display: flex;
        align-items: center;
        gap: 24px;
        flex: 1;
        min-width: 0;
      }

      .mg-ov-cal-badge {
        width: 88px;
        min-width: 88px;
        border-radius: 14px;
        overflow: hidden;
        background: #3D1F0D;
        color: #FFFFFF;
        text-align: center;
        box-shadow: 0 6px 16px rgba(61, 31, 13, 0.22);
        border: 1px solid rgba(255, 255, 255, 0.08);
        user-select: none;
      }

      .mg-ov-cal-top {
        background: #2E6B22;
        color: #FFFFFF;
        font-size: 13px;
        font-weight: 600;
        padding: 6px 8px;
        letter-spacing: 0.2px;
      }

      .mg-ov-cal-day {
        font-size: 34px;
        font-weight: 800;
        line-height: 1.1;
        padding: 8px 0 2px 0;
        color: #FFFFFF;
      }

      .mg-ov-cal-month {
        font-size: 12.5px;
        font-weight: 700;
        color: #EAB354;
        padding: 0 0 9px 0;
        letter-spacing: 0.3px;
      }

      .mg-ov-greeting-content {
        flex: 1;
        min-width: 0;
      }

      .mg-ov-date-line {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-muted, #6E5D4F);
        margin-bottom: 4px;
      }

      .mg-ov-greeting-title {
        font-size: 27px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        margin: 0 0 10px 0;
        line-height: 1.25;
        letter-spacing: -0.3px;
      }

      .mg-ov-greeting-summary {
        font-size: 15px;
        line-height: 1.6;
        color: var(--text-secondary, #4B3B2F);
        margin: 0;
      }

      .mg-ov-greeting-summary .hl-green {
        color: #2E6B22;
        font-weight: 700;
      }

      .mg-ov-greeting-summary .hl-dark {
        color: var(--text-primary, #24160D);
        font-weight: 700;
      }

      .mg-ov-greeting-summary .hl-blue {
        color: #2B7BBB;
        font-weight: 700;
      }

      .mg-ov-greeting-summary .hl-amber {
        color: #C25E14;
        font-weight: 700;
      }

      .mg-ov-welcome-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 176px;
      }

      .mg-ov-btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 11px 20px;
        border-radius: 10px;
        border: none;
        background: #2E6B22;
        color: #FFFFFF;
        font-size: 14.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
        box-shadow: 0 3px 10px rgba(46, 107, 34, 0.25);
      }

      .mg-ov-btn-primary:hover {
        background: #235519;
        transform: translateY(-1px);
      }

      .mg-ov-btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 11px 20px;
        border-radius: 10px;
        border: 1px solid var(--border-color, #D8CEB8);
        background: var(--surface-bg, #FFFFFF);
        color: var(--text-primary, #2B180A);
        font-size: 14.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
      }

      .mg-ov-btn-secondary:hover {
        border-color: #3D1F0D;
        background: #F4EDE0;
      }

      /* 3-Column KPI Grid: Doanh thu · Chi phí · Lợi nhuận */
      .mg-ov-kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .mg-ov-kpi-card {
        background: var(--surface-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 14px;
        padding: 20px 22px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
      }

      .mg-ov-kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--kpi-accent, #2E6B22);
      }

      .mg-ov-kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(61, 31, 13, 0.08);
        border-color: var(--kpi-accent, #2E6B22);
      }

      .mg-ov-kpi-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .mg-ov-kpi-label {
        font-size: 14.5px;
        font-weight: 700;
        color: var(--text-muted, #5C4938);
      }

      .mg-ov-kpi-icon {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        background: rgba(46, 107, 34, 0.1);
        color: var(--kpi-accent, #2E6B22);
      }

      .mg-ov-kpi-main {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .mg-ov-kpi-value-wrap {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .mg-ov-kpi-value {
        font-size: 26px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        letter-spacing: -0.4px;
      }

      .mg-ov-kpi-vnd {
        font-size: 13px;
        font-weight: 700;
        color: var(--kpi-accent, #2E6B22);
      }

      .mg-ov-kpi-badge {
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 999px;
      }

      .mg-ov-kpi-badge.positive {
        background: #EAF4E7;
        color: #2E6B22;
      }

      .mg-ov-kpi-badge.neutral {
        background: #F3ECE1;
        color: #5C3114;
      }

      .mg-ov-kpi-badge.warning {
        background: #FDF0E4;
        color: #C25E14;
      }

      .mg-ov-kpi-sub {
        font-size: 12.5px;
        color: var(--text-muted, #7A6A5C);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding-top: 6px;
        border-top: 1px dashed var(--border-color, #EFE8D8);
      }

      .mg-ov-kpi-link {
        font-weight: 700;
        color: var(--kpi-accent, #2E6B22);
        white-space: nowrap;
      }

      /* Bottom 2-Column Grid */
      .mg-ov-bottom-grid {
        display: grid;
        grid-template-columns: 1.08fr 1fr;
        gap: 20px;
      }

      .mg-ov-panel {
        background: var(--surface-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 16px;
        padding: 24px 26px;
        box-shadow: 0 2px 10px rgba(61, 31, 13, 0.03);
        display: flex;
        flex-direction: column;
      }

      .mg-ov-panel-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border-color, #EFE8D8);
        flex-wrap: wrap;
      }

      .mg-ov-panel-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary, #24160D);
        margin: 0 0 4px 0;
      }

      .mg-ov-panel-subtitle {
        font-size: 13.5px;
        color: var(--text-muted, #7A6A5C);
        margin: 0;
      }

      .mg-ov-mode-toggle {
        display: inline-flex;
        background: var(--card-bg, #F4EDE0);
        padding: 3px;
        border-radius: 9px;
        border: 1px solid var(--border-color, #E6DEC8);
      }

      .mg-ov-mode-btn {
        border: none;
        background: transparent;
        color: var(--text-secondary, #5C4938);
        font-size: 12.5px;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .mg-ov-mode-btn.active {
        background: #3D1F0D;
        color: #FFFFFF;
        box-shadow: 0 1px 4px rgba(61, 31, 13, 0.2);
      }

      .mg-ov-donut-layout {
        display: flex;
        align-items: center;
        gap: 28px;
        margin: 6px 0 18px 0;
      }

      .mg-ov-donut-box {
        position: relative;
        width: 176px;
        height: 176px;
        min-width: 176px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mg-ov-donut-svg {
        width: 176px;
        height: 176px;
        transform: rotate(-90deg);
      }

      .mg-ov-donut-segment {
        transition: stroke-dasharray 0.4s ease, stroke-width 0.2s ease;
        cursor: pointer;
      }

      .mg-ov-donut-segment:hover {
        stroke-width: 22;
      }

      .mg-ov-donut-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        pointer-events: none;
      }

      .mg-ov-donut-total {
        font-size: 24px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        line-height: 1.15;
      }

      .mg-ov-donut-unit {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted, #7A6A5C);
        margin-top: 3px;
      }

      /* 3-Row Legend Table: Doanh thu · Chi phí · Lợi nhuận */
      .mg-ov-legend-table {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mg-ov-legend-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px;
        border-radius: 10px;
        background: var(--surface-bg, #FFFFFF);
        border: 1px solid var(--border-color, #EFE8D8);
        transition: all 0.15s ease;
      }

      .mg-ov-legend-row.highlighted {
        background: #FDF5EC;
        border-color: #F3D5B5;
      }

      .mg-ov-legend-row:hover {
        background: #F8F3E8;
        border-color: #D8CEB8;
      }

      .mg-ov-legend-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .mg-ov-legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .mg-ov-legend-name-wrap {
        display: flex;
        flex-direction: column;
      }

      .mg-ov-legend-name {
        font-size: 14.5px;
        font-weight: 700;
        color: var(--text-primary, #2B180A);
      }

      .mg-ov-legend-sub {
        font-size: 11.5px;
        color: var(--text-muted, #7A6A5C);
      }

      .mg-ov-legend-right {
        display: flex;
        align-items: baseline;
        gap: 12px;
      }

      .mg-ov-legend-val {
        font-size: 17px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
      }

      .mg-ov-legend-pct {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted, #7A6A5C);
        min-width: 44px;
        text-align: right;
      }

      .mg-ov-secondary-strip {
        margin-top: auto;
        padding-top: 14px;
        border-top: 1px dashed var(--border-color, #E6DEC8);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        font-size: 12.5px;
        color: var(--text-muted, #6E5D4F);
      }

      .mg-ov-pill-group {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .mg-ov-mini-pill {
        background: #F4EDE0;
        color: #3D1F0D;
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 12px;
      }

      .mg-ov-schedule-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mg-ov-schedule-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 11px 14px;
        border-radius: 12px;
        background: var(--card-bg, #FBF8F1);
        border: 1px solid var(--border-color, #EBE3D1);
        transition: all 0.15s ease;
      }

      .mg-ov-schedule-item:hover {
        border-color: #C8B99E;
        background: #F5EFE2;
      }

      .mg-ov-sch-timebox {
        min-width: 96px;
        padding-right: 10px;
        border-right: 2px solid #D9CBB3;
      }

      .mg-ov-sch-day {
        font-size: 12.5px;
        font-weight: 700;
        color: #3D1F0D;
      }

      .mg-ov-sch-hours {
        font-size: 11.5px;
        font-weight: 600;
        color: #2E6B22;
        margin-top: 2px;
      }

      .mg-ov-sch-body {
        flex: 1;
        min-width: 0;
      }

      .mg-ov-sch-title {
        font-size: 13.5px;
        font-weight: 700;
        color: var(--text-primary, #24160D);
        margin: 0 0 3px 0;
        line-height: 1.35;
      }

      .mg-ov-sch-loc {
        font-size: 12px;
        color: var(--text-muted, #7A6A5C);
      }

      .mg-ov-sch-tag {
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 999px;
        white-space: nowrap;
      }

      .mg-ov-sch-tag.green {
        background: #EAF4E7;
        color: #2E6B22;
      }

      .mg-ov-sch-tag.amber {
        background: #FDF0E4;
        color: #C25E14;
      }

      .mg-ov-sch-tag.blue {
        background: #E8F2FA;
        color: #2B7BBB;
      }

      @media (max-width: 1100px) {
        .mg-ov-kpi-grid {
          grid-template-columns: 1fr;
        }
        .mg-ov-bottom-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .mg-ov-welcome-card {
          flex-direction: column;
          align-items: stretch;
        }
        .mg-ov-welcome-left {
          flex-direction: column;
          align-items: flex-start;
        }
        .mg-ov-donut-layout {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function navigateToView(viewId) {
    if (typeof window.switchView === 'function') {
      window.switchView(viewId);
      return;
    }
    const allViews = document.querySelectorAll('.app-view');
    allViews.forEach(function (v) {
      v.classList.toggle('active', v.id === viewId);
    });
    const navTarget = document.querySelector('[data-target="' + viewId + '"]');
    if (navTarget) navTarget.click();
  }

  function buildDonutSvg(arcs, centerValue, centerSub) {
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const gap = 3.5;
    let accumulatedPercent = 0;

    const circlesHtml = (arcs || [])
      .map(function (item) {
        const pct = Math.max(0, Number(item.percent) || 0) / 100;
        const arcLength = Math.max(0, pct * circumference - (pct > 0.02 ? gap : 0));
        const dashArray = arcLength.toFixed(2) + ' ' + (circumference - arcLength).toFixed(2);
        const dashOffset = (-accumulatedPercent * circumference).toFixed(2);
        accumulatedPercent += pct;

        return (
          '<circle class="mg-ov-donut-segment" cx="88" cy="88" r="' +
          radius +
          '" fill="transparent" stroke="' +
          item.color +
          '" stroke-width="19" stroke-dasharray="' +
          dashArray +
          '" stroke-dashoffset="' +
          dashOffset +
          '" stroke-linecap="butt">' +
          '<title>' +
          item.shortLabel +
          ': ' +
          item.displayValue +
          ' (' +
          item.percent +
          '%)</title></circle>'
        );
      })
      .join('');

    return (
      '<div class="mg-ov-donut-box">' +
      '<svg class="mg-ov-donut-svg" viewBox="0 0 176 176" aria-label="Biểu đồ tổng quan thực tế Mộc Giang">' +
      '<circle cx="88" cy="88" r="' +
      radius +
      '" fill="transparent" stroke="#EFE8D8" stroke-width="19"></circle>' +
      circlesHtml +
      '</svg>' +
      '<div class="mg-ov-donut-center">' +
      '<div class="mg-ov-donut-total">' +
      centerValue +
      '</div>' +
      '<div class="mg-ov-donut-unit">' +
      centerSub +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function buildLegendRows(items) {
    return (items || [])
      .map(function (item) {
        return (
          '<div class="mg-ov-legend-row' +
          (item.highlight ? ' highlighted' : '') +
          '">' +
          '<div class="mg-ov-legend-left">' +
          '<span class="mg-ov-legend-dot" style="background:' +
          item.color +
          '"></span>' +
          '<div class="mg-ov-legend-name-wrap">' +
          '<span class="mg-ov-legend-name">' +
          item.shortLabel +
          '</span>' +
          (item.displayVnd
            ? '<span class="mg-ov-legend-sub">' + item.displayVnd + '</span>'
            : '') +
          '</div>' +
          '</div>' +
          '<div class="mg-ov-legend-right">' +
          '<span class="mg-ov-legend-val">' +
          item.displayValue +
          '</span>' +
          '<span class="mg-ov-legend-pct">' +
          (item.percentText || (item.percent + '%')) +
          '</span>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderOverview() {
    injectOverviewStyles();
    const container = document.getElementById('view-overview');
    if (!container) return;

    if (window.MocGiangData && typeof window.MocGiangData.recalculateOverview === 'function') {
      try { window.MocGiangData.recalculateOverview(); } catch (e) {}
    }

    const mg = window.MocGiangData || {};
    const summary = mg.summary || {
      totalRevenue: 13.48,
      totalRevenueVnd: 13480000,
      formattedRevenueVnd: '13 480 000',
      totalExpenses: 9.164,
      totalExpensesVnd: 9164000,
      formattedExpensesVnd: '9 164 000',
      expenseRatioPercent: 68.0,
      estimatedProfit: 4.316,
      estimatedProfitVnd: 4316000,
      formattedProfitVnd: '4 316 000',
      profitMarginPercent: 32.0,
      completedOrders: 156,
      totalItemsSold: 409,
      expenseEntryCount: 16
    };

    const data = mg.overview || {};
    const calendarBadge = data.calendarBadge || { dayOfWeek: 'Thứ 3', dayNumber: '24', monthYear: '11/2026' };
    const greetingDate = data.greetingDate || 'Dữ liệu thực tế POS & Google Sheet · 17/11 – 24/11/2026';
    const greetingTitle = data.greetingTitle || 'Chào buổi tối, Quản trị Mộc Giang';

    const revTrieuText = Number(summary.totalRevenue || 13.48).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    const expTrieuText = Number(summary.totalExpenses || 9.164).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    const profTrieuText = Number(summary.estimatedProfit || 4.316).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    const marginText = Number(summary.profitMarginPercent || 32.0).toFixed(1).replace('.', ',');

    // ONLY 3 KPI Cards: Doanh thu, Chi phí, Lợi nhuận
    const kpis = (data.kpis && data.kpis.length === 3) ? data.kpis : [
      {
        id: 'kpi-revenue',
        label: 'Doanh thu',
        value: revTrieuText + ' tr',
        vndText: (summary.formattedRevenueVnd || '13 480 000') + ' VNĐ',
        badge: (summary.completedOrders || 156) + ' hóa đơn · ' + (summary.totalItemsSold || 409) + ' món',
        badgeType: 'positive',
        subtext: 'Tại chỗ 36,4% · Online 33,9% · Mang về 29,7%',
        targetView: 'view-revenue',
        accentColor: '#2E6B22'
      },
      {
        id: 'kpi-expenses',
        label: 'Chi phí',
        value: expTrieuText + ' tr',
        vndText: (summary.formattedExpensesVnd || '9 164 000') + ' VNĐ',
        badge: Number(summary.expenseRatioPercent || 68.0).toFixed(1).replace('.', ',') + '% doanh thu',
        badgeType: 'warning',
        subtext: (summary.expenseEntryCount || 16) + ' khoản chi thực tế từ Google Sheet',
        targetView: 'view-expenses',
        accentColor: '#D97724'
      },
      {
        id: 'kpi-profit',
        label: 'Lợi nhuận',
        value: profTrieuText + ' tr',
        vndText: (summary.formattedProfitVnd || '4 316 000') + ' VNĐ',
        badge: marginText + '% biên LN',
        badgeType: 'positive',
        subtext: 'Doanh thu (' + revTrieuText + ' tr) − Chi phí (' + expTrieuText + ' tr)',
        targetView: 'view-revenue',
        accentColor: '#2B7BBB'
      }
    ];

    const donutModes = data.donutModes || {};
    const activeDonut = donutModes[currentDonutMode] || donutModes.finance || {
      centerValue: revTrieuText + ' tr',
      centerSub: (summary.formattedRevenueVnd || '13 480 000') + ' VNĐ',
      donutArcs: [
        { shortLabel: 'Chi phí', displayValue: expTrieuText + ' tr', percent: 68, color: '#D97724' },
        { shortLabel: 'Lợi nhuận', displayValue: profTrieuText + ' tr', percent: 32, color: '#2B7BBB' }
      ],
      items: [
        { shortLabel: 'Doanh thu', displayValue: revTrieuText + ' tr', displayVnd: (summary.formattedRevenueVnd || '13 480 000') + ' VNĐ', percent: 100, percentText: '100%', color: '#2E6B22', highlight: false },
        { shortLabel: 'Chi phí', displayValue: expTrieuText + ' tr', displayVnd: (summary.formattedExpensesVnd || '9 164 000') + ' VNĐ', percent: 68, percentText: '68,0%', color: '#D97724', highlight: true },
        { shortLabel: 'Lợi nhuận', displayValue: profTrieuText + ' tr', displayVnd: (summary.formattedProfitVnd || '4 316 000') + ' VNĐ', percent: 32, percentText: '32,0%', color: '#2B7BBB', highlight: false }
      ]
    };

    const kpiIcons = ['₫', '🧾', '📈'];
    const kpisHtml = kpis
      .map(function (kpi, idx) {
        return (
          '<div class="mg-ov-kpi-card" style="--kpi-accent:' +
          kpi.accentColor +
          '" data-nav-target="' +
          kpi.targetView +
          '" role="button" tabindex="0">' +
          '<div class="mg-ov-kpi-header">' +
          '<span class="mg-ov-kpi-label">' +
          kpi.label +
          '</span>' +
          '<span class="mg-ov-kpi-icon">' +
          (kpiIcons[idx] || '•') +
          '</span>' +
          '</div>' +
          '<div class="mg-ov-kpi-main">' +
          '<div class="mg-ov-kpi-value-wrap">' +
          '<span class="mg-ov-kpi-value">' +
          kpi.value +
          '</span>' +
          (kpi.vndText ? '<span class="mg-ov-kpi-vnd">' + kpi.vndText + '</span>' : '') +
          '</div>' +
          '<span class="mg-ov-kpi-badge ' +
          kpi.badgeType +
          '">' +
          kpi.badge +
          '</span>' +
          '</div>' +
          '<div class="mg-ov-kpi-sub">' +
          '<span>' +
          kpi.subtext +
          '</span>' +
          '<span class="mg-ov-kpi-link">Chi tiết →</span>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    const recentInvoices = data.recentInvoices || data.weeklySchedule || [];
    const scheduleHtml = recentInvoices
      .map(function (item) {
        return (
          '<div class="mg-ov-schedule-item">' +
          '<div class="mg-ov-sch-timebox">' +
          '<div class="mg-ov-sch-day">' +
          item.day +
          '</div>' +
          '<div class="mg-ov-sch-hours">' +
          item.time +
          '</div>' +
          '</div>' +
          '<div class="mg-ov-sch-body">' +
          '<div class="mg-ov-sch-title">' +
          item.title +
          '</div>' +
          '<div class="mg-ov-sch-loc">📍 ' +
          item.location +
          ' · <strong>' +
          item.status +
          '</strong></div>' +
          '</div>' +
          '<span class="mg-ov-sch-tag ' +
          item.tagColor +
          '">' +
          item.tag +
          '</span>' +
          '</div>'
        );
      })
      .join('');

    const topDishes = (data.topDishes && data.topDishes.length > 0)
      ? data.topDishes.slice(0, 3)
      : [
          { name: 'Bánh Bao Bò Ngô', formattedVnd: '720 000', quantity: 40 },
          { name: 'Cơm Bò sốt vang', formattedVnd: '649 000', quantity: 11 },
          { name: 'Bánh Bao Xúc Xích', formattedVnd: '594 000', quantity: 33 }
        ];

    const topDishesPillsHtml = topDishes
      .map(function (d, i) {
        return (
          '<span class="mg-ov-mini-pill">#' +
          (i + 1) +
          ' ' +
          d.name +
          ': ' +
          d.formattedVnd +
          ' VNĐ (' +
          d.quantity +
          ')</span>'
        );
      })
      .join('');

    container.innerHTML =
      '<div class="mg-ov-wrapper">' +
      /* Top Welcome Card with 100% Real Data */
      '<section class="mg-ov-welcome-card">' +
      '<div class="mg-ov-welcome-left">' +
      '<div class="mg-ov-cal-badge" aria-label="Lịch ngày 24/11/2026">' +
      '<div class="mg-ov-cal-top">' +
      calendarBadge.dayOfWeek +
      '</div>' +
      '<div class="mg-ov-cal-day">' +
      calendarBadge.dayNumber +
      '</div>' +
      '<div class="mg-ov-cal-month">' +
      calendarBadge.monthYear +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-greeting-content">' +
      '<div class="mg-ov-date-line">' +
      greetingDate +
      '</div>' +
      '<h1 class="mg-ov-greeting-title">' +
      greetingTitle +
      '</h1>' +
      '<p class="mg-ov-greeting-summary">' +
      'Toàn nhà hàng ghi nhận <span class="hl-green">' +
      (summary.formattedRevenueVnd || '13 480 000') +
      ' VNĐ (' +
      revTrieuText +
      ' triệu VNĐ)</span> doanh thu thực tế từ <span class="hl-dark">' +
      (summary.completedOrders || 156) +
      ' hóa đơn POS</span> (' +
      (summary.totalItemsSold || 409) +
      ' món bán ra), tổng chi phí thực tế <span class="hl-amber">' +
      (summary.formattedExpensesVnd || '9 164 000') +
      ' VNĐ (' +
      expTrieuText +
      ' triệu VNĐ)</span> và lợi nhuận thực tế <span class="hl-blue">' +
      (summary.formattedProfitVnd || '4 316 000') +
      ' VNĐ (' +
      profTrieuText +
      ' triệu VNĐ · ' +
      marginText +
      '%)</span>.' +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-welcome-actions">' +
      '<button type="button" class="mg-ov-btn-primary" id="btn-ov-go-revenue">Xem doanh thu</button>' +
      '<button type="button" class="mg-ov-btn-secondary" id="btn-ov-go-expenses">Xem chi phí</button>' +
      '</div>' +
      '</section>' +
      /* Row of ONLY 3 KPI Cards: Doanh thu · Chi phí · Lợi nhuận */
      '<section class="mg-ov-kpi-grid kpi-grid-3 overview-kpi-grid" aria-label="3 chỉ số cốt lõi: Doanh thu, Chi phí, Lợi nhuận">' +
      kpisHtml +
      '</section>' +
      /* Bottom 2-Column Grid */
      '<section class="mg-ov-bottom-grid">' +
      /* Left Card: Doanh thu · Chi phí · Lợi nhuận */
      '<div class="mg-ov-panel">' +
      '<div class="mg-ov-panel-header">' +
      '<div>' +
      '<h2 class="mg-ov-panel-title">Tổng quan Doanh thu · Chi phí · Lợi nhuận</h2>' +
      '<p class="mg-ov-panel-subtitle">Dữ liệu thực tế từ 156 hóa đơn POS & Google Sheet Mộc Giang</p>' +
      '</div>' +
      '<div class="mg-ov-mode-toggle" role="tablist" aria-label="Chuyển chế độ biểu đồ">' +
      '<button type="button" class="mg-ov-mode-btn ' +
      (currentDonutMode === 'finance' ? 'active' : '') +
      '" data-donut-mode="finance">Tài chính (' +
      revTrieuText +
      ' tr)</button>' +
      '<button type="button" class="mg-ov-mode-btn ' +
      (currentDonutMode === 'orders' ? 'active' : '') +
      '" data-donut-mode="orders">Hóa đơn POS (' +
      (summary.completedOrders || 156) +
      ' đơn)</button>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-donut-layout" id="mg-ov-donut-container">' +
      buildDonutSvg(activeDonut.donutArcs || activeDonut.items, activeDonut.centerValue, activeDonut.centerSub) +
      '<div class="mg-ov-legend-table">' +
      buildLegendRows(activeDonut.items) +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-secondary-strip">' +
      '<span>Top món bán chạy nhất (POS thực tế):</span>' +
      '<div class="mg-ov-pill-group">' +
      topDishesPillsHtml +
      '</div>' +
      '</div>' +
      '</div>' +
      /* Right Card: Recent Real POS Invoices */
      '<div class="mg-ov-panel">' +
      '<div class="mg-ov-panel-header">' +
      '<div>' +
      '<h2 class="mg-ov-panel-title">Giao dịch & Hóa đơn POS thực tế gần nhất · 17/11 – 24/11/2026</h2>' +
      '<p class="mg-ov-panel-subtitle">Trích xuất trực tiếp từ 156 hóa đơn bán hàng tại 199 Hoàng Cầu</p>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-schedule-list">' +
      scheduleHtml +
      '</div>' +
      '</div>' +
      '</section>' +
      '</div>';

    // Bind navigation & toggle events
    const btnRev = document.getElementById('btn-ov-go-revenue');
    if (btnRev) {
      btnRev.addEventListener('click', function () {
        navigateToView('view-revenue');
      });
    }

    const btnExp = document.getElementById('btn-ov-go-expenses');
    if (btnExp) {
      btnExp.addEventListener('click', function () {
        navigateToView('view-expenses');
      });
    }

    const kpiCards = container.querySelectorAll('.mg-ov-kpi-card');
    kpiCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const target = card.getAttribute('data-nav-target');
        if (target) navigateToView(target);
      });
    });

    const modeButtons = container.querySelectorAll('[data-donut-mode]');
    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const mode = btn.getAttribute('data-donut-mode');
        if (mode && mode !== currentDonutMode) {
          currentDonutMode = mode;
          renderOverview();
        }
      });
    });
  }

  window.renderOverview = renderOverview;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderOverview);
  } else {
    renderOverview();
  }
})();
