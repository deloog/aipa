// src/pages/DialoguePage.tsx
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { continueDialogue } from '../services/dialogue.service'; // 1. 导入 continueDialogue

interface DialogueMessage {
  id: string; // 2. 为消息添加唯一ID，用于React的key
  sender: 'AIPA' | 'user';
  text: string;
  timestamp: Date;
}

const DialoguePage: React.FC = () => {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false); // 3. 添加发送中的加载状态

  // 从路由参数或父组件获取当前projectId的逻辑将在步骤6实现
  // 现在，我们暂时硬编码一个projectId用于测试
  const MOCK_PROJECT_ID = 'mock_project_12345'; // <--- 临时硬编码

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserInput(event.target.value);
  };

  const handleSendMessage = async () => { // 4. 将函数设为 async
    if (!currentUserInput.trim() || isSending) return;

    setIsSending(true); // 开始发送，设置加载状态

    const userMessageText = currentUserInput;
    setCurrentUserInput(''); // 立刻清空输入框，提升用户体验

    // a. 将用户的消息添加到 messages 状态数组中
    const newUserMessage: DialogueMessage = {
      id: `user-${Date.now()}`, // 简单的唯一ID生成
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    try {
      // b. 调用后端对话API（目前是桩代码/模拟的）
      console.log(`[DialoguePage] Calling continueDialogue for projectId: <span class="math-inline">\{MOCK\_PROJECT\_ID\} with message\: "</span>{userMessageText}"`);
      const response = await continueDialogue(MOCK_PROJECT_ID, userMessageText);

      // c. 接收到模拟的AI回复后，将其也添加到 messages 状态数组中
      const aiResponseMessage: DialogueMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AIPA',
        text: response.aiMessage,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiResponseMessage]);

    } catch (error) {
      console.error("Error calling continueDialogue stub:", error);
      // 可以考虑添加一条错误消息到UI上
      const errorMessage: DialogueMessage = {
        id: `error-${Date.now()}`,
        sender: 'AIPA',
        text: '抱歉，发送消息时似乎遇到了问题（模拟）。',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false); // 结束发送，清除加载状态
    }
  };

  // 方便调试：每当 messages 状态更新时，在控制台打印它
  React.useEffect(() => {
    console.log('Messages state updated:', messages);
  }, [messages]);

  return (
    <Box
      sx={{ /* ... 省略之前的背景和页面布局样式 ... */
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', textAlign: 'center', mb: 2 }}>
          AIPA 对话界面 (Project ID: {MOCK_PROJECT_ID}) {/* 显示模拟的项目ID */}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ /* ... Paper样式保持不变 ... */
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{ /* ... 对话历史区样式保持不变 ... */
              flexGrow: 1,
              overflowY: 'auto',
              padding: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{textAlign: 'center', mt: 2}}>
              对话历史将显示在此处... (当前messages数组长度: {messages.length})
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{ /* ... 输入区表单样式保持不变 ... */
              display: 'flex',
              alignItems: 'center',
              padding: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="在此输入您的回复..."
              value={currentUserInput}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{ mr: 1.5 }}
              multiline
              maxRows={4}
              disabled={isSending} // 发送时禁用输入框
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              endIcon={<SendIcon />}
              sx={{ height: '100%' }}
              type="submit"
              disabled={isSending} // 发送时禁用按钮
            >
              {isSending ? '发送中...' : '发送'} {/* 根据加载状态改变按钮文本 */}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DialoguePage;