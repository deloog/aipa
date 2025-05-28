// src/components/instructions/InstructionsViewer.tsx
import React, { useState } from 'react'; // 1. 导入 useState
import type { AtomizedInstruction } from './types'; // 从同级目录的types.ts导入
import InstructionItem from './InstructionItem'; // 2. 导入 InstructionItem 组件
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List'; // 可以用List来包裹InstructionItem，也可以不用

interface InstructionsViewerProps {
  instructions: AtomizedInstruction[];
  taskId?: string;
}

const InstructionsViewer: React.FC<InstructionsViewerProps> = ({ instructions, taskId }) => {
  // 3. 状态：用于存储已完成步骤的编号集合
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // 4. 处理函数：用于切换单个指令的完成状态
  const handleToggleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prevCompletedSteps => {
      const newCompletedSteps = new Set(prevCompletedSteps);
      if (newCompletedSteps.has(stepNumber)) {
        newCompletedSteps.delete(stepNumber); // 如果已完成，则标记为未完成
      } else {
        newCompletedSteps.add(stepNumber); // 如果未完成，则标记为已完成
      }
      console.log(`Step ${stepNumber} completion toggled. New set:`, newCompletedSteps);
      return newCompletedSteps;
    });
  };

  // 5. 对指令按 stepNumber 排序 (以防传入的数组顺序不正确)
  const sortedInstructions = [...instructions].sort((a, b) => a.stepNumber - b.stepNumber);

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
      {/* 6. 渲染指令列表 */}
      {/* 可以选择用 <List> 包裹，也可以直接渲染Box/Paper列表 */}
      <Box component={List} disablePadding> {/* 使用Box模仿List，或直接用List */}
        {sortedInstructions.map((instruction) => (
          <InstructionItem
            key={instruction.stepNumber} // 使用 stepNumber 作为 key (假设在一个任务内是唯一的)
            instruction={instruction}
            isComplete={completedSteps.has(instruction.stepNumber)}
            onToggleComplete={handleToggleStepComplete}
            // onCopyInstruction 处理函数将在 InstructionItem 内部实现，或由外部传入
          />
        ))}
      </Box>
    </Box>
  );
};

export default InstructionsViewer;