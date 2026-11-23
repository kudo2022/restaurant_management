/**
 * MỘC GIANG RESTAURANT MANAGEMENT — EXPENSES MODULE (CHI PHÍ CỐ ĐỊNH & CHI PHÍ BIẾN ĐỘNG)
 * Cơ sở: 199 Hoàng Cầu, Đống Đa, Hà Nội | Hotline: 096 3689077
 * Exposes:
 *   - window.renderFixedExpenses()    -> renders into #view-expenses-fixed
 *   - window.renderVariableExpenses() -> renders into #view-expenses-variable
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. SELF-CONTAINED FALLBACK DATA (November 2026 — Đơn vị: Triệu VNĐ)
  // ============================================================================
  const VAR_CATEGORY_CONFIG = {
    suatCom: {
      id: 'suatCom',
      key: 'suatCom',
      name: 'Suất cơm',
      fullName: 'Chi phí Suất cơm (Gạo tám, thịt cá, rau củ & hộp cơm)',
      shortName: 'Suất cơm',
      color: '#2E6B22',
      gradientStart: '#3B842D',
      gradientEnd: '#24551A',
      note: 'Nguyên liệu chế biến suất cơm nhà Mộc Giang (thịt, cá kho, rau theo mùa, gạo tám Hải Hậu)'
    },
    doUong: {
      id: 'doUong',
      key: 'doUong',
      name: 'Đồ uống',
      fullName: 'Chi phí Đồ uống (Trà thảo mộc, nước mơ, sấu, cam tươi)',
      shortName: 'Đồ uống',
      color: '#2B7BBB',
      gradientStart: '#388FD4',
      gradientEnd: '#23669E',
      note: 'Nguyên liệu pha chế đồ uống & ly nước Mộc Giang (“Đậm đà ly nước”)'
    },
    banhBao: {
      id: 'banhBao',
      key: 'banhBao',
      name: 'Bánh bao',
      fullName: 'Chi phí Bánh bao (Bột mì, nhân thịt trứng cút, nấm hương)',
      shortName: 'Bánh bao',
      color: '#D97724',
      gradientStart: '#E88835',
      gradientEnd: '#C06316',
      note: 'Nguyên liệu làm bánh bao thủ công & điểm tâm kèm suất ăn'
    }
  };

  const DEFAULT_EXPENSES_DATA = {
    monthlyRevenue: 486.5, // Triệu VNĐ (Tổng doanh thu tháng 11/2026)

    // --- CHI PHÍ CỐ ĐỊNH (FIXED EXPENSES — Tổng: 118,0 Triệu VNĐ) ---
    fixed: {
      totalMonth: 118.0,
      daysInMonth: 30,
      categories: [
        {
          id: 'rent',
          name: 'Thuê mặt bằng (199 Hoàng Cầu)',
          shortName: 'Thuê mặt bằng',
          percent: 42,
          amount: 49.56,
          color: '#3D1F0D',
          note: 'Thanh toán tiền thuê mặt bằng 3 tầng tại 199 Hoàng Cầu, Đống Đa, Hà Nội'
        },
        {
          id: 'salary_fixed',
          name: 'Lương nhân sự cố định (Bếp & Quản lý)',
          shortName: 'Lương nhân sự cố định',
          percent: 33,
          amount: 38.94,
          color: '#2E6B22',
          note: 'Bếp trưởng, 4 đầu bếp cơm nhà, 2 pha chế chính, 1 quản lý cơ sở'
        },
        {
          id: 'depreciation',
          name: 'Khấu hao thiết bị & Bảo trì định kỳ',
          shortName: 'Khấu hao & Bảo trì',
          percent: 11,
          amount: 12.98,
          color: '#D97724',
          note: 'Khấu hao bếp công nghiệp, tủ mát, máy pha trà & nội thất gỗ'
        },
        {
          id: 'pos_internet',
          name: 'Phần mềm POS, Internet & Bản quyền',
          shortName: 'POS & Internet',
          percent: 8,
          amount: 9.44,
          color: '#2B7BBB',
          note: 'Phần mềm quản lý bán hàng POS, hóa đơn điện tử & cáp quang doanh nghiệp'
        },
        {
          id: 'insurance_security',
          name: 'Bảo hiểm, An ninh & Vệ sinh cố định',
          shortName: 'Bảo hiểm & An ninh',
          percent: 6,
          amount: 7.08,
          color: '#8C5A3C',
          note: 'BHXH nhân sự chính thức, phí PCCC, an ninh & vệ sinh môi trường đô thị'
        }
      ],
      dailyRecords: [
        {
          date: '01/11',
          fullDate: '01/11/2026',
          amount: 49.56,
          code: 'CPCĐ-1101',
          categoryId: 'rent',
          categoryName: 'Thuê mặt bằng (199 Hoàng Cầu)',
          description: 'Thanh toán tiền thuê mặt bằng tháng 11/2026 (Tầng 1–3 tại 199 Hoàng Cầu)',
          approvedBy: 'Quản trị Mộc Giang',
          status: 'Đã tất toán'
        },
        {
          date: '03/11',
          fullDate: '03/11/2026',
          amount: 5.44,
          code: 'CPCĐ-1103',
          categoryId: 'pos_internet',
          categoryName: 'Phần mềm POS, Internet & Bản quyền',
          description: 'Phí gia hạn iPOS, chữ ký số, cáp quang Viettel doanh nghiệp',
          approvedBy: 'Nguyễn Thu Hà',
          status: 'Đã tất toán'
        },
        {
          date: '05/11',
          fullDate: '05/11/2026',
          amount: 18.50,
          code: 'CPCĐ-1105',
          categoryId: 'salary_fixed',
          categoryName: 'Lương nhân sự cố định (Bếp & Quản lý)',
          description: 'Tạm ứng lương cố định đợt 1 cho Bếp trưởng, Bếp chính & Quản lý ca',
          approvedBy: 'Quản trị Mộc Giang',
          status: 'Đã tất toán'
        },
        {
          date: '08/11',
          fullDate: '08/11/2026',
          amount: 4.20,
          code: 'CPCĐ-1108',
          categoryId: 'insurance_security',
          categoryName: 'Bảo hiểm, An ninh & Vệ sinh cố định',
          description: 'Phí vệ sinh môi trường, bảo vệ trông xe phố Hoàng Cầu',
          approvedBy: 'Nguyễn Thu Hà',
          status: 'Đã tất toán'
        },
        {
          date: '10/11',
          fullDate: '10/11/2026',
          amount: 6.48,
          code: 'CPCĐ-1110',
          categoryId: 'depreciation',
          categoryName: 'Khấu hao thiết bị & Bảo trì định kỳ',
          description: 'Bảo dưỡng hệ thống hút mùi bếp, tủ đông & nồi cơm niêu công nghiệp',
          approvedBy: 'Trần Quốc Tuấn',
          status: 'Đã tất toán'
        },
        {
          date: '15/11',
          fullDate: '15/11/2026',
          amount: 20.44,
          code: 'CPCĐ-1115',
          categoryId: 'salary_fixed',
          categoryName: 'Lương nhân sự cố định (Bếp & Quản lý)',
          description: 'Quyết toán lương cố định đợt 2 & phụ cấp trách nhiệm nhân sự biên chế',
          approvedBy: 'Quản trị Mộc Giang',
          status: 'Đã tất toán'
        },
        {
          date: '18/11',
          fullDate: '18/11/2026',
          amount: 4.00,
          code: 'CPCĐ-1118',
          categoryId: 'pos_internet',
          categoryName: 'Phần mềm POS, Internet & Bản quyền',
          description: 'Phí duy trì hệ thống đặt bàn Web & tổng đài CSKH 096 3689077',
          approvedBy: 'Nguyễn Thu Hà',
          status: 'Đã tất toán'
        },
        {
          date: '20/11',
          fullDate: '20/11/2026',
          amount: 6.50,
          code: 'CPCĐ-1120',
          categoryId: 'depreciation',
          categoryName: 'Khấu hao thiết bị & Bảo trì định kỳ',
          description: 'Trích khấu hao tài sản cố định & điều hòa trung tâm tháng 11/2026',
          approvedBy: 'Trần Quốc Tuấn',
          status: 'Đã tất toán'
        },
        {
          date: '23/11',
          fullDate: '23/11/2026',
          amount: 2.88,
          code: 'CPCĐ-1123',
          categoryId: 'insurance_security',
          categoryName: 'Bảo hiểm, An ninh & Vệ sinh cố định',
          description: 'Bảo hiểm cháy nổ định kỳ & kiểm định an toàn thực phẩm cơ sở',
          approvedBy: 'Quản trị Mộc Giang',
          status: 'Đã duyệt'
        }
      ]
    },

    // --- CHI PHÍ BIẾN ĐỘNG THEO TỪNG TUẦN (1 TUẦN = 7 NGÀY, 3 CỘT: SUẤT CƠM, ĐỒ UỐNG, BÁNH BAO) ---
    variableWeeks: {
      week_17_23: {
        id: 'week_17_23',
        label: 'Tuần 17/11 – 23/11',
        fullLabel: 'Tuần 48 (17/11 – 23/11/2026)',
        xAxisTitle: 'Trục X: Ngày (17/11 – 23/11/2026)',
        yMax: 20,
        yStep: 5,
        days: [
          {
            date: '17/11',
            fullDate: '17/11/2026',
            dayLabel: 'Thứ 3',
            code: 'CPBĐ-1117',
            doUong: 5.8,
            suatCom: 9.8,
            banhBao: 3.9,
            note: 'Nhập nguyên liệu suất cơm trưa văn phòng, cốt trà thảo mộc & mẻ bánh bao sáng',
            supplier: 'HTX Rau sạch & Thực phẩm Mộc'
          },
          {
            date: '18/11',
            fullDate: '18/11/2026',
            dayLabel: 'Thứ 4',
            code: 'CPBĐ-1118',
            doUong: 6.1,
            suatCom: 10.6,
            banhBao: 4.1,
            note: 'Nguyên liệu suất cơm đoàn 25 khách, nước mơ/sấu tươi & bánh bao nhân thịt',
            supplier: 'NCC Thực phẩm An Việt'
          },
          {
            date: '19/11',
            fullDate: '19/11/2026',
            dayLabel: 'Thứ 5',
            code: 'CPBĐ-1119',
            doUong: 5.9,
            suatCom: 10.4,
            banhBao: 4.0,
            note: 'Thực phẩm tươi cho suất cơm niêu, trà hoa cúc mật ong & bột bánh bao',
            supplier: 'Trang trại Gà sạch Hòa Bình'
          },
          {
            date: '20/11',
            fullDate: '20/11/2026',
            dayLabel: 'Thứ 6',
            code: 'CPBĐ-1120',
            doUong: 7.8,
            suatCom: 15.6,
            banhBao: 5.4,
            note: 'Cao điểm lễ 20/11: tăng gấp rưỡi suất cơm đặt tiệc, đồ uống đóng chai & bánh bao',
            supplier: 'Tổng hợp NCC Thực phẩm & Đồ uống'
          },
          {
            date: '21/11',
            fullDate: '21/11/2026',
            dayLabel: 'Thứ 7',
            code: 'CPBĐ-1121',
            doUong: 7.2,
            suatCom: 14.1,
            banhBao: 5.1,
            note: 'Thứ Bảy đông khách gia đình: nguyên liệu suất cơm mâm, trà sâm dứa & bánh bao trứng cút',
            supplier: 'NCC Nông sản sạch Hà Nội'
          },
          {
            date: '22/11',
            fullDate: '22/11/2026',
            dayLabel: 'CN',
            code: 'CPBĐ-1122',
            doUong: 6.7,
            suatCom: 13.0,
            banhBao: 4.7,
            note: 'Chủ nhật: nguyên liệu suất cơm gia đình, nước thảo mộc & bánh bao nóng mang về',
            supplier: 'HTX Rau sạch & Đồ uống Mộc'
          },
          {
            date: '23/11',
            fullDate: '23/11/2026',
            dayLabel: 'Thứ 2',
            code: 'CPBĐ-1123',
            doUong: 5.6,
            suatCom: 10.2,
            banhBao: 4.2,
            note: 'Hôm nay (23/11): nhập thịt cá tươi cho suất cơm đầu tuần, trà sen & bánh bao',
            supplier: 'HTX Rau sạch & Thực phẩm Mộc'
          }
        ]
      },
      week_10_16: {
        id: 'week_10_16',
        label: 'Tuần 10/11 – 16/11',
        fullLabel: 'Tuần 47 (10/11 – 16/11/2026)',
        xAxisTitle: 'Trục X: Ngày (10/11 – 16/11/2026)',
        yMax: 20,
        yStep: 5,
        days: [
          {
            date: '10/11',
            fullDate: '10/11/2026',
            dayLabel: 'Thứ 3',
            code: 'CPBĐ-1110',
            doUong: 5.2,
            suatCom: 9.4,
            banhBao: 3.6,
            note: 'Nhập gạo tám Hải Hậu, thịt heo sinh học cho suất cơm, cốt trà & bột bánh bao',
            supplier: 'NCC Thực phẩm An Việt'
          },
          {
            date: '11/11',
            fullDate: '11/11/2026',
            dayLabel: 'Thứ 4',
            code: 'CPBĐ-1111',
            doUong: 6.8,
            suatCom: 11.2,
            banhBao: 4.4,
            note: 'Đơn combo Suất cơm + Đồ uống + Bánh bao tăng mạnh dịp khuyến mãi 11/11',
            supplier: 'HTX Rau sạch & Thực phẩm Mộc'
          },
          {
            date: '12/11',
            fullDate: '12/11/2026',
            dayLabel: 'Thứ 5',
            code: 'CPBĐ-1112',
            doUong: 5.4,
            suatCom: 9.6,
            banhBao: 3.7,
            note: 'Nguyên liệu suất cơm cá kho tộ, cam sành pha chế & nhân bánh bao',
            supplier: 'NCC Nông sản sạch Hà Nội'
          },
          {
            date: '13/11',
            fullDate: '13/11/2026',
            dayLabel: 'Thứ 6',
            code: 'CPBĐ-1113',
            doUong: 6.3,
            suatCom: 11.8,
            banhBao: 4.3,
            note: 'Suất cơm liên hoan văn phòng tối Thứ 6, trà thảo mộc & bánh bao hấp',
            supplier: 'Trang trại Gà sạch Hòa Bình'
          },
          {
            date: '14/11',
            fullDate: '14/11/2026',
            dayLabel: 'Thứ 7',
            code: 'CPBĐ-1114',
            doUong: 7.0,
            suatCom: 13.5,
            banhBao: 4.8,
            note: 'Cuối tuần: thực phẩm suất cơm gia đình, đồ uống thảo mộc & bánh bao',
            supplier: 'NCC Thực phẩm & Đồ uống Mộc'
          },
          {
            date: '15/11',
            fullDate: '15/11/2026',
            dayLabel: 'CN',
            code: 'CPBĐ-1115',
            doUong: 6.5,
            suatCom: 12.6,
            banhBao: 4.5,
            note: 'Chủ nhật: nguyên liệu suất cơm niêu, nước mơ ngâm & bánh bao nhân thịt',
            supplier: 'HTX Rau sạch & Thực phẩm Mộc'
          },
          {
            date: '16/11',
            fullDate: '16/11/2026',
            dayLabel: 'Thứ 2',
            code: 'CPBĐ-1116',
            doUong: 5.1,
            suatCom: 9.1,
            banhBao: 3.5,
            note: 'Nhập nguyên liệu suất cơm đầu tuần, trà lá nếp & bánh bao điểm tâm',
            supplier: 'Chợ đầu mối & Làng nghề'
          }
        ]
      },
      week_03_09: {
        id: 'week_03_09',
        label: 'Tuần 03/11 – 09/11',
        fullLabel: 'Tuần 46 (03/11 – 09/11/2026)',
        xAxisTitle: 'Trục X: Ngày (03/11 – 09/11/2026)',
        yMax: 20,
        yStep: 5,
        days: [
          {
            date: '03/11',
            fullDate: '03/11/2026',
            dayLabel: 'Thứ 3',
            code: 'CPBĐ-1103',
            doUong: 5.0,
            suatCom: 9.0,
            banhBao: 3.5,
            note: 'Nguyên liệu suất cơm văn phòng Hoàng Cầu, trà sâm dứa & bánh bao sáng',
            supplier: 'NCC Thực phẩm An Việt'
          },
          {
            date: '04/11',
            fullDate: '04/11/2026',
            dayLabel: 'Thứ 4',
            code: 'CPBĐ-1104',
            doUong: 5.3,
            suatCom: 9.5,
            banhBao: 3.7,
            note: 'Nhập sườn non, gà ta cho suất cơm trưa, cam tươi & bột mì làm bánh bao',
            supplier: 'Trang trại Gà sạch Hòa Bình'
          },
          {
            date: '05/11',
            fullDate: '05/11/2026',
            dayLabel: 'Thứ 5',
            code: 'CPBĐ-1105',
            doUong: 5.1,
            suatCom: 9.2,
            banhBao: 3.6,
            note: 'Thực phẩm suất cơm nhà, trái cây pha chế đồ uống & bánh bao',
            supplier: 'NCC Nông sản sạch Hà Nội'
          },
          {
            date: '06/11',
            fullDate: '06/11/2026',
            dayLabel: 'Thứ 6',
            code: 'CPBĐ-1106',
            doUong: 6.2,
            suatCom: 11.4,
            banhBao: 4.2,
            note: 'Tăng cường suất cơm thứ Sáu, cốt trà thảo mộc & bánh bao',
            supplier: 'HTX Rau sạch & Thực phẩm Mộc'
          },
          {
            date: '07/11',
            fullDate: '07/11/2026',
            dayLabel: 'Thứ 7',
            code: 'CPBĐ-1107',
            doUong: 6.7,
            suatCom: 12.9,
            banhBao: 4.6,
            note: 'Cao điểm thứ Bảy: suất cơm gia đình, đồ uống thảo mộc & bánh bao',
            supplier: 'NCC Thực phẩm & Thủy sản tươi'
          },
          {
            date: '08/11',
            fullDate: '08/11/2026',
            dayLabel: 'CN',
            code: 'CPBĐ-1108',
            doUong: 6.4,
            suatCom: 12.3,
            banhBao: 4.4,
            note: 'Chủ nhật: nguyên liệu suất cơm mâm, nước sấu/mơ & bánh bao',
            supplier: 'HTX Rau sạch & Đồ uống Mộc'
          },
          {
            date: '09/11',
            fullDate: '09/11/2026',
            dayLabel: 'Thứ 2',
            code: 'CPBĐ-1109',
            doUong: 4.9,
            suatCom: 8.8,
            banhBao: 3.4,
            note: 'Đầu tuần: nhập gạo ST25/Hải Hậu cho suất cơm, trà sen & bánh bao',
            supplier: 'Đại lý Gạo & Trà Việt'
          }
        ]
      }
    }
  };

  // ============================================================================
  // 2. STATE & DATA NORMALIZATION
  // ============================================================================
  const state = {
    fixedRange: 'month_nov',      // 'month_nov' | 'last_10' | 'all_active'
    fixedCategoryFilter: 'all',
    fixedSearch: '',
    fixedHighlightCat: null,

    variableWeek: 'week_17_23',   // Always 1 week (7 days) at a time: 'week_17_23' | 'week_10_16' | 'week_03_09'
    variableSearch: '',
    variableHighlightCat: null,   // 'suatCom' | 'doUong' | 'banhBao' | null
    variablePieMode: 'pie'        // 'pie' | 'donut'
  };

  function getNormalizedData() {
    const ext = window.MocGiangData || {};
    const monthlyRevenue =
      (ext.summary && Number(ext.summary.totalRevenue)) ||
      (ext.revenue && Number(ext.revenue.total)) ||
      Number(ext.monthlyRevenue) ||
      DEFAULT_EXPENSES_DATA.monthlyRevenue;

    // Check if window.MocGiangData.variableExpenses has weekly 3-category data
    const variableWeeks = JSON.parse(JSON.stringify(DEFAULT_EXPENSES_DATA.variableWeeks));
    const extVar = ext.variableExpenses;
    if (extVar) {
      if (extVar.weeks && typeof extVar.weeks === 'object') {
        Object.keys(extVar.weeks).forEach((wkKey) => {
          const wk = extVar.weeks[wkKey];
          if (wk && Array.isArray(wk.days || wk.items) && (wk.days || wk.items).length === 7) {
            const rawDays = wk.days || wk.items;
            variableWeeks[wkKey] = {
              id: wkKey,
              label: wk.label || (variableWeeks[wkKey] && variableWeeks[wkKey].label) || wkKey,
              fullLabel: wk.fullLabel || wk.label || wkKey,
              xAxisTitle: wk.xAxisTitle || `Trục X: Ngày (${wk.label || '7 ngày'})`,
              yMax: wk.yMax || 20,
              yStep: wk.yStep || 5,
              days: rawDays.map((d, i) => ({
                date: d.date,
                fullDate: d.fullDate || `${d.date}/2026`,
                dayLabel: d.dayLabel || '',
                code: d.code || `CPBĐ-${String(d.date || i).replace('/', '')}`,
                suatCom: Number(d.suatCom ?? d.rice ?? d.meals ?? 10),
                doUong: Number(d.doUong ?? d.drink ?? d.drinks ?? 6),
                banhBao: Number(d.banhBao ?? d.bun ?? d.buns ?? 4),
                note: d.note || 'Chi phí biến động: Suất cơm, Đồ uống & Bánh bao',
                supplier: d.supplier || 'HTX Rau sạch & Thực phẩm Mộc'
              }))
            };
          }
        });
      } else if (Array.isArray(extVar.byDay) && extVar.byDay.length === 7 && extVar.byDay[0].suatCom !== undefined) {
        variableWeeks.week_17_23.days = extVar.byDay.map((d, i) => ({
          date: d.date,
          fullDate: d.fullDate || `${d.date}/2026`,
          dayLabel: d.dayLabel || '',
          code: d.code || `CPBĐ-11${17 + i}`,
          suatCom: Number(d.suatCom) || 0,
          doUong: Number(d.doUong) || 0,
          banhBao: Number(d.banhBao) || 0,
          note: d.note || 'Chi phí biến động: Suất cơm, Đồ uống & Bánh bao',
          supplier: d.supplier || 'HTX Rau sạch & Thực phẩm Mộc'
        }));
      }
    }

    return {
      monthlyRevenue: monthlyRevenue > 0 ? monthlyRevenue : 486.5,
      fixed: DEFAULT_EXPENSES_DATA.fixed,
      variableWeeks: variableWeeks
    };
  }

  function formatMillion(val, decimals = 2) {
    const num = Number(val) || 0;
    return num.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatMillionOneDec(val) {
    const num = Number(val) || 0;
    return num.toFixed(1).replace('.', ',');
  }

  function formatMillionCompact(val) {
    const num = Number(val) || 0;
    const isInt = Math.abs(num - Math.round(num)) < 0.005;
    return num.toLocaleString('vi-VN', {
      minimumFractionDigits: isInt ? 0 : 1,
      maximumFractionDigits: 2
    });
  }

  // ============================================================================
  // 3. SCOPED STYLES INJECTION
  // ============================================================================
  function ensureExpensesStyles() {
    if (document.getElementById('mg-expenses-styles')) return;
    const style = document.createElement('style');
    style.id = 'mg-expenses-styles';
    style.textContent = `
      .mg-exp-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding-bottom: 32px;
        color: var(--text-primary, #24160B);
        font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      /* Sub-navigation Switcher Bar (Chi phí cố định <-> Chi phí biến động) */
      .mg-exp-subnav-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 14px;
        background: var(--card-bg, #FFFFFF);
        border: 1px solid var(--border-color, #E6DEC8);
        border-radius: 14px;
        padding: 12px 18px;
        box-shadow: 0 2px 10px rgba(61, 31, 13, 0.04);
      }

      .mg-exp-subnav-tabs {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--bg-secondary, #F4EDE0);
        padding: 5px;
        border-radius: 11px;
        border: 1px solid var(--border-color, #E6DEC8);
      }

      .mg-exp-subnav-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 16px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-secondary, #695342);
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
      }

      .mg-exp-subnav-btn:hover {
        color: var(--text-primary, #24160B);
        background: rgba(61, 31, 13, 0.05);
      }

      .mg-exp-subnav-btn.active {
        background: #2E6B22;
        color: #FFFFFF;
        box-shadow: 0 2px 8px rgba(46, 107, 34, 0.28);
      }

      .mg-exp-subnav-btn .mg-badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.85;
      }

      .mg-exp-branch-note {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 12.5px;
        color: var(--text-secondary, #695342);
        font-weight: 500;
      }

      .mg-exp-branch-pill {
        background: rgba(46, 107, 34, 0.11);
        color: #2E6B22;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
      }

      /* Page Header & Time Filter */
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
        letter-spacing: -0.01em;
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

      .mg-exp-filter-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .mg-exp-filter-label {
        font-size: 12.5px;
        font-weight: 600;
        color: var(--text-secondary, #695342);
        margin-right: 4px;
      }

      .mg-exp-period-pills {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 6px;
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
        padding: 7px 13px;
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
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .mg-exp-kpi-card[data-var-cat-toggle] {
        cursor: pointer;
      }

      .mg-exp-kpi-card[data-var-cat-toggle]:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(61, 31, 13, 0.08);
      }

      .mg-exp-kpi-card.is-highlighted {
        outline: 2px solid var(--kpi-accent, #2E6B22);
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
        display: flex;
        align-items: center;
        gap: 7px;
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
        flex-shrink: 0;
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

      /* 2-Column Main Charts Grid (Left: Bar Chart, Right: Pie Chart) */
      .mg-exp-charts-grid {
        display: grid;
        grid-template-columns: 1.42fr 1fr;
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
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mg-exp-card-subtitle {
        margin: 0;
        font-size: 12.5px;
        color: var(--text-secondary, #695342);
      }

      .mg-exp-axis-badges {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .mg-exp-axis-badge {
        font-size: 11.5px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 7px;
        background: var(--bg-secondary, #F4EDE0);
        color: var(--text-primary, #3D1F0D);
        border: 1px solid var(--border-color, #E6DEC8);
      }

      /* Bar Chart Container */
      .mg-exp-barchart-wrap {
        position: relative;
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

      .mg-exp-bar-group {
        cursor: pointer;
        transition: opacity 0.18s ease;
      }

      .mg-exp-bar-group:hover .mg-exp-bar-rect {
        filter: brightness(1.1);
      }

      .mg-exp-bar-group.is-dimmed {
        opacity: 0.25;
      }

      .mg-exp-cluster:hover .mg-exp-cluster-bg {
        fill: rgba(61, 31, 13, 0.04);
      }

      /* Legend under 3-Column Grouped Bar Chart */
      .mg-exp-grouped-legend {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 22px;
        padding-top: 12px;
        border-top: 1px dashed var(--border-color, #E6DEC8);
      }

      .mg-exp-grouped-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13.5px;
        font-weight: 700;
        color: var(--text-primary, #24160B);
        cursor: pointer;
        padding: 5px 11px;
        border-radius: 8px;
        border: 1px solid transparent;
        transition: all 0.15s ease;
        user-select: none;
      }

      .mg-exp-grouped-legend-item:hover {
        background: var(--bg-secondary, #FBF7EE);
        border-color: var(--border-color, #E6DEC8);
      }

      .mg-exp-grouped-legend-item.is-active {
        background: var(--bg-secondary, #FBF7EE);
        border-color: var(--text-primary, #24160B);
      }

      .mg-exp-grouped-legend-item.is-dimmed {
        opacity: 0.4;
      }

      .mg-exp-chart-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--border-color, #E6DEC8);
        font-size: 12.5px;
        color: var(--text-secondary, #695342);
      }

      /* Pie Chart Layout */
      .mg-exp-pie-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .mg-exp-pie-svg-wrap {
        position: relative;
        width: 245px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .mg-exp-pie-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .mg-exp-pie-slice {
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
        transform-origin: 120px 120px;
      }

      .mg-exp-pie-slice:hover,
      .mg-exp-pie-slice.is-active {
        transform: scale(1.045);
        filter: drop-shadow(0 4px 10px rgba(36, 22, 11, 0.22));
      }

      .mg-exp-pie-slice.is-dimmed {
        opacity: 0.3;
      }

      .mg-exp-pie-legend {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .mg-exp-legend-item {
        display: grid;
        grid-template-columns: 14px 1fr auto auto;
        align-items: center;
        gap: 10px;
        padding: 8px 11px;
        border-radius: 10px;
        background: var(--bg-secondary, #FBF7EE);
        border: 1px solid var(--border-color, #E6DEC8);
        cursor: pointer;
        transition: all 0.16s ease;
      }

      .mg-exp-legend-item:hover,
      .mg-exp-legend-item.is-active {
        background: rgba(46, 107, 34, 0.08);
        border-color: #2E6B22;
        transform: translateX(2px);
      }

      .mg-exp-legend-swatch {
        width: 13px;
        height: 13px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .mg-exp-legend-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary, #24160B);
        line-height: 1.35;
      }

      .mg-exp-legend-amount {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-primary, #24160B);
        white-space: nowrap;
      }

      .mg-exp-legend-pct {
        font-size: 12.5px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 6px;
        background: rgba(61, 31, 13, 0.08);
        color: var(--text-primary, #3D1F0D);
        min-width: 46px;
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

      .mg-exp-select:focus,
      .mg-exp-search:focus {
        border-color: #2E6B22;
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
        padding: 12px 13px;
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

      .mg-exp-status-pill {
        display: inline-flex;
        align-items: center;
        padding: 3px 9px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 700;
        background: rgba(46, 107, 34, 0.13);
        color: #2E6B22;
      }

      /* Floating Tooltip */
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
        max-width: 300px;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.12s ease, transform 0.12s ease;
      }

      .mg-exp-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Dark Mode Support */
      body.dark-mode .mg-exp-subnav-bar,
      body.dark .mg-exp-subnav-bar,
      [data-theme="dark"] .mg-exp-subnav-bar,
      body.dark-mode .mg-exp-header-card,
      body.dark .mg-exp-header-card,
      [data-theme="dark"] .mg-exp-header-card,
      body.dark-mode .mg-exp-kpi-card,
      body.dark .mg-exp-kpi-card,
      [data-theme="dark"] .mg-exp-kpi-card,
      body.dark-mode .mg-exp-chart-card,
      body.dark .mg-exp-chart-card,
      [data-theme="dark"] .mg-exp-chart-card,
      body.dark-mode .mg-exp-table-card,
      body.dark .mg-exp-table-card,
      [data-theme="dark"] .mg-exp-table-card {
        background: var(--card-bg, #1E1610);
        border-color: var(--border-color, #3A2A1D);
        color: var(--text-primary, #F5EFE6);
      }

      body.dark-mode .mg-exp-legend-item,
      body.dark .mg-exp-legend-item,
      [data-theme="dark"] .mg-exp-legend-item,
      body.dark-mode .mg-exp-subnav-tabs,
      body.dark .mg-exp-subnav-tabs,
      [data-theme="dark"] .mg-exp-subnav-tabs,
      body.dark-mode .mg-exp-period-pills,
      body.dark .mg-exp-period-pills,
      [data-theme="dark"] .mg-exp-period-pills {
        background: var(--bg-secondary, #2A1E15);
        border-color: var(--border-color, #3A2A1D);
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // 4. TOOLTIP HELPER
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

  function showTooltip(evt, htmlContent) {
    const tip = getTooltip();
    tip.innerHTML = htmlContent;
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
    if (x + rect.width > window.innerWidth - 12) {
      x = evt.clientX - rect.width - pad;
    }
    if (y + rect.height > window.innerHeight - 12) {
      y = evt.clientY - rect.height - pad;
    }
    tip.style.left = `${Math.max(8, x)}px`;
    tip.style.top = `${Math.max(8, y)}px`;
  }

  function hideTooltip() {
    const tip = getTooltip();
    tip.classList.remove('visible');
  }

  // ============================================================================
  // 5. NAVIGATION HELPER (Sub-navigation between Fixed & Variable Expenses)
  // ============================================================================
  function navigateExpenseSubView(targetViewId) {
    if (typeof window.switchView === 'function') {
      window.switchView(targetViewId);
      return;
    }
    document.querySelectorAll('.app-view').forEach((el) => {
      el.classList.toggle('active', el.id === targetViewId);
    });
    document.querySelectorAll('[data-target]').forEach((nav) => {
      nav.classList.toggle('active', nav.getAttribute('data-target') === targetViewId);
    });
  }

  function buildSubNavBar(activeType) {
    const isFixed = activeType === 'fixed';
    return `
      <div class="mg-exp-subnav-bar">
        <div class="mg-exp-subnav-tabs" role="tablist" aria-label="Phân mục Chi phí">
          <button type="button"
                  class="mg-exp-subnav-btn ${isFixed ? 'active' : ''}"
                  data-switch-expense="view-expenses-fixed">
            <span class="mg-badge-dot"></span>
            <span>Chi phí cố định</span>
          </button>
          <button type="button"
                  class="mg-exp-subnav-btn ${!isFixed ? 'active' : ''}"
                  data-switch-expense="view-expenses-variable">
            <span class="mg-badge-dot"></span>
            <span>Chi phí biến động</span>
          </button>
        </div>
        <div class="mg-exp-branch-note">
          <span class="mg-exp-branch-pill">Nhà hàng Mộc Giang · 199 Hoàng Cầu</span>
          <span>Đơn vị tiền tệ: <strong>Triệu VNĐ</strong></span>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 6. SVG SINGLE-BAR CHART GENERATOR (FOR FIXED EXPENSES)
  // ============================================================================
  function buildSingleBarChartSVG(items, options) {
    const {
      yMaxForced = null,
      yStep = 10,
      barColor = '#3D1F0D',
      barAccentColor = '#2E6B22',
      highlightCatColorMap = null,
      chartType = 'fixed'
    } = options || {};

    const svgWidth = Math.max(620, items.length * 46 + 110);
    const svgHeight = 340;
    const padLeft = 64;
    const padRight = 24;
    const padTop = 32;
    const padBottom = 64;
    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    const maxVal = Math.max(...items.map((d) => Number(d.amount) || 0), 1);
    const yMax = yMaxForced || Math.ceil((maxVal * 1.15) / yStep) * yStep;
    const numSteps = Math.max(4, Math.round(yMax / yStep));

    let gridLinesHtml = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (yMax / numSteps) * i;
      const y = padTop + plotHeight - (val / yMax) * plotHeight;
      const isZero = i === 0;
      gridLinesHtml += `
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

    const slotWidth = plotWidth / Math.max(items.length, 1);
    const barWidth = Math.min(34, Math.max(15, slotWidth * 0.56));

    let barsHtml = '';
    items.forEach((item, idx) => {
      const val = Number(item.amount) || 0;
      const barH = Math.max(4, (val / yMax) * plotHeight);
      const cx = padLeft + slotWidth * idx + slotWidth / 2;
      const x = cx - barWidth / 2;
      const y = padTop + plotHeight - barH;

      const fill =
        (highlightCatColorMap && item.categoryId && highlightCatColorMap[item.categoryId]) ||
        (idx === items.length - 1 ? barAccentColor : barColor);

      barsHtml += `
        <g class="mg-exp-bar-group" data-bar-idx="${idx}" data-chart-type="${chartType}">
          <rect x="${(cx - slotWidth / 2).toFixed(1)}" y="${padTop}" width="${slotWidth.toFixed(1)}" height="${plotHeight}" fill="transparent" />
          <rect class="mg-exp-bar-rect"
                x="${x.toFixed(1)}"
                y="${y.toFixed(1)}"
                width="${barWidth.toFixed(1)}"
                height="${barH.toFixed(1)}"
                rx="6"
                fill="${fill}" />
          <text x="${cx.toFixed(1)}"
                y="${Math.max(14, y - 7).toFixed(1)}"
                text-anchor="middle"
                fill="#24160B"
                font-size="10.5"
                font-weight="700">${formatMillionCompact(val)} tr</text>
          <text x="${cx.toFixed(1)}"
                y="${(padTop + plotHeight + 20).toFixed(1)}"
                text-anchor="middle"
                fill="#4E3B2C"
                font-size="11.5"
                font-weight="700">${item.date}</text>
        </g>
      `;
    });

    const axisLabelsHtml = `
      <text x="${padLeft - 4}" y="15" text-anchor="start" fill="#3D1F0D" font-size="11.5" font-weight="800">
        ↑ Trục Y: Tiền (Đơn vị: Triệu VNĐ)
      </text>
      <text x="${(padLeft + plotWidth / 2).toFixed(1)}" y="${svgHeight - 10}" text-anchor="middle" fill="#3D1F0D" font-size="12" font-weight="800">
        Trục X: Ngày (Tháng 11/2026) →
      </text>
    `;

    return `
      <svg class="mg-exp-barchart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Biểu đồ cột chi phí cố định theo ngày">
        ${axisLabelsHtml}
        ${gridLinesHtml}
        ${barsHtml}
      </svg>
    `;
  }

  // ============================================================================
  // 6B. SVG 3-COLUMN GROUPED BAR CHART (FOR VARIABLE EXPENSES: SUẤT CƠM, ĐỒ UỐNG, BÁNH BAO)
  // Matches media_1795449557370_0e10e126.png (7 days = 1 week on X-axis, 3 colored bars per day)
  // ============================================================================
  function buildVariableGroupedBarSVG(weekDataset) {
    const days = weekDataset.days || [];
    const yMax = weekDataset.yMax || 20;
    const yStep = weekDataset.yStep || 5;
    const numTicks = Math.round(yMax / yStep);

    const svgWidth = 720;
    const svgHeight = 370;
    const padLeft = 72;
    const padRight = 24;
    const padTop = 34;
    const padBottom = 64;

    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;
    const groupCount = days.length || 7;
    const groupSlotW = plotW / groupCount;

    // 3 side-by-side bars per day matching screenshot
    const barWidth = Math.min(24, Math.max(13, Math.floor((groupSlotW * 0.68) / 3)));
    const barGap = Math.max(4, Math.floor(barWidth * 0.22));
    const totalClusterW = barWidth * 3 + barGap * 2;

    const hl = state.variableHighlightCat;

    const defs = `
      <defs>
        <linearGradient id="var-grad-doUong" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${VAR_CATEGORY_CONFIG.doUong.gradientStart}"/>
          <stop offset="100%" stop-color="${VAR_CATEGORY_CONFIG.doUong.gradientEnd}"/>
        </linearGradient>
        <linearGradient id="var-grad-suatCom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${VAR_CATEGORY_CONFIG.suatCom.gradientStart}"/>
          <stop offset="100%" stop-color="${VAR_CATEGORY_CONFIG.suatCom.gradientEnd}"/>
        </linearGradient>
        <linearGradient id="var-grad-banhBao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${VAR_CATEGORY_CONFIG.banhBao.gradientStart}"/>
          <stop offset="100%" stop-color="${VAR_CATEGORY_CONFIG.banhBao.gradientEnd}"/>
        </linearGradient>
      </defs>
    `;

    // Horizontal gridlines & Y-axis ticks (0 tr, 5 tr, 10 tr, 15 tr, 20 tr)
    let gridLinesHtml = '';
    for (let i = 0; i <= numTicks; i++) {
      const val = i * yStep;
      const ratio = val / yMax;
      const yPos = padTop + plotH - ratio * plotH;
      const isZero = i === 0;
      gridLinesHtml += `
        <g class="mg-exp-y-tick">
          <line x1="${padLeft}" y1="${yPos.toFixed(1)}" x2="${svgWidth - padRight}" y2="${yPos.toFixed(1)}"
                stroke="${isZero ? '#C8BCA6' : '#E6DEC8'}"
                stroke-width="${isZero ? '1.5' : '1'}" />
          <text x="${padLeft - 10}" y="${(yPos + 4).toFixed(1)}"
                text-anchor="end"
                fill="#6E5A49"
                font-size="11.5"
                font-weight="600">${val} tr</text>
        </g>
      `;
    }

    const yAxisHeader = `
      <text x="${padLeft}" y="18" fill="#6E5A49" font-size="11" font-weight="700">
        ▲ Trục Y: Số tiền (Đơn vị: Triệu VNĐ)
      </text>
    `;

    // Order of 3 bars per date matching reference image: Blue (Đồ uống), Green (Suất cơm), Orange (Bánh bao)
    const barOrder = ['doUong', 'suatCom', 'banhBao'];
    let clustersHtml = '';

    days.forEach((day, idx) => {
      const groupCenterX = padLeft + idx * groupSlotW + groupSlotW / 2;
      const clusterStartX = groupCenterX - totalClusterW / 2;
      const dayTotal = (Number(day.suatCom) || 0) + (Number(day.doUong) || 0) + (Number(day.banhBao) || 0);

      clustersHtml += `
        <g class="mg-exp-cluster" data-day-idx="${idx}" data-date="${day.date}">
          <rect class="mg-exp-cluster-bg"
                x="${(padLeft + idx * groupSlotW + 4).toFixed(1)}"
                y="${padTop}"
                width="${(groupSlotW - 8).toFixed(1)}"
                height="${plotH}"
                rx="6"
                fill="transparent" />
      `;

      barOrder.forEach((catKey, cIdx) => {
        const rawVal = Number(day[catKey]) || 0;
        const barH = Math.max(3, (Math.min(rawVal, yMax) / yMax) * plotH);
        const barX = clusterStartX + cIdx * (barWidth + barGap);
        const barY = padTop + plotH - barH;
        const cfg = VAR_CATEGORY_CONFIG[catKey];
        const pctOfDay = dayTotal > 0 ? ((rawVal / dayTotal) * 100).toFixed(1).replace('.', ',') : '0,0';
        const dimmedClass = hl && hl !== catKey ? ' is-dimmed' : '';

        clustersHtml += `
          <g class="mg-exp-bar-group${dimmedClass}"
             data-chart-type="variable-grouped"
             data-var-cat="${catKey}"
             data-day-idx="${idx}"
             data-date="${day.date}"
             data-fulldate="${day.dayLabel ? day.dayLabel + ', ' + day.fullDate : day.fullDate}"
             data-label="${cfg.name}"
             data-value="${formatMillionOneDec(rawVal)}"
             data-pct="${pctOfDay}"
             data-daytotal="${formatMillionOneDec(dayTotal)}">
            <rect class="mg-exp-bar-rect"
                  x="${barX.toFixed(1)}"
                  y="${barY.toFixed(1)}"
                  width="${barWidth}"
                  height="${barH.toFixed(1)}"
                  rx="3.5"
                  fill="url(#var-grad-${catKey})"
                  stroke="${cfg.color}"
                  stroke-width="0.5" />
            <text x="${(barX + barWidth / 2).toFixed(1)}"
                  y="${(barY - 6).toFixed(1)}"
                  text-anchor="middle"
                  fill="${cfg.color}"
                  font-size="10.5"
                  font-weight="700">${formatMillionOneDec(rawVal)}</text>
          </g>
        `;
      });

      clustersHtml += `
          <text x="${groupCenterX.toFixed(1)}"
                y="${padTop + plotH + 24}"
                text-anchor="middle"
                fill="#2C180A"
                font-size="12"
                font-weight="700">${day.date}</text>
        </g>
      `;
    });

    const xAxisFooter = `
      <text x="${(padLeft + plotW / 2).toFixed(1)}"
            y="${svgHeight - 10}"
            text-anchor="middle"
            fill="#6E5A49"
            font-size="11.5"
            font-weight="700">${weekDataset.xAxisTitle || 'Trục X: Ngày'}</text>
    `;

    return `
      <svg class="mg-exp-barchart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Biểu đồ cột nhóm 3 cột Chi phí biến động: Suất cơm, Đồ uống, Bánh bao">
        ${defs}
        ${yAxisHeader}
        ${gridLinesHtml}
        ${clustersHtml}
        ${xAxisFooter}
      </svg>
    `;
  }

  // ============================================================================
  // 7. SVG PIE CHART GENERATOR (% ON SLICES + INTERACTIVE LEGEND)
  // ============================================================================
  function polarToCartesian(cx, cy, r, angleInDegrees) {
    const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  function createPieSlicePath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', cx, cy,
      'L', start.x.toFixed(2), start.y.toFixed(2),
      'A', r, r, 0, largeArcFlag, 0, end.x.toFixed(2), end.y.toFixed(2),
      'Z'
    ].join(' ');
  }

  function buildPieChartSVG(categories, activeCatId, chartType, showLabelNameOnSlice = false) {
    const cx = 120;
    const cy = 120;
    const r = 106;
    const totalPct = categories.reduce((acc, c) => acc + (Number(c.percent) || 0), 0) || 100;

    let currentAngle = 0;
    let slicesHtml = '';

    categories.forEach((cat, idx) => {
      const pct = Number(cat.percent) || 0;
      const sliceAngle = (pct / totalPct) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      currentAngle = endAngle;

      const pathData = createPieSlicePath(cx, cy, r, startAngle, endAngle);
      const labelRadius = pct < 10 ? r * 0.72 : r * 0.6;
      const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);
      const isHighlighted = activeCatId === cat.id;
      const isDimmed = activeCatId && activeCatId !== cat.id;

      const pctDisplay = typeof cat.percentDisplay === 'string' ? cat.percentDisplay : `${pct}%`;

      slicesHtml += `
        <g class="mg-exp-pie-slice ${isHighlighted ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}"
           data-pie-cat="${cat.id}"
           data-pie-idx="${idx}"
           data-chart-type="${chartType}">
          <path d="${pathData}"
                fill="${cat.color}"
                stroke="#FFFFFF"
                stroke-width="2.4" />
          <text x="${labelPos.x.toFixed(1)}"
                y="${(showLabelNameOnSlice ? labelPos.y - 2 : labelPos.y + 4).toFixed(1)}"
                text-anchor="middle"
                fill="#FFFFFF"
                font-size="${pct < 9 ? '11' : '12.5'}"
                font-weight="800"
                style="text-shadow: 0 1px 3px rgba(0,0,0,0.45); pointer-events: none;">
            ${pctDisplay}
          </text>
          ${
            showLabelNameOnSlice
              ? `<text x="${labelPos.x.toFixed(1)}"
                       y="${(labelPos.y + 13).toFixed(1)}"
                       text-anchor="middle"
                       fill="#FFFFFF"
                       font-size="10.5"
                       font-weight="700"
                       style="text-shadow: 0 1px 3px rgba(0,0,0,0.45); pointer-events: none;">
                   ${cat.shortName || cat.name}
                 </text>`
              : ''
          }
        </g>
      `;
    });

    return `
      <svg class="mg-exp-pie-svg" viewBox="0 0 240 240" role="img" aria-label="Biểu đồ tròn tỷ trọng chi phí">
        ${slicesHtml}
      </svg>
    `;
  }

  // ============================================================================
  // 8. PART 1: RENDER CHI PHÍ CỐ ĐỊNH (#view-expenses-fixed)
  // ============================================================================
  function getFilteredFixedRecords(fixedData) {
    const all = fixedData.dailyRecords || [];
    if (state.fixedRange === 'last_10') {
      return all.slice(-5);
    }
    return all;
  }

  window.renderFixedExpenses = function renderFixedExpenses() {
    ensureExpensesStyles();
    const container = document.getElementById('view-expenses-fixed');
    if (!container) return;

    const data = getNormalizedData();
    const fixed = data.fixed;
    const recordsForChart = getFilteredFixedRecords(fixed);

    const periodTotal = recordsForChart.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const totalMonth = fixed.totalMonth || 118.0;
    const avgPerDay = totalMonth / (fixed.daysInMonth || 30);
    const largestCat = fixed.categories[0];
    const revenueRatio = ((totalMonth / data.monthlyRevenue) * 100).toFixed(1);

    const catColorMap = {};
    fixed.categories.forEach((c) => {
      catColorMap[c.id] = c.color;
    });

    const tableRecords = recordsForChart.filter((rec) => {
      const matchCat = state.fixedCategoryFilter === 'all' || rec.categoryId === state.fixedCategoryFilter;
      const q = state.fixedSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        rec.description.toLowerCase().includes(q) ||
        rec.categoryName.toLowerCase().includes(q) ||
        rec.code.toLowerCase().includes(q) ||
        rec.date.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    const tableSum = tableRecords.reduce((s, r) => s + (Number(r.amount) || 0), 0);

    container.innerHTML = `
      <div class="mg-exp-wrapper">
        ${buildSubNavBar('fixed')}

        <!-- Header & Time Range Filter -->
        <div class="mg-exp-header-card">
          <div class="mg-exp-title-group">
            <h2>
              <span>🏛️ Quản lý Chi phí cố định — Nhà hàng Mộc Giang</span>
            </h2>
            <p>
              Theo dõi các khoản định phí hàng tháng tại cơ sở <strong>199 Hoàng Cầu, Đống Đa, Hà Nội</strong>
              (Mặt bằng, Lương biên chế, Khấu hao thiết bị, POS &amp; Bảo hiểm).
            </p>
          </div>
          <div class="mg-exp-filter-group">
            <span class="mg-exp-filter-label">Kỳ hiển thị:</span>
            <div class="mg-exp-period-pills">
              <button type="button"
                      class="mg-exp-period-btn ${state.fixedRange === 'month_nov' ? 'active' : ''}"
                      data-fixed-range="month_nov">
                Tháng 11/2026 — Theo ngày
              </button>
              <button type="button"
                      class="mg-exp-period-btn ${state.fixedRange === 'last_10' ? 'active' : ''}"
                      data-fixed-range="last_10">
                10 ngày gần nhất
              </button>
              <button type="button"
                      class="mg-exp-period-btn ${state.fixedRange === 'all_active' ? 'active' : ''}"
                      data-fixed-range="all_active">
                Tất cả các ngày có phát sinh
              </button>
            </div>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div class="mg-exp-kpi-grid">
          <div class="mg-exp-kpi-card" style="--kpi-accent: #3D1F0D; --kpi-bg: rgba(61, 31, 13, 0.1);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Tổng chi phí cố định tháng</span>
              <span class="mg-exp-kpi-icon">🏦</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillion(totalMonth, 1)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span class="mg-exp-kpi-tag">100% đúng định mức</span>
              <span>Kỳ lọc: ${formatMillion(periodTotal, 2)} tr</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: #2E6B22; --kpi-bg: rgba(46, 107, 34, 0.11);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Trung bình / Ngày</span>
              <span class="mg-exp-kpi-icon">📅</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillion(avgPerDay, 2)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ/ngày</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>Phân bổ trên 30 ngày vận hành tháng 11/2026</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: #D97724; --kpi-bg: rgba(217, 119, 36, 0.13);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Khoản chi lớn nhất</span>
              <span class="mg-exp-kpi-icon">🏢</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillion(largestCat.amount, 2)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ (${largestCat.percent}%)</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <strong>Thuê mặt bằng 199 Hoàng Cầu</strong>
            </div>
          </div>

          <div class="mg-exp-kpi-card" style="--kpi-accent: #2B7BBB; --kpi-bg: rgba(43, 123, 187, 0.12);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Tỷ trọng / Doanh thu</span>
              <span class="mg-exp-kpi-icon">📊</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${revenueRatio}%</span>
              <span class="mg-exp-kpi-unit">Doanh thu tháng</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>So với ${formatMillion(data.monthlyRevenue, 1)} Triệu VNĐ doanh thu</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Chart Section (Left: Bar Chart, Right: Pie Chart) -->
        <div class="mg-exp-charts-grid chart-split-grid">
          <!-- LEFT: Biểu đồ cột Chi phí cố định -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">📊 Biểu đồ cột Chi phí cố định theo ngày</h3>
                <p class="mg-exp-card-subtitle">
                  Biểu diễn số tiền chi phí cố định phát sinh theo từng ngày trong tháng 11/2026 (Rê chuột vào cột để xem chi tiết)
                </p>
              </div>
              <div class="mg-exp-axis-badges">
                <span class="mg-exp-axis-badge">Trục X: Ngày</span>
                <span class="mg-exp-axis-badge">Trục Y: Tiền (Đơn vị: Triệu VNĐ)</span>
              </div>
            </div>

            <div class="mg-exp-barchart-wrap">
              ${buildSingleBarChartSVG(recordsForChart, {
                yMaxForced: 50,
                yStep: 10,
                barColor: '#3D1F0D',
                barAccentColor: '#2E6B22',
                highlightCatColorMap: catColorMap,
                chartType: 'fixed'
              })}
            </div>

            <div class="mg-exp-chart-footer">
              <span>💡 Đỉnh chi phí cố định vào ngày <strong>01/11 (49,56 tr — Thuê mặt bằng)</strong> và ngày <strong>05/11, 15/11 (Lương cố định)</strong>.</span>
              <span>Tổng kỳ hiển thị: <strong>${formatMillion(periodTotal, 2)} Triệu VNĐ</strong></span>
            </div>
          </div>

          <!-- RIGHT: Biểu đồ tròn Tỷ trọng Chi phí cố định (%) -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">🥧 Biểu đồ tròn Tỷ trọng Chi phí cố định (%)</h3>
                <p class="mg-exp-card-subtitle">
                  Cơ cấu phần trăm (%) từng loại chi phí cố định trong tổng ${formatMillion(totalMonth, 1)} Triệu VNĐ
                </p>
              </div>
              <span class="mg-exp-axis-badge">Tổng: 100%</span>
            </div>

            <div class="mg-exp-pie-container">
              <div class="mg-exp-pie-svg-wrap">
                ${buildPieChartSVG(fixed.categories, state.fixedHighlightCat, 'fixed', false)}
              </div>

              <div class="mg-exp-pie-legend">
                ${fixed.categories
                  .map(
                    (cat) => `
                  <div class="mg-exp-legend-item ${state.fixedHighlightCat === cat.id ? 'is-active' : ''}"
                       data-legend-cat="${cat.id}"
                       data-chart-type="fixed">
                    <span class="mg-exp-legend-swatch" style="background: ${cat.color};"></span>
                    <span class="mg-exp-legend-name">${cat.name}</span>
                    <span class="mg-exp-legend-amount">${formatMillion(cat.amount, 2)} tr</span>
                    <span class="mg-exp-legend-pct">${cat.percent}%</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Table below -->
        <div class="mg-exp-table-card">
          <div class="mg-exp-card-head">
            <div>
              <h3 class="mg-exp-card-title">📋 Bảng kê chi tiết các khoản Chi phí cố định theo ngày</h3>
              <p class="mg-exp-card-subtitle">
                Danh sách chứng từ thanh toán định phí tháng 11/2026 tại Nhà hàng Mộc Giang — 199 Hoàng Cầu
              </p>
            </div>
            <div class="mg-exp-table-controls">
              <select class="mg-exp-select" id="mg-fixed-cat-select" aria-label="Lọc theo loại chi phí cố định">
                <option value="all" ${state.fixedCategoryFilter === 'all' ? 'selected' : ''}>Tất cả loại chi phí cố định (5 nhóm)</option>
                ${fixed.categories
                  .map(
                    (c) => `
                  <option value="${c.id}" ${state.fixedCategoryFilter === c.id ? 'selected' : ''}>
                    ${c.name} (${c.percent}%)
                  </option>
                `
                  )
                  .join('')}
              </select>
              <input type="search"
                     class="mg-exp-search"
                     id="mg-fixed-search-input"
                     placeholder="Tìm ngày, mã phiếu, nội dung..."
                     value="${state.fixedSearch.replace(/"/g, '&quot;')}" />
            </div>
          </div>

          <div class="mg-exp-table-wrap">
            <table class="mg-exp-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Mã chứng từ</th>
                  <th>Loại chi phí cố định</th>
                  <th>Nội dung chi tiết</th>
                  <th>Người duyệt</th>
                  <th style="text-align: right;">Số tiền (Triệu VNĐ)</th>
                  <th style="text-align: right;">Tỷ trọng tháng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${
                  tableRecords.length === 0
                    ? `<tr><td colspan="8" style="text-align:center; padding: 24px; color:#695342;">Không tìm thấy khoản chi phí cố định phù hợp với bộ lọc.</td></tr>`
                    : tableRecords
                        .map((rec) => {
                          const color = catColorMap[rec.categoryId] || '#3D1F0D';
                          const pctOfMonth = ((rec.amount / totalMonth) * 100).toFixed(1);
                          return `
                            <tr>
                              <td><strong>${rec.fullDate}</strong></td>
                              <td><code>${rec.code}</code></td>
                              <td>
                                <span class="mg-exp-cat-pill">
                                  <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;"></span>
                                  ${rec.categoryName}
                                </span>
                              </td>
                              <td>${rec.description}</td>
                              <td>${rec.approvedBy}</td>
                              <td style="text-align: right; font-weight: 800; color: #3D1F0D;">
                                ${formatMillion(rec.amount, 2)} tr
                              </td>
                              <td style="text-align: right; font-weight: 600;">
                                ${pctOfMonth}%
                              </td>
                              <td>
                                <span class="mg-exp-status-pill">${rec.status}</span>
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="5">Tổng cộng (${tableRecords.length} chứng từ hiển thị)</td>
                  <td style="text-align: right; color: #2E6B22; font-size: 14.5px;">
                    ${formatMillion(tableSum, 2)} Triệu VNĐ
                  </td>
                  <td style="text-align: right;">
                    ${((tableSum / totalMonth) * 100).toFixed(1)}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    bindFixedExpensesEvents(container, recordsForChart, fixed);
  };

  function bindFixedExpensesEvents(container, recordsForChart, fixedData) {
    container.querySelectorAll('[data-switch-expense]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-switch-expense');
        navigateExpenseSubView(target);
      });
    });

    container.querySelectorAll('[data-fixed-range]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.fixedRange = btn.getAttribute('data-fixed-range');
        window.renderFixedExpenses();
      });
    });

    container.querySelectorAll('.mg-exp-bar-group[data-chart-type="fixed"]').forEach((barEl) => {
      const idx = Number(barEl.getAttribute('data-bar-idx'));
      const rec = recordsForChart[idx];
      if (!rec) return;

      barEl.addEventListener('mouseenter', (e) => {
        const pct = ((rec.amount / (fixedData.totalMonth || 118)) * 100).toFixed(1);
        showTooltip(
          e,
          `
            <div style="font-weight:800; font-size:13px; margin-bottom:4px; color:#A8E096;">
              📅 Ngày ${rec.fullDate} (${rec.code})
            </div>
            <div style="margin-bottom:4px;">
              Số tiền: <strong style="font-size:14px; color:#FFFFFF;">${formatMillion(rec.amount, 2)} Triệu VNĐ</strong> (${pct}% tháng)
            </div>
            <div style="font-size:12px; color:#E6DEC8; margin-bottom:3px;">
              <strong>Hạng mục:</strong> ${rec.categoryName}
            </div>
            <div style="font-size:11.5px; color:#CFC2B0;">
              ${rec.description}
            </div>
          `
        );
      });
      barEl.addEventListener('mousemove', moveTooltip);
      barEl.addEventListener('mouseleave', hideTooltip);
    });

    container.querySelectorAll('.mg-exp-pie-slice[data-chart-type="fixed"]').forEach((sliceEl) => {
      const idx = Number(sliceEl.getAttribute('data-pie-idx'));
      const cat = fixedData.categories[idx];
      if (!cat) return;

      sliceEl.addEventListener('mouseenter', (e) => {
        showTooltip(
          e,
          `
            <div style="font-weight:800; font-size:13px; margin-bottom:4px; color:#A8E096;">
              ${cat.name}
            </div>
            <div>
              Số tiền: <strong>${formatMillion(cat.amount, 2)} Triệu VNĐ</strong>
            </div>
            <div>
              Tỷ trọng: <strong>${cat.percent}%</strong> tổng chi phí cố định
            </div>
            <div style="font-size:11.5px; color:#CFC2B0; margin-top:4px;">
              ${cat.note}
            </div>
          `
        );
      });
      sliceEl.addEventListener('mousemove', moveTooltip);
      sliceEl.addEventListener('mouseleave', hideTooltip);
      sliceEl.addEventListener('click', () => {
        state.fixedHighlightCat = state.fixedHighlightCat === cat.id ? null : cat.id;
        state.fixedCategoryFilter = state.fixedHighlightCat || 'all';
        hideTooltip();
        window.renderFixedExpenses();
      });
    });

    container.querySelectorAll('.mg-exp-legend-item[data-chart-type="fixed"]').forEach((rowEl) => {
      const catId = rowEl.getAttribute('data-legend-cat');
      rowEl.addEventListener('click', () => {
        state.fixedHighlightCat = state.fixedHighlightCat === catId ? null : catId;
        state.fixedCategoryFilter = state.fixedHighlightCat || 'all';
        window.renderFixedExpenses();
      });
    });

    const catSelect = container.querySelector('#mg-fixed-cat-select');
    if (catSelect) {
      catSelect.addEventListener('change', () => {
        state.fixedCategoryFilter = catSelect.value;
        state.fixedHighlightCat = catSelect.value === 'all' ? null : catSelect.value;
        window.renderFixedExpenses();
      });
    }

    const searchInput = container.querySelector('#mg-fixed-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.fixedSearch = searchInput.value;
        const pos = searchInput.selectionStart;
        window.renderFixedExpenses();
        const newSearch = document.getElementById('mg-fixed-search-input');
        if (newSearch) {
          newSearch.focus();
          newSearch.setSelectionRange(pos, pos);
        }
      });
    }
  }

  // ============================================================================
  // 9. PART 2: RENDER CHI PHÍ BIẾN ĐỘNG (#view-expenses-variable)
  // - Only 3 categories: Suất cơm (#2E6B22), Đồ uống (#2B7BBB), Bánh bao (#D97724)
  // - Only 1 week (7 days) displayed on X-axis at a time
  // - Left: 3-column Vertical Grouped Bar Chart matching media_1795449557370_0e10e126.png
  // - Right: SVG Pie Chart showing % and Triệu VNĐ of Suất cơm, Đồ uống, Bánh bao
  // ============================================================================
  window.renderVariableExpenses = function renderVariableExpenses() {
    ensureExpensesStyles();
    const container = document.getElementById('view-expenses-variable');
    if (!container) return;

    const data = getNormalizedData();
    const weeksMap = data.variableWeeks;
    const currentWeek = weeksMap[state.variableWeek] || weeksMap.week_17_23;
    const days = currentWeek.days || [];

    // Compute totals across the 7 days of the selected week
    let sumSuatCom = 0;
    let sumDoUong = 0;
    let sumBanhBao = 0;

    days.forEach((d) => {
      sumSuatCom += Number(d.suatCom) || 0;
      sumDoUong += Number(d.doUong) || 0;
      sumBanhBao += Number(d.banhBao) || 0;
    });

    sumSuatCom = Math.round(sumSuatCom * 10) / 10;
    sumDoUong = Math.round(sumDoUong * 10) / 10;
    sumBanhBao = Math.round(sumBanhBao * 10) / 10;
    const weekTotal = Math.round((sumSuatCom + sumDoUong + sumBanhBao) * 10) / 10;
    const avgPerDay = weekTotal / Math.max(days.length, 1);

    const pctSuatCom = weekTotal > 0 ? Math.round((sumSuatCom / weekTotal) * 1000) / 10 : 52.2;
    const pctDoUong = weekTotal > 0 ? Math.round((sumDoUong / weekTotal) * 1000) / 10 : 28.2;
    const pctBanhBao = weekTotal > 0 ? Math.round((100 - pctSuatCom - pctDoUong) * 10) / 10 : 19.6;

    const pieCategories = [
      {
        id: 'suatCom',
        name: 'Suất cơm',
        shortName: 'Suất cơm',
        amount: sumSuatCom,
        percent: pctSuatCom,
        percentDisplay: `${formatMillionOneDec(pctSuatCom)}%`,
        color: VAR_CATEGORY_CONFIG.suatCom.color,
        note: VAR_CATEGORY_CONFIG.suatCom.note
      },
      {
        id: 'doUong',
        name: 'Đồ uống',
        shortName: 'Đồ uống',
        amount: sumDoUong,
        percent: pctDoUong,
        percentDisplay: `${formatMillionOneDec(pctDoUong)}%`,
        color: VAR_CATEGORY_CONFIG.doUong.color,
        note: VAR_CATEGORY_CONFIG.doUong.note
      },
      {
        id: 'banhBao',
        name: 'Bánh bao',
        shortName: 'Bánh bao',
        amount: sumBanhBao,
        percent: pctBanhBao,
        percentDisplay: `${formatMillionOneDec(pctBanhBao)}%`,
        color: VAR_CATEGORY_CONFIG.banhBao.color,
        note: VAR_CATEGORY_CONFIG.banhBao.note
      }
    ];

    const hl = state.variableHighlightCat;

    // Filter table rows within the selected 7-day week
    const tableRecords = days.filter((rec) => {
      const q = state.variableSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        rec.note.toLowerCase().includes(q) ||
        rec.supplier.toLowerCase().includes(q) ||
        rec.code.toLowerCase().includes(q) ||
        rec.date.toLowerCase().includes(q) ||
        (rec.dayLabel && rec.dayLabel.toLowerCase().includes(q))
      );
    });

    let tableSuatComSum = 0;
    let tableDoUongSum = 0;
    let tableBanhBaoSum = 0;
    tableRecords.forEach((r) => {
      tableSuatComSum += Number(r.suatCom) || 0;
      tableDoUongSum += Number(r.doUong) || 0;
      tableBanhBaoSum += Number(r.banhBao) || 0;
    });
    const tableGrandSum = tableSuatComSum + tableDoUongSum + tableBanhBaoSum;

    container.innerHTML = `
      <div class="mg-exp-wrapper">
        ${buildSubNavBar('variable')}

        <!-- Header & 1-Week Switcher (Always 7 days on X-axis) -->
        <div class="mg-exp-header-card">
          <div class="mg-exp-title-group">
            <h2>
              <span>🍱 Quản lý Chi phí biến động — Nhà hàng Mộc Giang</span>
              <span class="mg-exp-branch-pill">Hiển thị theo tuần (7 ngày)</span>
            </h2>
            <p>
              Thống kê chi phí biến động theo 3 nhóm chính: <strong>Suất cơm · Đồ uống · Bánh bao</strong>
              tại cơ sở 199 Hoàng Cầu (Đơn vị: <strong>Triệu VNĐ</strong>).
            </p>
          </div>
          <div class="mg-exp-filter-group">
            <span class="mg-exp-filter-label">Chọn tuần (7 ngày):</span>
            <div class="mg-exp-period-pills">
              ${Object.keys(weeksMap)
                .map((wkKey) => {
                  const wk = weeksMap[wkKey];
                  return `
                    <button type="button"
                            class="mg-exp-period-btn ${state.variableWeek === wkKey ? 'active' : ''}"
                            data-variable-week="${wkKey}">
                      ${wk.label}
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>
        </div>

        <!-- 4 KPI Summary Cards (Tổng tuần, Suất cơm, Đồ uống, Bánh bao) -->
        <div class="mg-exp-kpi-grid">
          <div class="mg-exp-kpi-card" style="--kpi-accent: #3D1F0D; --kpi-bg: rgba(61, 31, 13, 0.1);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">Tổng chi phí biến động tuần</span>
              <span class="mg-exp-kpi-icon">📊</span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillionOneDec(weekTotal)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span class="mg-exp-kpi-tag">7 ngày (${currentWeek.label.replace('Tuần ', '')})</span>
              <span>TB: <strong>${formatMillion(avgPerDay, 1)} tr/ngày</strong></span>
            </div>
          </div>

          <div class="mg-exp-kpi-card ${hl === 'suatCom' ? 'is-highlighted' : ''}"
               data-var-cat-toggle="suatCom"
               style="--kpi-accent: ${VAR_CATEGORY_CONFIG.suatCom.color}; --kpi-bg: rgba(46, 107, 34, 0.12);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">
                <span style="width:10px;height:10px;border-radius:3px;background:${VAR_CATEGORY_CONFIG.suatCom.color};display:inline-block;"></span>
                Chi phí Suất cơm
              </span>
              <span class="mg-exp-kpi-tag" style="background:rgba(46,107,34,0.14);color:#2E6B22;">
                ${formatMillionOneDec(pctSuatCom)}%
              </span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillionOneDec(sumSuatCom)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>TB: ${formatMillionOneDec(sumSuatCom / 7)} tr/ngày · Nhóm tỷ trọng lớn nhất</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card ${hl === 'doUong' ? 'is-highlighted' : ''}"
               data-var-cat-toggle="doUong"
               style="--kpi-accent: ${VAR_CATEGORY_CONFIG.doUong.color}; --kpi-bg: rgba(43, 123, 187, 0.12);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">
                <span style="width:10px;height:10px;border-radius:3px;background:${VAR_CATEGORY_CONFIG.doUong.color};display:inline-block;"></span>
                Chi phí Đồ uống
              </span>
              <span class="mg-exp-kpi-tag" style="background:rgba(43,123,187,0.14);color:#2B7BBB;">
                ${formatMillionOneDec(pctDoUong)}%
              </span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillionOneDec(sumDoUong)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>TB: ${formatMillionOneDec(sumDoUong / 7)} tr/ngày · Trà thảo mộc, nước mơ, sấu</span>
            </div>
          </div>

          <div class="mg-exp-kpi-card ${hl === 'banhBao' ? 'is-highlighted' : ''}"
               data-var-cat-toggle="banhBao"
               style="--kpi-accent: ${VAR_CATEGORY_CONFIG.banhBao.color}; --kpi-bg: rgba(217, 119, 36, 0.14);">
            <div class="mg-exp-kpi-top">
              <span class="mg-exp-kpi-label">
                <span style="width:10px;height:10px;border-radius:3px;background:${VAR_CATEGORY_CONFIG.banhBao.color};display:inline-block;"></span>
                Chi phí Bánh bao
              </span>
              <span class="mg-exp-kpi-tag" style="background:rgba(217,119,36,0.15);color:#D97724;">
                ${formatMillionOneDec(pctBanhBao)}%
              </span>
            </div>
            <div>
              <span class="mg-exp-kpi-value">${formatMillionOneDec(sumBanhBao)}</span>
              <span class="mg-exp-kpi-unit">Triệu VNĐ</span>
            </div>
            <div class="mg-exp-kpi-sub">
              <span>TB: ${formatMillionOneDec(sumBanhBao / 7)} tr/ngày · Bánh bao thủ công Mộc Giang</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Chart Section (Left: 3-Bar Grouped Bar Chart, Right: Pie Chart) -->
        <div class="mg-exp-charts-grid chart-split-grid">
          <!-- LEFT: Biểu đồ cột nhóm 3 cột Chi phí biến động (7 ngày trong tuần) -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">📊 Biểu đồ cột nhóm Chi phí biến động (3 nhóm · 7 ngày)</h3>
                <p class="mg-exp-card-subtitle">
                  So sánh trực quan 3 cột <strong>Đồ uống</strong>, <strong>Suất cơm</strong>, <strong>Bánh bao</strong> theo từng ngày trong ${currentWeek.fullLabel}
                </p>
              </div>
              <div class="mg-exp-axis-badges">
                <span class="mg-exp-axis-badge">Trục X: 7 Ngày</span>
                <span class="mg-exp-axis-badge">Đơn vị: Triệu VNĐ</span>
              </div>
            </div>

            <div class="mg-exp-barchart-wrap">
              ${buildVariableGroupedBarSVG(currentWeek)}
            </div>

            <!-- Interactive 3-Category Legend under Grouped Bar Chart -->
            <div class="mg-exp-grouped-legend" role="group" aria-label="Chú thích 3 loại chi phí biến động">
              <div class="mg-exp-grouped-legend-item ${hl === 'doUong' ? 'is-active' : ''} ${hl && hl !== 'doUong' ? 'is-dimmed' : ''}"
                   data-var-cat-toggle="doUong">
                <span class="mg-exp-legend-swatch" style="background: ${VAR_CATEGORY_CONFIG.doUong.color};"></span>
                <span>Đồ uống (${formatMillionOneDec(sumDoUong)} tr)</span>
              </div>
              <div class="mg-exp-grouped-legend-item ${hl === 'suatCom' ? 'is-active' : ''} ${hl && hl !== 'suatCom' ? 'is-dimmed' : ''}"
                   data-var-cat-toggle="suatCom">
                <span class="mg-exp-legend-swatch" style="background: ${VAR_CATEGORY_CONFIG.suatCom.color};"></span>
                <span>Suất cơm (${formatMillionOneDec(sumSuatCom)} tr)</span>
              </div>
              <div class="mg-exp-grouped-legend-item ${hl === 'banhBao' ? 'is-active' : ''} ${hl && hl !== 'banhBao' ? 'is-dimmed' : ''}"
                   data-var-cat-toggle="banhBao">
                <span class="mg-exp-legend-swatch" style="background: ${VAR_CATEGORY_CONFIG.banhBao.color};"></span>
                <span>Bánh bao (${formatMillionOneDec(sumBanhBao)} tr)</span>
              </div>
              ${
                hl
                  ? `<button type="button" class="mg-exp-period-btn" data-var-cat-reset="true" style="font-size:11.5px;padding:4px 10px;background:#F4EDE0;">
                       Hiện tất cả 3 cột
                     </button>`
                  : ''
              }
            </div>
          </div>

          <!-- RIGHT: Biểu đồ tròn Tỷ trọng Chi phí biến động (%) -->
          <div class="mg-exp-chart-card">
            <div class="mg-exp-card-head">
              <div>
                <h3 class="mg-exp-card-title">🥧 Biểu đồ tròn Tỷ trọng Chi phí biến động (%)</h3>
                <p class="mg-exp-card-subtitle">
                  Cơ cấu phần trăm (%) từng loại chi phí trong tổng ${formatMillionOneDec(weekTotal)} Triệu VNĐ (${currentWeek.label})
                </p>
              </div>
              <span class="mg-exp-axis-badge">Tổng: 100%</span>
            </div>

            <div class="mg-exp-pie-container">
              <div class="mg-exp-pie-svg-wrap">
                ${buildPieChartSVG(pieCategories, state.variableHighlightCat, 'variable', true)}
              </div>

              <div class="mg-exp-pie-legend">
                ${pieCategories
                  .map(
                    (cat) => `
                  <div class="mg-exp-legend-item ${state.variableHighlightCat === cat.id ? 'is-active' : ''}"
                       data-var-cat-toggle="${cat.id}"
                       data-chart-type="variable">
                    <span class="mg-exp-legend-swatch" style="background: ${cat.color};"></span>
                    <span class="mg-exp-legend-name">${cat.name}</span>
                    <span class="mg-exp-legend-amount">${formatMillionOneDec(cat.amount)} tr</span>
                    <span class="mg-exp-legend-pct">${cat.percentDisplay}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Table below (7 days of selected week) -->
        <div class="mg-exp-table-card">
          <div class="mg-exp-card-head">
            <div>
              <h3 class="mg-exp-card-title">📋 Bảng kê chi tiết Chi phí biến động theo ngày (${currentWeek.fullLabel})</h3>
              <p class="mg-exp-card-subtitle">
                Bóc tách chi phí biến động 3 nhóm (Suất cơm, Đồ uống, Bánh bao) trong 7 ngày của tuần đang chọn (Đơn vị: Triệu VNĐ)
              </p>
            </div>
            <div class="mg-exp-table-controls">
              <input type="search"
                     class="mg-exp-search"
                     id="mg-variable-search-input"
                     placeholder="Tìm ngày, mã phiếu, ghi chú..."
                     value="${state.variableSearch.replace(/"/g, '&quot;')}" />
            </div>
          </div>

          <div class="mg-exp-table-wrap">
            <table class="mg-exp-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Mã phiếu</th>
                  <th>Nội dung &amp; Nhà cung cấp</th>
                  <th style="text-align: right; color: ${VAR_CATEGORY_CONFIG.doUong.color};">Đồ uống (Triệu VNĐ)</th>
                  <th style="text-align: right; color: ${VAR_CATEGORY_CONFIG.suatCom.color};">Suất cơm (Triệu VNĐ)</th>
                  <th style="text-align: right; color: ${VAR_CATEGORY_CONFIG.banhBao.color};">Bánh bao (Triệu VNĐ)</th>
                  <th style="text-align: right;">Tổng ngày (Triệu VNĐ)</th>
                  <th>Nhóm chủ đạo</th>
                </tr>
              </thead>
              <tbody>
                ${
                  tableRecords.length === 0
                    ? `<tr><td colspan="8" style="text-align:center; padding: 24px; color:#695342;">Không tìm thấy ngày phù hợp trong tuần này.</td></tr>`
                    : tableRecords
                        .map((rec) => {
                          const dayTotal = (Number(rec.suatCom) || 0) + (Number(rec.doUong) || 0) + (Number(rec.banhBao) || 0);
                          const domPct = dayTotal > 0 ? ((rec.suatCom / dayTotal) * 100).toFixed(1).replace('.', ',') : '51,0';
                          return `
                            <tr>
                              <td><strong>${rec.dayLabel ? rec.dayLabel + ', ' : ''}${rec.fullDate}</strong></td>
                              <td><code>${rec.code}</code></td>
                              <td>
                                <div style="font-weight: 600; color: var(--text-primary, #24160B);">${rec.note}</div>
                                <div style="font-size: 12px; color: var(--text-secondary, #695342);">NCC: ${rec.supplier}</div>
                              </td>
                              <td style="text-align: right; font-weight: 700; color: ${VAR_CATEGORY_CONFIG.doUong.color};">
                                ${formatMillionOneDec(rec.doUong)} tr
                              </td>
                              <td style="text-align: right; font-weight: 700; color: ${VAR_CATEGORY_CONFIG.suatCom.color};">
                                ${formatMillionOneDec(rec.suatCom)} tr
                              </td>
                              <td style="text-align: right; font-weight: 700; color: ${VAR_CATEGORY_CONFIG.banhBao.color};">
                                ${formatMillionOneDec(rec.banhBao)} tr
                              </td>
                              <td style="text-align: right; font-weight: 800; color: #24160B;">
                                ${formatMillionOneDec(dayTotal)} tr
                              </td>
                              <td>
                                <span class="mg-exp-status-pill">Suất cơm (${domPct}%)</span>
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Tổng cộng tuần (${tableRecords.length} ngày)</td>
                  <td style="text-align: right; color: ${VAR_CATEGORY_CONFIG.doUong.color};">
                    ${formatMillionOneDec(tableDoUongSum)} tr (${formatMillionOneDec(pctDoUong)}%)
                  </td>
                  <td style="text-align: right; color: ${VAR_CATEGORY_CONFIG.suatCom.color};">
                    ${formatMillionOneDec(tableSuatComSum)} tr (${formatMillionOneDec(pctSuatCom)}%)
                  </td>
                  <td style="text-align: right; color: ${VAR_CATEGORY_CONFIG.banhBao.color};">
                    ${formatMillionOneDec(tableBanhBaoSum)} tr (${formatMillionOneDec(pctBanhBao)}%)
                  </td>
                  <td style="text-align: right; color: #2E6B22; font-size: 14.5px;">
                    ${formatMillionOneDec(tableGrandSum)} Triệu VNĐ
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    bindVariableExpensesEvents(container, days, pieCategories);
  };

  function bindVariableExpensesEvents(container, days, pieCategories) {
    // Sub-nav switcher buttons
    container.querySelectorAll('[data-switch-expense]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-switch-expense');
        navigateExpenseSubView(target);
      });
    });

    // Week switcher buttons (1 week = 7 days at a time)
    container.querySelectorAll('[data-variable-week]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wk = btn.getAttribute('data-variable-week');
        if (wk && wk !== state.variableWeek) {
          state.variableWeek = wk;
          window.renderVariableExpenses();
        }
      });
    });

    // Category highlight toggles (KPI cards, Bar Legend, Pie Legend)
    container.querySelectorAll('[data-var-cat-toggle]').forEach((el) => {
      el.addEventListener('click', () => {
        const cat = el.getAttribute('data-var-cat-toggle');
        if (!cat) return;
        state.variableHighlightCat = state.variableHighlightCat === cat ? null : cat;
        window.renderVariableExpenses();
      });
    });

    const resetBtn = container.querySelector('[data-var-cat-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.variableHighlightCat = null;
        window.renderVariableExpenses();
      });
    }

    // Hover tooltips on each bar of the 3-column grouped bar chart
    container.querySelectorAll('.mg-exp-bar-group[data-chart-type="variable-grouped"]').forEach((barEl) => {
      barEl.addEventListener('mouseenter', (e) => {
        const fullDate = barEl.getAttribute('data-fulldate');
        const label = barEl.getAttribute('data-label');
        const val = barEl.getAttribute('data-value');
        const pct = barEl.getAttribute('data-pct');
        const dayTotal = barEl.getAttribute('data-daytotal');
        const catKey = barEl.getAttribute('data-var-cat');
        const dayIdx = Number(barEl.getAttribute('data-day-idx'));
        const dayObj = days[dayIdx] || {};
        const cfg = VAR_CATEGORY_CONFIG[catKey] || VAR_CATEGORY_CONFIG.suatCom;

        showTooltip(
          e,
          `
            <div style="font-weight:800; font-size:13px; margin-bottom:5px; color:#F4EDE0;">
              📅 ${fullDate}
            </div>
            <div style="display:flex; align-items:center; gap:7px; margin-bottom:6px;">
              <span style="width:10px;height:10px;border-radius:2px;background:${cfg.color};display:inline-block;"></span>
              <span>${label}: <strong style="font-size:14px;color:#FFFFFF;">${val} triệu VNĐ</strong> (${pct}%)</span>
            </div>
            <div style="font-size:11.5px; color:#E6DEC8; display:grid; grid-template-columns: 1fr auto; gap:2px 10px; border-top:1px solid rgba(255,255,255,0.14); padding-top:5px;">
              <span>• Đồ uống:</span><strong>${formatMillionOneDec(dayObj.doUong)} tr</strong>
              <span>• Suất cơm:</span><strong>${formatMillionOneDec(dayObj.suatCom)} tr</strong>
              <span>• Bánh bao:</span><strong>${formatMillionOneDec(dayObj.banhBao)} tr</strong>
              <span style="color:#A8E096;font-weight:700;">Tổng chi phí ngày:</span><strong style="color:#A8E096;">${dayTotal} triệu VNĐ</strong>
            </div>
          `
        );
      });
      barEl.addEventListener('mousemove', moveTooltip);
      barEl.addEventListener('mouseleave', hideTooltip);
      barEl.addEventListener('click', () => {
        const catKey = barEl.getAttribute('data-var-cat');
        state.variableHighlightCat = state.variableHighlightCat === catKey ? null : catKey;
        hideTooltip();
        window.renderVariableExpenses();
      });
    });

    // Pie slice tooltips & click
    container.querySelectorAll('.mg-exp-pie-slice[data-chart-type="variable"]').forEach((sliceEl) => {
      const idx = Number(sliceEl.getAttribute('data-pie-idx'));
      const cat = pieCategories[idx];
      if (!cat) return;

      sliceEl.addEventListener('mouseenter', (e) => {
        showTooltip(
          e,
          `
            <div style="display:flex;align-items:center;gap:7px;font-weight:800;font-size:13px;margin-bottom:4px;color:#A8E096;">
              <span style="width:10px;height:10px;border-radius:2px;background:${cat.color};display:inline-block;"></span>
              <span>Nhóm: ${cat.name}</span>
            </div>
            <div>
              Chi phí tuần: <strong>${formatMillionOneDec(cat.amount)} Triệu VNĐ</strong>
            </div>
            <div>
              Tỷ trọng: <strong>${cat.percentDisplay}</strong> tổng chi phí biến động
            </div>
            <div style="font-size:11.5px; color:#CFC2B0; margin-top:4px;">
              ${cat.note}
            </div>
          `
        );
      });
      sliceEl.addEventListener('mousemove', moveTooltip);
      sliceEl.addEventListener('mouseleave', hideTooltip);
      sliceEl.addEventListener('click', () => {
        state.variableHighlightCat = state.variableHighlightCat === cat.id ? null : cat.id;
        hideTooltip();
        window.renderVariableExpenses();
      });
    });

    // Search input
    const searchInput = container.querySelector('#mg-variable-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.variableSearch = searchInput.value;
        const pos = searchInput.selectionStart;
        window.renderVariableExpenses();
        const newSearch = document.getElementById('mg-variable-search-input');
        if (newSearch) {
          newSearch.focus();
          newSearch.setSelectionRange(pos, pos);
        }
      });
    }
  }

  // ============================================================================
  // 10. AUTO-INITIALIZE ON DOMContentLoaded
  // ============================================================================
  function initExpensesViews() {
    try {
      window.renderFixedExpenses();
      window.renderVariableExpenses();
    } catch (err) {
      console.error('[MocGiang Expenses] Render error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpensesViews);
  } else {
    initExpensesViews();
  }
})();
