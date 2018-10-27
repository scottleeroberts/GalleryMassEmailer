function _sendEmail(to,subject,msg){
  Logger.log(to);
  Logger.log(subject);
  Logger.log(msg);
  GmailApp.sendEmail(to,subject,msg)
}


function _getSheetByName(name){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for( var n in sheets){
    if (name==sheets[n].getName()){
      return sheets[n];
    }
  }
  return sheets[0];
}

function _prepareMessage(link){
  var msg_sheet = _getSheetByName("msg");
  
  var initial_sheet = SpreadsheetApp.getActiveSheet()
  SpreadsheetApp.setActiveSheet(msg_sheet)
  
  var msg_cell = msg_sheet.getRange(1,1,1,1)
  msg_data = msg_cell.getValues()
  var msg = msg_data[0][0]
  msg = msg.replace("%GALLERY_LINK%",link)
  SpreadsheetApp.setActiveSheet(initial_sheet)
  return msg;
}


// GoogleSheet must have
//1: sheet named "students"
//    col 2: mom email address (0 based)
//    col 3: dad email address (0 based )
//    col 4: link to photo gallery
//2. sheet named "msg"
// this sheet contains the contents of the email 
// note %GALLERY_LINK% in email msg will be substituted with photo gallery address (above)

function emailParents(){
  //note 0 based indexing
  const MOM_EMAIL_COLUMN = 2;
  const DAD_EMAIL_COLUMN = 3;
  const GALLERY_LINK_COLUMN = 4
  
  var student_sheet = _getSheetByName("students");
  var rowCount = student_sheet.getLastRow();
  var colCount = student_sheet.getLastColumn();
  var dataRange = student_sheet.getRange(2,1,rowCount-1,colCount); 
  var student_data = dataRange.getValues();
  
  for (student_row in student_data){
    var mom_email = student_data[student_row][MOM_EMAIL_COLUMN];
    var dad_email = student_data[student_row][DAD_EMAIL_COLUMN];
    var link = student_data[student_row][GALLERY_LINK_COLUMN];
    var msg = _prepareMessage(link);
    
    _sendEmail(mom_email,"SPMA School Portraits are ready for you to see!",msg)
    
    if ((dad_email !== '') && (dad_email != mom_email)){
      _sendEmail(dad_email,"SPMA School Portraits are ready for you to see!",msg)
    }
  }
}
