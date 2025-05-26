import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // 1. 导入 Paper 组件用于卡片效果

// 导入我们创建的模拟服务函数 (路径可能需要根据您的项目结构调整)
import { createProject } from '../services/project.service';
import { initiateDialogue } from '../services/dialogue.service';

const NewProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [initialIdea, setInitialIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleInitialIdeaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialIdea(event.target.value);
  };

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      alert('项目名称不能为空！');
      return;
    }
    if (!initialIdea.trim()) {
      alert('初步项目想法不能为空！');
      return;
    }
    setIsLoading(true);
    try {
      const projectResponse = await createProject(projectName);
      const projectId = projectResponse.projectId;
      const dialogueResponse = await initiateDialogue(projectId, initialIdea);
      const aiMessage = dialogueResponse.aiMessage;
      alert(`项目创建和对话初始化模拟成功！\nProject ID: ${projectId}\nAI回应: ${aiMessage}\n（下一步将实现导航到对话页面）`);
    } catch (error) {
      console.error('模拟API调用过程中发生错误:', error);
      alert('提交过程中发生错误（模拟），详情请查看控制台。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 2. 外层Box作为页面容器，设置背景色和flex布局使其内容垂直水平居中
    <Box
      sx={{
        minHeight: '100vh', // 至少占据整个视口高度
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 水平居中
        justifyContent: 'center', // 垂直居中 (如果内容不足以撑满高度)
        // bgcolor: '#282c34', // 一个示例深色背景，您可以替换为您喜欢的颜色
        // 或者使用渐变背景、图片背景等，这里用一个深灰色系
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)', 
        padding: 2, // 在视口边缘留一些内边距
      }}
    >
      {/* 3. 使用Paper组件作为卡片容器 */}
      <Paper
        elevation={6} // elevation属性可以控制阴影深度，0-24
        sx={{
          padding: 4, // 卡片内部的内边距 (theme.spacing(4))
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch', // 使内部元素（如按钮）可以撑满宽度
          width: '100%',
          maxWidth: '600px', // 卡片的最大宽度
          borderRadius: '12px', // 卡片的圆角
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          创建新项目规划
        </Typography>

        <TextField
          label="项目名称"
          variant="outlined"
          fullWidth
          required
          value={projectName}
          onChange={handleProjectNameChange}
          sx={{ mb: 3 }}
          disabled={isLoading}
        />

        <TextField
          label="您的初步项目想法"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={initialIdea}
          onChange={handleInitialIdeaChange}
          placeholder="请用自然语言描述您的项目大概想做什么，主要解决什么问题，面向哪些用户等..."
          sx={{ mb: 3 }}
          disabled={isLoading}
        />

        <Box sx={{ mb: 3, textAlign: 'left' }}> {/* 让上传按钮靠左 */}
          <Button
            variant="outlined" // 使用描边按钮作为次要操作
            component="label"
            disabled={isLoading}
            size="medium"
          >
            上传参考文件 (可选)
            <input type="file" hidden onChange={() => alert('文件上传功能待实现')} disabled={isLoading} />
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary" // 使用主题的主色调
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ 
            // alignSelf: 'flex-start', // 如果希望按钮不撑满，可以取消注释并调整
            paddingTop: '10px', 
            paddingBottom: '10px',
            fontSize: '1.1rem'
          }} 
          fullWidth // 让主要操作按钮更突出
        >
          {isLoading ? '正在处理...' : '开始智能规划'}
        </Button>
      </Paper>
    </Box>
  );
};

export default NewProjectPage;