// src/pages/DialoguePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // 1. 导入 useParams 和 useLocation
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

const DialoguePage: React.FC = () => {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // 2. 从URL参数中获取projectId
  const { projectId } = useParams<{ projectId: string }>(); 
  const location = useLocation();
  
  // 3. 从路由状态中获取传递过来的数据
  const location = useLocation();
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
      </Container>
    </Box>
  );
};

export default DialoguePage;