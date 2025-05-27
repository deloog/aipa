// src/pages/PlanningDocumentViewerPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader'; // 用于显示部分标题
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// 1. 更新数据结构接口
interface Chapter {
  id: string; // 确保ID在整个文档中唯一，例如 "req_overview", "tech_stack"
  title: string;
  content: string;
}

interface DocumentPart {
  title: string;
  chapters: Chapter[];
}

interface PlanningDocument {
  title: string; // 文档的总标题
  requirementsSpec?: DocumentPart; // 第一部分：需求规格 (可选)
  technicalPlan?: DocumentPart;    // 第二部分：技术规划 (可选)
}

// 用于从路由状态接收数据的接口
interface PlanningPageLocationState {
  documentData?: PlanningDocument; // 使用新的 PlanningDocument 类型
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

  // 2. 使用传递过来的文档数据，或提供一个更完整的默认/空结构
  const currentDocumentData: PlanningDocument = locationState?.documentData || {
    title: `项目规划文档 (${projectId || '未知项目'})`,
    requirementsSpec: { title: '第一部分：需求规格说明书 (空)', chapters: [] },
    technicalPlan: { title: '第二部分：项目技术规划方案 (空)', chapters: [] },
  };
  const currentProjectName = locationState?.projectName || projectId || '项目';

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // 3. useEffect: 组件加载或文档数据变化时，设置默认选中章节
  useEffect(() => {
    let firstChapter: Chapter | undefined = undefined;
    if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
      firstChapter = currentDocumentData.requirementsSpec.chapters[0];
    } else if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
      firstChapter = currentDocumentData.technicalPlan.chapters[0];
    }

    if (firstChapter && (!selectedChapterId || !locationState?.revisionMode)) {
      setSelectedChapterId(firstChapter.id);
    } else if (!firstChapter) {
      setSelectedChapterId(null);
    }
  }, [currentDocumentData, locationState?.revisionMode]); // 依赖文档数据和是否修订模式

  // useEffect: 当selectedChapterId变化时，更新selectedChapter的内容
  useEffect(() => {
    if (selectedChapterId) {
      let chapter: Chapter | undefined = undefined;
      if (currentDocumentData.requirementsSpec) {
        chapter = currentDocumentData.requirementsSpec.chapters.find(c => c.id === selectedChapterId);
      }
      if (!chapter && currentDocumentData.technicalPlan) {
        chapter = currentDocumentData.technicalPlan.chapters.find(c => c.id === selectedChapterId);
      }
      setSelectedChapter(chapter || null);
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
      part.chapters.forEach(chapter => {
        formattedString += `- ${chapter.title}\n`;
      });
    });
    formattedString += "\n====================================\n\n";
    parts.forEach(part => {
      formattedString += `\n--- ${part.title} ---\n\n`;
      part.chapters.forEach(chapter => {
        formattedString += `<span class="math-inline">\{chapter\.title\}\\n\\n</span>{chapter.content}\n\n------------------------------------\n\n`;
      });
    });
    return formattedString;
  };
  const handleCopyDocument = async () => { /* ... (逻辑不变，使用 currentDocumentData) ... */ 
    const documentText = formatDocumentForCopy(currentDocumentData);
    try { await navigator.clipboard.writeText(documentText); alert('已复制!'); } catch(e) { alert('复制失败');}
  };
  const handleRequestRevision = () => { /* ... (逻辑不变，使用 currentProjectName, projectId, selectedChapterId, selectedChapter) ... */ 
    if (!projectId) { alert('项目ID未知'); return; }
    if (!selectedChapterId || !selectedChapter) { alert('请选择章节'); return; }
    navigate(`/dialogue/${projectId}`, { state: { revisionMode: true, chapterToReviseId: selectedChapterId, chapterToReviseTitle: selectedChapter.title, projectName: currentProjectName } });
  };
  const handleClickOpenConfirmDialog = () => { setOpenConfirmDialog(true); };
  const handleCloseConfirmDialog = () => { setOpenConfirmDialog(false); };
  const handleFinalConfirm = async () => { /* ... (逻辑不变，使用 projectId) ... */ 
    if (!projectId) { alert('项目ID未知'); return; }
    setOpenConfirmDialog(false); console.log(`为项目 ${projectId} 最终确认需求`);
    await new Promise(resolve => setTimeout(resolve, 500)); alert('需求规格已最终确认！');
  };

  // 将所有可显示的章节收集到一个数组中，方便侧边栏渲染
  const allDisplayableParts: DocumentPart[] = [];
  if (currentDocumentData.requirementsSpec && currentDocumentData.requirementsSpec.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.requirementsSpec);
  }
  if (currentDocumentData.technicalPlan && currentDocumentData.technicalPlan.chapters.length > 0) {
    allDisplayableParts.push(currentDocumentData.technicalPlan);
  }

  return (
    <Box sx={{ /* ... 外层Box样式 ... */ }}>
      <Paper elevation={3} sx={{ /* ... Paper卡片样式 ... */ }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
          {currentDocumentData.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          (审阅草稿 - 项目ID: {projectId})
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} sx={{ flexGrow: 1, width: '100%', gap: { xs: 2, sm: 3 } }}>
          {/* 左侧：侧边栏目录 */}
          <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%' }, minWidth: { sm: '200px' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 0, overflowY: 'auto' }}> {/* p:0 让ListSubheader紧贴边缘 */}
              <List dense component="nav" aria-labelledby="nested-list-subheader">
                {allDisplayableParts.map((part, partIndex) => (
                  <React.Fragment key={`part-${partIndex}`}>
                    <ListSubheader component="div" sx={{ bgcolor: 'grey.100', lineHeight: '32px' }}> {/* 部分标题 */}
                      {part.title}
                    </ListSubheader>
                    {part.chapters.map((chapter) => (
                      <ListItem key={chapter.id} disablePadding sx={{ pl: 2 }}> {/* 子章节缩进 */}
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
                {allDisplayableParts.length === 0 && (
                    <ListItem><ListItemText primary="暂无章节内容" /></ListItem>
                )}
              </List>
            </Paper>
          </Box>

          {/* 右侧：主内容区 */}
          <Box sx={{ width: { xs: '100%', sm: '70%', md: '75%' }, mt: { xs: 2, sm: 0 }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: {xs: 2, md: 3}, overflowY: 'auto' }}>
              {selectedChapter ? ( /* ... 显示选定章节内容 ... */ ) : ( /* ... 提示选择章节 ... */ )=>,
            </Paper>
          </Box>
        </Box>

        <Divider sx={{ mt: 3, mb: 2 }} />
        <Box sx={{ /* ... 按钮区域Box样式 ... */ }}>
          {/* ... 按钮 ... */}
        </Box>
      </Paper>
      {/* ... Dialog组件 ... */}
    </Box>
  );
};

export default PlanningDocumentViewerPage;