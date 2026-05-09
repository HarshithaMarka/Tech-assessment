import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import TasksBoard from './pages/TasksBoard';

// Components
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="app-container"><div className="text-center mt-4 text-muted">Loading...</div></div>;
  }

  return (
    <Router>
      <div className="app-container">
        {user && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/projects" element={user ? <ProjectsPage /> : <Navigate to="/auth" />} />
            <Route path="/tasks" element={user ? <TasksBoard /> : <Navigate to="/auth" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
