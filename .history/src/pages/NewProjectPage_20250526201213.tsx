// src/pages/NewProjectPage.tsx
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // 确保 Paper 已导入，如果之前 NewProjectPage 的样式修改中使用了它
                                      // 从您之前的确认来看，NewProjectPage 的样式修改是成功的，应该已经有Paper了
import { useNavigate } from 'react-router-dom'; // 1. 导入 useNavigate

import { createProject } from '../services/project.service';
import { initiateDialogue } from '../services/dialogue.service';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate(); // 2. 获取 navigate 函数
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
    console.log('开始提交项目信息...');
    console.log('项目名称:', projectName);
    console.log('初步项目想法:', initialIdea);

    try {
      const projectResponse = await createProject(projectName);
      const projectId = projectResponse.projectId;
      console.log('模拟创建项目成功，获得 Project ID:', projectId);

      const dialogueResponse = await initiateDialogue(projectId, initialIdea);
      const aiMessage = dialogueResponse.aiMessage;
      console.log('模拟初始化对话成功，AI的首次回应:', aiMessage);

      // 3. 使用 navigate 进行跳转，并传递数据
      // 我们将 projectId 通过 URL 路径传递
      // 将 initialAiMessage 和 projectName 通过路由的 state 对象传递
      navigate(`/dialogue/${projectId}`, { 
        state: { 
          initialAiMessage: aiMessage,
          projectName: projectName // 传递项目名称，方便在对话页显示
        } 
      });

    } catch (error) {
      console.error('模拟API调用过程中发生错误:', error);
      alert('提交过程中发生错误（模拟），详情请查看控制台。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 页面整体布局 (与您之前确认的样式一致)
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '12px',
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

        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Button
            variant="outlined"
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
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ 
            paddingTop: '10px', 
            paddingBottom: '10px',
            fontSize: '1.1rem'
          }} 
          fullWidth
        >
          {isLoading ? '正在处理...' : '开始智能规划'}
        </Button>
      </Paper>
    </Box>
  );
};

export default NewProjectPage;