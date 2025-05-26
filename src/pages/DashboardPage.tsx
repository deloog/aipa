// src/pages/DashboardPage.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate(); // 后续步骤使用

  const handleCreateNewProject = () => {
    console.log('“创建新项目规划”按钮被点击了！将导航到新项目页面...');
    // 3. 使用 navigate 函数进行页面跳转
    navigate('/projects/new'); // 我们将为新项目页面定义这个路径
  };

  const userName = "用户"; 

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          欢迎，{userName}！
        </Typography>
        <Typography component="p" variant="body1" sx={{ mb: 4 }}>
          在这里管理您的AI项目规划，或开始一个新的规划。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateNewProject} // 这个按钮现在会触发导航
        >
          创建新项目规划
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;