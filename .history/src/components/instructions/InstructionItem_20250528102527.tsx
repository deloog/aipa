// src/components/instructions/InstructionItem.tsx
import React from 'react';
import { AtomizedInstruction } from './types'; // 导入共享的类型定义
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'; // 复制图标
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // 完成图标
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // 未完成图标

interface InstructionItemProps {
  instruction: AtomizedInstruction;
  // 未来会添加 isComplete 和 onToggleComplete props
  // isComplete: boolean;
  // onToggleComplete: (stepNumber: number) => void;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ instruction /*, isComplete, onToggleComplete */ }) => {

  const handleCopy = (textToCopy?: string) => {
    if (!textToCopy) {
      alert('没有可复制的内容。');
      return;
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert(`内容已复制到剪贴板：\n${textToCopy.substring(0, 100)}${textToCopy.length > 100 ? '...' : ''}`))
      .catch(err => {
        console.error('复制失败: ', err);
        alert('复制失败，请检查浏览器权限或手动复制。');
      });
  };

  // 模拟的完成状态和处理函数 (占位符)
  const [isComplete, setIsComplete] = React.useState(false);
  const handleToggleComplete = () => {
    setIsComplete(!isComplete);
    console.log(`指令 ${instruction.stepNumber} 完成状态切换为: ${!isComplete}`);
    // onToggleComplete(instruction.stepNumber); // 未来调用prop传入的函数
  };


  return (
    <Paper elevation={2} sx={{ mb: 2, p: 2, borderRadius: '8px', opacity: isComplete ? 0.6 : 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          步骤 {instruction.stepNumber}: {instruction.purpose}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isComplete}
              onChange={handleToggleComplete}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleOutlineIcon sx={{ color: 'success.main' }} />}
            />
          }
          label={isComplete ? "已完成" : "标记为完成"}
          labelPlacement="start"
        />
      </Box>

      {instruction.filePath && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary" component="span">文件路径：</Typography>
          <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 0.5, borderRadius: '4px' }}>
            {instruction.filePath}
          </Typography>
        </Box>
      )}

      {instruction.command && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">命令：</Typography>
          <Paper variant="outlined" sx={{ p: 1, mt: 0.5, bgcolor: 'grey.50', overflowX: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{instruction.command}</code>
            </pre>
          </Paper>
          <Button
            size="small"
            startIcon={<FileCopyOutlinedIcon />}
            onClick={() => handleCopy(instruction.command)}
            sx={{ mt: 0.5, textTransform: 'none' }}
          >
            复制命令
          </Button>
        </Box>
      )}

      {instruction.codeSnippet && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">代码片段：</Typography>
          <Paper variant="outlined" sx={{ p: 1, mt: 0.5, bgcolor: 'grey.50', overflowX: 'auto' }}>
            {/* 简单pre/code。未来可集成语法高亮库如 Prism.js 或 react-syntax-highlighter */}
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{instruction.codeSnippet}</code>
            </pre>
          </Paper>
          <Button
            size="small"
            startIcon={<FileCopyOutlinedIcon />}
            onClick={() => handleCopy(instruction.codeSnippet)}
            sx={{ mt: 0.5, textTransform: 'none' }}
          >
            复制代码片段
          </Button>
        </Box>
      )}

      {instruction.content && ( // 用于文件内容
         <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">文件内容：</Typography>
          <Paper variant="outlined" sx={{ p: 1, mt: 0.5, bgcolor: 'grey.50', overflowX: 'auto', maxHeight: '200px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{instruction.content}</code>
            </pre>
          </Paper>
          <Button
            size="small"
            startIcon={<FileCopyOutlinedIcon />}
            onClick={() => handleCopy(instruction.content)}
            sx={{ mt: 0.5, textTransform: 'none' }}
          >
            复制文件内容
          </Button>
        </Box>
      )}

      {instruction.expectedOutcome && (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>预期结果：</Typography>
          <Typography variant="body2" sx={{ pl: 1 }}>{instruction.expectedOutcome}</Typography>
        </Box>
      )}

      {instruction.verificationMethod && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>验证方法：</Typography>
          <Typography variant="body2" sx={{ pl: 1 }}>{instruction.verificationMethod}</Typography>
        </Box>
      )}

      {instruction.notes && (
        <Box sx={{ mt: 1, fontStyle: 'italic' }}>
          <Typography variant="caption" color="text.secondary">备注：{instruction.notes}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default InstructionItem;