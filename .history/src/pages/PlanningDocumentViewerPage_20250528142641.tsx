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
import type { AtomizedInstruction } from '../../components/instructions/types'; // 1. 确保或添加此导入
import InstructionsViewer from '../../components/instructions/InstructionsViewer'; // 2. 导入 InstructionsViewer

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
  

  useEffect(() => {
    let firstChapter: Chapter | undefined = undefined;
    if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
      firstChapter = currentDocumentData.requirementsSpec.chapters[0];
    } else if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
      firstChapter = currentDocumentData.technicalPlan.chapters[0];
    }

    if (firstChapter && (!selectedChapterId || !locationState?.revisionMode)) {
       setSelectedChapterId(firstChapter.id);
    } else if (!firstChapter && !locationState?.revisionMode) { // 如果没有章节且不是修订模式返回
      setSelectedChapterId(null);
    }
    // 如果是修订模式返回，并且有chapterToReviseId，我们应该选中它
    // 这个逻辑可以在另一个useEffect或这里扩展，但为了保持当前步骤清晰，暂时简化
  }, [currentDocumentData, locationState?.revisionMode, selectedChapterId]); 

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
                  <React.Fragment key={`part-<span class="math-inline">\{part\.title\}\-</span>{partIndex}`}>
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
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {selectedChapter.content}
                  </Typography>
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
    </Box>
  );
};

export default PlanningDocumentViewerPage;