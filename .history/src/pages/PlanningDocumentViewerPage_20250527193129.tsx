// src/pages/RequirementsReviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface RequirementsDocument {
  title: string;
  chapters: Chapter[];
}

//const mockDocumentData: RequirementsDocument = {
  //title: 'AI项目规划助手 (AIPA) MVP - 项目需求规格说明书',
  //chapters: [
    //{ 
      //id: 'overview', 
      //title: '1. 项目概述与愿景', 
      //content: '1.1. 项目名称: AI项目规划助手 (AIPA)\n1.2. 一句话核心定位: 一款AI赋能的“保姆级”项目规划工具...\n1.3. 项目要解决的核心问题: ...\n(此处省略详细内容)', 
    //},
    //{ 
      //id: 'users', 
      //title: '2. 目标用户画像', 
      //content: '2.1. 主要用户群体描述: 核心用户：技术小白...\n2.2. 用户使用场景示例: 技术小白小明...\n(此处省略详细内容)',
    //},
    //{ 
      //id: 'features', 
      //title: '3. 核心功能需求列表 (AIPA自身的功能)', 
      //content: '3.1. 【模块1】用户需求引导与交互：...\n3.2. 【模块2】项目技术规划生成与编排：...\n(此处省略详细内容)',
    //},
    //{
      //id: 'data_entities',
      //title: '4. AIPA核心数据实体 (概念模型)',
      //content: '4.1. 用户 (User)\n4.2. 项目规划 (ProjectPlan)\n(此处省略详细内容)',
    //},
  //],
//};

//const MOCK_PROJECT_ID_FOR_REVIEW = 'project_for_review_123'; 
interface ReviewPageLocationState {
  documentData?: RequirementsDocument;
  projectName?: string;
  // 用于“我需要修改”按钮返回对话页时可能携带的参数
  revisionMode?: boolean;
  chapterToReviseId?: string;
  chapterToReviseTitle?: string;
}

const RequirementsReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const locationState = location.state as ReviewPageLocationState | undefined;
  const currentDocumentData = locationState?.documentData || { title: `项目 ${projectId || ''} - 需求规格`, chapters: [] };
  const currentProjectName = locationState?.projectName || projectId || '项目';

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // <--- 对话框状态

  useEffect(() => {
    if (currentDocumentData.chapters.length > 0) {
      const firstChapterId = currentDocumentData.chapters[0].id;
      // 只有当selectedChapterId还未设置，或者与当前第一个章节不同时才更新
      // 避免从对话页返回时，因revisionMode等信息重置了章节选择
      if (!selectedChapterId || !locationState?.revisionMode) {
         setSelectedChapterId(firstChapterId);
      }
    } else {
      setSelectedChapterId(null); // 如果没有章节，清空选择
    }
  }, [currentDocumentData, locationState?.revisionMode]); // 依赖于文档数据和是否是修订模式返回

  useEffect(() => {
    if (selectedChapterId) {
      const chapter = currentDocumentData.chapters.find(c => c.id === selectedChapterId);
      setSelectedChapter(chapter || null);
    } else {
      setSelectedChapter(null); // 如果没有选中ID，清空章节内容
    }
  }, [selectedChapterId, currentDocumentData]);

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
  };

  const formatDocumentForCopy = (doc: RequirementsDocument): string => {
    let formattedString = `${doc.title}\n\n(审阅草稿)\n\n`;
    formattedString += "目录：\n";
    doc.chapters.forEach(chapter => { formattedString += `- ${chapter.title}\n`; });
    formattedString += "\n====================================\n\n";
    doc.chapters.forEach(chapter => { formattedString += `${chapter.title}\n\n${chapter.content}\n\n------------------------------------\n\n`; });
    return formattedString;
  };

  const handleCopyDocument = async () => {
    console.log('“复制本文档内容”按钮被点击');
    const documentText = formatDocumentForCopy(currentDocumentData);
    try {
      await navigator.clipboard.writeText(documentText);
      alert('项目需求规格说明书已复制到剪贴板！');
    } catch (err) {
      console.error('复制到剪贴板失败:', err);
      alert('抱歉，复制失败，请检查浏览器权限或手动复制。');
    }
  };
  
  // VV V V V  确保这些函数在 PlanningDocumentViewerPage 组件内部 V V V V V
  const handleClickOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleFinalConfirm = async () => { // 使用从URL获取的projectId
    if (!projectId) { alert('项目ID未知，无法确认。'); return; }
    setOpenConfirmDialog(false); 
    console.log(`为项目 ${projectId} 最终确认需求`);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('需求规格已最终确认！');
    // navigate('/'); 
  };
  // ^ ^ ^ ^ ^  确保这些函数在 PlanningDocumentViewerPage 组件内部 ^ ^ ^ ^ ^
  const handleRequestRevision = () => {
    console.log('“我需要修改”按钮被点击');
    // 确保 selectedChapterId 和 selectedChapter 确实有值，否则用户可能没有选择章节
    // selectedChapterId 在点击目录时更新，selectedChapter 在 useEffect 中依赖 selectedChapterId 更新
    if (!selectedChapterId || !selectedChapter) { 
      alert('请先在左侧目录中选择一个您希望针对其进行修改反馈的章节。');
      // 或者，如果不想强制用户选择，可以只传递 revisionMode: true
      // navigate(`/dialogue/${MOCK_PROJECT_ID_FOR_REVIEW}`, { 
      //   state: { 
      //     revisionMode: true,
      //     projectName: mockDocumentData.title 
      //   } 
      // });
      return; // 如果没有选定章节，则不继续执行导航
    }
    
    // navigate 函数现在会被使用
    navigate(`/dialogue/${projectId}`, { 
      state: { 
        revisionMode: true, 
        chapterToReviseId: selectedChapterId, 
        chapterToReviseTitle: selectedChapter.title, 
        projectName: currentProjectName,
      } 
    });
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 1, sm: 2, md: 3 }, borderRadius: '8px', bgcolor: 'background.paper',
          width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', minHeight: '85vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
          {currentDocumentData.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          (审阅草稿)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* 双栏布局使用Box替代Grid */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          sx={{ flexGrow: 1, width: '100%', gap: { xs: 2, sm: 3 } }}
        >
          {/* 左侧：侧边栏目录 */}
          <Box
            sx={{
              width: { xs: '100%', sm: '30%', md: '25%' },
              minWidth: { sm: '200px' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 1.5, overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>目录</Typography>
              <List dense>
                {currentDocumentData.chapters.map((chapter) => (
                  <ListItem key={chapter.id} disablePadding>
                    <ListItemButton 
                      selected={selectedChapterId === chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                    >
                      <ListItemText primary={chapter.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* 右侧：主内容区 */}
          <Box
            sx={{
              width: { xs: '100%', sm: '70%', md: '75%' },
              mt: { xs: 2, sm: 0 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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
                <Typography variant="body1" color="textSecondary">
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
          <Button variant="contained" color="primary" onClick={handleClickOpenConfirmDialog}> {/* 确保这里正确引用 */}
            最终确认此需求规格
          </Button>
        </Box>
      </Paper>

      {/* Dialog组件定义 */}
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

export default RequirementsReviewPage;