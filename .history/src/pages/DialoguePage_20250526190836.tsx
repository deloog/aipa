// src/pages/DialoguePage.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // 导入Box以方便布局

const DialoguePage: React.FC = () => {
  // 在后续步骤中，我们将在这里添加状态管理 (useState) 
  // 以及处理消息发送、接收的逻辑

  return (
    // 使用与NewProjectPage类似的页面整体布局风格
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // bgcolor: '#f4f6f8', // 一个浅灰色背景，或者沿用之前的深色背景
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)', // 与NewProjectPage风格一致
        padding: { xs: 2, md: 3 }, // 根据屏幕大小调整内边距
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2 }}> {/* 使用 "lg" 使对话区域更宽敞 */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', textAlign: 'center', mb: 3 }}>
          AIPA 对话界面
        </Typography>
        <Typography variant="body1" sx={{ color: '#e0e0e0', textAlign: 'center' }}>
          这里将是您与AI项目规划助手进行需求梳理对话的地方。
        </Typography>
        {/* 在接下来的步骤中，我们将在这里添加：
          1. 对话历史显示区
          2. 用户输入框
          3. 发送按钮
        */}
      </Container>
    </Box>
  );
};

export default DialoguePage;