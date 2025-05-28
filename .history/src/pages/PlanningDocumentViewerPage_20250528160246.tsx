// src/pages/PlanningDocumentViewerPage.tsx
import React, { useState, useEffect, useRef } from 'react'; // 确保导入了 useRef
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
import type { AtomizedInstruction } from '../components/instructions/types';
import InstructionsViewer from '../components/instructions/InstructionsViewer';

interface Chapter {
  id: string;
  title: string;
  content: string;
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
    requirementsSpec: { title: '第一部分：项目需求规格说明书 (加载中...)', chapters: [] },
    technicalPlan: { title: '第二部分：项目技术规划方案 (加载中...)', chapters: [] },
  };
  const currentProjectName = locationState?.projectName || projectId || '项目';

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedTaskForInstructions, setSelectedTaskForInstructions] = useState<string | null>(null);
  const [currentTaskInstructions, setCurrentTaskInstructions] = useState<AtomizedInstruction[] | null>(null);

  // useEffect: 设置初始选中章节，或处理从修订模式返回时的章节选中
  useEffect(() => {
    console.log('[Effect 1] Running: currentDocumentData or locationState changed.');
    let chapterIdToSelect: string | null = null;

    if (locationState?.revisionMode && locationState?.chapterToReviseId) {
      console.log('[Effect 1] Revision mode, attempting to select chapter:', locationState.chapterToReviseId);
      chapterIdToSelect = locationState.chapterToReviseId;
    } else {
      // 默认选择第一个可用章节 (仅当 selectedChapterId 当前为 null 时，避免不必要的重置)
      if (selectedChapterId === null) { 
        if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
          chapterIdToSelect = currentDocumentData.requirementsSpec.chapters[0].id;
          console.log('[Effect 1] Defaulting to first requirements chapter:', chapterIdToSelect);
        } else if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
          chapterIdToSelect = currentDocumentData.technicalPlan.chapters[0].id;
          console.log('[Effect 1] Defaulting to first technical plan chapter:', chapterIdToSelect);
        }
      } else {
        // selectedChapterId 已经有值，并且不是revisionMode带回来的特定值，则保持当前选择
        console.log('[Effect 1] selectedChapterId already has a value, not changing:', selectedChapterId);
        chapterIdToSelect = selectedChapterId; // 保持当前值，避免被下面逻辑意外清空
      }
    }
    
    // 只有当计算出的 chapterIdToSelect 与当前 selectedChapterId 不同时才更新
    // 或者当 chapterIdToSelect 为 null (意味着没有可选章节) 而当前 selectedChapterId 非 null 时更新
    if (selectedChapterId !== chapterIdToSelect) {
        console.log('[Effect 1] Setting selectedChapterId to:', chapterIdToSelect);
        setSelectedChapterId(chapterIdToSelect);
    }
  // 依赖项修正：不再包含 selectedChapterId
  }, [currentDocumentData, locationState]); 

  // useEffect: 当selectedChapterId变化时，更新selectedChapter的内容
  useEffect(() => {
    console.log('[Effect 2] Running: selectedChapterId changed to:', selectedChapterId);
    if (selectedChapterId) {
      let chapterToSet: Chapter | undefined = undefined;
      if (currentDocumentData.requirementsSpec) {
        chapterToSet = currentDocumentData.requirementsSpec.chapters.find(c => c.id === selectedChapterId);
      }
      if (!chapterToSet && currentDocumentData.technicalPlan) {
        chapterToSet = currentDocumentData.technicalPlan.chapters.find(c => c.id === selectedChapterId);
      }
      setSelectedChapter(chapterToSet || null);
      console.log('[Effect 2] Selected chapter content set to:', chapterToSet);
    } else {
      setSelectedChapter(null);
      console.log('[Effect 2] No chapter selected (selectedChapterId is null).');
    }
  }, [selectedChapterId, currentDocumentData]);

  // handleChapterSelect: 移除 useCallback 简化调试
  const handleChapterSelect = (chapterId: string) => {
    console.log('[handleChapterSelect] Clicked chapter ID:', chapterId);
    setSelectedChapterId(chapterId);
    setSelectedTaskForInstructions(null); 
    setCurrentTaskInstructions(null);
  };
  
  // ... (formatDocumentForCopy, handleCopyDocument, handleRequestRevision, dialog handlers, handleViewInstructions 保持不变) ...
  const formatDocumentForCopy = (doc: PlanningDocument): string => { /* ... */ return ""; };
  const handleCopyDocument = async () => { /* ... */ };
  const handleRequestRevision = () => { /* ... */ };
  const handleClickOpenConfirmDialog = () => { setOpenConfirmDialog(true); };
  const handleCloseConfirmDialog = () => { setOpenConfirmDialog(false); };
  const handleFinalConfirm = async () => { /* ... */ };
  const handleViewInstructions = (taskId: string, taskTitle: string) => { /* ... */ };

  const allDisplayableParts: DocumentPart[] = [];
  if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.requirementsSpec);
  }
  if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.technicalPlan);
  }

  // 在 return 之前打印关键状态，帮助调试
  console.log('[Render] Current selectedChapterId:', selectedChapterId);
  console.log('[Render] Current selectedChapter object:', selectedChapter);

  return (
    <Box sx={{ minHeight: '100vh', /* ... */ }}>
      <Paper elevation={3} sx={{ /* ... */ }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
          {currentDocumentData.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          (审阅草稿 - 项目ID: {projectId})
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, width: '100%', gap: { xs: 2, sm: 3 } }}>
          {/* 左侧目录 */}
          <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%' }, /* ... */ }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 0, overflowY: 'auto' }}>
              <List dense component="nav" aria-labelledby="nested-list-subheader">
                 {allDisplayableParts.length === 0 && (<ListItem><ListItemText primary="暂无章节可供审阅" /></ListItem>)}
                 {allDisplayableParts.map((part, partIndex) => (
                   <React.Fragment key={`part-${part.title}-${partIndex}`}>
                     {part.title && ( <ListSubheader component="div" sx={{ bgcolor: 'grey.100', lineHeight: '32px', mt: partIndex > 0 ? 1 : 0 }}>{part.title}</ListSubheader> )}
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

          {/* 右侧主内容区 */}
          <Box sx={{ width: { xs: '100%', sm: '70%', md: '75%' }, mt: { xs: 2, sm: 0 }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: {xs: 2, md: 3}, overflowY: 'auto' }}>
              {/* 添加一个 console.log 来查看即将渲染的 selectedChapter */}
              {/* { console.log('[Render JSX] selectedChapter for content rendering:', selectedChapter) } */}
              {selectedChapter ? (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>{selectedChapter.title}</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedChapter.id === 'tech_dev_steps' ? (
                    (() => {
                      try {
                        const devStepsData = JSON.parse(selectedChapter.content);
                        return ( /* ... 任务列表和指令查看器的JSX ... */ );
                      } catch (e) { /* ... 错误处理 ... */ }
                    })()
                  ) : (
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {selectedChapter.content}
                    </Typography>
                  )}
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