/**
 * MỘC GIANG RESTAURANT MANAGEMENT — UNIFIED EXPENSES MODULE (CHI PHÍ)
 * Cơ sở: 199 Hoàng Cầu, Đống Đa, Hà Nội | Hotline: 096 3689077
 *
 * Exposes:
 *   - window.renderExpenses() -> renders into #view-expenses
 *   - window.renderFixedExpenses / window.renderVariableExpenses (aliases -> renderExpenses)
 *   - window.openExpenseFormModal()
 *   - window.openGoogleConfigModal()
 *   - window.openReceiptLightbox(entryId)
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. CANONICAL 9 EXPENSE CATEGORIES (EXACT ORDER & DISTINCT COLORS)
  // ============================================================================
  const EXPENSE_CATEGORIES = [
    { key: 'nguyen_vat_lieu', name: 'Chi phí nguyên vật liệu đầu vào', shortName: 'Nguyên vật liệu', color: '#2E6B22' },
    { key: 'nhan_cong', name: 'Chi phí nhân công', shortName: 'Nhân công', color: '#2B7BBB' },
    { key: 'dung_cu', name: 'Chi phí dụng cụ', shortName: 'Dụng cụ', color: '#D97724' },
    { key: 'dien_nuoc', name: 'Chi phí điện nước', shortName: 'Điện nước', color: '#EAB308' },
    { key: 'dich_vu_khac', name: 'Các dịch vụ khác', shortName: 'Dịch vụ khác', color: '#8B5CF6' },
    { key: 'ship', name: 'Chi phí ship', shortName: 'Ship', color: '#06B6D4' },
    { key: 'van_hanh', name: 'Chi phí vận hành', shortName: 'Vận hành', color: '#EC4899' },
    { key: 'thue_mat_bang', name: 'Chi phí thuê mặt bằng', shortName: 'Thuê mặt bằng', color: '#3D1F0D' },
    { key: 'khau_hao', name: 'Chi phí tài sản khấu hao', shortName: 'Tài sản khấu hao', color: '#78716C' }
  ];

  const CATEGORY_MAP = {};
  EXPENSE_CATEGORIES.forEach((c) => {
    CATEGORY_MAP[c.key] = c;
  });

  // ============================================================================
  // 2. REAL DATA FALLBACK (16 REAL ROWS = 9 164 000 VNĐ)
  // ============================================================================
  const REAL_ENTRIES_FALLBACK = [
    { id: 'GF-01', date: '17/11/2026', shortDate: '17/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 126000, note: 'Thảm bar (80k) + Ca đong 100ml & 250ml (46k)' },
    { id: 'GF-02', date: '17/11/2026', shortDate: '17/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 200000, note: 'Máy đánh bọt pha Cacao Latte & Kem trứng' },
    { id: 'GF-03', date: '18/11/2026', shortDate: '18/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 135000, note: 'Bình lắc pha chế (3 cái x 45k)' },
    { id: 'GF-04', date: '18/11/2026', shortDate: '18/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 460000, note: 'Bình đựng trà 1L (4 cái = 200k) + Bình 2.1L (4 cái = 260k)' },
    { id: 'GF-05', date: '19/11/2026', shortDate: '19/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 160000, note: 'Bình đựng đường & sữa đặc (2 cái x 80k)' },
    { id: 'GF-06', date: '20/11/2026', shortDate: '20/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 204000, note: 'Xúc đá (45k) + Vét (50k) + Vá (50k) + Thìa bar (35k) + Thìa định lượng (24k)' },
    { id: 'GF-07', date: '21/11/2026', shortDate: '21/11', fullName: 'Quản lý Mộc Giang', categoryKey: 'dung_cu', amountVnd: 80000, note: 'Giấy chống tràn & dụng cụ quầy nước (80k)' },
    { id: 'GF-08', date: '17/11/2026', shortDate: '17/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 2310000, note: 'Nguyên liệu Ngày 17/11: Trà sen vàng, Cốm dẻo, Nhài sữa, Thanh nhài, Trà dâu/me/vải/dưa lưới/khế quýt, Cafe/Bạc xỉu' },
    { id: 'GF-09', date: '18/11/2026', shortDate: '18/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 1419000, note: 'Nguyên liệu Ngày 18/11: Cacao latte, Thanh nhài, Nhài sữa, Trà dâu, Trà sen, Cốm dẻo, Cafe sữa' },
    { id: 'GF-10', date: '19/11/2026', shortDate: '19/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 1019000, note: 'Nguyên liệu Ngày 19/11: Trà sen vàng, Bạc xỉu, Cafe muối, Cốm, Nhài sữa' },
    { id: 'GF-11', date: '20/11/2026', shortDate: '20/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 575000, note: 'Nguyên liệu Ngày 20/11: Trà sen vàng, Cốm, Trà dâu, Thanh nhài, Khế quýt' },
    { id: 'GF-12', date: '21/11/2026', shortDate: '21/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 435000, note: 'Nguyên liệu Ngày 21/11: Bạc xỉu, Cafe muối, Me Đác, Trà Vải' },
    { id: 'GF-13', date: '22/11/2026', shortDate: '22/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 440000, note: 'Nguyên liệu Ngày 22/11: Trà sen, Cốm, Thanh nhài' },
    { id: 'GF-14', date: '23/11/2026', shortDate: '23/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 566000, note: 'Nguyên liệu Ngày 23/11: Olong dừa nướng, Trà sữa cốm, Nhài sữa kem trứng, Cafe muối' },
    { id: 'GF-15', date: '24/11/2026', shortDate: '24/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 430000, note: 'Nguyên liệu Ngày 24/11: Cafe sữa, Trà sữa cốm, Trà dưa lưới, Trà Khế quýt' },
    { id: 'GF-16', date: '25/11/2026', shortDate: '25/11', fullName: 'Quầy Nước Mộc Giang', categoryKey: 'nguyen_vat_lieu', amountVnd: 605000, note: 'Nguyên liệu Ngày 25/11: Cafe muối, Trà sữa cốm, Trà sen vàng' }
  ];

  // ============================================================================
  // 3. VND <-> TRIỆU VNĐ PARSER & FORMATTER HELPERS
  // ============================================================================
  function formatVndSpace(vndAmount) {
    const n = Math.round(Number(vndAmount) || 0);
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function formatMillionSmart(val, forceTwoDecimalsForSmall = false) {
    const num = Number(val) || 0;
    const rounded3 = Math.round(num * 1000) / 1000;
    const hasThousandths = Math.abs(rounded3 * 100 - Math.round(rounded3 * 100)) > 0.01;
    const hasHundredths = Math.abs(rounded3 * 10 - Math.round(rounded3 * 10)) > 0.001;

    if (hasThousandths) {
      return rounded3.toFixed(3).replace('.', ',');
    }
    if (hasHundredths || (forceTwoDecimalsForSmall && num > 0 && num < 1)) {
      return rounded3.toFixed(2).replace('.', ',');
    }
    return rounded3.toFixed(1).replace('.', ',');
  }

  function formatMillionCompact(val) {
    const num = Number(val) || 0;
    const rounded2 = Math.round(num * 100) / 100;
    const hasHundredths = Math.abs(rounded2 * 10 - Math.round(rounded2 * 10)) > 0.001;
    if (hasHundredths) {
      return rounded2.toFixed(2).replace('.', ',');
    }
    const isInt = Math.abs(rounded2 - Math.round(rounded2)) < 0.005;
    return rounded2.toLocaleString('vi-VN', {
      minimumFractionDigits: isInt ? 0 : 1,
      maximumFractionDigits: 2
    });
  }

  function parseVndInputLocal(raw) {
    if (typeof window.parseVndInput === 'function') {
      try {
        const res = window.parseVndInput(raw);
        if (res && typeof res.vnd === 'number' && typeof res.trieu === 'number') {
          return res;
        }
      } catch (e) {
        // Fallback below
      }
    }
    if (raw === null || raw === undefined || raw === '') {
      return { vnd: 0, trieu: 0, formattedVnd: '0', formattedTrieu: '0,00' };
    }
    let vnd = 0;
    if (typeof raw === 'number' && !Number.isNaN(raw)) {
      vnd = raw > 0 && raw < 1000 ? Math.round(raw * 1000000) : Math.round(raw);
    } else {
      const digitsOnly = String(raw).trim().replace(/[^\d]/g, '');
      vnd = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    }
    const trieu = Math.round((vnd / 1000000) * 10000) / 10000;
    return {
      vnd,
      trieu,
      formattedVnd: formatVndSpace(vnd),
      formattedTrieu: formatMillionSmart(trieu, true)
    };
  }

  function mapToCategoryKey(rawCategory, noteText) {
    if (rawCategory && CATEGORY_MAP[rawCategory]) return rawCategory;
    const s = String(rawCategory || '').toLowerCase();
    const n = String(noteText || '').toLowerCase();
    const combined = `${s} ${n}`;

    if (s.includes('dụng cụ') || s.includes('dung_cu') || n.includes('dụng cụ') || n.includes('thảm bar') || n.includes('bình lắc') || n.includes('bình đựng') || n.includes('giấy chống tràn')) {
      return 'dung_cu';
    }
    if (s.includes('nguyên vật liệu') || s.includes('nguyen_vat_lieu') || s.includes('đồ uống') || s.includes('suất cơm') || s.includes('bánh bao') || s.includes('nguyên liệu')) {
      return 'nguyen_vat_lieu';
    }
    if (s.includes('nhân công') || s.includes('nhan_cong') || s.includes('lương')) {
      return 'nhan_cong';
    }
    if (s.includes('điện') || s.includes('nước') || s.includes('gas') || s.includes('dien_nuoc')) {
      return 'dien_nuoc';
    }
    if (s.includes('ship') || s.includes('giao hàng') || s.includes('bao bì')) {
      return 'ship';
    }
    if (s.includes('vận hành') || s.includes('van_hanh')) {
      return 'van_hanh';
    }
    if (s.includes('mặt bằng') || s.includes('thue_mat_bang')) {
      return 'thue_mat_bang';
    }
    if (s.includes('khấu hao') || s.includes('tài sản') || s.includes('khau_hao')) {
      return 'khau_hao';
    }
    if (s.includes('dịch vụ') || s.includes('pos') || s.includes('internet') || s.includes('bảo hiểm') || s.includes('dich_vu_khac')) {
      return 'dich_vu_khac';
    }
    if (combined.includes('trà') || combined.includes('cafe') || combined.includes('cốm') || combined.includes('cacao')) {
      return 'nguyen_vat_lieu';
    }
    return 'dich_vu_khac';
  }

  function normalizeShortDate(dateStr) {
    if (!dateStr) return '24/11';
    const s = String(dateStr).trim();
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[3]}/${iso[2]}`;
    const vn = s.match(/^(\d{1,2})\/(\d{1,2})/);
    if (vn) return `${vn[1].padStart(2, '0')}/${vn[2].padStart(2, '0')}`;
    return '24/11';
  }

  function generateReceiptSvgDataUri(opts) {
    const {
      code = 'GF-01',
      payer = 'Quản lý Mộc Giang',
      date = '24/11/2026',
      category = 'Chi phí nguyên vật liệu đầu vào',
      vndText = '1 000 000',
      trieuText = '1,00',
      note = 'Phiếu chi thực tế tại Nhà hàng Mộc Giang - 199 Hoàng Cầu'
    } = opts || {};

    const safe = (str) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="520" viewBox="0 0 420 520">
      <rect width="420" height="520" rx="16" fill="#FBF7EE" stroke="#D8CCB4" stroke-width="3"/>
      <rect x="16" y="16" width="388" height="82" rx="10" fill="#3D1F0D"/>
      <text x="210" y="48" text-anchor="middle" fill="#FBF7EE" font-family="Arial, sans-serif" font-size="18" font-weight="bold">NHÀ HÀNG MỘC GIANG</text>
      <text x="210" y="72" text-anchor="middle" fill="#A8E096" font-family="Arial, sans-serif" font-size="12">199 Hoàng Cầu, Đống Đa, Hà Nội · ĐT: 096 3689077</text>
      <text x="210" y="130" text-anchor="middle" fill="#24160B" font-family="Arial, sans-serif" font-size="17" font-weight="bold">PHIẾU CHI &amp; MINH CHỨNG</text>
      <text x="210" y="150" text-anchor="middle" fill="#695342" font-family="Arial, sans-serif" font-size="12">Mã chứng từ: ${safe(code)} · Ngày: ${safe(date)}</text>
      <line x1="28" y1="166" x2="392" y2="166" stroke="#D8CCB4" stroke-dasharray="5 4" stroke-width="1.5"/>
      <text x="32" y="198" fill="#695342" font-family="Arial, sans-serif" font-size="12">Người kê khai:</text>
      <text x="388" y="198" text-anchor="end" fill="#24160B" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${safe(payer)}</text>
      <text x="32" y="230" fill="#695342" font-family="Arial, sans-serif" font-size="12">Loại chi phí:</text>
      <text x="388" y="230" text-anchor="end" fill="#2E6B22" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${safe(category)}</text>
      <rect x="28" y="256" width="364" height="82" rx="10" fill="#EAF4E7" stroke="#2E6B22" stroke-width="1.5"/>
      <text x="210" y="282" text-anchor="middle" fill="#2E6B22" font-family="Arial, sans-serif" font-size="12" font-weight="bold">SỐ TIỀN CHI (VNĐ)</text>
      <text x="210" y="310" text-anchor="middle" fill="#24160B" font-family="Arial, sans-serif" font-size="22" font-weight="bold">${safe(vndText)} VNĐ</text>
      <text x="210" y="328" text-anchor="middle" fill="#3D1F0D" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Quy đổi: = ${safe(trieuText)} Triệu VNĐ</text>
      <text x="32" y="368" fill="#695342" font-family="Arial, sans-serif" font-size="12">Ghi chú:</text>
      <text x="32" y="390" fill="#24160B" font-family="Arial, sans-serif" font-size="12">${safe(note.slice(0, 58))}</text>
      <line x1="28" y1="420" x2="392" y2="420" stroke="#D8CCB4" stroke-dasharray="5 4" stroke-width="1.5"/>
      <text x="32" y="456" fill="#695342" font-family="Arial, sans-serif" font-size="11">Lưu trữ: Google Drive Mộc Giang</text>
      <text x="32" y="476" fill="#695342" font-family="Arial, sans-serif" font-size="11">Đồng bộ: Google Sheet Responses</text>
      <rect x="276" y="440" width="112" height="44" rx="8" fill="none" stroke="#2E6B22" stroke-width="2"/>
      <text x="332" y="460" text-anchor="middle" fill="#2E6B22" font-family="Arial, sans-serif" font-size="11" font-weight="bold">ĐÃ ĐỐI SOÁT</text>
      <text x="332" y="475" text-anchor="middle" fill="#2E6B22" font-family="Arial, sans-serif" font-size="10">Google Drive</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // ============================================================================
  // 4. STATE & UNIFIED DATA AGGREGATION (9 CATEGORIES)
  // ============================================================================
  const state = {
    period: 'all',          // 'all' (17/11–25/11) | 'week_17_23' (17/11–23/11) | 'last_7' (7 ngày gần nhất)
    barMode: 'stacked',     // 'stacked' ("Theo ngày (cột chồng)") | 'by_category' ("Theo loại chi phí")
    highlightKey: null,     // category key or null
    searchQuery: '',
    categoryFilter: 'all',
    localAddedEntries: []
  };

  function getGoogleConfig() {
    const ext = (window.MocGiangData && window.MocGiangData.googleIntegration) || {};
    const spreadsheetId = ext.spreadsheetId || '14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE';
    const driveFolderId = ext.driveFolderId || '1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2';
    return {
      spreadsheetId,
      spreadsheetUrl: ext.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      driveFolderId,
      driveFolderUrl: ext.driveFolderUrl || `https://drive.google.com/drive/folders/${driveFolderId}`,
      appsScriptUrl: ext.appsScriptUrl || '',
      formUrl: ext.formUrl || ''
    };
  }

  function getNormalizedExpensesData() {
    const ext = window.MocGiangData || {};
    const extExp = ext.expenses;
    const cfg = getGoogleConfig();

    let rawEntries = null;
    if (extExp && Array.isArray(extExp.entries) && extExp.entries.length > 0) {
      rawEntries = extExp.entries;
    } else if (ext.googleIntegration && Array.isArray(ext.googleIntegration.entries) && ext.googleIntegration.entries.length > 0) {
      rawEntries = ext.googleIntegration.entries;
    } else {
      rawEntries = REAL_ENTRIES_FALLBACK;
    }

    const combinedRaw = [...state.localAddedEntries, ...rawEntries];
    const normalizedEntries = combinedRaw.map((item, idx) => {
      const parsed = parseVndInputLocal(
        item.amountVnd !== undefined
          ? item.amountVnd
          : item.vndAmount !== undefined
          ? item.vndAmount
          : item.amountRaw !== undefined
          ? item.amountRaw
          : item.amount
      );
      const catKey = mapToCategoryKey(item.categoryKey || item.category || item.categoryName, item.note);
      const catObj = CATEGORY_MAP[catKey] || EXPENSE_CATEGORIES[0];
      const fullDate = item.fullDate || item.date || '24/11/2026';
      const shortDate = item.shortDate || normalizeShortDate(fullDate);
      const id = item.id || item.code || `GF-${String(idx + 1).padStart(2, '0')}`;
      const fullName = item.fullName || item.payer || 'Quản lý Mộc Giang';
      const note = item.note || item.description || `Phiếu chi ${catObj.name}`;
      const receiptUrl =
        item.receiptUrl ||
        item.receiptThumb ||
        item.imageBase64 ||
        generateReceiptSvgDataUri({
          code: id,
          payer: fullName,
          date: fullDate,
          category: catObj.name,
          vndText: parsed.formattedVnd,
          trieuText: parsed.formattedTrieu,
          note
        });

      return {
        id,
        timestamp: item.timestamp || `${fullDate} 08:30:00`,
        fullName,
        date: fullDate.includes('/2026') ? fullDate : `${shortDate}/2026`,
        shortDate,
        amountVnd: parsed.vnd,
        amountTrieu: parsed.trieu,
        formattedVnd: parsed.formattedVnd,
        formattedTrieu: parsed.formattedTrieu,
        categoryKey: catKey,
        categoryName: catObj.name,
        categoryShort: catObj.shortName,
        categoryColor: catObj.color,
        note,
        receiptUrl,
        driveUrl: item.driveUrl || cfg.driveFolderUrl
      };
    });

    // Period filtering on entries
    const allShortDates = Array.from(new Set(normalizedEntries.map((e) => e.shortDate))).sort((a, b) => {
      const [da, ma] = a.split('/').map(Number);
      const [db, mb] = b.split('/').map(Number);
      return ma !== mb ? ma - mb : da - db;
    });

    let allowedDates = allShortDates;
    if (state.period === 'week_17_23') {
      allowedDates = ['17/11', '18/11', '19/11', '20/11', '21/11', '22/11', '23/11'];
    } else if (state.period === 'last_7') {
      allowedDates = allShortDates.slice(-7);
    }

    const periodEntries = normalizedEntries.filter((e) => allowedDates.includes(e.shortDate));

    // Aggregate byDay (each day has all 9 category keys in VND + totalVnd)
    const dayMap = {};
    allowedDates.forEach((sd) => {
      const obj = { date: sd, label: `${sd}/2026`, totalVnd: 0, totalTrieu: 0, count: 0 };
      EXPENSE_CATEGORIES.forEach((c) => {
        obj[c.key] = 0;
      });
      dayMap[sd] = obj;
    });

    const catAgg = {};
    EXPENSE_CATEGORIES.forEach((c) => {
      catAgg[c.key] = {
        key: c.key,
        name: c.name,
        shortName: c.shortName,
        color: c.color,
        vnd: 0,
        trieu: 0,
        percent: 0,
        count: 0
      };
    });

    let totalVnd = 0;
    periodEntries.forEach((e) => {
      totalVnd += e.amountVnd;
      if (!dayMap[e.shortDate]) {
        const obj = { date: e.shortDate, label: e.date, totalVnd: 0, totalTrieu: 0, count: 0 };
        EXPENSE_CATEGORIES.forEach((c) => {
          obj[c.key] = 0;
        });
        dayMap[e.shortDate] = obj;
      }
      dayMap[e.shortDate][e.categoryKey] += e.amountVnd;
      dayMap[e.shortDate].totalVnd += e.amountVnd;
      dayMap[e.shortDate].totalTrieu = Math.round((dayMap[e.shortDate].totalVnd / 1000000) * 1000) / 1000;
      dayMap[e.shortDate].count += 1;

      catAgg[e.categoryKey].vnd += e.amountVnd;
      catAgg[e.categoryKey].count += 1;
    });

    const byDay = Object.values(dayMap)
      .filter((d) => d.count > 0 || allowedDates.includes(d.date))
      .sort((a, b) => {
        const [da, ma] = a.date.split('/').map(Number);
        const [db, mb] = b.date.split('/').map(Number);
        return ma !== mb ? ma - mb : da - db;
      });

    const byCategory = EXPENSE_CATEGORIES.map((c) => {
      const item = catAgg[c.key];
      item.trieu = Math.round((item.vnd / 1000000) * 1000) / 1000;
      item.percent = totalVnd > 0 ? Math.round((item.vnd / totalVnd) * 1000) / 10 : 0;
      item.formattedVnd = formatVndSpace(item.vnd);
      item.formattedTrieu = formatMillionSmart(item.trieu, true);
      return item;
    });

    const totalTrieu = Math.round((totalVnd / 1000000) * 1000) / 1000;

    return {
      categories: EXPENSE_CATEGORIES,
      byDay,
      byCategory,
      entries: periodEntries,
      allEntriesCount: normalizedEntries.length,
      totalVnd,
      totalTrieu,
      formattedTotalVnd: formatVndSpace(totalVnd),
      formattedTotalTrieu: formatMillionSmart(totalTrieu, true),
      googleConfig: cfg
    };
  }

  // ============================================================================
  // 5. SCOPED STYLES
  // ============================================================================
  function ensureExpensesStyles() {
    if (document.getElementById('mg-unified-expenses-styles')) return;
    const style = document.createElement('style');
    style.id = 'mg-unified-expenses-styles';
    style.textContent = `
      .mg-exp-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding-bottom: 32px;
        color: var(--text-primary, #24160B);
        font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .mg-exp-header-card {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
        background: var(--card-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 16px;
        padding: 20px 24px;
        box-shadow: 0 3px 14px rgba(61, 31, 13, 0.04);
      }

      .mg-exp-title-group h2 {
        margin: 0 0 6px 0;
        font-size: 21px;
        font-weight: 800;
        color: var(--text-primary, #24160B);
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .mg-exp-title-group p {
        margin: 0;
        font-size: 13.5px;
        color: var(--text-secondary, #695342);
        line-height: 1.5;
      }

      .mg-exp-header-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .mg-exp-period-pills {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 5px;
        background: var(--bg-secondary, #F4EDE0);
        padding: 4px;
        border-radius: 10px;
        border: 1px solid var(--border-color, #E6DEC8);
      }

      .mg-exp-period-btn {
        border: none;
        background: transparent;
        color: var(--text-secondary, #695342);
        font-size: 12.5px;
        font-weight: 600;
        padding: 7px 12px;
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.16s ease;
      }

      .mg-exp-period-btn:hover {
        color: var(--text-primary, #24160B);
      }

      .mg-exp-period-btn.active {
        background: #2E6B22;
        color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(46, 107, 34, 0.25);
      }

      .mg-exp-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 14px;
        border-radius: 10px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid #2E6B22;
        background: #2E6B22;
        color: #FFFFFF;
        box-shadow: 0 3px 10px rgba(46, 107, 34, 0.22);
        transition: all 0.16s ease;
      }

      .mg-exp-action-btn:hover {
        background: #24551A;
        transform: translateY(-1px);
      }

      .mg-exp-action-btn.secondary {
        background: #FFFFFF;
        color: #3D1F0D;
        border-color: #D5C8B0;
        box-shadow: none;
      }

      .mg-exp-action-btn.secondary:hover {
        border-color: #2E6B22;
        color: #2E6B22;
      }

      /* KPI Cards Row */
      .mg-exp-kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      @media (max-width: 1180px) {
        .mg-exp-kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .mg-exp-kpi-grid {
          grid-template-columns: 1fr;
        }
      }

      .mg-exp-kpi-card {
        background: var(--card-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 15px;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 2px 10px rgba(61, 31, 13, 0.03);
        position: relative;
        overflow: hidden;
      }

      .mg-exp-kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--kpi-accent, #2E6B22);
      }

      .mg-exp-kpi-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .mg-exp-kpi-label {
        font-size: 12.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-secondary, #695342);
      }

      .mg-exp-kpi-icon {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--kpi-bg, rgba(46, 107, 34, 0.1));
        color: var(--kpi-accent, #2E6B22);
        font-size: 16px;
      }

      .mg-exp-kpi-value {
        font-size: 23px;
        font-weight: 800;
        color: var(--text-primary, #24160B);
        line-height: 1.2;
      }

      .mg-exp-kpi-unit {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary, #695342);
        margin-left: 4px;
      }

      .mg-exp-kpi-sub {
        font-size: 12.5px;
        color: var(--text-secondary, #695342);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        flex-wrap: wrap;
      }

      .mg-exp-kpi-tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 700;
        background: rgba(46, 107, 34, 0.12);
        color: #2E6B22;
      }

      /* 2-Column Main Charts Grid */
      .mg-exp-charts-grid {
        display: grid;
        grid-template-columns: 1.38fr 1fr;
        gap: 20px;
        align-items: stretch;
      }

      @media (max-width: 1120px) {
        .mg-exp-charts-grid {
          grid-template-columns: 1fr;
        }
      }

      .mg-exp-chart-card {
        background: var(--card-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 16px;
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
        box-shadow: 0 3px 14px rgba(61, 31, 13, 0.04);
      }

      .mg-exp-card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        border-bottom: 1px solid var(--border-color, #E6DEC8);
        padding-bottom: 14px;
      }

      .mg-exp-card-title {
        margin: 0 0 4px 0;
        font-size: 16.5px;
        font-weight: 800;
        color: var(--text-primary, #24160B);
      }

      .mg-exp-card-subtitle {
        margin: 0;
        font-size: 12.5px;
        color: var(--text-secondary, #695342);
      }

      .mg-exp-barchart-wrap {
        width: 100%;
        overflow-x: auto;
        padding-top: 4px;
      }

      .mg-exp-barchart-svg {
        width: 100%;
        min-width: 540px;
        height: auto;
        display: block;
        overflow: visible;
      }

      .mg-exp-bar-seg {
        cursor: pointer;
        transition: opacity 0.16s ease, filter 0.16s ease;
      }

      .mg-exp-bar-seg:hover {
        filter: brightness(1.1);
      }

      .mg-exp-bar-seg.is-dimmed {
        opacity: 0.2;
      }

      /* 9-Category Compact Legend under Bar Chart */
      .mg-exp-9legend-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 12px;
        border-top: 1px dashed var(--border-color, #E6DEC8);
      }

      .mg-exp-9legend-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        background: var(--bg-secondary, #FBF7EE);
        border: 1px solid var(--border-color, #E6DEC8);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .mg-exp-9legend-chip:hover,
      .mg-exp-9legend-chip.is-active {
        border-color: #2E6B22;
        background: rgba(46, 107, 34, 0.09);
      }

      .mg-exp-9legend-chip.is-dimmed {
        opacity: 0.45;
      }

      /* Pie Chart & 9-Row Legend */
      .mg-exp-pie-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .mg-exp-pie-svg-wrap {
        width: 230px;
        height: 230px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mg-exp-pie-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .mg-exp-pie-slice {
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;
        transform-origin: 120px 120px;
      }

      .mg-exp-pie-slice:hover,
      .mg-exp-pie-slice.is-active {
        transform: scale(1.04);
        filter: drop-shadow(0 4px 10px rgba(36, 22, 11, 0.2));
      }

      .mg-exp-pie-slice.is-dimmed {
        opacity: 0.28;
      }

      .mg-exp-pie-legend {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .mg-exp-legend-item {
        display: grid;
        grid-template-columns: 12px 1fr auto auto auto;
        align-items: center;
        gap: 8px;
        padding: 7px 10px;
        border-radius: 9px;
        background: var(--bg-secondary, #FBF7EE);
        border: 1px solid var(--border-color, #E6DEC8);
        cursor: pointer;
        font-size: 12.5px;
        transition: all 0.15s ease;
      }

      .mg-exp-legend-item:hover,
      .mg-exp-legend-item.is-active {
        background: rgba(46, 107, 34, 0.08);
        border-color: #2E6B22;
      }

      .mg-exp-legend-item.is-zero {
        opacity: 0.72;
      }

      .mg-exp-legend-swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .mg-exp-legend-name {
        font-weight: 600;
        color: var(--text-primary, #24160B);
      }

      .mg-exp-legend-vnd {
        font-weight: 600;
        color: var(--text-secondary, #695342);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .mg-exp-legend-trieu {
        font-weight: 700;
        color: var(--text-primary, #24160B);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .mg-exp-legend-pct {
        font-size: 11.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(61, 31, 13, 0.08);
        color: var(--text-primary, #3D1F0D);
        min-width: 44px;
        text-align: center;
      }

      /* Table Card */
      .mg-exp-table-card {
        background: var(--card-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 16px;
        padding: 20px 22px;
        box-shadow: 0 3px 14px rgba(61, 31, 13, 0.04);
      }

      .mg-exp-table-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .mg-exp-select,
      .mg-exp-search {
        padding: 8px 12px;
        border-radius: 9px;
        border: 1px solid var(--border-color, #E6DEC8);
        background: var(--bg-secondary, #FBF7EE);
        color: var(--text-primary, #24160B);
        font-size: 13px;
        font-family: inherit;
        outline: none;
      }

      .mg-exp-table-wrap {
        width: 100%;
        overflow-x: auto;
        margin-top: 14px;
      }

      .mg-exp-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13.5px;
      }

      .mg-exp-table th {
        text-align: left;
        padding: 11px 13px;
        background: var(--bg-secondary, #F4EDE0);
        color: var(--text-secondary, #5C4738);
        font-weight: 700;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-bottom: 1px solid var(--border-color, #E6DEC8);
        white-space: nowrap;
      }

      .mg-exp-table td {
        padding: 11px 13px;
        border-bottom: 1px solid var(--border-color, #EFE8D8);
        color: var(--text-primary, #24160B);
        vertical-align: middle;
      }

      .mg-exp-table tbody tr:hover {
        background: rgba(46, 107, 34, 0.04);
      }

      .mg-exp-table tfoot td {
        padding: 13px;
        font-weight: 800;
        background: var(--bg-secondary, #FBF7EE);
        border-top: 2px solid var(--border-color, #E6DEC8);
      }

      .mg-exp-cat-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        background: rgba(61, 31, 13, 0.07);
      }

      .mg-receipt-thumb-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 10px 4px 4px;
        border-radius: 9px;
        border: 1px solid #D5C8B0;
        background: #FBF7EE;
        color: #3D1F0D;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .mg-receipt-thumb-btn:hover {
        border-color: #2E6B22;
        background: #EAF4E7;
        color: #2E6B22;
      }

      .mg-receipt-thumb-img {
        width: 30px;
        height: 36px;
        object-fit: cover;
        border-radius: 5px;
        border: 1px solid #D5C8B0;
      }

      /* Modals & Lightbox */
      .mg-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9990;
        background: rgba(24, 14, 7, 0.62);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }

      .mg-modal-card {
        background: #FFFFFF;
        border: 1px solid #E6DEC8;
        border-radius: 18px;
        width: 100%;
        max-width: 640px;
        max-height: 92vh;
        overflow-y: auto;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.32);
        color: #24160B;
        display: flex;
        flex-direction: column;
      }

      .mg-modal-head {
        background: #3D1F0D;
        color: #FBF7EE;
        padding: 18px 22px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        border-radius: 17px 17px 0 0;
      }

      .mg-modal-head h3 {
        margin: 0 0 4px 0;
        font-size: 17px;
        font-weight: 800;
        color: #FFFFFF;
      }

      .mg-modal-head p {
        margin: 0;
        font-size: 12.5px;
        color: #E6DEC8;
      }

      .mg-modal-close {
        border: none;
        background: rgba(255, 255, 255, 0.14);
        color: #FFFFFF;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
      }

      .mg-modal-body {
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .mg-form-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      @media (max-width: 600px) {
        .mg-form-grid-2 {
          grid-template-columns: 1fr;
        }
      }

      .mg-form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .mg-form-field label {
        font-size: 13px;
        font-weight: 700;
        color: #24160B;
      }

      .mg-form-input {
        padding: 10px 13px;
        border-radius: 9px;
        border: 1.5px solid #D8CCB4;
        background: #FBF7EE;
        color: #24160B;
        font-size: 14px;
        font-family: inherit;
        outline: none;
      }

      .mg-vnd-preview-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        background: #EAF4E7;
        border: 1px solid #9FD096;
        padding: 9px 13px;
        border-radius: 9px;
        font-size: 13px;
        color: #1F4E16;
      }

      .mg-cat-radio-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      @media (max-width: 600px) {
        .mg-cat-radio-grid {
          grid-template-columns: 1fr;
        }
      }

      .mg-cat-radio-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 9px 11px;
        border-radius: 9px;
        border: 1px solid #E6DEC8;
        background: #FBF7EE;
        cursor: pointer;
        font-size: 12.5px;
        font-weight: 600;
      }

      .mg-cat-radio-item.active {
        border-color: #2E6B22;
        background: #EAF4E7;
        font-weight: 700;
      }

      .mg-exp-tooltip {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        background: #24160B;
        color: #FBF7EE;
        padding: 11px 14px;
        border-radius: 11px;
        font-size: 12.5px;
        line-height: 1.45;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
        border: 1px solid rgba(230, 222, 200, 0.22);
        max-width: 310px;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.12s ease, transform 0.12s ease;
      }

      .mg-exp-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // 6. TOOLTIP HELPER
  // ============================================================================
  let tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.getElementById('mg-exp-floating-tooltip');
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'mg-exp-floating-tooltip';
        tooltipEl.className = 'mg-exp-tooltip';
        document.body.appendChild(tooltipEl);
      }
    }
    return tooltipEl;
  }

  function showTooltip(evt, html) {
    const tip = getTooltip();
    tip.innerHTML = html;
    tip.classList.add('visible');
    moveTooltip(evt);
  }

  function moveTooltip(evt) {
    const tip = getTooltip();
    if (!tip.classList.contains('visible')) return;
    const pad = 14;
    let x = evt.clientX + pad;
    let y = evt.clientY + pad;
    const rect = tip.getBoundingClientRect();
    if (x + rect.width > window.innerWidth - 12) x = evt.clientX - rect.width - pad;
    if (y + rect.height > window.innerHeight - 12) y = evt.clientY - rect.height - pad;
    tip.style.left = `${Math.max(8, x)}px`;
    tip.style.top = `${Math.max(8, y)}px`;
  }

  function hideTooltip() {
    getTooltip().classList.remove('visible');
  }

  // ============================================================================
  // 7. SVG BAR CHARTS (STACKED BY DAY OR BY CATEGORY)
  // ============================================================================
  function buildStackedDailyBarSVG(byDay) {
    const svgWidth = Math.max(660, byDay.length * 68 + 110);
    const svgHeight = 350;
    const padLeft = 66;
    const padRight = 24;
    const padTop = 34;
    const padBottom = 64;
    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;

    const maxTrieu = Math.max(...byDay.map((d) => d.totalTrieu || 0), 0.5);
    const yStep = maxTrieu <= 2 ? 0.5 : maxTrieu <= 5 ? 1 : maxTrieu <= 12 ? 2 : 5;
    const yMax = Math.ceil((maxTrieu * 1.15) / yStep) * yStep;
    const numSteps = Math.max(4, Math.round(yMax / yStep));

    let gridHtml = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (yMax / numSteps) * i;
      const y = padTop + plotH - (val / yMax) * plotH;
      const isZero = i === 0;
      gridHtml += `
        <line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${svgWidth - padRight}" y2="${y.toFixed(1)}"
              stroke="${isZero ? '#8C7A6B' : '#E6DEC8'}"
              stroke-width="${isZero ? '1.5' : '1'}"
              stroke-dasharray="${isZero ? 'none' : '4 4'}" />
        <text x="${padLeft - 10}" y="${(y + 4).toFixed(1)}"
              text-anchor="end"
              fill="#695342"
              font-size="11.5"
              font-weight="600">${formatMillionCompact(val)} tr</text>
      `;
    }

    const slotW = plotW / Math.max(byDay.length, 1);
    const barW = Math.min(38, Math.max(20, slotW * 0.54));
    const hl = state.highlightKey;

    let barsHtml = '';
    byDay.forEach((day, dIdx) => {
      const cx = padLeft + slotW * dIdx + slotW / 2;
      const x = cx - barW / 2;
      let currentY = padTop + plotH;

      EXPENSE_CATEGORIES.forEach((cat) => {
        const vnd = Number(day[cat.key]) || 0;
        if (vnd <= 0) return;
        const trieu = vnd / 1000000;
        const segH = Math.max(2, (trieu / yMax) * plotH);
        const segY = currentY - segH;
        currentY = segY;
        const dimmed = hl && hl !== cat.key ? ' is-dimmed' : '';

        barsHtml += `
          <rect class="mg-exp-bar-seg${dimmed}"
                data-bar-mode="stacked"
                data-day-idx="${dIdx}"
                data-cat-key="${cat.key}"
                x="${x.toFixed(1)}"
                y="${segY.toFixed(1)}"
                width="${barW.toFixed(1)}"
                height="${segH.toFixed(1)}"
                rx="2"
                fill="${cat.color}"
                stroke="#FFFFFF"
                stroke-width="0.8" />
        `;
      });

      if (day.totalTrieu > 0) {
        barsHtml += `
          <text x="${cx.toFixed(1)}"
                y="${Math.max(16, currentY - 7).toFixed(1)}"
                text-anchor="middle"
                fill="#24160B"
                font-size="10.5"
                font-weight="800">${formatMillionSmart(day.totalTrieu, true)} tr</text>
        `;
      }

      barsHtml += `
        <text x="${cx.toFixed(1)}"
              y="${(padTop + plotH + 22).toFixed(1)}"
              text-anchor="middle"
              fill="#4E3B2C"
              font-size="11.5"
              font-weight="700">${day.date}</text>
      `;
    });

    const axisHtml = `
      <text x="${padLeft - 4}" y="16" text-anchor="start" fill="#3D1F0D" font-size="11.5" font-weight="800">
        ▲ Trục Y: Tiền (Đơn vị: Triệu VNĐ)
      </text>
      <text x="${(padLeft + plotW / 2).toFixed(1)}" y="${svgHeight - 10}" text-anchor="middle" fill="#3D1F0D" font-size="12" font-weight="800">
        Trục X: Ngày →
      </text>
    `;

    return `
      <svg class="mg-exp-barchart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Biểu đồ cột chồng chi phí theo ngày">
        ${axisHtml}
        ${gridHtml}
        ${barsHtml}
      </svg>
    `;
  }

  function buildByCategoryBarSVG(byCategory) {
    const svgWidth = 740;
    const svgHeight = 360;
    const padLeft = 66;
    const padRight = 24;
    const padTop = 34;
    const padBottom = 78;
    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;

    const maxTrieu = Math.max(...byCategory.map((c) => c.trieu || 0), 1);
    const yStep = maxTrieu <= 2 ? 0.5 : maxTrieu <= 5 ? 1 : maxTrieu <= 12 ? 2 : 5;
    const yMax = Math.ceil((maxTrieu * 1.15) / yStep) * yStep;
    const numSteps = Math.max(4, Math.round(yMax / yStep));

    let gridHtml = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (yMax / numSteps) * i;
      const y = padTop + plotH - (val / yMax) * plotH;
      const isZero = i === 0;
      gridHtml += `
        <line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${svgWidth - padRight}" y2="${y.toFixed(1)}"
              stroke="${isZero ? '#8C7A6B' : '#E6DEC8'}"
              stroke-width="${isZero ? '1.5' : '1'}"
              stroke-dasharray="${isZero ? 'none' : '4 4'}" />
        <text x="${padLeft - 10}" y="${(y + 4).toFixed(1)}"
              text-anchor="end"
              fill="#695342"
              font-size="11.5"
              font-weight="600">${formatMillionCompact(val)} tr</text>
      `;
    }

    const slotW = plotW / EXPENSE_CATEGORIES.length;
    const barW = Math.min(36, slotW * 0.56);
    const hl = state.highlightKey;

    let barsHtml = '';
    byCategory.forEach((cat, idx) => {
      const cx = padLeft + slotW * idx + slotW / 2;
      const x = cx - barW / 2;
      const barH = cat.trieu > 0 ? Math.max(4, (cat.trieu / yMax) * plotH) : 2;
      const y = padTop + plotH - barH;
      const dimmed = hl && hl !== cat.key ? ' is-dimmed' : '';

      barsHtml += `
        <g class="mg-exp-bar-seg${dimmed}" data-bar-mode="category" data-cat-key="${cat.key}">
          <rect x="${x.toFixed(1)}"
                y="${y.toFixed(1)}"
                width="${barW.toFixed(1)}"
                height="${barH.toFixed(1)}"
                rx="4"
                fill="${cat.color}" />
          <text x="${cx.toFixed(1)}"
                y="${Math.max(16, y - 7).toFixed(1)}"
                text-anchor="middle"
                fill="${cat.trieu > 0 ? '#24160B' : '#8C7A6B'}"
                font-size="10.5"
                font-weight="700">${cat.trieu > 0 ? cat.formattedTrieu + ' tr' : '0'}</text>
          <text x="${cx.toFixed(1)}"
                y="${(padTop + plotH + 18).toFixed(1)}"
                text-anchor="end"
                transform="rotate(-24 ${cx.toFixed(1)} ${(padTop + plotH + 18).toFixed(1)})"
                fill="#4E3B2C"
                font-size="10.5"
                font-weight="700">${cat.shortName}</text>
        </g>
      `;
    });

    const axisHtml = `
      <text x="${padLeft - 4}" y="16" text-anchor="start" fill="#3D1F0D" font-size="11.5" font-weight="800">
        ▲ Trục Y: Tiền (Đơn vị: Triệu VNĐ)
      </text>
      <text x="${(padLeft + plotW / 2).toFixed(1)}" y="${svgHeight - 8}" text-anchor="middle" fill="#3D1F0D" font-size="12" font-weight="800">
        Trục X: 9 Loại chi phí
      </text>
    `;

    return `
      <svg class="mg-exp-barchart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Biểu đồ cột theo 9 loại chi phí">
        ${axisHtml}
        ${gridHtml}
        ${barsHtml}
      </svg>
    `;
  }

  // ============================================================================
  // 8. SVG PIE CHART (SKIPS 0% SLICES; SINGLE 100% RENDERS AS FULL CIRCLE)
  // ============================================================================
  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function createPieSlicePath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', cx, cy, 'L', start.x.toFixed(2), start.y.toFixed(2), 'A', r, r, 0, largeArc, 0, end.x.toFixed(2), end.y.toFixed(2), 'Z'].join(' ');
  }

  function buildPieChartSVG(byCategory) {
    const cx = 120;
    const cy = 120;
    const r = 104;
    const nonZero = byCategory.filter((c) => c.vnd > 0);
    const totalPct = nonZero.reduce((s, c) => s + (c.percent || 0), 0) || 100;
    const hl = state.highlightKey;

    if (nonZero.length === 0) {
      return `
        <svg class="mg-exp-pie-svg" viewBox="0 0 240 240" role="img" aria-label="Chưa có dữ liệu chi phí">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F4EDE0" stroke="#D5C8B0" stroke-width="2"/>
          <text x="${cx}" y="${cy}" text-anchor="middle" fill="#695342" font-size="13" font-weight="700">0 VNĐ (0%)</text>
        </svg>
      `;
    }

    let currentAngle = 0;
    let slicesHtml = '';

    nonZero.forEach((cat) => {
      const pct = cat.percent || 0;
      const sliceAngle = (pct / totalPct) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      currentAngle = endAngle;

      const isFullCircle = nonZero.length === 1 || sliceAngle >= 359.8;
      const labelRadius = isFullCircle ? 0 : pct < 10 ? r * 0.74 : r * 0.6;
      const labelPos = isFullCircle ? { x: cx, y: cy } : polarToCartesian(cx, cy, labelRadius, midAngle);
      const isHighlighted = hl === cat.key;
      const isDimmed = hl && hl !== cat.key;

      const shapeHtml = isFullCircle
        ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cat.color}" stroke="#FFFFFF" stroke-width="2.4" />`
        : `<path d="${createPieSlicePath(cx, cy, r, startAngle, endAngle)}" fill="${cat.color}" stroke="#FFFFFF" stroke-width="2.4" />`;

      slicesHtml += `
        <g class="mg-exp-pie-slice ${isHighlighted ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}" data-pie-key="${cat.key}">
          ${shapeHtml}
          <text x="${labelPos.x.toFixed(1)}"
                y="${(labelPos.y + 4).toFixed(1)}"
                text-anchor="middle"
                fill="#FFFFFF"
                font-size="${isFullCircle ? '16' : pct < 10 ? '10.5' : '12.5'}"
                font-weight="800"
                style="text-shadow: 0 1px 3px rgba(0,0,0,0.45); pointer-events: none;">
            ${pct.toFixed(1).replace('.', ',')}%
          </text>
        </g>
      `;
    });

    return `
      <svg class="mg-exp-pie-svg" viewBox="0 0 240 240" role="img" aria-label="Biểu đồ tròn cơ cấu chi phí">
        ${slicesHtml}
      </svg>
    `;
  }

  // ============================================================================
  // 9. IN-APP FORM MODAL (9 CATEGORIES, NO FIXED/VARIABLE SPLIT) & LIGHTBOX
  // ============================================================================
  function closeActiveModal() {
    const existing = document.getElementById('mg-exp-active-modal');
    if (existing) existing.remove();
  }

  window.openExpenseFormModal = function openExpenseFormModal() {
    ensureExpensesStyles();
    closeActiveModal();

    let selectedCatKey = EXPENSE_CATEGORIES[0].key;
    let uploadedReceiptDataUrl = '';
    let uploadedFileName = '';

    const overlay = document.createElement('div');
    overlay.id = 'mg-exp-active-modal';
    overlay.className = 'mg-modal-overlay';

    function renderModal() {
      const fullName = (overlay.querySelector('#mg-form-fullname') || {}).value || 'Quản lý Mộc Giang';
      const dateVal = (overlay.querySelector('#mg-form-date') || {}).value || '2026-11-24';
      const rawVnd = (overlay.querySelector('#mg-form-vnd') || {}).value || '500 000';
      const noteVal = (overlay.querySelector('#mg-form-note') || {}).value || '';
      const parsed = parseVndInputLocal(rawVnd);

      overlay.innerHTML = `
        <div class="mg-modal-card" role="dialog" aria-modal="true">
          <div class="mg-modal-head">
            <div>
              <h3>📝 Nhập phiếu chi &amp; Ảnh minh chứng (Google Form Mộc Giang)</h3>
              <p>Nhập số tiền bằng <strong>VNĐ (vd: 20 000, 1 000 000)</strong> — tự động quy đổi sang <strong>Triệu VNĐ</strong></p>
            </div>
            <button type="button" class="mg-modal-close" data-close-modal="true">✕</button>
          </div>

          <form id="mg-unified-expense-form" class="mg-modal-body">
            <div class="mg-form-grid-2">
              <div class="mg-form-field">
                <label for="mg-form-fullname">Người kê khai *</label>
                <input type="text" id="mg-form-fullname" class="mg-form-input" required value="${fullName.replace(/"/g, '&quot;')}" />
              </div>
              <div class="mg-form-field">
                <label for="mg-form-date">Ngày chi *</label>
                <input type="date" id="mg-form-date" class="mg-form-input" required value="${dateVal}" />
              </div>
            </div>

            <div class="mg-form-field">
              <label for="mg-form-vnd">Số tiền (VNĐ — ví dụ: 20 000, 1 000 000) *</label>
              <input type="text" id="mg-form-vnd" class="mg-form-input" required value="${rawVnd.replace(/"/g, '&quot;')}" />
              <div class="mg-vnd-preview-box" id="mg-vnd-live-preview">
                <span>Số tiền nhập: <strong>${parsed.formattedVnd} VNĐ</strong></span>
                <span>➔ Quy đổi: <strong>= ${parsed.formattedTrieu} Triệu VNĐ</strong></span>
              </div>
            </div>

            <div class="mg-form-field">
              <label>Loại chi phí (9 danh mục) *</label>
              <div class="mg-cat-radio-grid">
                ${EXPENSE_CATEGORIES.map(
                  (c) => `
                  <div class="mg-cat-radio-item ${selectedCatKey === c.key ? 'active' : ''}" data-select-cat="${c.key}">
                    <input type="radio" name="expCategory" value="${c.key}" ${selectedCatKey === c.key ? 'checked' : ''} />
                    <span style="width:10px;height:10px;border-radius:3px;background:${c.color};display:inline-block;flex-shrink:0;"></span>
                    <span>${c.name}</span>
                  </div>
                `
                ).join('')}
              </div>
            </div>

            <div class="mg-form-field">
              <label>Ảnh chụp minh chứng (tùy chọn)</label>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <label class="mg-exp-action-btn secondary" style="cursor:pointer;margin:0;">
                  <span>📁 Chọn ảnh hóa đơn</span>
                  <input type="file" id="mg-form-file" accept="image/*" style="display:none;" />
                </label>
                <span style="font-size:12px;color:#695342;">${uploadedFileName || 'Chưa chọn tệp (tự tạo phiếu minh chứng nếu để trống)'}</span>
              </div>
            </div>

            <div class="mg-form-field">
              <label for="mg-form-note">Ghi chú chi tiết</label>
              <input type="text" id="mg-form-note" class="mg-form-input" placeholder="Nhập nội dung khoản chi..." value="${noteVal.replace(/"/g, '&quot;')}" />
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:8px;border-top:1px solid #E6DEC8;">
              <button type="button" class="mg-exp-action-btn secondary" data-close-modal="true">Hủy</button>
              <button type="submit" class="mg-exp-action-btn">💾 Lưu phiếu chi &amp; Cập nhật biểu đồ</button>
            </div>
          </form>
        </div>
      `;

      overlay.querySelectorAll('[data-close-modal]').forEach((b) => b.addEventListener('click', closeActiveModal));
      const vndInput = overlay.querySelector('#mg-form-vnd');
      const preview = overlay.querySelector('#mg-vnd-live-preview');
      if (vndInput && preview) {
        vndInput.addEventListener('input', () => {
          const p = parseVndInputLocal(vndInput.value);
          preview.innerHTML = `<span>Số tiền nhập: <strong>${p.formattedVnd} VNĐ</strong></span><span>➔ Quy đổi: <strong>= ${p.formattedTrieu} Triệu VNĐ</strong></span>`;
        });
      }
      overlay.querySelectorAll('[data-select-cat]').forEach((item) => {
        item.addEventListener('click', () => {
          selectedCatKey = item.getAttribute('data-select-cat');
          renderModal();
        });
      });
      const fileInput = overlay.querySelector('#mg-form-file');
      if (fileInput) {
        fileInput.addEventListener('change', () => {
          const f = fileInput.files && fileInput.files[0];
          if (!f) return;
          uploadedFileName = f.name;
          const reader = new FileReader();
          reader.onload = (ev) => {
            uploadedReceiptDataUrl = ev.target.result;
            renderModal();
          };
          reader.readAsDataURL(f);
        });
      }
      const formEl = overlay.querySelector('#mg-unified-expense-form');
      if (formEl) {
        formEl.addEventListener('submit', async (e) => {
          e.preventDefault();
          const fName = (overlay.querySelector('#mg-form-fullname') || {}).value.trim() || 'Quản lý Mộc Giang';
          const dVal = (overlay.querySelector('#mg-form-date') || {}).value || '2026-11-24';
          const [yyyy, mm, dd] = dVal.split('-');
          const shortDate = dd && mm ? `${dd}/${mm}` : '24/11';
          const fullDate = dd && mm && yyyy ? `${dd}/${mm}/${yyyy}` : '24/11/2026';
          const p = parseVndInputLocal((overlay.querySelector('#mg-form-vnd') || {}).value);
          const catObj = CATEGORY_MAP[selectedCatKey] || EXPENSE_CATEGORIES[0];
          const noteText = (overlay.querySelector('#mg-form-note') || {}).value.trim() || `Phiếu chi ${catObj.name}`;
          const newId = `GF-${Math.floor(100 + Math.random() * 899)}`;

          const entryPayload = {
            id: newId,
            fullName: fName,
            date: fullDate,
            shortDate,
            amountVnd: p.vnd,
            amountRaw: p.formattedVnd,
            categoryKey: catObj.key,
            category: catObj.name,
            note: noteText,
            imageBase64: uploadedReceiptDataUrl || '',
            receiptUrl: uploadedReceiptDataUrl || ''
          };

          let handled = false;
          if (typeof window.addExpenseEntry === 'function') {
            try {
              await window.addExpenseEntry(entryPayload);
              handled = true;
            } catch (err) {
              // Fallback below
            }
          }
          if (!handled) {
            state.localAddedEntries.unshift(entryPayload);
          }

          closeActiveModal();
          window.renderExpenses();
          if (typeof window.renderOverview === 'function') {
            window.renderOverview();
          }
        });
      }
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeActiveModal();
    });
    document.body.appendChild(overlay);
    renderModal();
  };

  window.openGoogleConfigModal = function openGoogleConfigModal() {
    window.openExpenseFormModal();
  };

  window.openReceiptLightbox = function openReceiptLightbox(entryId) {
    ensureExpensesStyles();
    closeActiveModal();

    const data = getNormalizedExpensesData();
    const item = data.entries.find((s) => s.id === entryId) || data.entries[0];
    if (!item) return;

    const overlay = document.createElement('div');
    overlay.id = 'mg-exp-active-modal';
    overlay.className = 'mg-modal-overlay';

    overlay.innerHTML = `
      <div class="mg-modal-card" style="max-width: 500px;" role="dialog" aria-modal="true">
        <div class="mg-modal-head">
          <div>
            <h3>🧾 Ảnh chụp minh chứng — ${item.id}</h3>
            <p>${item.fullName} · Ngày ${item.date} · ${item.categoryName}</p>
          </div>
          <button type="button" class="mg-modal-close" data-close-modal="true">✕</button>
        </div>
        <div class="mg-modal-body" style="align-items: center;">
          <div class="mg-vnd-preview-box" style="width: 100%;">
            <span>Số tiền: <strong>${item.formattedVnd} VNĐ</strong></span>
            <span>Quy đổi: <strong>= ${item.formattedTrieu} Triệu VNĐ</strong></span>
          </div>
          <img src="${item.receiptUrl}" alt="Ảnh minh chứng ${item.id}" style="max-width:100%;max-height:420px;border-radius:12px;border:1px solid #D8CCB4;" />
          <div style="width:100%;font-size:12.5px;color:#5C4738;background:#FBF7EE;padding:10px 14px;border-radius:10px;border:1px solid #E6DEC8;">
            <div><strong>Người kê khai:</strong> ${item.fullName}</div>
            <div><strong>Loại chi phí:</strong> ${item.categoryName}</div>
            <div><strong>Ghi chú:</strong> ${item.note}</div>
          </div>
        </div>
      </div>
    `;

    overlay.querySelectorAll('[data-close-modal]').forEach((b) => b.addEventListener('click', closeActiveModal));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeActiveModal();
    });
    document.body.appendChild(overlay);
  };

  // ============================================================================
  // 10. MAIN RENDER FUNCTION: window.renderExpenses()
  // ============================================================================
  window.renderExpenses = function renderExpenses() {
    ensureExpensesStyles();
    const container =
      document.getElementById('view-expenses') ||
      document.getElementById('view-expenses-fixed') ||
      document.getElementById('view-expenses-variable');
    if (!container) return;

    const data = getNormalizedExpensesData();
    const daysCount = Math.max(data.byDay.length, 1);
    const avgPerDayVnd = Math.round(data.totalVnd / daysCount);
    const avgPerDayTrieu = avgPerDayVnd / 1000000;

    const topCat = data.byCategory.slice().sort((a, b) => b.vnd - a.vnd)[0] || data.byCategory[0];
    const nonZeroCats = data.byCategory.filter((c) => c.vnd > 0);
    const tableCats = nonZeroCats.length > 0 ? nonZeroCats : data.byCategory.slice(0, 2);

    const filteredEntries = data.entries.filter((e) => {
      const matchCat = state.categoryFilter === 'all' || e.categoryKey === state.categoryFilter;
      const q = state.searchQuery.trim().toLowerCase();
      const matchQ =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.categoryName.toLowerCase().includes(q) ||
        e.note.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    const hl = state.highlightKey;

    container.innerHTML = `
      <div class="mg-exp-wrapper">
        <!-- Header & Period Filter -->
        <div class="mg-exp-header-card">
          <div class="mg-exp-title-group">
            <h2>
              <span>💸 Quản lý Chi phí — Nhà hàng Mộc Giang</span>
            </h2>
            <p>
              Tổng hợp chi phí thực tế theo 9 danh mục chuẩn tại cơ sở <strong>199 Hoàng Cầu, Đống Đa, Hà Nội</strong>
              (Đồng bộ trực tiếp từ Google Sheet &amp; Form · Đơn vị biểu đồ: <strong>Triệu VNĐ</strong>).
            </p>
          </div>
          <div class="mg-exp-header-actions">
            <div class="mg-exp-period-pills" role="group" aria-label="Chọn kỳ hiển thị chi phí">
              <button type="button" class="mg-exp-period-btn ${state.period === 'all' ? 'active' : ''}" data-exp-period="all">
                Tất cả 17/11–25/11
              </button>
              <button type="button" class="mg-exp-period-btn ${state.period === 'week_17_23' ? 'active' : ''}" data-exp-period="week_17_23">
                Tuần 17/11–23/11
              </button>
              <button type="button" class="mg-exp-period-btn ${state.period === 'last_7' ? 'active' : ''}" data-exp-period="last_7">
                7 ngày gần nhất
              </button>
            </div>
            <button type="button" class="mg-exp-action-btn" id="mg-btn-open-expense-form">
              <span>+ Nhập phiếu chi</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div class="mg-exp-kpi-grid">
          <div class="mg-exp-kpi-card" style="--kpi-accent: #3D1F0D; --kpi-bg: rgba(61, 31, 13, 0.1);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Tổng chi phí</span>
              <span class="mg-exp-kpi-icon">💰</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${data.formattedTotalTrieu}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span class="mg-exp-kpi-tag">${data.formattedTotalVnd} VNĐ</span>
              <span>${daysCount} ngày phát sinh</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: #2E6B22; --kpi-bg: rgba(46, 107, 34, 0.11);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Trung bình / Ngày</span>
              <span class="mg-exp-kpi-icon">📅</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillionSmart(avgPerDayTrieu, true)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ/ngày</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>≈ ${formatVndSpace(avgPerDayVnd)} VNĐ / ngày</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: ${topCat.color}; --kpi-bg: rgba(217, 119, 36, 0.12);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Khoản chi lớn nhất</span>
              <span class="mg-exp-kpi-icon">🏆</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${topCat.formattedTrieu}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ (${topCat.percent.toFixed(1).replace('.', ',')}%)</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <strong>${topCat.name}</strong>
              <span>${topCat.formattedVnd} VNĐ</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: #2B7BBB; --kpi-bg: rgba(43, 123, 187, 0.12);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Số khoản chi</span>
              <span class="mg-exp-kpi-icon">🧾</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${data.entries.length}</span>
              <span class="mg-exp-kpi-unit">phiếu chi thực tế</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>Đã đồng bộ từ Google Sheet Mộc Giang</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Charts Grid (Left: Bar Chart, Right: Pie Chart) -->
        <div class="mg-exp-charts-grid chart-split-grid">
          <!-- LEFT: Bar Chart (Stacked Daily OR By Category) -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">📊 Biểu đồ cột Chi phí (Đơn vị: Triệu VNĐ)</h3>
                <p class="mg-exp-card-subtitle">
                  ${
                    state.barMode === 'stacked'
                      ? 'Biểu đồ cột chồng theo ngày phân tách theo 9 danh mục chi phí'
                      : 'Biểu đồ so sánh tổng chi phí từng nhóm trong 9 danh mục'
                  }
                </p>
              </div>
              <div class="mg-exp-period-pills" role="group" aria-label="Chế độ biểu đồ cột">
                <button type="button" class="mg-exp-period-btn ${state.barMode === 'stacked' ? 'active' : ''}" data-bar-mode="stacked">
                  Theo ngày (cột chồng)
                </button>
                <button type="button" class="mg-exp-period-btn ${state.barMode === 'by_category' ? 'active' : ''}" data-bar-mode="by_category">
                  Theo loại chi phí
                </button>
              </div>
            </div>

            <div class="mg-exp-barchart-wrap">
              ${
                state.barMode === 'stacked'
                  ? buildStackedDailyBarSVG(data.byDay)
                  : buildByCategoryBarSVG(data.byCategory)
              }
            </div>

            <!-- 9-Color Legend -->
            <div class="mg-exp-9legend-grid">
              ${data.byCategory
                .map(
                  (c) => `
                <div class="mg-exp-9legend-chip ${hl === c.key ? 'is-active' : ''} ${hl && hl !== c.key ? 'is-dimmed' : ''}"
                     data-toggle-cat="${c.key}">
                  <span class="mg-exp-legend-swatch" style="background: ${c.color};"></span>
                  <span>${c.name}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- RIGHT: Pie Chart + 9-Category Breakdown Legend -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">🥧 Biểu đồ tròn Cơ cấu Chi phí (%)</h3>
                <p class="mg-exp-card-subtitle">
                  Tỷ trọng % từng loại chi phí trong tổng <strong>${data.formattedTotalVnd} VNĐ</strong> (${data.formattedTotalTrieu} tr)
                </p>
              </div>
              <span class="mg-exp-kpi-tag">9 danh mục</span>
            </div>

            <div class="mg-exp-pie-container">
              <div class="mg-exp-pie-svg-wrap">
                ${buildPieChartSVG(data.byCategory)}
              </div>

              <div class="mg-exp-pie-legend">
                ${data.byCategory
                  .map(
                    (c) => `
                  <div class="mg-exp-legend-item ${hl === c.key ? 'is-active' : ''} ${c.vnd === 0 ? 'is-zero' : ''}"
                       data-toggle-cat="${c.key}">
                    <span class="mg-exp-legend-swatch" style="background: ${c.color};"></span>
                    <span class="mg-exp-legend-name">${c.name}</span>
                    <span class="mg-exp-legend-vnd">${c.formattedVnd} đ</span>
                    <span class="mg-exp-legend-trieu">${c.vnd > 0 ? c.formattedTrieu + ' tr' : '0 tr'}</span>
                    <span class="mg-exp-legend-pct">${c.percent.toFixed(1).replace('.', ',')}%</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown Table (One column per non-zero category + total) -->
        <div class="mg-exp-table-card">
          <div class="mg-exp-card-head">
            <div>
              <h3 class="mg-exp-card-title">📋 Bảng kê chi phí theo ngày</h3>
              <p class="mg-exp-card-subtitle">
                Tổng hợp chi phí từng ngày theo các danh mục có phát sinh (Hiển thị Triệu VNĐ &amp; VNĐ)
              </p>
            </div>
          </div>
          <div class="mg-exp-table-wrap">
            <table class="mg-exp-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  ${tableCats
                    .map(
                      (c) => `
                    <th style="text-align: right; color: ${c.color};">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${c.color};margin-right:4px;"></span>
                      ${c.name}
                    </th>
                  `
                    )
                    .join('')}
                  <th style="text-align: right;">Tổng ngày (VNĐ)</th>
                  <th style="text-align: right;">Quy đổi (Triệu VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                ${data.byDay
                  .map(
                    (d) => `
                  <tr>
                    <td><strong>${d.label}</strong></td>
                    ${tableCats
                      .map((c) => {
                        const v = Number(d[c.key]) || 0;
                        return `<td style="text-align: right; font-variant-numeric: tabular-nums;">
                          ${v > 0 ? `${formatVndSpace(v)} đ` : '0'}
                        </td>`;
                      })
                      .join('')}
                    <td style="text-align: right; font-weight: 800; color: #3D1F0D; font-variant-numeric: tabular-nums;">
                      ${formatVndSpace(d.totalVnd)} VNĐ
                    </td>
                    <td style="text-align: right; font-weight: 800; color: #2E6B22; font-variant-numeric: tabular-nums;">
                      ${formatMillionSmart(d.totalTrieu, true)} tr
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td>Tổng cộng (${data.byDay.length} ngày)</td>
                  ${tableCats
                    .map((c) => `<td style="text-align: right; color: ${c.color};">${c.formattedVnd} đ</td>`)
                    .join('')}
                  <td style="text-align: right; color: #3D1F0D;">${data.formattedTotalVnd} VNĐ</td>
                  <td style="text-align: right; color: #2E6B22;">${data.formattedTotalTrieu} Triệu VNĐ</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Entries List with Người kê khai, Loại chi phí & Ảnh minh chứng -->
        <div class="mg-exp-table-card">
          <div class="mg-exp-card-head">
            <div>
              <h3 class="mg-exp-card-title">📸 Danh sách phiếu chi &amp; Ảnh minh chứng (${filteredEntries.length} phiếu)</h3>
              <p class="mg-exp-card-subtitle">
                Chi tiết từng phiếu chi thực tế đồng bộ từ Google Sheet &amp; Google Drive
              </p>
            </div>
            <div class="mg-exp-table-controls">
              <select class="mg-exp-select" id="mg-exp-cat-filter" aria-label="Lọc theo loại chi phí">
                <option value="all" ${state.categoryFilter === 'all' ? 'selected' : ''}>Tất cả 9 loại chi phí</option>
                ${EXPENSE_CATEGORIES.map(
                  (c) => `<option value="${c.key}" ${state.categoryFilter === c.key ? 'selected' : ''}>${c.name}</option>`
                ).join('')}
              </select>
              <input type="search"
                     class="mg-exp-search"
                     id="mg-exp-search-input"
                     placeholder="Tìm ngày, người kê khai, ghi chú..."
                     value="${state.searchQuery.replace(/"/g, '&quot;')}" />
            </div>
          </div>

          <div class="mg-exp-table-wrap">
            <table class="mg-exp-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Người kê khai</th>
                  <th>Loại chi phí</th>
                  <th>Ghi chú</th>
                  <th style="text-align: right;">Số tiền (VNĐ)</th>
                  <th style="text-align: right;">Quy đổi (Triệu VNĐ)</th>
                  <th>Ảnh minh chứng</th>
                </tr>
              </thead>
              <tbody>
                ${
                  filteredEntries.length === 0
                    ? `<tr><td colspan="7" style="text-align:center;padding:24px;color:#695342;">Không tìm thấy phiếu chi phù hợp.</td></tr>`
                    : filteredEntries
                        .map(
                          (item) => `
                        <tr>
                          <td>
                            <div><strong>${item.date}</strong></div>
                            <div style="font-size:11.5px;color:#695342;"><code>${item.id}</code></div>
                          </td>
                          <td><strong>${item.fullName}</strong></td>
                          <td>
                            <span class="mg-exp-cat-pill">
                              <span style="width:8px;height:8px;border-radius:50%;background:${item.categoryColor};display:inline-block;"></span>
                              ${item.categoryName}
                            </span>
                          </td>
                          <td>${item.note}</td>
                          <td style="text-align: right; font-weight: 800; color: #3D1F0D; font-variant-numeric: tabular-nums;">
                            ${item.formattedVnd} VNĐ
                          </td>
                          <td style="text-align: right; font-weight: 800; color: #2E6B22; font-variant-numeric: tabular-nums;">
                            ${item.formattedTrieu} tr
                          </td>
                          <td>
                            <button type="button" class="mg-receipt-thumb-btn" data-open-receipt="${item.id}">
                              <img class="mg-receipt-thumb-img" src="${item.receiptUrl}" alt="Minh chứng ${item.id}" />
                              <span>🔍 Xem ảnh</span>
                            </button>
                          </td>
                        </tr>
                      `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    bindExpensesEvents(container, data);
  };

  function bindExpensesEvents(container, data) {
    container.querySelectorAll('[data-exp-period]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.period = btn.getAttribute('data-exp-period');
        window.renderExpenses();
      });
    });

    container.querySelectorAll('[data-bar-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.barMode = btn.getAttribute('data-bar-mode');
        window.renderExpenses();
      });
    });

    const addBtn = container.querySelector('#mg-btn-open-expense-form');
    if (addBtn) {
      addBtn.addEventListener('click', () => window.openExpenseFormModal());
    }

    container.querySelectorAll('[data-toggle-cat], .mg-exp-pie-slice').forEach((el) => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-toggle-cat') || el.getAttribute('data-pie-key');
        if (!key) return;
        state.highlightKey = state.highlightKey === key ? null : key;
        hideTooltip();
        window.renderExpenses();
      });
    });

    // Bar hover tooltips
    container.querySelectorAll('.mg-exp-bar-seg').forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        const mode = el.getAttribute('data-bar-mode');
        const catKey = el.getAttribute('data-cat-key');
        const catObj = CATEGORY_MAP[catKey] || EXPENSE_CATEGORIES[0];

        if (mode === 'stacked') {
          const dayIdx = Number(el.getAttribute('data-day-idx'));
          const day = data.byDay[dayIdx];
          if (!day) return;
          const vnd = Number(day[catKey]) || 0;
          const trieu = vnd / 1000000;
          const pct = day.totalVnd > 0 ? ((vnd / day.totalVnd) * 100).toFixed(1).replace('.', ',') : '0,0';
          showTooltip(
            e,
            `
              <div style="font-weight:800;font-size:13px;margin-bottom:4px;color:#A8E096;">📅 Ngày ${day.label}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span style="width:10px;height:10px;border-radius:2px;background:${catObj.color};display:inline-block;"></span>
                <span>${catObj.name}</span>
              </div>
              <div>Số tiền: <strong>${formatVndSpace(vnd)} VNĐ</strong> (${formatMillionSmart(trieu, true)} tr · ${pct}%)</div>
              <div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.15);font-size:12px;">
                Tổng ngày: <strong>${formatVndSpace(day.totalVnd)} VNĐ</strong> (${formatMillionSmart(day.totalTrieu, true)} tr)
              </div>
            `
          );
        } else {
          const catData = data.byCategory.find((c) => c.key === catKey);
          if (!catData) return;
          showTooltip(
            e,
            `
              <div style="display:flex;align-items:center;gap:6px;font-weight:800;font-size:13px;margin-bottom:4px;color:#A8E096;">
                <span style="width:10px;height:10px;border-radius:2px;background:${catData.color};display:inline-block;"></span>
                <span>${catData.name}</span>
              </div>
              <div>Số tiền: <strong>${catData.formattedVnd} VNĐ</strong> (${catData.formattedTrieu} tr)</div>
              <div>Tỷ trọng: <strong>${catData.percent.toFixed(1).replace('.', ',')}%</strong> (${catData.count} phiếu chi)</div>
            `
          );
        }
      });
      el.addEventListener('mousemove', moveTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });

    // Pie slice tooltips
    container.querySelectorAll('.mg-exp-pie-slice').forEach((el) => {
      const key = el.getAttribute('data-pie-key');
      const catData = data.byCategory.find((c) => c.key === key);
      if (!catData) return;
      el.addEventListener('mouseenter', (e) => {
        showTooltip(
          e,
          `
            <div style="display:flex;align-items:center;gap:6px;font-weight:800;font-size:13px;margin-bottom:4px;color:#A8E096;">
              <span style="width:10px;height:10px;border-radius:2px;background:${catData.color};display:inline-block;"></span>
              <span>${catData.name}</span>
            </div>
            <div>Số tiền: <strong>${catData.formattedVnd} VNĐ</strong> (${catData.formattedTrieu} tr)</div>
            <div>Tỷ trọng: <strong>${catData.percent.toFixed(1).replace('.', ',')}%</strong></div>
          `
        );
      });
      el.addEventListener('mousemove', moveTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });

    container.querySelectorAll('[data-open-receipt]').forEach((btn) => {
      btn.addEventListener('click', () => window.openReceiptLightbox(btn.getAttribute('data-open-receipt')));
    });

    const catSelect = container.querySelector('#mg-exp-cat-filter');
    if (catSelect) {
      catSelect.addEventListener('change', () => {
        state.categoryFilter = catSelect.value;
        window.renderExpenses();
      });
    }

    const searchInput = container.querySelector('#mg-exp-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.searchQuery = searchInput.value;
        const pos = searchInput.selectionStart;
        window.renderExpenses();
        const nextInput = document.getElementById('mg-exp-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }
  }

  // Legacy aliases so overview/old callers never break
  window.renderFixedExpenses = window.renderExpenses;
  window.renderVariableExpenses = window.renderExpenses;

  // ============================================================================
  // 11. AUTO-INITIALIZE ON DOMContentLoaded
  // ============================================================================
  function initExpensesView() {
    try {
      window.renderExpenses();
      if (typeof window.syncFromGoogleDrive === 'function') {
        Promise.resolve(window.syncFromGoogleDrive({ silent: true }))
          .then(() => {
            window.renderExpenses();
            if (typeof window.renderOverview === 'function') {
              window.renderOverview();
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error('[MocGiang Expenses] Render error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpensesView);
  } else {
    initExpensesView();
  }
})();
