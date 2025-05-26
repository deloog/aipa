import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Vite模板中可能有的默认CSS，可以暂时保留或按需修改
import LoginPage from './pages/LoginPage'; 
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';

// 1. 创建临时的占位符组件 (我们后续会用真实的页面组件替换它们)



// 2. 修改App组件以包含路由配置
function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>仪表盘 (/) </Link>
          <Link to="/login" style={{ marginRight: '10px' }}>登录 (/login)</Link>
          {/* 方便测试，临时添加一个到新项目页面的链接 */}
          <Link to="/projects/new">创建新项目 (/projects/new)</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          {/* 2. 为新项目页面添加路由规则 */}
          <Route path="/projects/new" element={<NewProjectPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;