# Quick Start: Enable Add Member Feature

## The Problem
❌ **Error**: "Failed to add member to sheet. The API key may need write permissions."

## The Solution
Google Sheets API with just an API key **cannot write data**. You need to set up a Google Apps Script Web App (takes 5 minutes).

## 5-Minute Setup Steps

### 1. Open Apps Script (30 seconds)
1. Open your sheet: https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit
2. Click **Extensions** → **Apps Script**

### 2. Paste the Code (1 minute)
Delete everything and paste this:

```javascript
function doPost(e) {
  try {
    // Log incoming request
    Logger.log('=== INCOMING REQUEST ===');
    Logger.log('Raw request: ' + e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed action: ' + data.action);
    
    if (data.action === 'addMember') {
      Logger.log('=== RECEIVED MEMBER DATA ===');
      Logger.log('Name: ' + data.data.name);
      Logger.log('Mobile: ' + data.data.mobile);
      Logger.log('Village: ' + data.data.village);
      Logger.log('Address: ' + data.data.currentAddress);
      
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheets()[0];
      
      // Get next row
      const nextRow = sheet.getLastRow() + 1;
      Logger.log('=== WRITING TO ROW ' + nextRow + ' ===');
      
      // EXACT COLUMN POSITIONS based on your sheet:
      // A=Timestamp, B=Name, C=Mobile, D=Village, E=Current Address
      
      // Write to Column A (1): Timestamp
      const timestamp = new Date();
      sheet.getRange(nextRow, 1).setValue(timestamp);
      Logger.log('Col A (1) - Timestamp: ' + timestamp);
      
      // Write to Column B (2): Name
      const name = data.data.name || '';
      sheet.getRange(nextRow, 2).setValue(name);
      Logger.log('Col B (2) - Name: "' + name + '"');
      
      // Write to Column C (3): Mobile
      const mobile = data.data.mobile || '';
      sheet.getRange(nextRow, 3).setValue(mobile);
      Logger.log('Col C (3) - Mobile: "' + mobile + '"');
      
      // Write to Column D (4): Village
      const village = data.data.village || '';
      sheet.getRange(nextRow, 4).setValue(village);
      Logger.log('Col D (4) - Village: "' + village + '"');
      
      // Write to Column E (5): Current Address
      const address = data.data.currentAddress || '';
      sheet.getRange(nextRow, 5).setValue(address);
      Logger.log('Col E (5) - Address: "' + address + '"');
      
      // Family members columns F onwards (6+)
      sheet.getRange(nextRow, 6).setValue(data.data.member2Name || '');
      sheet.getRange(nextRow, 7).setValue(data.data.member2Age || '');
      sheet.getRange(nextRow, 8).setValue(data.data.member2Business || '');
      sheet.getRange(nextRow, 9).setValue(data.data.member3Name || '');
      sheet.getRange(nextRow, 10).setValue(data.data.member3Age || '');
      sheet.getRange(nextRow, 11).setValue(data.data.member3Business || '');
      sheet.getRange(nextRow, 12).setValue(data.data.member4Name || '');
      sheet.getRange(nextRow, 13).setValue(data.data.member4Age || '');
      sheet.getRange(nextRow, 14).setValue(data.data.member4Business || '');
      sheet.getRange(nextRow, 15).setValue(data.data.member5Name || '');
      sheet.getRange(nextRow, 16).setValue(data.data.member5Age || '');
      sheet.getRange(nextRow, 17).setValue(data.data.member5Business || '');
      sheet.getRange(nextRow, 18).setValue(data.data.member6Name || '');
      sheet.getRange(nextRow, 19).setValue(data.data.member6Age || '');
      sheet.getRange(nextRow, 20).setValue(data.data.member6Business || '');
      sheet.getRange(nextRow, 21).setValue(data.data.remark || '');
      
      Logger.log('=== SUCCESS - ALL DATA WRITTEN ===');
      
      // Verify what was written
      const writtenData = sheet.getRange(nextRow, 1, 1, 5).getValues()[0];
      Logger.log('=== VERIFICATION - What was actually written ===');
      Logger.log('Read back Col A: ' + writtenData[0]);
      Logger.log('Read back Col B: ' + writtenData[1]);
      Logger.log('Read back Col C: ' + writtenData[2]);
      Logger.log('Read back Col D: ' + writtenData[3]);
      Logger.log('Read back Col E: ' + writtenData[4]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Member added to row ' + nextRow,
        verification: {
          timestamp: writtenData[0],
          name: writtenData[1],
          mobile: writtenData[2],
          village: writtenData[3],
          address: writtenData[4]
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown action: ' + data.action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('=== CRITICAL ERROR ===');
    Logger.log('Error message: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// TEST FUNCTION - Run this directly to verify column mapping
function testAddMemberDirectly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const nextRow = sheet.getLastRow() + 1;
  
  Logger.log('=== DIRECT TEST - Adding to row: ' + nextRow + ' ===');
  
  // Write test data to exact columns
  sheet.getRange(nextRow, 1).setValue(new Date());
  sheet.getRange(nextRow, 2).setValue('TEST NAME');
  sheet.getRange(nextRow, 3).setValue('9999999999');
  sheet.getRange(nextRow, 4).setValue('TEST VILLAGE');
  sheet.getRange(nextRow, 5).setValue('TEST ADDRESS');
  
  Logger.log('Test complete! Check your sheet row ' + nextRow);
  Logger.log('Expected: A=Timestamp, B=TEST NAME, C=9999999999, D=TEST VILLAGE, E=TEST ADDRESS');
  
  // Read back and verify
  const verify = sheet.getRange(nextRow, 1, 1, 5).getValues()[0];
  Logger.log('=== READBACK ===');
  Logger.log('A: ' + verify[0]);
  Logger.log('B: ' + verify[1]);
  Logger.log('C: ' + verify[2]);
  Logger.log('D: ' + verify[3]);
  Logger.log('E: ' + verify[4]);
}
```

Click **Save** (Ctrl+S)

### 3. Deploy (2 minutes)

**IMPORTANT: Create a NEW deployment (not update existing one)**

1. Click **Deploy** → **New deployment** (NOT "Manage deployments")
2. Click gear icon → Select **Web app**
3. Settings:
   - **Description**: "Add Member v2" (use a new name)
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. If asked to authorize again, click **Authorize access** → Choose your account
6. **COPY THE NEW URL** (it will be different from before)
7. **IMPORTANT**: This is your NEW Web App URL - it will look like:
   `https://script.google.com/macros/s/AKfycb.../exec`

### 4. Update .env (1 minute)
Open `.env` file and add:
```
VITE_GOOGLE_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycb.../exec
```
(Replace with YOUR URL from step 3)

### 5. Restart Server (30 seconds)
```powershell
# Press Ctrl+C to stop
npm run dev
```

## Test It!
1. Go to http://localhost:5173
2. Click "Add New Member"
3. Fill the form and submit
4. Check your Google Sheet → Member should appear! ✅

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Script function not found" | Make sure you saved the script (Ctrl+S) |
| "Authorization required" | Redo step 3, authorize the script |
| "CORS error" | Make sure URL ends with `/exec` not `/dev` |
| Still not working? | Check [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) for detailed guide |

## Why This Works
- ✅ Google Apps Script runs with YOUR permissions
- ✅ It can write to YOUR spreadsheet
- ✅ The `/exec` endpoint is publicly accessible but only does what YOU coded
- ✅ Your frontend validation prevents bad data
- ✅ Secure and simple!

## Alternative (Not Recommended)
You could make the sheet "Anyone with link can edit" but this is **NOT SECURE** - anyone can modify anything directly.

---

**Need detailed help?** See [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)
