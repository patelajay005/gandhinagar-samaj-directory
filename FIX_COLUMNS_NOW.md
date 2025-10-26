# 🚨 IMMEDIATE FIX FOR COLUMN ISSUE

## The Problem
Data is going to WRONG columns:
- ❌ "Atul" → Column A (should be Column B)
- ❌ "Pratapgadh" → Column B (should be Column D)  
- ❌ "Sargasan" → Column C (should be Column E)
- ❌ "9726320567" → Column E (should be Column C)

## Why This Happens
You're running an OLD cached version of the Google Apps Script deployment!

## 🔧 STEP-BY-STEP FIX (5 minutes)

### Step 1: Open Apps Script (30 seconds)
1. Go to: https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit
2. Click **Extensions** → **Apps Script**

### Step 2: Test Locally FIRST (1 minute)
**This will tell us if the script logic is correct!**

1. At the top of the editor, find the function dropdown (shows `doPost`)
2. Click it and select: **`testAddMemberDirectly`**
3. Click the **Run** button (▶️)
4. Check your Google Sheet - find the last row
5. **Tell me what you see in that row:**
   - Column A = ?
   - Column B = ?
   - Column C = ?
   - Column D = ?
   - Column E = ?

**Expected results:**
- ✅ Column A = Today's date/time
- ✅ Column B = "TEST NAME"
- ✅ Column C = "9999999999"
- ✅ Column D = "TEST VILLAGE"
- ✅ Column E = "TEST ADDRESS"

**If test succeeds but form still fails, it's a deployment caching issue.**

### Step 3: Delete Old Script & Paste New (1 minute)

**Delete ALL the code** in the Apps Script editor and paste this fresh code:

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
  
  return {
    success: true,
    message: 'Check row ' + nextRow + ' in your sheet',
    expected: {A: 'Timestamp', B: 'TEST NAME', C: '9999999999', D: 'TEST VILLAGE', E: 'TEST ADDRESS'},
    actual: {A: verify[0], B: verify[1], C: verify[2], D: verify[3], E: verify[4]}
  };
}
```

Click **Save** (💾 or Ctrl+S)

### Step 4: Create BRAND NEW Deployment (2 minutes)

**⚠️ CRITICAL: Do NOT click "Manage deployments" - that uses cached version!**

1. Click **Deploy** button (top right) → **New deployment**
2. Click the ⚙️ gear icon next to "Select type"
3. Select **Web app**
4. Fill in:
   - **Description**: "Fixed column mapping v2" (or any description)
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [project name] (unsafe)**
9. Click **Allow**
10. **COPY THE NEW WEB APP URL** (it will be different!)

### Step 5: Update Your .env File (30 seconds)

1. Open: `d:\Code\hackathon\Gandhinagar Samaj\.env`
2. Replace the URL with your NEW one:
   ```
   VITE_GOOGLE_SCRIPT_WEB_APP_URL=YOUR_NEW_URL_HERE
   ```
3. Save the file

### Step 6: Restart Dev Server (30 seconds)

In your terminal:
```powershell
# Stop the current server (Ctrl+C if running)
# Then start fresh
npm run dev
```

### Step 7: Test Again (1 minute)

1. Open the app: http://localhost:5173
2. Click "Add Member"
3. Fill the form with test data:
   - Name: "Test User"
   - Mobile: "9876543210"
   - Village: "Test Village"
   - Current Address: "Test Address"
4. Submit
5. Check your Google Sheet

**Expected result:**
- ✅ Column A = Timestamp
- ✅ Column B = "Test User"
- ✅ Column C = "9876543210"
- ✅ Column D = "Test Village"
- ✅ Column E = "Test Address"

## 🔍 Debugging

### Check Browser Console
Press F12 → Console tab. You should see:
```
=== SENDING TO GOOGLE SHEETS ===
Name: Test User
Mobile: 9876543210
Village: Test Village
Current Address: Test Address
```

### Check Apps Script Logs
1. In Apps Script editor, click **Executions** (left sidebar)
2. Find the latest execution
3. Click it to see logs
4. Look for the "VERIFICATION" section - it shows what was actually written

## ✅ Success Checklist

- [ ] Ran `testAddMemberDirectly()` and verified correct columns
- [ ] Pasted fresh code in Apps Script
- [ ] Created BRAND NEW deployment (not update)
- [ ] Copied new Web App URL
- [ ] Updated .env file with new URL
- [ ] Restarted dev server (npm run dev)
- [ ] Tested form submission
- [ ] Data appears in CORRECT columns!

## 🚨 If Still Having Issues

Share with me:
1. Screenshot of test row from `testAddMemberDirectly()`
2. Screenshot of form submission result
3. Apps Script execution logs (from Executions panel)
4. Browser console output
