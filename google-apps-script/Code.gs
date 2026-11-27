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
 *      để tự động tạo Google Form 1 phần với 9 loại chi phí liên kết trực tiếp với Google Sheet này.
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
var SHEET_NAME = 'Sheet1';
var FORM_RESPONSES_SHEET = 'Form Responses 1';

var EXPENSE_CATEGORIES = [
  'Chi phí nguyên vật liệu đầu vào',
  'Chi phí nhân công',
  'Chi phí dụng cụ',
  'Chi phí điện nước',
  'Các dịch vụ khác',
  'Chi phí ship',
  'Chi phí vận hành',
  'Chi phí thuê mặt bằng',
  'Chi phí tài sản khấu hao'
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
 * 1. TỰ ĐỘNG TẠO GOOGLE FORM THỐNG NHẤT (9 LOẠI CHI PHÍ) & LIÊN KẾT VỚI GOOGLE SHEET
 */
function setupMocGiangExpenseForm() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var form = FormApp.create('Nhà hàng Mộc Giang — Phiếu Nhập Chi Phí & Minh Chứng');

  form.setDescription(
    'Biểu mẫu nhập chi phí nội bộ Nhà hàng Mộc Giang (199 Hoàng Cầu, Đống Đa, Hà Nội).\n' +
    '• Đơn vị nhập số tiền: VNĐ (ví dụ: 20 000 hoặc 1 000 000 hoặc 9 800 000).\n' +
    '• Hệ thống Dashboard tự động quy đổi sang Triệu VNĐ để vẽ biểu đồ cột và biểu đồ tròn % theo 9 loại chi phí.\n' +
    '• Thư mục Google Drive lưu ảnh chụp minh chứng: https://drive.google.com/drive/folders/' + FOLDER_ID
  );
  form.setConfirmationMessage('Đã ghi nhận phiếu chi vào hệ thống Google Sheet & Dashboard Nhà hàng Mộc Giang!');

  var itemFullName = form.addTextItem();
  itemFullName.setTitle('Họ và tên')
    .setHelpText('Nhập họ và tên người lập phiếu / người chi (ví dụ: Quản lý Mộc Giang, Quầy Nước Mộc Giang)')
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
      'Dán link ảnh minh chứng hoặc tải ảnh vào thư mục Drive Mộc Giang: https://drive.google.com/drive/folders/' + FOLDER_ID
    )
    .setRequired(false);

  var itemCategory = form.addMultipleChoiceItem();
  itemCategory.setTitle('Loại chi phí')
    .setHelpText('Chọn 1 trong 9 loại chi phí của Nhà hàng Mộc Giang')
    .setChoiceValues(EXPENSE_CATEGORIES)
    .setRequired(true);

  var itemNote = form.addParagraphTextItem();
  itemNote.setTitle('Ghi chú (nếu có)')
    .setRequired(false);

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
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheetByName(FORM_RESPONSES_SHEET) || ss.getSheets()[0];
    var values = sheet.getDataRange().getDisplayValues();
    var headers = values.length > 0 ? values[0] : [];
    var rows = [];

    for (var i = 1; i < values.length; i++) {
      var r = values[i];
      if (!r || (!r[1] && !r[2] && !r[3])) continue;

      var parsedAmount = parseVndAmount(r[3]);
      var category = (r[5] || '').trim();
      var noteVal = (r[6] || '').trim();

      // Hỗ trợ đọc tương thích nếu dữ liệu cũ nằm ở các cột mở rộng
      if (category === 'Chi phí cố định' && r[6]) {
        category = String(r[6]).trim();
        noteVal = (r[7] || r[8] || '').trim();
      } else if (category === 'Chi phí biến động' && (r[7] || r[8])) {
        category = String(r[7] || r[8]).trim();
        noteVal = (r[9] || r[8] || '').trim();
      }

      rows.push({
        rowNumber: i + 1,
        timestamp: r[0] || '',
        fullName: r[1] || '',
        date: r[2] || '',
        amountRaw: r[3] || '',
        amountVnd: parsedAmount.vnd,
        amountFormattedVnd: parsedAmount.formattedVnd,
        amountTrieu: parsedAmount.trieu,
        receiptUrl: r[4] || '',
        category: category,
        note: noteVal
      });
    }

    var payload = {
      status: 'ok',
      spreadsheetId: SPREADSHEET_ID,
      driveFolderId: FOLDER_ID,
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
    var category = data.category || 'Chi phí nguyên vật liệu đầu vào';
    var note = data.note || '';
    var receiptUrl = data.receiptUrl || '';

    if (data.imageBase64) {
      var folder = DriveApp.getFolderById(FOLDER_ID);
      var cleanBase64 = String(data.imageBase64).replace(/^data:[^;]+;base64,/, '');
      var mimeType = data.imageMimeType || 'image/jpeg';
      var fileName = data.imageName || ('MinhChung_MocGiang_' + new Date().getTime() + '.jpg');
      var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), mimeType, fileName);
      var file = folder.createFile(blob);
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (shareErr) {}
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
      category,
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
      category: category,
      note: note
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
