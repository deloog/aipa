// src/pages/LoginPage.tsx
import React from 'react';
import './LoginPage.css'; // 我们将为此页面创建一个CSS文件

const LoginPage: React.FC = () => {
    const handleGoogleLogin = () => {
        // 1. 从环境变量中获取Google Client ID (由Vite提供给客户端代码)
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
        // 2. 定义我们后端处理Google回调的URI
        const redirectUri = 'http://localhost:3001/api/v1/auth/google/callback';
      
        // 3. Google OAuth 2.0 授权端点
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      
        // 4. 定义URL参数
        const params = {
          client_id: googleClientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        };
      
        // 5. 将参数对象转换为URL查询字符串
        const queryString = new URLSearchParams(params).toString();
      
        // 6. 构造完整的授权URL (确保 oauth2Endpoint 和 queryString 在这里被正确使用)
        const googleAuthUrl = `<span class="math-inline">\{oauth2Endpoint\}?</span>{queryString}`;
      
        console.log('将重定向到Google授权URL:', googleAuthUrl);
      
        // 7. 执行重定向到Google的授权页面
        window.location.href = googleAuthUrl;
      };
  return (
    <div className="login-page-container">
      <div className="login-form">
        <h1>登录到 AI项目规划助手 (AIPA)</h1>
        <p>请选择您的登录方式：</p>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          {/* 您可以找一个Google的SVG图标放在这里 */}
          使用Google登录
        </button>
        {/* 未来可以在这里添加其他登录方式，例如：
        <button className="other-login-button">使用GitHub登录</button>
        */}
      </div>
    </div>
  );
};

export default LoginPage;