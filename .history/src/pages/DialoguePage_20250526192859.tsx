// src/pages/DialoguePage.tsx
import React, { useState } from 'react'; // 1. 确保从 'react' 中导入 useState
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

// 2. (可选但推荐) 定义一下单条消息的 TypeScript 类型/接口
interface DialogueMessage {
  sender: 'AIPA' | 'user';
  text: string;
  timestamp?: Date;
  // id?: string; // 未来可以为每条消息添加唯一ID，方便用作React列表的key
}

const DialoguePage: React.FC = () => {
  // 3. 初始化状态
  // messages: 存储对话消息的数组，初始为空数组
  const [messages, setMessages] = useState<DialogueMessage[]>([]); 
  // currentUserInput: 存储用户当前在输入框中输入的文本，初始为空字符串
  const [currentUserInput, setCurrentUserInput] = useState<string>('');

  // handleInputChange 和 handleSendMessage 函数的骨架，我们将在下一步实现它们
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserInput(event.target.value); // 更新 currentUserInput 状态
  };

  const handleSendMessage = () => {
    if (!currentUserInput.trim()) return; // 如果输入为空或只有空格，则不发送

    // (这里的逻辑将在下一步骤中详细实现)
    console.log('Sending message (state):', currentUserInput); 

    // 示例：如何添加一条用户消息到 messages 数组 (这只是初步示意)
    // const newUserMessage: DialogueMessage = {
    //   sender: 'user',
    //   text: currentUserInput,
    //   timestamp: new Date(),
    // };
    // setMessages(prevMessages => [...prevMessages, newUserMessage]);

    setCurrentUserInput(''); // 清空输入框
  };

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
          AIPA 对话界面
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
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
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{textAlign: 'center', mt: 2}}>
              对话历史将显示在此处...
            </Typography>
            {/* 消息列表渲染将在步骤5中实现 */}
          </Box>

          <Box
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} // 5. 将表单的 onSubmit 连接到 handleSendMessage
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="在此输入您的回复..."
              value={currentUserInput} // 4. 将输入框的 value 绑定到 currentUserInput 状态
              onChange={handleInputChange} // 4. 将输入框的 onChange 连接到 handleInputChange
              onKeyPress={(e) => { // 5. (可选) 实现回车发送 (Shift+Enter 换行)
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // 阻止默认的回车换行行为
                  handleSendMessage();
                }
              }}
              sx={{ mr: 1.5 }}
              multiline
              maxRows={4}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage} // 5. 将按钮的 onClick 连接到 handleSendMessage
              endIcon={<SendIcon />}
              sx={{ height: '100%' }}
              type="submit" // 使其可以触发表单的 onSubmit
            >
              发送
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DialoguePage;