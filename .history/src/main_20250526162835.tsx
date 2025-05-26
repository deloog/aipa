import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Vite模板中可能有的全局CSS，可以保留

import { ThemeProvider, createTheme } from '@mui/material/styles'; // 1. 导入MUI主题相关组件
import CssBaseline from '@mui/material/CssBaseline'; // 2. 导入CssBaseline

// 3. 创建一个基础的MUI主题实例 (我们暂时使用默认主题)
// 未来您可以根据需要在这里深度定制主题 (颜色、字体、间距等)
const theme = createTheme({
  // 例如，您可以定义调色板:
  // palette: {
  //   primary: {
  //     main: '#1976d2', // 这是一个示例主色调
  //   },
  //   secondary: {
  //     main: '#dc004e', // 这是一个示例次要色调
  //   },
  // },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* 4. 使用ThemeProvider包裹App组件，并传入主题 */}
      <CssBaseline /> {/* 5. 添加CssBaseline以应用基础样式重置和MUI默认背景等 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);