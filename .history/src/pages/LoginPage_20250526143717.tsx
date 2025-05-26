// src/pages/LoginPage.tsx
import React from 'react';
import './LoginPage.css'; // 我们将为此页面创建一个CSS文件

const LoginPage: React.FC = () => {
    const handleGoogleLogin = () => {
        // 1. 从环境变量中获取Google Client ID (由Vite提供给客户端代码)
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
        // 2. 定义我们后端处理Google回调的URI
        //    这个地址需要与您后端 AuthController 中定义的 /auth/google/callback 路由匹配，
        //    并且也需要与您未来在Google Cloud Console中配置的回调URI完全一致。
        //    您的开发指令中建议的后端API基础URL是 http://localhost:3001/api/v1
        //    而我们后端 AuthController 的基础路径是 /auth，回调是 google/callback
        //    所以完整的后端回调URL应该是 http://localhost:3001/api/v1/auth/google/callback (根据指令)
        //    (请注意：我们后端目前还没有配置 /api/v1 全局前缀，这是一个后续需要同步的点)
        const redirectUri = 'http://localhost:3001/api/v1/auth/google/callback'; // 与AIPA指令一致
    
        // 3. 构造Google OAuth 2.0 授权URL
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    
        // 定义URL参数
        const params = {
          client_id: googleClientId,
          redirect_uri: redirectUri,
          response_type: 'code', // 我们期望获取授权码 (authorization code)
          scope: 'openid email profile', // 请求的权限范围：获取用户的基本OpenID信息、邮箱和个人资料
          access_type: 'offline', // 请求刷新令牌 (refresh token)，以便在用户离线后也能代表用户访问其数据 (如果需要)
          prompt: 'consent', // (可选) 每次都提示用户进行授权，即使之前已授权 (有助于测试)
        };
    
        // 将参数对象转换为URL查询字符串
        const queryString = new URLSearchParams(params).toString();
    
        // 完整的授权URL
        const googleAuthUrl = `<span class="math-inline">\{oauth2Endpoint\}?</span>{queryString}`;
    
        console.log('将重定向到Google授权URL:', googleAuthUrl);
    
        // 4. 执行重定向到Google的授权页面
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