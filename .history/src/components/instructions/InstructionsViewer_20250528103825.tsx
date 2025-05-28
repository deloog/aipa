// src/components/instructions/InstructionsViewer.tsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type{ AtomizedInstruction } from './types'; // 从同级目录的types.ts导入
// 导入未来可能需要的其他MUI组件，例如 List, ListItem, Button, Checkbox, IconButton, Tooltip 等

// 我们需要从后端DTO/接口定义中复用或重新定义 AtomizedInstruction 接口
// 为方便起见，我们暂时在这里重新定义它，未来可以考虑共享类型定义
interface AtomizedInstruction {}

interface InstructionsViewerProps {
  instructions: AtomizedInstruction[]; // 接收一个指令数组作为prop
  taskId?: string; // 可选，当前指令对应的任务ID
}

const InstructionsViewer: React.FC<InstructionsViewerProps> = ({ instructions, taskId }) => {
  if (!instructions || instructions.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {taskId ? `任务ID "${taskId}" ` : ''}暂无生成的原子化指令。
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {taskId && (
        <Typography variant="h6" gutterBottom component="h3">
          任务 "{taskId}" 的原子化开发指令：
        </Typography>
      )}
      {/* 在接下来的步骤中，我们将在这里渲染指令列表 */}
      <Typography variant="body1" color="textSecondary">
        （指令列表渲染逻辑待实现，当前共有 {instructions.length} 条指令）
      </Typography>
    </Box>
  );
};

export default InstructionsViewer;