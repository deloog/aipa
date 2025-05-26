// src/pages/DialoguePage.tsx
import React from 'react'; // 在后续步骤中，我们会用到 useState
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // 用于更好地承载对话内容和输入区域
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send'; // 一个发送图标示例

const DialoguePage: React.FC = () => {
  // 状态和处理函数将在后续步骤添加
  // const [messages, setMessages] = useState([]);
  // const [currentUserInput, setCurrentUserInput] = useState('');

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCurrentUserInput(event.target.value);
  // };

  // const handleSendMessage = () => {
  //   if (!currentUserInput.trim()) return;
  //   console.log('Sending message:', currentUserInput);
  //   // ...后续添加消息处理逻辑...
  //   setCurrentUserInput('');
  // };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 }, // 根据屏幕大小调整内边距
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', textAlign: 'center', mb: 2 }}>
          AIPA 对话界面
        </Typography>

        {/* 1. 对话界面的主要容器，使用Paper增加卡片感和层次 */}
        <Paper 
          elevation={3} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1, // 使其填充可用垂直空间
            width: '100%',
            bgcolor: 'background.paper', // 使用主题的纸张背景色
            borderRadius: '8px', // 轻微的圆角
            overflow: 'hidden', // 确保子元素不会溢出圆角
          }}
        >
          {/* 2. 对话历史区 */}
          <Box
            sx={{
              flexGrow: 1, // 占据大部分垂直空间
              overflowY: 'auto', // 当内容超出时显示垂直滚动条
              padding: 2,
              // 示例背景色，方便区分区域，后续会被消息列表填充
              // bgcolor: 'grey.100', 
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{textAlign: 'center', mt: 2}}>
              对话历史将显示在此处...
              <br /> (例如：每条消息一个气泡)
            </Typography>
            {/* 消息列表将在后续步骤中渲染在这里 */}
          </Box>

          {/* 3. 用户输入区和发送按钮 */}
          <Box
            component="form" // 可以用form包裹，方便处理回车发送等
            sx={{
              display: 'flex',
              alignItems: 'center', // 垂直居中输入框和按钮
              padding: 1.5,
              borderTop: '1px solid', // 在输入区和历史区之间添加分割线
              borderColor: 'divider', // 使用主题中定义的分割线颜色
              bgcolor: 'grey.50', // 给输入区一个轻微的背景色
            }}
            // onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} // 表单提交处理后续添加
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small" // 使输入框稍微紧凑一些
              placeholder="在此输入您的回复..."
              // value={currentUserInput}
              // onChange={handleInputChange}
              // onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} // 回车发送后续添加
              sx={{ mr: 1.5 }} // 与发送按钮之间留出一些间距
              multiline // 允许多行输入
              maxRows={4} // 最多显示4行，超出则滚动
            />
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSendMessage} // 发送逻辑后续添加
              endIcon={<SendIcon />} // 在按钮文字后添加发送图标
              sx={{ height: '100%' }} // 使按钮与输入框等高
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