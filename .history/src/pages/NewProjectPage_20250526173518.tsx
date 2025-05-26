// src/pages/NewProjectPage.tsx
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import { useNavigate } from 'react-router-dom'; // 后续步骤处理提交逻辑时可能需要
import { createProject } from '../services/project.service';
import { initiateDialogue } from '../services/dialogue.service';

cconst NewProjectPage: React.FC = () => {
    // const navigate = useNavigate();
    const [projectName, setProjectName] = useState('');
    const [initialIdea, setInitialIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 添加加载状态
  
    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setProjectName(event.target.value);
    };
  
    const handleInitialIdeaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInitialIdea(event.target.value);
    };
  
    const handleSubmit = async () => { // 2. 将 handleSubmit 修改为异步函数
      if (!projectName.trim()) {
        alert('项目名称不能为空！');
        return;
      }
      if (!initialIdea.trim()) {
        alert('初步项目想法不能为空！');
        return;
      }
  
      setIsLoading(true); // 开始提交，设置加载状态为true
      console.log('开始提交项目信息...');
      console.log('项目名称:', projectName);
      console.log('初步项目想法:', initialIdea);
  
      try {
        // 第一步API调用（模拟）：创建项目规划条目
        const projectResponse = await createProject(projectName);
        const projectId = projectResponse.projectId;
        console.log('模拟创建项目成功，获得 Project ID:', projectId);
  
        // 第二步API调用（模拟）：提交初步想法并初始化对话
        const dialogueResponse = await initiateDialogue(projectId, initialIdea);
        const aiMessage = dialogueResponse.aiMessage;
        console.log('模拟初始化对话成功，AI的首次回应:', aiMessage);
  
        // 成功提交后，按指令要求，暂时先 console.log 导航意图
        console.log(`导航意图：应导航到对话界面，projectId: <span class="math-inline">\{projectId\}, AI初步回应\: "</span>{aiMessage}"`);
        alert(`项目创建和对话初始化模拟成功！\nProject ID: ${projectId}\nAI回应: ${aiMessage}\n（下一步将实现导航到对话页面）`);
        // 后续：navigate(`/dialogue/${projectId}`, { state: { initialAiMessage: aiMessage } });
  
      } catch (error) {
        console.error('模拟API调用过程中发生错误:', error);
        alert('提交过程中发生错误（模拟），详情请查看控制台。');
      } finally {
        setIsLoading(false); // 结束提交，设置加载状态为false
      }
    };
  
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
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
            disabled={isLoading} // 加载时禁用输入框
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
            disabled={isLoading} // 加载时禁用输入框
          />
  
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              disabled={isLoading} // 加载时禁用按钮
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
            disabled={isLoading} // 加载时禁用按钮
            sx={{ alignSelf: 'flex-start' }}
          >
            {isLoading ? '正在处理...' : '开始智能规划'}
          </Button>
        </Box>
      </Container>
    );
  };
  
  export default NewProjectPage;