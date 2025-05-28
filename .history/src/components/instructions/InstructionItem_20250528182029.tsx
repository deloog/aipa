// src/components/instructions/InstructionItem.tsx
import React from 'react';
import type { AtomizedInstruction } from './types'; // 确保这个类型定义文件路径正确且内容无误
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface InstructionItemProps {
  instruction: AtomizedInstruction;
  // 为了最大限度简化，我们暂时移除 isComplete 和 onToggleComplete props
  // isComplete: boolean; 
  // onToggleComplete: (stepNumber: number) => void;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ 
  instruction
}) => {
  // 在组件渲染时打印传入的instruction对象，帮助调试
  console.log('[InstructionItem MINIMAL DEBUG] Rendering instruction:', JSON.stringify(instruction, null, 2));

  // 基本检查，确保instruction和其核心属性存在且类型正确
  if (!instruction || typeof instruction.stepNumber !== 'number' || typeof instruction.purpose !== 'string') {
    console.error('[InstructionItem MINIMAL DEBUG] Invalid or missing instruction data:', instruction);
    return (
      <Paper sx={{p:1, mb:1, bgcolor: 'error.light', color: 'error.contrastText'}}>
        Error: 指令数据无效或缺失。
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ mb: 1, p: 2, border: '1px solid lightgrey' }}>
      <Typography variant="h6">
        {/* 这里只渲染字符串和数字，确保不会渲染对象 */}
        步骤 {instruction.stepNumber}: {instruction.purpose}
      </Typography>

      {/* 如果 command 存在并且是字符串，才渲染它 */}
      {instruction.command && typeof instruction.command === 'string' && (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mt:1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          命令: {instruction.command}
        </Typography>
      )}
    </Paper>
  );
};

export default InstructionItem;