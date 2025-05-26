import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Vite模板中可能有的默认CSS，可以暂时保留或按需修改
import LoginPage from './pages/LoginPage'; 
import DashboardPage from './pages/DashboardPage';

// 1. 创建临时的占位符组件 (我们后续会用真实的页面组件替换它们)

function DashboardPagePlaceholder() {
  return (
    <div>
      <h1>AIPA 仪表盘 (占位符)</h1>
      <p>欢迎使用AI项目规划助手！</p>
      <p>登录成功后，用户将看到此页面或类似的管理界面。</p>
    </div>
  );
}

// 2. 修改App组件以包含路由配置
function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>仪表盘 (/) </Link>
          <Link to="/login">登录 (/login)</Link>
        </nav>

        <Routes>
          {/* 2. 更新 login 路由的 element */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPagePlaceholder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;