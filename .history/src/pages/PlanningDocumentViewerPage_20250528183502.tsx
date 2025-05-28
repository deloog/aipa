// src/pages/PlanningDocumentViewerPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid'; // 我们已用Box替代，故移除此导入
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button'; // 确保Button已导入
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { AtomizedInstruction } from '../components/instructions/types'; 
import InstructionsViewer from '../components/instructions/InstructionsViewer'; 

//以下一行代码调试结束后删除
console.log('[DEBUG] 页面已重新加载');


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
  chapterToReviseTitle?: string;
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
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState(false);

  useEffect(() => {
    console.log('[Effect 1 DEBUG] Running. locationState:', locationState, 'currentDoc chapters:', currentDocumentData?.requirementsSpec?.chapters, currentDocumentData?.technicalPlan?.chapters);
  
    let chapterIdToSet: string | null = null;
  
    if (locationState?.revisionMode && locationState?.chapterToReviseId) {
      // 如果是从修订模式返回，并且明确指定了要修订的章节ID
      chapterIdToSet = locationState.chapterToReviseId;
      console.log('[Effect 1 DEBUG] Revision mode, setting chapter to:', chapterIdToSet);
    } else if (!selectedChapterId) { 
      // 仅当 selectedChapterId 当前为 null (例如首次加载) 时，才设置默认的第一章
      if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
        chapterIdToSet = currentDocumentData.requirementsSpec.chapters[0].id;
        console.log('[Effect 1 DEBUG] Initial load, defaulting to first requirements chapter:', chapterIdToSet);
      } else if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
        chapterIdToSet = currentDocumentData.technicalPlan.chapters[0].id;
        console.log('[Effect 1 DEBUG] Initial load, defaulting to first technical plan chapter:', chapterIdToSet);
      }
    }
  
    // 只有当计算出的 chapterIdToSet 有意义且与当前 selectedChapterId 不同时才更新
    if (chapterIdToSet !== null && selectedChapterId !== chapterIdToSet) {
      console.log('[Effect 1 DEBUG] Updating selectedChapterId from', selectedChapterId, 'to:', chapterIdToSet);
      setSelectedChapterId(chapterIdToSet);
    } else if (chapterIdToSet === null && selectedChapterId !== null) {
      // 如果没有章节可以被选中 (例如文档为空)，则清空 selectedChapterId
      console.log('[Effect 1 DEBUG] No chapter to select, clearing selectedChapterId.');
      setSelectedChapterId(null);
    }
  // 依赖项修正：移除了 selectedChapterId，现在只依赖外部传入的数据和导航状态
  }, [currentDocumentData, locationState]);  

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
  }, [selectedChapterId, currentDocumentData]);

  const handleChapterSelect = (chapterId: string) => { setSelectedChapterId(chapterId); };

  const formatDocumentForCopy = (doc: PlanningDocument): string => {
    let formattedString = `${doc.title}\n\n(审阅草稿)\n\n`;
    const parts = [doc.requirementsSpec, doc.technicalPlan].filter(Boolean) as DocumentPart[];
    parts.forEach(part => {
      formattedString += `\n--- ${part.title} ---\n`;
      part.chapters.forEach(chapter => { formattedString += `- ${chapter.title}\n`; });
    });
    formattedString += "\n====================================\n\n";
    parts.forEach(part => {
      formattedString += `\n--- ${part.title} ---\n\n`;
      part.chapters.forEach(chapter => { formattedString += `${chapter.title}\n\n${chapter.content}\n\n------------------------------------\n\n`; });
    });
    return formattedString;
  };

  const handleCopyDocument = async () => { 
    const documentText = formatDocumentForCopy(currentDocumentData);
    try { await navigator.clipboard.writeText(documentText); alert('已复制到剪贴板!'); } catch(e) { console.error('复制失败:', e); alert('复制失败');}
  };

  const handleRequestRevision = () => { 
    if (!projectId) { alert('项目ID未知，无法返回修订。'); return; }
    if (!selectedChapterId || !selectedChapter) { alert('请先在左侧目录中选择一个您希望针对其进行修改反馈的章节。'); return; }
    navigate(`/dialogue/${projectId}`, { 
      state: { 
        revisionMode: true, 
        chapterToReviseId: selectedChapterId, 
        chapterToReviseTitle: selectedChapter.title, 
        projectName: currentProjectName,
      } 
    });
  };

  const handleClickOpenConfirmDialog = () => { setOpenConfirmDialog(true); };
  const handleCloseConfirmDialog = () => { setOpenConfirmDialog(false); };
  const handleFinalConfirm = async () => { 
    if (!projectId) { alert('项目ID未知，无法确认。'); return; }
    setOpenConfirmDialog(false); 
    console.log(`为项目 ${projectId} 最终确认需求 (模拟API调用)`);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('需求规格已最终确认！');
  };
  const handleViewInstructions = (taskId: string, taskTitle: string) => {
    console.log(`查看任务 "${taskTitle}" (ID: ${taskId}) 的指令`);
    setSelectedTaskForInstructions(taskId);
    let mockInstructionsForTask: AtomizedInstruction[] = [];
  if (taskId === 'task_frontend_init') { // 假设这是我们在模拟数据中定义的一个taskId
    mockInstructionsForTask = [
      { stepNumber: 1, purpose: '使用Vite创建React+TS项目 (aipa-frontend)', command: 'npm create vite@latest aipa-frontend -- --template react-ts', expectedOutcome: '项目成功创建', verificationMethod: 'cd aipa-frontend && npm install && npm run dev 正常启动' },
      { stepNumber: 2, purpose: '安装前端路由库 react-router-dom', command: 'npm install react-router-dom', expectedOutcome: '依赖安装成功', verificationMethod: '检查package.json' },
      { stepNumber: 3, purpose: '配置基础路由结构 (App.tsx)', codeSnippet: '...', content: '// App.tsx\n// <BrowserRouter> <Routes> ... </Routes> </BrowserRouter>', expectedOutcome: '路由骨架配置完成', verificationMethod: '浏览器访问不同路径能看到占位内容' },
    ];
  } else if (taskId === 'task_auth_api') { // 假设这是另一个taskId
     mockInstructionsForTask = [
      { stepNumber: 1, purpose: '在后端Auth模块生成Service和Controller', command: 'nest generate service auth/services/auth --flat', expectedOutcome: '文件生成', verificationMethod: '检查src/auth目录'},
      { stepNumber: 2, purpose: '安装JWT及Passport依赖', command: 'npm install @nestjs/jwt @nestjs/passport passport passport-jwt', expectedOutcome: '依赖安装成功', verificationMethod: '检查package.json'},
     ];
  } else {
     mockInstructionsForTask = [
      { stepNumber: 1, purpose: `为任务 "${taskTitle}" 生成的通用占位指令1`, notes: '这是模拟指令' },
      { stepNumber: 2, purpose: `为任务 "${taskTitle}" 生成的通用占位指令2`, command: 'echo "执行模拟命令"' },
     ];
  }
  setCurrentTaskInstructions(mockInstructionsForTask);
  setIsInstructionsDialogOpen(true); 
};
  const handleCloseInstructionsDialog = () => {
    setIsInstructionsDialogOpen(false);
  // （可选）关闭对话框时，清空当前查看的任务和指令，以便下次打开是干净的
    setSelectedTaskForInstructions(null);
    setCurrentTaskInstructions(null);
};
  const allDisplayableParts: DocumentPart[] = [];
  if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.requirementsSpec);
  }
  if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.technicalPlan);
  }

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', flexDirection: 'stretch', alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: 0,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 1, sm: 2, md: 3 }, borderRadius: '8px', bgcolor: 'background.paper',
          width: '100%',  display: 'flex', flexDirection: 'column', minHeight: '85vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
          {currentDocumentData.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          (审阅草稿 - 项目ID: {projectId})
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, width: '100%', gap: { xs: 2, sm: 3 } }}>
          <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%' }, minWidth: { sm: '200px' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 0, overflowY: 'auto' }}>
              <List dense component="nav" aria-labelledby="nested-list-subheader">
                {allDisplayableParts.length === 0 && (
                    <ListItem><ListItemText primary="暂无章节可供审阅" /></ListItem>
                )}
                {allDisplayableParts.map((part, partIndex) => (
                  <React.Fragment key={`part-${part.title.replace(/\s+/g, '_')}-${partIndex}`}>
                    {part.title && (
                      <ListSubheader component="div" sx={{ bgcolor: 'grey.100', lineHeight: '32px', mt: partIndex > 0 ? 1 : 0 }}>
                        {part.title}
                      </ListSubheader>
                    )}
                    {part.chapters.map((chapter) => (
                      <ListItem key={chapter.id} disablePadding sx={{ pl: part.title ? 2 : 0 }}>
                        <ListItemButton 
                          selected={selectedChapterId === chapter.id}
                          onClick={() => handleChapterSelect(chapter.id)}
                        >
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

          <Box sx={{ width: { xs: '100%', sm: '70%', md: '75%' }, mt: { xs: 2, sm: 0 }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: {xs: 2, md: 3}, overflowY: 'auto' }}>
              {selectedChapter ? (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>{selectedChapter.title}</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedChapter.id === 'tech_dev_steps' ? (
                    (() => { // 使用立即执行函数表达式 (IIFE) 以便在JSX中进行多步逻辑处理
                      try {
                        const devStepsData = JSON.parse(selectedChapter.content);
                        return (
                          <Box>
                            {devStepsData.introduction && <Typography paragraph>{devStepsData.introduction}</Typography>}
                            {devStepsData.tasks && Array.isArray(devStepsData.tasks) && (
                              <List dense>
                                {devStepsData.tasks.map((task: { taskId: string; title: string; description: string; }, index: number) => (
                                  <ListItem key={task.taskId || index} divider>
                                    <Box sx={{ width: '100%'}}>
                                      <Typography variant="subtitle1" component="div" gutterBottom sx={{fontWeight: 'bold'}}>
                                        {task.title || `未命名任务 ${index + 1}`}
                                      </Typography>
                                      {task.description && <Typography variant="body2" color="text.secondary" paragraph>{task.description}</Typography>}
                                      <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={() => handleViewInstructions(task.taskId, task.title)}
                                        sx={{ mt: 1 }}
                                      >
                                        查看/执行指令
                                      </Button>
                                    </Box>
                                  </ListItem>
                                ))}
                              </List>
                            )}
                            {/* 6. 在这里显示选定任务的指令 */}
                            {selectedTaskForInstructions && currentTaskInstructions }
                          </Box>
                        );
                      } catch (e) {
                        console.error("无法解析开发步骤内容:", e);
                        return <Typography color="error">开发步骤内容格式错误。</Typography>;
                      }
                    })() //立即执行
                  ) : (
                    // 对于其他普通章节，正常显示其content
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
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 2, 
            paddingTop: 2, 
          }}
        >
          <Button variant="outlined" onClick={handleCopyDocument}>
            复制本文档内容
          </Button>
          <Button variant="outlined" color="warning" onClick={handleRequestRevision}>
            我需要修改
          </Button>
          <Button variant="contained" color="primary" onClick={handleClickOpenConfirmDialog}>
            最终确认此需求规格
          </Button>
          <Button
            variant="outlined"
            color="info" // 使用不同颜色区分
            onClick={() => {
              console.log('“我需要调整/澄清技术方案”按钮被点击');
              alert('“我需要调整/澄清技术方案”功能待实现');
            }}
            sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }} // 添加一些边距
          >
            调整/澄清技术方案
          </Button>
          <Button
            variant="contained"
            color="success" // 使用不同颜色区分
            onClick={() => {
              console.log('“确认此技术方案（初稿）”按钮被点击');
              alert('“确认此技术方案（初稿）”功能待实现 (模拟API调用 POST /api/v1/projects/{projectId}/technical-plan/confirm-draft)');
            }}
            sx={{ ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }}
          >
            确认技术方案(初稿)
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {"重要提示：最终确认需求规格"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            这份需求规格说明书一旦最终确认，它将成为我们接下来为您进行所有“项目技术规划”的唯一且核心的依据。
            后续的技术方案都将严格围绕这份已确认的需求来展开。
            <br /><br />
            请问，对于当前这份“项目需求规格说明书”，您是选择：
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-around', paddingBottom: 2 }}>
          <Button onClick={handleCloseConfirmDialog} color="warning" variant="outlined">
            A) 我再想想/还需要调整
          </Button>
          <Button onClick={handleFinalConfirm} color="primary" variant="contained" autoFocus>
            B) 最终确认，可以定稿了
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={isInstructionsDialogOpen}
          onClose={handleCloseInstructionsDialog}
          fullWidth // 使对话框占据可用宽度的较大部分
          maxWidth="md" // 设置对话框的最大宽度 (可以是 'xs', 'sm', 'md', 'lg', 'xl')
          aria-labelledby="instructions-dialog-title"
        >
          <DialogTitle id="instructions-dialog-title">
            任务 "{selectedTaskForInstructions || '未知任务'}" 的原子化开发指令
          </DialogTitle>
          <DialogContent dividers> {/* dividers 会在内容区上下添加分割线 */}
            {currentTaskInstructions && selectedTaskForInstructions ? (
              <InstructionsViewer
                instructions={currentTaskInstructions}
                taskId={selectedTaskForInstructions}
              />
            ) : (
              <Typography>暂无指令可显示。</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInstructionsDialog} color="primary">
              关闭
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
};

export default PlanningDocumentViewerPage;