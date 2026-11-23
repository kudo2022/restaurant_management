/**
 * Mộc Giang Restaurant Management — Overview View (Tổng quan)
 * Populates #view-overview following the reference dashboard layout,
 * customized for Nhà hàng Mộc Giang (199 Hoàng Cầu, Đống Đa, Hà Nội).
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

      /* Welcome Hero Card (matches Screenshot 3 layout) */
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

      /* Calendar Badge */
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

      /* Center Greeting */
      .mg-ov-greeting-content {
        flex: 1;
        min-width: 0;
      }

      .mg-ov-date-line {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-muted, #6E5D4F);
        margin-bottom: 4px;
      }

      .mg-ov-greeting-title {
        font-size: 28px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        margin: 0 0 10px 0;
        line-height: 1.25;
        letter-spacing: -0.3px;
      }

      .mg-ov-greeting-summary {
        font-size: 15.5px;
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

      .mg-ov-greeting-summary .hl-red {
        color: #C93B2B;
        font-weight: 700;
      }

      .mg-ov-greeting-summary .hl-amber {
        color: #B85D14;
        font-weight: 700;
      }

      /* Right Action Buttons */
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

      /* Row of 4 Quick KPI Cards */
      .mg-ov-kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .mg-ov-kpi-card {
        background: var(--surface-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 14px;
        padding: 18px 20px;
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
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-muted, #6E5D4F);
      }

      .mg-ov-kpi-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        background: rgba(46, 107, 34, 0.1);
        color: var(--kpi-accent, #2E6B22);
      }

      .mg-ov-kpi-main {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .mg-ov-kpi-value {
        font-size: 24px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        letter-spacing: -0.4px;
      }

      .mg-ov-kpi-badge {
        font-size: 12px;
        font-weight: 700;
        padding: 3px 9px;
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
      }

      .mg-ov-kpi-link {
        font-weight: 600;
        color: var(--kpi-accent, #2E6B22);
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

      /* Toggle Switch for Donut Mode */
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

      /* Donut + 3-Row Legend Layout (matches Screenshot 3 "Công việc") */
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
        font-size: 27px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
        line-height: 1.15;
      }

      .mg-ov-donut-unit {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-muted, #7A6A5C);
        margin-top: 2px;
      }

      /* 3-Row Legend Table */
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
        border: 1px solid transparent;
        transition: all 0.15s ease;
      }

      .mg-ov-legend-row.highlighted {
        background: #FDF2EE;
        border-color: #F5D0C5;
      }

      .mg-ov-legend-row:hover {
        background: #F8F3E8;
        border-color: #E6DEC8;
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

      .mg-ov-legend-name {
        font-size: 14.5px;
        font-weight: 600;
        color: var(--text-primary, #2B180A);
      }

      .mg-ov-legend-row.highlighted .mg-ov-legend-name,
      .mg-ov-legend-row.highlighted .mg-ov-legend-val {
        color: #B83324;
      }

      .mg-ov-legend-right {
        display: flex;
        align-items: baseline;
        gap: 14px;
      }

      .mg-ov-legend-val {
        font-size: 18px;
        font-weight: 800;
        color: var(--text-primary, #24160D);
      }

      .mg-ov-legend-pct {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--text-muted, #7A6A5C);
        min-width: 38px;
        text-align: right;
      }

      /* Secondary Dual-Metric Strip inside Left Card */
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

      /* Right Card: Schedule List */
      .mg-ov-schedule-list {
        display: flex;
        flex-direction: column;
        gap: 11px;
      }

      .mg-ov-schedule-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
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
        min-width: 98px;
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
        color: var(--text-muted, #7A6A5C);
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
        font-size: 11.5px;
        font-weight: 700;
        padding: 3px 9px;
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

      .mg-ov-sch-tag.brown {
        background: #EFE7DC;
        color: #5C3114;
      }

      @media (max-width: 1100px) {
        .mg-ov-kpi-grid {
          grid-template-columns: repeat(2, 1fr);
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
        .mg-ov-kpi-grid {
          grid-template-columns: 1fr;
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

  function buildDonutSvg(items, centerValue, centerSub) {
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const gap = 4; // subtle white gap between arcs like Screenshot 3
    let accumulatedPercent = 0;

    const circlesHtml = items
      .map(function (item) {
        const pct = item.percent / 100;
        const arcLength = Math.max(0, pct * circumference - gap);
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
      '<svg class="mg-ov-donut-svg" viewBox="0 0 176 176" aria-label="Biểu đồ tổng quan Mộc Giang">' +
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
    return items
      .map(function (item) {
        return (
          '<div class="mg-ov-legend-row' +
          (item.highlight ? ' highlighted' : '') +
          '">' +
          '<div class="mg-ov-legend-left">' +
          '<span class="mg-ov-legend-dot" style="background:' +
          item.color +
          '"></span>' +
          '<span class="mg-ov-legend-name">' +
          item.shortLabel +
          '</span>' +
          '</div>' +
          '<div class="mg-ov-legend-right">' +
          '<span class="mg-ov-legend-val">' +
          item.displayValue +
          '</span>' +
          '<span class="mg-ov-legend-pct">' +
          item.percent +
          '%</span>' +
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

    const data = (window.MocGiangData && window.MocGiangData.overview) || {
      greetingDate: 'Thứ Hai, 23/11/2026',
      calendarBadge: { dayOfWeek: 'Thứ 2', dayNumber: '23', monthYear: '11/2026' },
      greetingTitle: 'Chào buổi tối, Quản trị Mộc Giang',
      kpis: [],
      donutModes: {
        finance: {
          centerValue: '486,5 tr',
          centerSub: 'Tổng quy mô',
          items: [
            { shortLabel: 'Doanh thu thuần', displayValue: '194,0 tr', percent: 40, color: '#2E6B22', highlight: false },
            { shortLabel: 'Chi phí biến động', displayValue: '174,5 tr', percent: 36, color: '#D97724', highlight: true },
            { shortLabel: 'Chi phí cố định', displayValue: '118,0 tr', percent: 24, color: '#3D1F0D', highlight: false }
          ]
        },
        orders: {
          centerValue: '1.420',
          centerSub: 'đơn tháng này',
          items: [
            { shortLabel: 'Đơn hoàn thành', displayValue: '1.362 đơn', percent: 96, color: '#2E6B22', highlight: false },
            { shortLabel: 'Đang phục vụ', displayValue: '18 đơn', percent: 1, color: '#C93B2B', highlight: true },
            { shortLabel: 'Đặt trước', displayValue: '40 đơn', percent: 3, color: '#2B7BBB', highlight: false }
          ]
        }
      },
      weeklySchedule: []
    };

    const activeDonut = data.donutModes[currentDonutMode] || data.donutModes.finance;
    const kpiIcons = ['₫', '🏛️', '🥬', '📈'];

    const kpisHtml = (data.kpis || [])
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
          '<span class="mg-ov-kpi-value">' +
          kpi.value +
          '</span>' +
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

    const scheduleHtml = (data.weeklySchedule || [])
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

    container.innerHTML =
      '<div class="mg-ov-wrapper">' +
      /* Top Welcome Card matching Screenshot 3 */
      '<section class="mg-ov-welcome-card">' +
      '<div class="mg-ov-welcome-left">' +
      '<div class="mg-ov-cal-badge" aria-label="Lịch ngày 23/11/2026">' +
      '<div class="mg-ov-cal-top">' +
      data.calendarBadge.dayOfWeek +
      '</div>' +
      '<div class="mg-ov-cal-day">' +
      data.calendarBadge.dayNumber +
      '</div>' +
      '<div class="mg-ov-cal-month">' +
      data.calendarBadge.monthYear +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-greeting-content">' +
      '<div class="mg-ov-date-line">' +
      data.greetingDate +
      '</div>' +
      '<h1 class="mg-ov-greeting-title">' +
      data.greetingTitle +
      '</h1>' +
      '<p class="mg-ov-greeting-summary">' +
      'Toàn nhà hàng đạt <span class="hl-green">486,5 triệu VNĐ</span> doanh thu tháng này với <span class="hl-dark">1.420 đơn hàng hoàn thành</span>. ' +
      'Hôm nay có <span class="hl-amber">3 đơn đặt tiệc bàn lớn</span> và <span class="hl-red">2 khoản chi phí cần duyệt</span>.' +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-welcome-actions">' +
      '<button type="button" class="mg-ov-btn-primary" id="btn-ov-go-revenue">Xem doanh thu</button>' +
      '<button type="button" class="mg-ov-btn-secondary" id="btn-ov-go-expenses">Xem chi phí</button>' +
      '</div>' +
      '</section>' +
      /* Row of 4 Quick KPI Cards */
      '<section class="mg-ov-kpi-grid" aria-label="Chỉ số tài chính nhanh">' +
      kpisHtml +
      '</section>' +
      /* Bottom 2-Column Grid matching Screenshot 3 */
      '<section class="mg-ov-bottom-grid">' +
      /* Left Card: Financial & Orders Donut Summary */
      '<div class="mg-ov-panel">' +
      '<div class="mg-ov-panel-header">' +
      '<div>' +
      '<h2 class="mg-ov-panel-title">Tổng quan Tài chính & Đơn hàng · Toàn nhà hàng</h2>' +
      '<p class="mg-ov-panel-subtitle">Nhà hàng Mộc Giang · 199 Hoàng Cầu, Đống Đa, Hà Nội</p>' +
      '</div>' +
      '<div class="mg-ov-mode-toggle" role="tablist" aria-label="Chuyển chế độ biểu đồ">' +
      '<button type="button" class="mg-ov-mode-btn ' +
      (currentDonutMode === 'finance' ? 'active' : '') +
      '" data-donut-mode="finance">Tài chính (486,5 tr)</button>' +
      '<button type="button" class="mg-ov-mode-btn ' +
      (currentDonutMode === 'orders' ? 'active' : '') +
      '" data-donut-mode="orders">Đơn hàng (1.420 đơn)</button>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-donut-layout" id="mg-ov-donut-container">' +
      buildDonutSvg(activeDonut.items, activeDonut.centerValue, activeDonut.centerSub) +
      '<div class="mg-ov-legend-table">' +
      buildLegendRows(activeDonut.items) +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-secondary-strip">' +
      '<span>Trạng thái đơn hàng hôm nay:</span>' +
      '<div class="mg-ov-pill-group">' +
      '<span class="mg-ov-mini-pill">Đơn hoàn thành: 1.362 (96%)</span>' +
      '<span class="mg-ov-mini-pill">Đang phục vụ: 18 (1%)</span>' +
      '<span class="mg-ov-mini-pill">Đặt trước: 40 (3%)</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      /* Right Card: Weekly Operations & Party Booking Schedule */
      '<div class="mg-ov-panel">' +
      '<div class="mg-ov-panel-header">' +
      '<div>' +
      '<h2 class="mg-ov-panel-title">Lịch vận hành & Đặt tiệc tuần này · Tuần 48 (23–29/11/2026)</h2>' +
      '<p class="mg-ov-panel-subtitle">Lịch ca trực bếp, kiểm kê nguyên liệu & tiệc đặt trước tại 199 Hoàng Cầu</p>' +
      '</div>' +
      '</div>' +
      '<div class="mg-ov-schedule-list">' +
      scheduleHtml +
      '</div>' +
      '</div>' +
      '</section>' +
      '</div>';

    // Bind events
    const btnRev = document.getElementById('btn-ov-go-revenue');
    if (btnRev) {
      btnRev.addEventListener('click', function () {
        navigateToView('view-revenue');
      });
    }

    const btnExp = document.getElementById('btn-ov-go-expenses');
    if (btnExp) {
      btnExp.addEventListener('click', function () {
        navigateToView('view-expenses-fixed');
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
