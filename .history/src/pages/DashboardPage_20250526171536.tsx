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
    // 在后续步骤 (步骤3) 中，我们将在这里添加导航到“新项目创建”页面的逻辑
    console.log('“创建新项目规划”按钮被点击了！');
    alert('导航到新项目创建页面的逻辑待实现！');
    navigate('/projects/new'); // 示例导航路径，后续定义
  };

  // 用户昵称暂时可以是假数据或登录后从API获取——获取逻辑后续实现
  const userName = "用户"; // 临时用 "用户"

  return (
    <Container component="main" maxWidth="md"> {/* md 表示中等宽度容器 */}
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
          onClick={handleCreateNewProject}
        >
          创建新项目规划
        </Button>
        {/* 未来这里可以展示用户的项目列表等 */}
      </Box>
    </Container>
  );
};

export default DashboardPage;