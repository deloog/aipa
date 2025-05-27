// src/pages/RequirementsReviewPage.tsx
import React from 'react';
import Container from '@mui/material/Container'; // Container 用于限制内容最大宽度并居中
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // Paper 用于卡片效果

const RequirementsReviewPage: React.FC = () => {
  // 在后续步骤中，我们将在这里添加状态来管理需求文档数据
  // 以及处理用户交互的逻辑

  return (
    // 整体页面布局，与 DialoguePage 和 NewProjectPage 风格保持一致
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 }, // 响应式内边距
      }}
    >
      {/* 使用 Container 来约束主要内容区域的宽度。
        对于文档审阅页面，"lg" (large) 或 "xl" (extra-large) 可能是合适的，
        以便为侧边栏和主内容区提供足够的空间。我们先用 "lg"。
      */}
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2, width: '100%' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            padding: { xs: 2, sm: 3 }, // 卡片内边距
            borderRadius: '8px', 
            bgcolor: 'background.paper' 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            项目需求规格说明书 (审阅)
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            这里将结构化地展示AIPA为您生成的项目需求规格说明书草稿。
            <br/>
            (后续步骤将在这里添加侧边栏目录和主内容显示区域)
          </Typography>
          {/* 在接下来的步骤中，我们将在这里实现：
            1. 左侧的可折叠侧边栏目录
            2. 右侧的主内容显示区域
            3. 操作按钮（如复制、请求修订、最终确认）
          */}
        </Paper>
      </Container>
    </Box>
  );
};

export default RequirementsReviewPage;