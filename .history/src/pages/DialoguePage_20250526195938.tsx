// src/pages/DialoguePage.tsx
import React, { useState, useEffect, useRef } from 'react'; // 1. 导入 useEffect 和 useRef
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

const DialoguePage: React.FC = () => {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const MOCK_PROJECT_ID = 'mock_project_12345';

  const messagesEndRef = useRef<null | HTMLDivElement>(null); // 2. 创建一个ref用于自动滚动

  // 3. 自动滚动到最新消息的useEffect Hook
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // 依赖项是 messages 数组，每次它变化时执行

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!currentUserInput.trim() || isSending) return;
    setIsSending(true);
    const userMessageText = currentUserInput;
    setCurrentUserInput('');

    const newUserMessage: DialogueMessage = {
      id: `user-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random()}`, // 更可靠的唯一ID
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    try {
      const response = await continueDialogue(MOCK_PROJECT_ID, userMessageText);
      const aiResponseMessage: DialogueMessage = {
        id: `ai-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random()}`, // 更可靠的唯一ID
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

  // (可以移除之前的 console.log(messages) useEffect，因为现在消息会直接显示在UI上)

  return (
    <Box
      sx={{ /* ... 省略之前的背景和页面布局样式 ... */
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', textAlign: 'center', mb: 2 }}>
          AIPA 对话界面 (Project ID: {MOCK_PROJECT_ID})
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ /* ... Paper样式保持不变 ... */
            display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%',
            bgcolor: 'background.paper', borderRadius: '8px', overflow: 'hidden',
          }}
        >
          {/* 对话历史区 */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto', // 使得内容超出时可以滚动
              padding: 2,
              display: 'flex',
              flexDirection: 'column', // 消息垂直排列
            }}
          >
            {/* 4. 渲染消息列表 */}
            {messages.map((msg) => (
              <Box
                key={msg.id} // 使用唯一ID作为key
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', // 用户消息靠右，AIPA消息靠左
                  mb: 1.5, // 消息间的下边距
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', // 气泡效果
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200', // 用户消息用主题色，AIPA消息用浅灰色
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary', // 文字颜色
                    maxWidth: '70%', // 消息气泡最大宽度
                    wordBreak: 'break-word', // 长单词或链接换行
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left', mt: 0.5, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {/* 空的div，用于自动滚动定位 */}
            <div ref={messagesEndRef} /> 
          </Box>

          {/* 用户输入区和发送按钮 (保持不变) */}
          <Box
            component="form"
            sx={{ /* ... 输入区表单样式保持不变 ... */
              display: 'flex', alignItems: 'center', padding: 1.5,
              borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50',
            }}
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          >
            <TextField
              fullWidth variant="outlined" size="small" placeholder="在此输入您的回复..."
              value={currentUserInput} onChange={handleInputChange}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              sx={{ mr: 1.5 }} multiline maxRows={4} disabled={isSending}
            />
            <Button
              variant="contained" color="primary" onClick={handleSendMessage}
              endIcon={<SendIcon />} sx={{ height: '100%' }} type="submit" disabled={isSending}
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