// src/pages/PlanningDocumentViewerPage.tsx
import React, { useState, useEffect, useCallback } from 'react'; // 增加了 useCallback
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { AtomizedInstruction } from '../../components/instructions/types';
import InstructionsViewer from '../../components/instructions/InstructionsViewer';

interface Chapter {
  id: string;
  title: string;
  content: string; // For "tech_dev_steps", this will be a JSON string
}

interface DocumentPart {
  title: string;
  chapters: Chapter[];
}

interface PlanningDocument {
  title: string;
  requirementsSpec?: DocumentPart;
  technicalPlan?: DocumentPart;
}

interface PlanningPageLocationState {
  documentData?: PlanningDocument;
  projectName?: string;
  revisionMode?: boolean;
  chapterToReviseId?: string;
}

const PlanningDocumentViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const locationState = location.state as PlanningPageLocationState | undefined;
  
  const currentDocumentData: PlanningDocument = locationState?.documentData || {
    title: `项目规划文档 (${projectId || '未知项目'})`,
    requirementsSpec: { title: '第一部分：需求规格说明书 (加载中...)', chapters: [] },
    technicalPlan: { title: '第二部分：项目技术规划方案 (加载中...)', chapters: [] },
  };
  const currentProjectName = locationState?.projectName || projectId || '项目';

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const [selectedTaskForInstructions, setSelectedTaskForInstructions] = useState<string | null>(null);
  const [currentTaskInstructions, setCurrentTaskInstructions] = useState<AtomizedInstruction[] | null>(null);

  // 使用 useCallback 包装 handleChapterSelect 以避免不必要的子组件重渲染 (如果适用)
  const handleChapterSelect = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedTaskForInstructions(null); // 切换章节时，清除已显示的指令
    setCurrentTaskInstructions(null);
  }, []);

  // useEffect: 设置初始选中章节，或处理从修订模式返回时的章节选中
  useEffect(() => {
    let initialChapterIdToSelect: string | null = null;

    if (locationState?.revisionMode && locationState?.chapterToReviseId) {
      initialChapterIdToSelect = locationState.chapterToReviseId;
    } else {
      // 默认选择第一个可用章节
      if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
        initialChapterIdToSelect = currentDocumentData.requirementsSpec.chapters[0].id;
      } else if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
        initialChapterIdToSelect = currentDocumentData.technicalPlan.chapters[0].id;
      }
    }
    
    // 只有当需要改变选中的章节ID时才调用，避免不必要的重渲染
    if (initialChapterIdToSelect && selectedChapterId !== initialChapterIdToSelect) {
        setSelectedChapterId(initialChapterIdToSelect);
    } else if (!initialChapterIdToSelect && selectedChapterId !== null) {
        setSelectedChapterId(null); // 如果没有章节可选，则清空
    }

  }, [currentDocumentData, locationState, selectedChapterId]); // 依赖项调整

  // useEffect: 当selectedChapterId变化时，更新selectedChapter的内容
  useEffect(() => {
    if (selectedChapterId) {
      let chapterToSet: Chapter | undefined = undefined;
      if (currentDocumentData.requirementsSpec) {
        chapterToSet = currentDocumentData.requirementsSpec.chapters.find(c => c.id === selectedChapterId);
      }
      if (!chapterToSet && currentDocumentData.technicalPlan) {
        chapterToSet = currentDocumentData.technicalPlan.chapters.find(c => c.id === selectedChapterId);
      }
      setSelectedChapter(chapterToSet || null);
    } else {
      setSelectedChapter(null);
    }
  }, [selectedChapterId, currentDocumentData]); // 这个依赖是正确的

  // ... (formatDocumentForCopy, handleCopyDocument, handleRequestRevision, dialog handlers 保持不变)
  const formatDocumentForCopy = (doc: PlanningDocument): string => { /* ... */ return ""; };
  const handleCopyDocument = async () => { /* ... */ };
  const handleRequestRevision = () => { /* ... */ };
  const handleClickOpenConfirmDialog = () => { setOpenConfirmDialog(true); };
  const handleCloseConfirmDialog = () => { setOpenConfirmDialog(false); };
  const handleFinalConfirm = async () => { /* ... */ };

  const handleViewInstructions = (taskId: string, taskTitle: string) => {
    console.log(`查看任务 "${taskTitle}" (ID: ${taskId}) 的指令`);
    setSelectedTaskForInstructions(taskId);
    let mockInstructionsForTask: AtomizedInstruction[] = [];
    if (taskId === 'task_frontend_init') {
      mockInstructionsForTask = [ { stepNumber: 1, purpose: '使用Vite创建React+TS项目', command: 'npm create vite@latest aipa-frontend -- --template react-ts' }, /* ... */ ];
    } else if (taskId === 'task_auth_api') {
      mockInstructionsForTask = [ { stepNumber: 1, purpose: '在后端Auth模块生成Service和Controller', command: 'nest generate service auth/services/auth --flat' }, /* ... */ ];
    } else {
      mockInstructionsForTask = [ { stepNumber: 1, purpose: `为任务 "${taskTitle}" 生成的通用占位指令1` }, /* ... */ ];
    }
    setCurrentTaskInstructions(mockInstructionsForTask);
  };
  
  const allDisplayableParts: DocumentPart[] = [];
  // ... (allDisplayableParts 逻辑保持不变)

  return (
    // ... (整体JSX结构，包括最外层Box, Paper标题区等保持不变)
    // 主要关注右侧主内容区的渲染逻辑
    <Box sx={{ minHeight: '100vh', /* ... */ }}>
      <Paper elevation={3} sx={{ /* ... */ }}>
        <Typography variant="h4" /* ... */ >{currentDocumentData.title}</Typography>
        <Typography variant="subtitle1" /* ... */ >(审阅草稿 - 项目ID: {projectId})</Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, width: '100%', gap: { xs: 2, sm: 3 } }}>
          {/* 左侧目录 (List渲染逻辑基本不变，确保onClick调用了新的handleChapterSelect) */}
          <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%' }, /* ... */ }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 0, overflowY: 'auto' }}>
              <List dense component="nav" aria-labelledby="nested-list-subheader">
                 {/* ... (allDisplayableParts.map 渲染目录，确保 ListItemButton 的 onClick={handleChapterSelect} 使用的是 useCallback 包装后的版本) ... */}
                 {allDisplayableParts.length === 0 && (<ListItem><ListItemText primary="暂无章节可供审阅" /></ListItem>)}
                 {allDisplayableParts.map((part, partIndex) => (
                   <React.Fragment key={`part-${part.title}-${partIndex}`}>
                     {part.title && ( <ListSubheader /*...*/ >{part.title}</ListSubheader> )}
                     {part.chapters.map((chapter) => (
                       <ListItem key={chapter.id} disablePadding sx={{ pl: part.title ? 2 : 0 }}>
                         <ListItemButton selected={selectedChapterId === chapter.id} onClick={() => handleChapterSelect(chapter.id)}>
                           <ListItemText primary={chapter.title} primaryTypographyProps={{ style: { whiteSpace: 'normal' } }}/>
                         </ListItemButton>
                       </ListItem>
                     ))}
                     {partIndex < allDisplayableParts.length - 1 && <Divider />}
                   </React.Fragment>
                 ))}
              </List>
            </Paper>
          </Box>

          {/* 右侧：主内容区 (这里的逻辑需要仔细检查和修正) */}
          <Box sx={{ width: { xs: '100%', sm: '70%', md: '75%' }, mt: { xs: 2, sm: 0 }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: {xs: 2, md: 3}, overflowY: 'auto' }}>
              {selectedChapter ? (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>{selectedChapter.title}</Typography>
                  <Divider sx={{ mb: 2 }} />

                  {/* VV V V V  关键的条件渲染逻辑 VV V V V */}
                  {selectedChapter.id === 'tech_dev_steps' ? ( // 检查是否是“开发实施步骤”章节
                    (() => {
                      try {
                        const devStepsData = JSON.parse(selectedChapter.content); // 解析JSON字符串
                        return (
                          <Box>
                            {devStepsData.introduction && <Typography paragraph>{devStepsData.introduction}</Typography>}
                            {devStepsData.tasks && Array.isArray(devStepsData.tasks) && (
                              <List dense sx={{pt:0}}> {/* 移除List的默认上padding */}
                                {devStepsData.tasks.map((task: { taskId: string; title: string; description: string; }, index: number) => (
                                  <React.Fragment key={task.taskId || `task-${index}`}>
                                    <ListItem alignItems="flex-start" sx={{display: 'block', px:0}}> {/* alignItems使内容顶部对齐, display:block让Box撑满 */}
                                      <Box>
                                        <Typography variant="subtitle1" component="div" gutterBottom sx={{fontWeight: 'medium'}}>
                                          {task.title || `未命名任务 ${index + 1}`}
                                        </Typography>
                                        {task.description && <Typography variant="body2" color="text.secondary" paragraph>{task.description}</Typography>}
                                        <Button 
                                          size="small" 
                                          variant="contained" 
                                          onClick={() => handleViewInstructions(task.taskId, task.title)}
                                          sx={{ mt: 0.5, mb:1 }} // 调整按钮边距
                                        >
                                          查看/执行指令
                                        </Button>
                                      </Box>
                                    </ListItem>
                                    {index < devStepsData.tasks.length - 1 && <Divider component="li" />} {/* 任务间分隔线 */}
                                  </React.Fragment>
                                ))}
                              </List>
                            )}
                            {/* 指令查看器 */}
                            {selectedTaskForInstructions && currentTaskInstructions && (
                              <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: '4px' }}>
                                <InstructionsViewer 
                                  instructions={currentTaskInstructions} 
                                  taskId={selectedTaskForInstructions} 
                                />
                                <Button 
                                  size="small" 
                                  onClick={() => { setSelectedTaskForInstructions(null); setCurrentTaskInstructions(null); }} 
                                  sx={{ mt: 2 }} // 与指令查看器保持距离
                                  variant="outlined"
                                >
                                  关闭指令视图
                                </Button>
                              </Box>
                            )}
                          </Box>
                        );
                      } catch (e) {
                        console.error("无法解析开发步骤JSON内容:", selectedChapter.content, e);
                        return <Typography color="error">开发步骤内容格式错误，无法显示。请检查模拟数据中的JSON格式。</Typography>;
                      }
                    })()
                  ) : (
                    // 对于其他普通章节，正常显示其content
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {selectedChapter.content}
                    </Typography>
                  )}
                  {/* ^ ^ ^ ^ ^ 关键的条件渲染逻辑结束 ^ ^ ^ ^ ^ */}
                </>
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                  请从左侧目录中选择一个章节进行查看。
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
        
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Box sx={{ /* ... 按钮区域Box样式 ... */ }}>
          {/* ... 按钮 ... */}
        </Box>
      </Paper>
      <Dialog open={openConfirmDialog} /* ... Dialog组件 ... */ >
        {/* ... Dialog内容 ... */}
      </Dialog>
    </Box>
  );
};
export default PlanningDocumentViewerPage;