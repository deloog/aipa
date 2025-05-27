// src/pages/RequirementsReviewPage.tsx
import React from 'react';
// import Container from '@mui/material/Container'; // Container 已在外层Box中使用
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'; // 1. 导入 Grid 组件
import List from '@mui/material/List'; // 示例：用于侧边栏目录
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const RequirementsReviewPage: React.FC = () => {
  // 模拟的需求文档章节数据 (后续会由真实数据驱动)
  const mockChapters = [
    { id: 'overview', title: '1. 项目概述与愿景' },
    { id: 'users', title: '2. 目标用户画像' },
    { id: 'features', title: '3. 核心功能需求列表' },
    // ...更多章节
  ];

  // 模拟的当前选定章节的内容 (后续会动态加载)
  const mockSelectedChapterContent = {
    title: '1. 项目概述与愿景',
    content: '这里是“项目概述与愿景”章节的详细内容... AIPA旨在成为一款“保姆级”的AI项目规划助手，其核心使命是赋能用户（特别是“技术小白”和缺乏完整项目规划经验的个体或团队），将一个初步的、可能模糊的项目想法，高效、系统地转化为一份详尽、结构化、可执行的项目规划蓝图...',
  };

  const handleChapterSelect = (chapterId: string) => {
    console.log('Selected chapter:', chapterId);
    // 后续实现点击章节后，在右侧加载对应内容，并滚动到相应位置的逻辑
    alert(`您点击了章节: ${chapterId} (内容加载和滚动功能待实现)`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Container现在移到Paper内部，或直接让Paper作为主要的内容容器 */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 1, sm: 2, md: 3 },
          borderRadius: '8px', 
          bgcolor: 'background.paper',
          width: '100%',
          maxWidth: '1200px', // 整体内容区域的最大宽度，可以根据lg断点调整
          display: 'flex',    // 为内部的Grid布局做准备
          flexDirection: 'column',
          minHeight: '85vh', // 给卡片一个最小高度
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          项目需求规格说明书 (审阅)
        </Typography>

        {/* 2. 使用 Grid 组件创建双栏布局 */}
        <Grid container spacing={2} sx={{ flexGrow: 1 }}> {/* spacing={2} 提供列之间的间距 */}

          {/* 左侧：侧边栏目录 */}
          <Grid xs={12} sm={4} md={3}> {/* 响应式：小屏幕占满12列，中屏幕占4列，大屏幕占3列 */}
            <Paper elevation={1} sx={{ height: '100%', p: 1.5, overflowY: 'auto' }}> {/* 使侧边栏内容可滚动 */}
              <Typography variant="h6" gutterBottom>目录</Typography>
              <List dense> {/* dense使列表项更紧凑 */}
                {mockChapters.map((chapter) => (
                  <ListItem key={chapter.id} disablePadding>
                    <ListItemButton onClick={() => handleChapterSelect(chapter.id)}>
                      <ListItemText primary={chapter.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 右侧：主内容区 */}
          <Grid item xs={12} sm={8} md={9}> {/* 响应式：小屏幕占满12列，中屏幕占8列，大屏幕占9列 */}
            <Paper elevation={1} sx={{ height: '100%', p: 2, overflowY: 'auto' }}> {/* 使主内容可滚动 */}
              <Typography variant="h5" gutterBottom>{mockSelectedChapterContent.title}</Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {mockSelectedChapterContent.content}
              </Typography>
              {/* 更多内容将在这里动态渲染 */}
            </Paper>
          </Grid>
        </Grid>
        {/* 后续步骤将在这里添加操作按钮区域 */}
      </Paper>
    </Box>
  );
};

export default RequirementsReviewPage;