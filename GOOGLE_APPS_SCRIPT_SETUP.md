# Google Apps Script Setup Guide

This guide will help you set up Google Apps Script Web App to enable writing data to your Google Sheet.

## Why is this needed?

Google Sheets API with just an API key only supports **read operations**. To add new members to the sheet, you need write permissions, which requires either:
1. OAuth 2.0 (requires user login - complex)
2. **Google Apps Script Web App** (recommended - simple and secure)

## Step-by-Step Setup

### Step 1: Open Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1775CUAh2xcbZiWF-_9ApU0G17erA2TiT2ARaKdllLSs/edit
2. Click on **Extensions** → **Apps Script**
3. This will open the Google Apps Script editor

### Step 2: Create the Script

1. Delete any existing code in the editor
2. Copy and paste the following code:

```javascript
// Google Apps Script to handle adding members to the sheet

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addMember') {
      return addMemberToSheet(data.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addMemberToSheet(memberData) {
  try {
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; // First sheet
    
    // Get the header row
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    const headers = headerRange.getValues()[0];
    
    // Create a mapping of header name to column index (0-based)
    const columnMap = {};
    headers.forEach((header, index) => {
      const headerName = header.toString().toLowerCase().trim();
      columnMap[headerName] = index;
      Logger.log('Header "' + headerName + '" is at index ' + index);
    });
    
    // Get the next empty row
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    Logger.log('Adding data to row: ' + newRow);
    
    // Set Timestamp (automatically)
    const timestampCol = columnMap['timestamp'] !== undefined ? columnMap['timestamp'] + 1 : 1;
    sheet.getRange(newRow, timestampCol).setValue(new Date());
    Logger.log('Timestamp set in column ' + timestampCol);
    
    // Set Name (finds "name" column)
    const nameCol = columnMap['name'] !== undefined ? columnMap['name'] + 1 : 2;
    sheet.getRange(newRow, nameCol).setValue(memberData.name || '');
    Logger.log('Name "' + memberData.name + '" set in column ' + nameCol);
    
    // Set Village
    const villageCol = columnMap['village'] !== undefined ? columnMap['village'] + 1 : 3;
    sheet.getRange(newRow, villageCol).setValue(memberData.village || '');
    
    // Set Current Address
    const addressCol = columnMap['current address'] !== undefined ? columnMap['current address'] + 1 : 4;
    sheet.getRange(newRow, addressCol).setValue(memberData.currentAddress || '');
    
    // Set Mobile
    const mobileCol = columnMap['mobile'] !== undefined ? columnMap['mobile'] + 1 : 5;
    sheet.getRange(newRow, mobileCol).setValue(memberData.mobile || '');
    
    // Set family members starting from column 6 (or after known columns)
    let currentCol = 6;
    
    // Member 2
    sheet.getRange(newRow, currentCol++).setValue(memberData.member2Name || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member2Age || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member2Business || '');
    
    // Member 3
    sheet.getRange(newRow, currentCol++).setValue(memberData.member3Name || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member3Age || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member3Business || '');
    
    // Member 4
    sheet.getRange(newRow, currentCol++).setValue(memberData.member4Name || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member4Age || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member4Business || '');
    
    // Member 5
    sheet.getRange(newRow, currentCol++).setValue(memberData.member5Name || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member5Age || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member5Business || '');
    
    // Member 6
    sheet.getRange(newRow, currentCol++).setValue(memberData.member6Name || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member6Age || '');
    sheet.getRange(newRow, currentCol++).setValue(memberData.member6Business || '');
    
    // Remark
    sheet.getRange(newRow, currentCol++).setValue(memberData.remark || '');
    
    Logger.log('Member data added successfully to row ' + newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Member added successfully',
      row: newRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error adding member: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Failed to add member: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function
function testAddMember() {
  const testData = {
    name: 'Test User',
    village: 'Test Village',
    currentAddress: 'Test Address',
    mobile: '9876543210',
    member2Name: 'Family Member 1',
    member2Age: '25',
    member2Business: 'Engineer',
    remark: 'Test entry'
  };
  
  const result = addMemberToSheet(testData);
  Logger.log(result.getContent());
}
```

3. Click **Save** (disk icon) and give your project a name (e.g., "Samaj Directory API")

### Step 3: Deploy as Web App

1. Click on **Deploy** → **New deployment**
2. Click on **Select type** (gear icon) → Choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Add Member API" (or any description)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (this is safe - your script controls what data can be written)
4. Click **Deploy**
5. **Authorize Access**:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)** (it's safe, Google just warns about custom scripts)
   - Click **Allow**
6. **Copy the Web App URL**: You'll see a URL like:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxx/exec
   ```
   **Copy this URL!**

### Step 4: Update Your .env File

1. Open the `.env` file in your project root
2. Add this line with your Web App URL:
   ```
   VITE_GOOGLE_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxx/exec
   ```
3. Save the file

### Step 5: Restart Your Development Server

```powershell
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 6: Test It!

1. Go to your app: http://localhost:5173
2. Click "Add New Member"
3. Fill in the form and submit
4. Check your Google Sheet - the new member should appear!

## Troubleshooting

### Error: "Script function not found: doPost"
- Make sure you saved the script (Ctrl+S or disk icon)
- Redeploy the web app

### Error: "Authorization required"
- You need to authorize the script to access your spreadsheet
- Go through Step 3 again and make sure you authorize access

### Error: "CORS error"
- This is normal for Google Apps Script
- Make sure you're using the `/exec` URL (not `/dev`)

### Members not appearing in sheet
- Check if the column order in the script matches your sheet
- Verify the Web App URL in `.env` is correct
- Check the browser console for detailed error messages

## Column Order in Your Sheet

Make sure your Google Sheet has columns in this order:
1. **Timestamp** (automatically added by the script)
2. Name
3. Village
4. Current Address
5. Mobile
6. Member 2 Name
7. Member 2 Age
8. Member 2 Business/Job
9. Member 3 Name
10. Member 3 Age
11. Member 3 Business/Job
12. Member 4 Name
13. Member 4 Age
14. Member 4 Business/Job
15. Member 5 Name
16. Member 5 Age
17. Member 5 Business/Job
18. Member 6 Name
19. Member 6 Age
20. Member 6 Business/Job
21. Remark

## Security Notes

- The Web App URL is safe to share - it only allows the specific operations you coded
- Only YOU can modify the script
- Data validation happens in your frontend before sending to the script
- The script runs with YOUR permissions, so it can write to YOUR spreadsheet

## Alternative: Make Sheet Publicly Editable (Not Recommended)

If you don't want to set up Apps Script, you can:
1. Open your Google Sheet
2. Click **Share** → Change to **"Anyone with the link can edit"**
3. ⚠️ **Warning**: This allows ANYONE to edit your sheet directly - not secure!

The Apps Script method is much safer and gives you control over what data can be added.

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Apps Script logs: **Executions** tab in Apps Script editor
3. Make sure the Web App URL in `.env` is the `/exec` URL (not `/dev`)
4. Ensure your Google Sheet is accessible to the script
