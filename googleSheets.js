// Google Apps Script 코드
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // 현재 시간 가져오기
  const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  
  // 데이터를 시트에 추가
  sheet.appendRow([
    timestamp,
    data.name,
    data.phone,
    data.agreement ? '동의' : '미동의'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
