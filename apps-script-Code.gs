/**
 * JobsEuro — Application Form Backend
 * ------------------------------------
 * Receives submissions from the Apply form on jobseuro.com,
 * logs each one (with a precise timestamp) as a new row in this
 * Google Sheet, and emails the full details to the notification
 * address below.
 *
 * SETUP:
 * 1. Open a new Google Sheet (sheets.new).
 * 2. Extensions > Apps Script.
 * 3. Delete any starter code, paste this whole file in.
 * 4. Update NOTIFY_EMAIL below if needed (already set).
 * 5. File > Project Settings > check "Show appsscript.json", then
 *    set the script Time Zone to your zone for accurate timestamps
 *    (Project Settings > Time zone, e.g. "Africa/Casablanca").
 * 6. Deploy > New deployment > type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 7. Click Deploy, authorize the permissions it asks for.
 * 8. Copy the Web App URL it gives you.
 * 9. Paste that URL into assets/script.js in the site,
 *    at the top: const GOOGLE_SCRIPT_URL = "...";
 */

const NOTIFY_EMAIL = "yhpro.help@gmail.com";
const SHEET_NAME = "Applications";
const CV_FOLDER_NAME = "JobsEuro - CV Uploads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const now = new Date();
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    let cvLink = "";
    if (data.cv_base64 && data.cv_filename) {
      cvLink = saveCvToDrive(data.cv_base64, data.cv_filename, data.fullname || "unknown");
    }

    const ref = "EU-" + Utilities.formatDate(now, Session.getScriptTimeZone(), "yyMMdd") + "-" + sheet.getLastRow();

    sheet.appendRow([
      timestamp,
      ref,
      data.lang || "",
      data.fullname || "",
      data.birthdate || "",
      data.email || "",
      data.phone || "",
      data.country_res || "",
      data.nationality || "",
      data.education || "",
      data.field || "",
      data.experience || "",
      data.languages || "",
      data.target_country || "",
      data.job_field || "",
      data.message || "",
      cvLink,
    ]);

    sendNotificationEmail(timestamp, ref, data, cvLink);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, ref: ref }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "Reference", "Language", "Full Name", "Date of Birth", "Email", "Phone",
      "Country of Residence", "Nationality", "Education Level", "Field of Study",
      "Experience", "Languages Spoken", "Target Country", "Desired Job Field",
      "Message", "CV Link"
    ]);
    sheet.getRange(1, 1, 1, 17).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveCvToDrive(base64Data, filename, applicantName) {
  try {
    let folder;
    const folders = DriveApp.getFoldersByName(CV_FOLDER_NAME);
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CV_FOLDER_NAME);

    const cleanBase64 = base64Data.split(",").pop();
    const mimeType = base64Data.includes("application/pdf") ? "application/pdf" : "application/octet-stream";
    const bytes = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(bytes, mimeType, applicantName + " - " + filename);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "Error saving CV: " + err.toString();
  }
}

function sendNotificationEmail(timestamp, ref, data, cvLink) {
  const subject = "New JobsEuro Application — " + (data.fullname || "Unnamed") + " (" + ref + ")";
  const body =
    "New application received on JobsEuro\n" +
    "----------------------------------------\n" +
    "Timestamp: " + timestamp + "\n" +
    "Reference: " + ref + "\n" +
    "Language: " + (data.lang || "-") + "\n\n" +
    "PERSONAL DETAILS\n" +
    "Full name: " + (data.fullname || "-") + "\n" +
    "Date of birth: " + (data.birthdate || "-") + "\n" +
    "Email: " + (data.email || "-") + "\n" +
    "Phone: " + (data.phone || "-") + "\n" +
    "Country of residence: " + (data.country_res || "-") + "\n" +
    "Nationality: " + (data.nationality || "-") + "\n\n" +
    "EDUCATION & EXPERIENCE\n" +
    "Education level: " + (data.education || "-") + "\n" +
    "Field of study: " + (data.field || "-") + "\n" +
    "Experience: " + (data.experience || "-") + "\n" +
    "Languages spoken: " + (data.languages || "-") + "\n\n" +
    "TARGET\n" +
    "Target country: " + (data.target_country || "-") + "\n" +
    "Desired job field: " + (data.job_field || "-") + "\n\n" +
    "MESSAGE\n" + (data.message || "-") + "\n\n" +
    "CV: " + (cvLink || "Not attached") + "\n" +
    "----------------------------------------\n" +
    "This application was logged automatically in the 'Applications' sheet.";

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// Optional: run manually once to verify permissions are granted correctly.
function testSetup() {
  sendNotificationEmail(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    "EU-TEST",
    { fullname: "Test User", email: "test@example.com", lang: "en" },
    ""
  );
}
