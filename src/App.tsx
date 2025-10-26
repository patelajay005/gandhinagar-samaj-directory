import { useState } from 'react'
import './App.css'
import SearchMembers from './components/SearchMembers'
import AddMember from './components/AddMember'

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'add'>('search');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMemberAdded = () => {
    // Trigger refresh by updating state
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      {currentView === 'search' ? (
        <SearchMembers 
          key={refreshTrigger} // This will force re-mount and reload data
          onAddMember={() => setCurrentView('add')} 
        />
      ) : (
        <AddMember 
          onBack={() => setCurrentView('search')} 
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}

export default App;
