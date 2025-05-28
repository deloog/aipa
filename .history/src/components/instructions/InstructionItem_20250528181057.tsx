// src/components/instructions/InstructionItem.tsx
import React from 'react';
import type { AtomizedInstruction } from './types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box'; // 暂时不用其他MUI组件
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface InstructionItemProps {
  instruction: AtomizedInstruction;
  isComplete: boolean; 
  onToggleComplete: (stepNumber: number) => void;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ 
  instruction, 
  // isComplete, // 暂时不使用 isComplete 和 onToggleComplete，以简化测试
  // onToggleComplete 
}) => {
  // 在组件渲染时打印传入的instruction对象，帮助调试
  console.log('[InstructionItem DEBUG] Rendering instruction:', instruction);

  // 如果instruction本身是undefined或null，提前返回，防止错误
  if (!instruction) {
    return <Paper sx={{p:1, mb:1, bgcolor: 'error.light'}}>Error: Instruction data is missing.</Paper>;
  }

  // 如果instruction的必要属性不是期望的类型，也可能导致问题，但错误提示是对象作为child
  if (typeof instruction.stepNumber !== 'number' || typeof instruction.purpose !== 'string') {
    console.error('[InstructionItem DEBUG] Invalid instruction format:', instruction);
    return <Paper sx={{p:1, mb:1, bgcolor: 'error.light'}}>Error: Invalid instruction format.</Paper>;
  }

  return (
    <Paper elevation={1} sx={{ mb: 1, p: 2, border: '1px solid lightgrey' }}>
      <Typography variant="h6">
        步骤 {instruction.stepNumber}: {instruction.purpose}
      </Typography>
      {/* 我们暂时只渲染这两个核心属性 */}

      {/* 为了测试，显示一下 command（如果存在且为字符串）*/}
      {instruction.command && typeof instruction.command === 'string' && (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mt:1 }}>
          Command: {instruction.command}
        </Typography>
      )}

      {/* <Typography variant="caption" color="textSecondary">
        (完成状态: {isComplete.toString()}) 
      </Typography> */}
    </Paper>
  );
};

export default InstructionItem;