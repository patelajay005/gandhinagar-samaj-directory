// Google Sheets API Configuration
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '';
const SHEET_ID = import.meta.env.VITE_SHEET_ID || '';

export interface PersonData {
  name: string;
  village: string;
  currentAddress: string;
  mobileNumber?: string;
  email?: string;
  [key: string]: any;
}

export interface NewMemberData {
  name: string;
  mobile: string;
  village: string;
  currentAddress: string;
  member2Name?: string;
  member2Age?: string;
  member2Business?: string;
  member3Name?: string;
  member3Age?: string;
  member3Business?: string;
  member4Name?: string;
  member4Age?: string;
  member4Business?: string;
  member5Name?: string;
  member5Age?: string;
  member5Business?: string;
  member6Name?: string;
  member6Age?: string;
  member6Business?: string;
  remark?: string;
}

/**
 * Fetch data from Google Sheets using the API
 */
export async function fetchGoogleSheetData(): Promise<PersonData[]> {
  try {
    // Validate environment variables
    if (!API_KEY || !SPREADSHEET_ID || !SHEET_ID) {
      throw new Error('Missing environment variables. Please check .env file.');
    }

    // First, get the sheet name from the sheet ID
    const sheetMetadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
    
    const metadataResponse = await fetch(sheetMetadataUrl);
    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('Metadata fetch failed:', errorText);
      throw new Error(`Failed to fetch sheet metadata: ${metadataResponse.statusText}. The sheet may not be publicly accessible.`);
    }
    
    const metadata = await metadataResponse.json();
    const sheet = metadata.sheets.find((s: any) => s.properties.sheetId === parseInt(SHEET_ID));
    
    if (!sheet) {
      throw new Error(`Sheet with ID ${SHEET_ID} not found`);
    }
    
    const sheetName = sheet.properties.title;
    
    // Fetch the actual data
    const range = `${sheetName}!A:Z`; // Adjust range as needed
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Data fetch failed:', errorText);
      throw new Error(`Failed to fetch data: ${response.statusText}. Please ensure the sheet is shared publicly.`);
    }
    
    const data = await response.json();
    const rows = data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // First row is headers
    const headers = rows[0].map((h: string) => h.trim().toLowerCase());
    
    // Map column indices
    const nameIndex = headers.findIndex((h: string) => h.includes('name'));
    const villageIndex = headers.findIndex((h: string) => h.includes('village') || h.includes('native'));
    const addressIndex = headers.findIndex((h: string) => 
      h.includes('address') || h.includes('current') || h.includes('location')
    );
    const mobileIndex = headers.findIndex((h: string) => 
      h.includes('mobile') || h.includes('phone') || h.includes('contact')
    );
    const emailIndex = headers.findIndex((h: string) => h.includes('email') || h.includes('mail'));
    
    // Parse data rows
    const parsedData: PersonData[] = rows.slice(1).map((row: string[]) => {
      const person: PersonData = {
        name: nameIndex >= 0 ? (row[nameIndex] || '').trim() : '',
        village: villageIndex >= 0 ? (row[villageIndex] || '').trim() : '',
        currentAddress: addressIndex >= 0 ? (row[addressIndex] || '').trim() : '',
      };
      
      if (mobileIndex >= 0) {
        person.mobileNumber = (row[mobileIndex] || '').trim();
      }
      
      if (emailIndex >= 0) {
        person.email = (row[emailIndex] || '').trim();
      }
      
      // Add all other columns as well
      headers.forEach((header: string, index: number) => {
        if (index !== nameIndex && 
            index !== villageIndex && 
            index !== addressIndex && 
            index !== mobileIndex && 
            index !== emailIndex) {
          const key = header.replace(/\s+/g, '_');
          person[key] = (row[index] || '').trim();
        }
      });
      
      return person;
    }).filter((person: PersonData) => person.name); // Filter out empty rows
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
}

/**
 * Alternative: Fetch using public CSV export (requires sheet to be public)
 */
export async function fetchGoogleSheetAsCSV(): Promise<PersonData[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_ID}`;
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}. Make sure the sheet is publicly accessible.`);
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => {
      // Simple CSV parsing (for complex CSVs, use papaparse library)
      return row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    });
    
    if (rows.length === 0) {
      return [];
    }
    
    const headers = rows[0].map(h => h.toLowerCase());
    
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const villageIndex = headers.findIndex(h => h.includes('village') || h.includes('native'));
    const addressIndex = headers.findIndex(h => 
      h.includes('address') || h.includes('current') || h.includes('location')
    );
    const mobileIndex = headers.findIndex(h => 
      h.includes('mobile') || h.includes('phone') || h.includes('contact')
    );
    const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('mail'));
    
    const parsedData: PersonData[] = rows.slice(1).map(row => {
      const person: PersonData = {
        name: nameIndex >= 0 ? row[nameIndex] : '',
        village: villageIndex >= 0 ? row[villageIndex] : '',
        currentAddress: addressIndex >= 0 ? row[addressIndex] : '',
      };
      
      if (mobileIndex >= 0) person.mobileNumber = row[mobileIndex];
      if (emailIndex >= 0) person.email = row[emailIndex];
      
      return person;
    }).filter((person: PersonData) => person.name);
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
}

/**
 * Add a new member to the Google Sheet using Google Apps Script Web App
 * This method works by calling a deployed Google Apps Script that has write permissions
 */
export async function addMemberToSheet(memberData: NewMemberData): Promise<void> {
  try {
    // Check if Web App URL is configured
    const webAppUrl = import.meta.env.VITE_GOOGLE_SCRIPT_WEB_APP_URL;
    
    if (!webAppUrl) {
      // Fallback: Try using Google Forms if configured
      const formUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
      if (formUrl) {
        throw new Error('Google Forms submission is not yet implemented. Please configure VITE_GOOGLE_SCRIPT_WEB_APP_URL in your .env file.');
      }
      
      throw new Error(
        'Write permissions not available. To add members:\n' +
        '1. Create a Google Apps Script Web App (instructions below)\n' +
        '2. Add VITE_GOOGLE_SCRIPT_WEB_APP_URL to your .env file\n' +
        'OR share the Google Sheet with "Anyone with link can edit" permissions.'
      );
    }

    // Prepare the data payload
    const payload = {
      action: 'addMember',
      data: {
        name: memberData.name,
        mobile: memberData.mobile,
        village: memberData.village,
        currentAddress: memberData.currentAddress,
        member2Name: memberData.member2Name || '',
        member2Age: memberData.member2Age || '',
        member2Business: memberData.member2Business || '',
        member3Name: memberData.member3Name || '',
        member3Age: memberData.member3Age || '',
        member3Business: memberData.member3Business || '',
        member4Name: memberData.member4Name || '',
        member4Age: memberData.member4Age || '',
        member4Business: memberData.member4Business || '',
        member5Name: memberData.member5Name || '',
        member5Age: memberData.member5Age || '',
        member5Business: memberData.member5Business || '',
        member6Name: memberData.member6Name || '',
        member6Age: memberData.member6Age || '',
        member6Business: memberData.member6Business || '',
        remark: memberData.remark || ''
      }
    };

    console.log('=== SERVICE: Sending to Google Apps Script ===');
    console.log('Web App URL:', webAppUrl);
    console.log('Payload data.name:', payload.data.name);
    console.log('Payload data.mobile:', payload.data.mobile);
    console.log('Payload data.village:', payload.data.village);
    console.log('Payload data.currentAddress:', payload.data.currentAddress);
    console.log('Full payload:', JSON.stringify(payload, null, 2));

    // Call the Google Apps Script Web App
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add member:', errorText);
      throw new Error(`Failed to add member: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to add member');
    }

    console.log('Member added successfully:', result);
  } catch (error) {
    console.error('Error adding member to Google Sheet:', error);
    throw error;
  }
}
