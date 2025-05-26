// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';
import DialoguePage from './pages/DialoguePage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>仪表盘 (/) </Link>
          <Link to="/login" style={{ marginRight: '10px' }}>登录 (/login)</Link>
          <Link to="/projects/new">创建新项目 (/projects/new)</Link>
          {/* 移除了之前可能存在的直接访问DialoguePage的临时链接，或将其注释掉 */}
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          {/* 1. 为DialoguePage添加带projectId参数的路由 */}
          <Route path="/dialogue/:projectId" element={<DialoguePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;