/**
 * ============================================================================
 * NHÀ HÀNG MỘC GIANG — GOOGLE APPS SCRIPT (FORM BUILDER + WEB API + DRIVE UPLOAD)
 * Cơ sở: 199 Hoàng Cầu, Đống Đa, Hà Nội | Hotline: 096 3689077
 *
 * ĐÃ CẤU HÌNH SẴN ID THỰC TẾ TRÊN GOOGLE DRIVE CỦA BẠN:
 *   - Google Sheet ID : 14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE
 *   - Drive Folder ID : 1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2
 *
 * HƯỚNG DẪN SỬ DỤNG NHANH:
 *   1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE/edit
 *   2. Chọn Tiện ích mở rộng (Extensions) -> Apps Script.
 *   3. Dán toàn bộ nội dung file Code.gs này vào trình soạn thảo và bấm Lưu (Ctrl+S).
 *   4. Chọn hàm `setupMocGiangExpenseForm` trên thanh công cụ và bấm "Chạy" (Run)
 *      để tự động tạo Google Form rẽ nhánh 3 phần liên kết trực tiếp với Google Sheet này.
 *   5. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment) ->
 *      Chọn loại "Ứng dụng web" (Web app):
 *        - Thực thi dưới dạng (Execute as): Tôi (Me)
 *        - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 *      Sau đó copy URL Web App dán vào nút "Cấu hình Google Form & Sheet" trên Dashboard Mộc Giang.
 * ============================================================================
 */

var SPREADSHEET_ID = '14OH_xC4muiSAAhK67nVzmJYltOpjemyLrvyPf5yLAtE';
var FOLDER_ID = '1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2';
var FORM_ID = '1wPU5OScA-S7s49lo1dURjr93NizlOyddVSnm23SERcc';
var FORM_RESPONSES_SHEET = 'Form Responses 1';
var SHEET_NAME = 'Sheet1';

var FIXED_CATEGORIES = [
  'Thuê mặt bằng (199 Hoàng Cầu)',
  'Lương nhân sự cố định (Bếp & Quản lý)',
  'Khấu hao thiết bị & Bảo trì định kỳ',
  'Phần mềm POS, Internet & Bản quyền',
  'Bảo hiểm, An ninh & Vệ sinh cố định'
];

var VARIABLE_CATEGORIES = [
  'Suất cơm',
  'Đồ uống',
  'Bánh bao'
];

/**
 * Chuẩn hóa chuỗi số tiền VNĐ (ví dụ: "20 000", "1 000 000", "9.800.000")
 * thành số nguyên VNĐ và số Triệu VNĐ (amountVnd / 1000000).
 */
function parseVndAmount(raw) {
  if (raw === null || raw === undefined) {
    return { vnd: 0, trieu: 0, formattedVnd: '0' };
  }
  var str = String(raw).trim();
  var digitsOnly = str.replace(/[^\d]/g, '');
  var vnd = digitsOnly ? parseInt(digitsOnly, 10) : 0;
  var trieu = Math.round((vnd / 1000000) * 10000) / 10000;
  var formattedVnd = String(vnd).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return {
    vnd: vnd,
    trieu: trieu,
    formattedVnd: formattedVnd
  };
}

/**
 * 1. TỰ ĐỘNG TẠO GOOGLE FORM RẼ NHÁNH (3 SECTIONS) & LIÊN KẾT VỚI GOOGLE SHEET
 */
function setupMocGiangExpenseForm() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var form = FormApp.create('Nhà hàng Mộc Giang — Phiếu Nhập Chi Phí & Minh Chứng');

  form.setDescription(
    'Biểu mẫu nhập chi phí nội bộ Nhà hàng Mộc Giang (199 Hoàng Cầu, Đống Đa, Hà Nội).\n' +
    '• Đơn vị nhập số tiền: VNĐ (ví dụ: 20 000 hoặc 1 000 000 hoặc 9 800 000).\n' +
    '• Hệ thống Dashboard tự động quy đổi sang Triệu VNĐ (ví dụ: 1 000 000 VNĐ -> 1,00 Triệu VNĐ; 20 000 VNĐ -> 0,02 Triệu VNĐ) để vẽ biểu đồ cột và biểu đồ tròn %.\n' +
    '• Thư mục Google Drive lưu ảnh chụp minh chứng: https://drive.google.com/drive/folders/' + FOLDER_ID
  );
  form.setConfirmationMessage('Đã ghi nhận phiếu chi vào hệ thống Google Sheet & Dashboard Nhà hàng Mộc Giang!');

  // --- SECTION 1: THÔNG TIN CHUNG ---
  var itemFullName = form.addTextItem();
  itemFullName.setTitle('Họ và tên')
    .setHelpText('Nhập họ và tên người lập phiếu / người chi (ví dụ: Nguyễn Minh Quản Lý, Lê Văn Bếp Trưởng)')
    .setRequired(true);

  var itemDate = form.addDateItem();
  itemDate.setTitle('Ngày phát sinh')
    .setHelpText('Chọn ngày phát sinh khoản chi phí')
    .setRequired(true);

  var vndValidation = FormApp.createTextValidation()
    .setHelpText('Vui lòng nhập số tiền bằng số (Đơn vị: VNĐ), có thể dùng dấu cách hoặc dấu chấm để phân tách hàng nghìn. Ví dụ: 20 000 hoặc 1 000 000')
    .requireTextMatchesPattern('^[0-9][0-9\\s\\.,]*$')
    .build();

  var itemAmount = form.addTextItem();
  itemAmount.setTitle('Số tiền (Đơn vị: VNĐ — ví dụ: 20 000, 1 000 000)')
    .setHelpText('Nhập số tiền theo đơn vị VNĐ (ví dụ: 20 000 hoặc 1 000 000). Dashboard sẽ tự động quy đổi sang Triệu VNĐ.')
    .setValidation(vndValidation)
    .setRequired(true);

  var itemReceipt = form.addTextItem();
  itemReceipt.setTitle('Ảnh chụp minh chứng')
    .setHelpText(
      'Dán link ảnh minh chứng hoặc tải ảnh vào thư mục Drive Mộc Giang: https://drive.google.com/drive/folders/' + FOLDER_ID +
      ' (Lưu ý: Bạn cũng có thể mở Google Form trong chế độ chỉnh sửa để đổi câu hỏi này sang loại "Tải tệp lên / File Upload" hoặc tải ảnh trực tiếp ngay trên Dashboard Mộc Giang).'
    )
    .setRequired(false);

  var itemExpenseType = form.addMultipleChoiceItem();
  itemExpenseType.setTitle('Phân loại chi phí')
    .setHelpText('Chọn loại chi phí để chuyển tới danh mục tương ứng')
    .setRequired(true);

  // --- SECTION 2: CHI PHÍ CỐ ĐỊNH ---
  var sectionFixed = form.addPageBreakItem();
  sectionFixed.setTitle('Phần 2: Danh mục Chi phí cố định')
    .setHelpText('Chọn 1 trong 5 danh mục chi phí cố định của Nhà hàng Mộc Giang');

  var itemFixedCategory = form.addMultipleChoiceItem();
  itemFixedCategory.setTitle('Danh mục chi phí cố định')
    .setChoiceValues(FIXED_CATEGORIES)
    .setRequired(true);

  var itemFixedNote = form.addParagraphTextItem();
  itemFixedNote.setTitle('Ghi chú chi phí cố định (nếu có)')
    .setRequired(false);

  // --- SECTION 3: CHI PHÍ BIẾN ĐỘNG ---
  var sectionVariable = form.addPageBreakItem();
  sectionVariable.setTitle('Phần 3: Danh mục Chi phí biến động')
    .setHelpText('Chọn 1 trong 3 danh mục chi phí biến động (Suất cơm, Đồ uống, Bánh bao)');

  var itemVariableCategory = form.addMultipleChoiceItem();
  itemVariableCategory.setTitle('Danh mục chi phí biến động')
    .setChoiceValues(VARIABLE_CATEGORIES)
    .setRequired(true);

  var itemVariableNote = form.addParagraphTextItem();
  itemVariableNote.setTitle('Ghi chú chi phí biến động (nếu có)')
    .setRequired(false);

  // Cấu hình rẽ nhánh (Branching) và kết thúc biểu mẫu (SUBMIT)
  sectionFixed.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  sectionVariable.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  itemExpenseType.setChoices([
    itemExpenseType.createChoice('Chi phí cố định', sectionFixed),
    itemExpenseType.createChoice('Chi phí biến động', sectionVariable)
  ]);

  // Liên kết Form với Google Sheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('=== TẠO GOOGLE FORM MỘC GIANG THÀNH CÔNG ===');
  Logger.log('Link điền Form (Published URL): ' + form.getPublishedUrl());
  Logger.log('Link chỉnh sửa Form (Edit URL): ' + form.getEditUrl());
  Logger.log('Link Google Sheet: ' + ss.getUrl());

  return {
    formId: form.getId(),
    publishedUrl: form.getPublishedUrl(),
    editUrl: form.getEditUrl(),
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    driveFolderId: FOLDER_ID,
    driveFolderUrl: 'https://drive.google.com/drive/folders/' + FOLDER_ID
  };
}

/**
 * 2. API GET (doGet) — Trả về danh sách toàn bộ dòng chi phí dưới dạng JSON cho Website Mộc Giang
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var formSheet = ss.getSheetByName(FORM_RESPONSES_SHEET);
    var sheet = (formSheet && formSheet.getLastRow() > 1) ? formSheet : (ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]);
    var isFormTab = (sheet.getName() === FORM_RESPONSES_SHEET);
    var values = sheet.getDataRange().getDisplayValues();
    var headers = values.length > 0 ? values[0] : [];
    var rows = [];

    for (var i = 1; i < values.length; i++) {
      var r = values[i];
      if (!r || (!r[1] && !r[2] && !r[3])) continue;

      var parsedAmount = parseVndAmount(r[3]);
      var expenseType = (r[5] || '').trim();
      var fixedCat = (r[6] || '').trim();
      var varCat = isFormTab ? (r[8] || '').trim() : (r[7] || '').trim();
      var noteVal = isFormTab ? ((r[7] || r[9] || '').trim()) : (r[8] || '').trim();
      var receiptLink = (isFormTab && r[10]) ? r[10] : (r[4] || '');
      var category = expenseType === 'Chi phí cố định' ? fixedCat : (varCat || fixedCat);

      rows.push({
        rowNumber: i + 1,
        timestamp: r[0] || '',
        fullName: r[1] || '',
        date: r[2] || '',
        amountRaw: r[3] || '',
        amountVnd: parsedAmount.vnd,
        amountFormattedVnd: parsedAmount.formattedVnd,
        amountTrieu: parsedAmount.trieu,
        receiptUrl: receiptLink,
        expenseType: expenseType,
        fixedCategory: fixedCat,
        variableCategory: varCat,
        category: category,
        note: noteVal
      });
    }

    var payload = {
      status: 'ok',
      spreadsheetId: SPREADSHEET_ID,
      driveFolderId: FOLDER_ID,
      formId: FORM_ID,
      sheetName: sheet.getName(),
      headers: headers,
      count: rows.length,
      rows: rows
    };

    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 3. API POST (doPost) — Nhận phiếu chi mới + ảnh chụp minh chứng (base64) từ Website,
 * lưu ảnh vào Google Drive Folder (1evvUqayKJ3MZAs4xjqg6WQPLHEzRvpv2) và ghi dòng mới vào Google Sheet.
 */
function doPost(e) {
  try {
    var bodyStr = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(bodyStr);

    var fullName = data.fullName || 'Quản trị Mộc Giang';
    var dateStr = data.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
    var parsedAmount = parseVndAmount(data.amountVnd || data.amountRaw || data.amount || 0);
    var expenseType = data.expenseType || 'Chi phí biến động';
    var fixedCategory = expenseType === 'Chi phí cố định' ? (data.category || data.fixedCategory || '') : '';
    var variableCategory = expenseType === 'Chi phí biến động' ? (data.category || data.variableCategory || '') : '';
    var note = data.note || '';
    var receiptUrl = data.receiptUrl || '';

    // Nếu người dùng tải ảnh chụp minh chứng dạng Base64 lên từ Website:
    if (data.imageBase64) {
      var folder = DriveApp.getFolderById(FOLDER_ID);
      var cleanBase64 = String(data.imageBase64).replace(/^data:[^;]+;base64,/, '');
      var mimeType = data.imageMimeType || 'image/jpeg';
      var fileName = data.imageName || ('MinhChung_MocGiang_' + new Date().getTime() + '.jpg');
      var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), mimeType, fileName);
      var file = folder.createFile(blob);
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (shareErr) {
        // Bỏ qua nếu chính sách Google Workspace hạn chế chia sẻ công khai
      }
      receiptUrl = file.getUrl();
    }

    var timestamp = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    sheet.appendRow([
      timestamp,
      fullName,
      dateStr,
      parsedAmount.formattedVnd,
      receiptUrl,
      expenseType,
      fixedCategory,
      variableCategory,
      note
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      timestamp: timestamp,
      fullName: fullName,
      date: dateStr,
      amountVnd: parsedAmount.vnd,
      amountFormattedVnd: parsedAmount.formattedVnd,
      amountTrieu: parsedAmount.trieu,
      receiptUrl: receiptUrl,
      expenseType: expenseType,
      category: fixedCategory || variableCategory,
      note: note
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
