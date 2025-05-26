import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google'; // 引入Google图标

// import './LoginPage.css'; // 1. 我们不再需要自定义的CSS文件，可以注释或删除这行

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // Google登录的逻辑保持不变
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:3001/api/v1/auth/google/callback';
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = {
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    };

    const queryString = new URLSearchParams(params).toString();
    // 修正 googleAuthUrl 的构造，确保使用模板字符串正确拼接
    const googleAuthUrl = `${oauth2Endpoint}?${queryString}`;

    window.location.href = googleAuthUrl;
  };

  return (
    // 2. 使用MUI的Container组件来约束内容宽度并居中
    <Container component="main" maxWidth="xs"> {/* "xs" 表示一个较小的容器宽度，适合登录表单 */}
      {/* CssBaseline已经在main.tsx全局应用，这里通常不需要重复添加 */}
      <Box
        sx={{
          marginTop: 8, // theme.spacing(8) 的简写，提供顶部边距
          display: 'flex',
          flexDirection: 'column', // 内部元素垂直排列
          alignItems: 'center',    // 内部元素水平居中
        }}
      >
        {/* 3. 使用MUI的Typography组件来显示文本，可以指定排版变体 */}
        <Typography component="h1" variant="h5" gutterBottom>
          登录到 AI项目规划助手 (AIPA)
        </Typography>
        <Typography component="p" variant="body1" sx={{ mb: 3 }}> {/* mb: 3 表示 margin-bottom: theme.spacing(3) */}
          请选择您的登录方式：
        </Typography>
        {/* 4. 使用MUI的Button组件 */}
        <Button
          type="button" // 明确按钮类型
          fullWidth     // 使按钮占据全部可用宽度
          variant="contained" // "contained" 是一种常见的按钮样式 (带背景)
          color="primary"   // 使用主题的主色调 (可以在theme中定义)
          startIcon={<GoogleIcon />} // 在按钮文字前添加Google图标
          onClick={handleGoogleLogin}
          // sx 属性允许我们添加一些自定义的内联样式，如果需要的话
          // 例如，如果您想使用Google的品牌红色：
          // sx={{ 
          //   backgroundColor: '#DB4437',
          //   '&:hover': { // 鼠标悬停时的样式
          //     backgroundColor: '#C33D2E',
          //   },
          // }}
        >
          使用Google登录
        </Button>
        {/* 未来可以在这里添加其他MUI按钮作为登录选项 */}
      </Box>
    </Container>
  );
};

export default LoginPage;