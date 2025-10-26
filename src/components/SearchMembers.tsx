import { useState, useEffect } from 'react'
import './SearchMembers.css'
import { fetchGoogleSheetData, type PersonData } from '../services/googleSheetsService'

interface SearchMembersProps {
  onAddMember: () => void;
}

function SearchMembers({ onAddMember }: SearchMembersProps) {
  const [data, setData] = useState<PersonData[]>([]);
  const [filteredData, setFilteredData] = useState<PersonData[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchVillage, setSearchVillage] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;

  // Load data from Google Sheets on component mount
  useEffect(() => {
    loadGoogleSheetData();
  }, []);

  const loadGoogleSheetData = async () => {
    try {
      setLoading(true);
      const sheetData = await fetchGoogleSheetData();
      setData(sheetData);
      setFilteredData(sheetData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to load Google Sheet data:', errorMessage);
      console.warn('Using sample data as fallback');
      // Load sample data as fallback
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData: PersonData[] = [
      { name: 'Rajesh Patel', village: 'Gandhinagar', currentAddress: 'Ahmedabad, Gujarat', mobileNumber: '9876543210', email: 'rajesh@example.com' },
      { name: 'Priya Shah', village: 'Kalol', currentAddress: 'Surat, Gujarat', mobileNumber: '9876543211', email: 'priya@example.com' },
      { name: 'Amit Desai', village: 'Mansa', currentAddress: 'Mumbai, Maharashtra', mobileNumber: '9876543212', email: 'amit@example.com' },
      { name: 'Neha Trivedi', village: 'Gandhinagar', currentAddress: 'Gandhinagar, Gujarat', mobileNumber: '9876543213', email: 'neha@example.com' },
      { name: 'Kiran Mehta', village: 'Dehgam', currentAddress: 'Pune, Maharashtra', mobileNumber: '9876543214', email: 'kiran@example.com' },
    ];
    setData(sampleData);
    setFilteredData(sampleData);
  };

  useEffect(() => {
    // Filter data based on search criteria
    const filtered = data.filter(person => {
      const nameMatch = person.name.toLowerCase().includes(searchName.toLowerCase());
      const villageMatch = person.village.toLowerCase().includes(searchVillage.toLowerCase());
      const addressMatch = person.currentAddress.toLowerCase().includes(searchAddress.toLowerCase());
      
      return nameMatch && villageMatch && addressMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchName, searchVillage, searchAddress, data]);

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchName('');
    setSearchVillage('');
    setSearchAddress('');
    setCurrentPage(1);
  };

  return (
    <div className="search-container">
      <header className="header">
        <h1>🏛️ Gandhinagar Morbi Samaj Directory</h1>
        <p>Search and find community members</p>
        {loading && <p className="status-message">⏳ Loading data from Google Sheets...</p>}
        <button onClick={onAddMember} className="add-member-btn">
          ➕ Add New Member
        </button>
      </header>

      <div className="search-section">
        <h2>🔍 Search Filters</h2>
        <div className="search-grid">
          <div className="search-field">
            <label htmlFor="search-name">Name</label>
            <input
              id="search-name"
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="search-village">Village</label>
            <input
              id="search-village"
              type="text"
              placeholder="Search by village..."
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="search-address">Current Address</label>
            <input
              id="search-address"
              type="text"
              placeholder="Search by current address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <button onClick={clearSearch} className="clear-btn">
          Clear All Filters
        </button>
      </div>

      <div className="results-section">
        <h2>📋 Results ({filteredData.length} found)</h2>
        
        {filteredData.length === 0 ? (
          <div className="no-results">
            <p>No results found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="pagination-info">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredData.length)} of {filteredData.length} records
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Village</th>
                    <th>Current Address</th>
                    <th>Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((person, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstRecord + index + 1}</td>
                      <td>{person.name}</td>
                      <td>{person.village}</td>
                      <td>{person.currentAddress}</td>
                      <td>{person.mobileNumber || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                
                <div className="pagination-numbers">
                  {currentPage > 2 && (
                    <>
                      <button onClick={() => goToPage(1)} className="pagination-btn">1</button>
                      {currentPage > 3 && <span className="pagination-dots">...</span>}
                    </>
                  )}
                  
                  {currentPage > 1 && (
                    <button onClick={() => goToPage(currentPage - 1)} className="pagination-btn">
                      {currentPage - 1}
                    </button>
                  )}
                  
                  <button className="pagination-btn active">{currentPage}</button>
                  
                  {currentPage < totalPages && (
                    <button onClick={() => goToPage(currentPage + 1)} className="pagination-btn">
                      {currentPage + 1}
                    </button>
                  )}
                  
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
                      <button onClick={() => goToPage(totalPages)} className="pagination-btn">
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchMembers;
