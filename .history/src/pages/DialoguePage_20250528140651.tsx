// src/pages/DialoguePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation,useNavigate } from 'react-router-dom'; // 1. 导入 useParams 和 useLocation
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { continueDialogue } from '../services/dialogue.service';

interface DialogueMessage {
  id: string;
  sender: 'AIPA' | 'user';
  text: string;
  timestamp: Date;
}

// 辅助函数，用于获取导航状态中的数据
interface DialoguePageState {
  initialAiMessage?: string;
  projectName?: string;
}
const generateMockRequirementsForReview = (projectNameFromState?: string) => ({
  title: `${projectNameFromState || '新项目'} - 项目规划文档 (MVP)`, // 更新文档标题
  requirementsSpec: { // 第一部分：需求规格
    title: '第一部分：项目需求规格说明书',
    chapters: [
      { id: 'req_overview', title: '1. 项目概述与愿景 (需求)', content: `这是项目“${projectNameFromState || '新项目'}”的需求概述...\n(此处应为更详细的需求内容)` },
      { id: 'req_users', title: '2. 目标用户画像 (需求)', content: `项目“${projectNameFromState || '新项目'}”的目标用户是...\n(此处应为更详细的需求内容)` },
      // ... 更多需求章节
    ],
  },
  technicalPlan: { // 第二部分：技术规划 (新增)
    title: '第二部分：项目技术规划方案',
    chapters: [
      { 
        id: 'tech_stack', 
        title: '2.1. 推荐技术栈', 
        content: '推荐技术栈：\n- 前端: React (TypeScript) + MUI\n- 后端: NestJS (TypeScript) + PostgreSQL\n理由: ... (此处应为更详细的技术栈说明)' 
      },
      { 
        id: 'tech_architecture', 
        title: '2.2. 系统架构设计初步', 
        content: '系统架构：\n- 采用微服务架构...\n- 核心模块包括用户认证、项目管理、AI编排...\n(此处应为更详细的架构说明)'
      },
        id: 'tech_dev_steps',
        title: '2.6. 开发实施步骤与优先级建议 (示例)', // 您的AIPA文档中是2.6，我们就用这个编号
          // 我们将content设计为一个特殊的对象，包含任务列表
        content: JSON.stringify({ // 将对象字符串化以便传递，接收方再解析
            introduction: '以下是建议的初步开发实施步骤：',
            tasks: [
              { taskId: 'task_init_backend', title: '阶段0 - 任务1.1: 后端项目初始化', description: '初始化NestJS后端项目, 集成Prisma, 定义初始数据模型。' },
              { taskId: 'task_auth_api', title: '阶段0 - 任务1.2: 核心用户认证API骨架', description: '搭建用户认证模块、JWT策略、第三方登录回调骨架。' },
              { taskId: 'task_frontend_init', title: '阶段1 - 任务1.3: 前端项目初始化', description: '初始化React (Vite) + TypeScript前端项目。' },
            ]
      // ... 更多技术规划章节
    ],
  }
});

const DialoguePage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // 2. 从URL参数中获取projectId
  const { projectId } = useParams<{ projectId: string }>(); 
  // 3. 从路由状态中获取传递过来的数据
  const location = useLocation();
  console.log('在DialoguePage中接收到的路由state:', location.state);
  const locationState = location.state as DialoguePageState | undefined; // 类型断言
  const initialAiMessage = locationState?.initialAiMessage;
  const pageProjectName = locationState?.projectName || projectId; // 优先使用传递的项目名，否则用ID

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 4. useEffect Hook: 用于在组件加载时处理初始AI消息
  useEffect(() => {
    if (initialAiMessage && messages.length === 0) { // 确保只在初次加载且没有消息时添加
      const firstAiMessage: DialogueMessage = {
        id: `ai-initial-${Date.now()}`,
        sender: 'AIPA',
        text: initialAiMessage,
        timestamp: new Date(),
      };
      setMessages([firstAiMessage]);
    }
  }, [initialAiMessage]); // 依赖项是 initialAiMessage

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!currentUserInput.trim() || isSending || !projectId) return; // 确保projectId存在

    setIsSending(true);
    const userMessageText = currentUserInput;
    setCurrentUserInput('');

    const newUserMessage: DialogueMessage = {
      id: `user-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    try {
      // 5. 在调用continueDialogue时使用从URL获取的projectId
      console.log(`[DialoguePage] Calling continueDialogue for projectId: <span class="math-inline">\{projectId\} with message\: "</span>{userMessageText}"`);
      const response = await continueDialogue(projectId, userMessageText);

      const aiResponseMessage: DialogueMessage = {
        id: `ai-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random()}`,
        sender: 'AIPA',
        text: response.aiMessage,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
    } catch (error) {
      console.error("Error calling continueDialogue stub:", error);
      const errorMessage: DialogueMessage = {
        id: `error-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random()}`,
        sender: 'AIPA',
        text: '抱歉，发送消息时似乎遇到了问题（模拟）。',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };
  const handleCompleteDialogueAndReview = () => {
    if (!projectId) {
      alert('错误：项目ID未知，无法进入审阅。');
      return;
    }
    console.log(`对话完成，准备为项目 ${projectId} 生成需求文档并导航到审阅页...`);
    const mockGeneratedDocAndPlan = generateMockRequirementsForReview(pageProjectName); 

    navigate(`/projects/${projectId}/review`, {
      state: {
        documentData: mockGeneratedDocAndPlan, // 传递模拟生成的需求文档数据
        projectName: pageProjectName,
      }
    });
  };
  return (
    <Box
      sx={{ /* ... 背景和页面布局样式 ... */
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* 6. 更新页面标题以显示真实的项目名称或ID */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', textAlign: 'center', mb: 2 }}>
          与AIPA对话 ({pageProjectName || '新项目'})
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ /* ... Paper样式 ... */
            display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%',
            bgcolor: 'background.paper', borderRadius: '8px', overflow: 'hidden',
          }}
        >
          <Box
            sx={{ /* ... 对话历史区样式 ... */
              flexGrow: 1, overflowY: 'auto', padding: 2, display: 'flex', flexDirection: 'column',
            }}
          >
            {messages.length === 0 && !initialAiMessage && ( // 只有在完全没有消息时显示占位符
              <Typography variant="body2" color="textSecondary" sx={{textAlign: 'center', mt: 2}}>
                对话历史将显示在此处...
              </Typography>
            )}
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{ /* ... 消息气泡容器样式 ... */
                  display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1.5,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{ /* ... 消息气泡样式 ... */
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    maxWidth: '70%', wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left', mt: 0.5, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} /> 
          </Box>

          <Box
            component="form"
            sx={{ /* ... 输入区表单样式 ... */
              display: 'flex', alignItems: 'center', padding: 1.5,
              borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50',
            }}
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          >
            <TextField
              fullWidth variant="outlined" size="small" placeholder="在此输入您的回复..."
              value={currentUserInput} onChange={handleInputChange}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              sx={{ mr: 1.5 }} multiline maxRows={4} disabled={isSending || !projectId} // 如果没有projectId也禁用
            />
            <Button
              variant="contained" color="primary" onClick={handleSendMessage}
              endIcon={<SendIcon />} sx={{ height: '100%' }} type="submit" disabled={isSending || !projectId}
            >
              {isSending ? '发送中...' : '发送'}
            </Button>
          </Box>
        </Paper>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleCompleteDialogueAndReview}
            disabled={!projectId || messages.length < 2} // 简单示例：至少有一轮用户和AI的对话
          >
            模拟需求收集完成，前往审阅
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DialoguePage;