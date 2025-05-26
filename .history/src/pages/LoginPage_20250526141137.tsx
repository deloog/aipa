// src/pages/LoginPage.tsx
import React from 'react';
import './LoginPage.css'; // 我们将为此页面创建一个CSS文件

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // 在下一个步骤 (步骤4) 中，我们将在这里添加处理Google登录的逻辑
    console.log('“使用Google登录”按钮被点击了！');
    alert('Google登录逻辑待实现！');
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