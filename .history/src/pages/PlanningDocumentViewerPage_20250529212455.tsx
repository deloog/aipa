// src/pages/PlanningDocumentViewerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getProjectPlanById } from '../services/project.service';
import type { FullProjectPlan } from '../types/project.types';
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
import Skeleton from '@mui/material/Skeleton'; // 新增加载占位符
import type { AtomizedInstruction } from '../components/instructions/types';
import InstructionsViewer from '../components/instructions/InstructionsViewer';
import type { PlanningDocument, Chapter, DocumentPart } from '../types/project.types';

// 工具类型和常量
const DOC_SECTIONS = ['requirementsSpec', 'technicalPlan'] as const;
type DocSectionType = typeof DOC_SECTIONS[number];

const isPlanningDocument = (data: any): data is PlanningDocument => {
  return (
    typeof data.title === 'string' &&
    DOC_SECTIONS.every(section => 
      data[section] && 
      typeof data[section].title === 'string' && 
      Array.isArray(data[section].chapters)
    )
  );
};

const removeBOM = (str: string) => 
  str.charCodeAt(0) === 0xFEFF ? str.substring(1) : str;

const safeJSONParse = <T>(str: string): T | null => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

interface PlanningPageLocationState {
  documentData?: PlanningDocument;
  projectName?: string;
  revisionMode?: boolean;
  chapterToReviseId?: string;
  chapterToReviseTitle?: string;
}

const PlanningDocumentViewerPage: React.FC = () => {
  // 状态管理优化
  const [projectPlan, setProjectPlan] = useState<FullProjectPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDocument, setCurrentDocument] = useState<PlanningDocument | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedTaskInstructions, setSelectedTaskInstructions] = useState<AtomizedInstruction[] | null>(null);
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const locationState = location.state as PlanningPageLocationState | undefined;

  // 数据获取逻辑
  const fetchProjectPlan = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const plan = await getProjectPlanById(projectId);
      
      if (isPlanningDocument(plan.documentData)) {
        setCurrentDocument(plan.documentData);
        setProjectPlan(plan);
        setError(null);
      } else {
        throw new Error('文档数据格式不符合要求');
      }
    } catch (err) {
      setError('获取项目规划详情失败。');
      console.error('数据获取失败:', err);
      setProjectPlan(null);
      setCurrentDocument(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectPlan();
  }, [fetchProjectPlan]);

  // 章节选择逻辑优化
  useEffect(() => {
    if (loading || !currentDocument) return;

    const handleInitialSelection = () => {
      if (locationState?.revisionMode && locationState.chapterToReviseId) {
        const validChapter = DOC_SECTIONS.some(section => 
          currentDocument[section].chapters.some(c => c.id === locationState.chapterToReviseId)
        );
        
        if (validChapter) return locationState.chapterToReviseId;
      }

      const firstChapter = DOC_SECTIONS.flatMap(section => 
        currentDocument[section].chapters
      ).find(Boolean);

      return firstChapter?.id || null;
    };

    const chapterIdToSelect = handleInitialSelection();
    if (chapterIdToSelect && selectedChapterId !== chapterIdToSelect) {
      setSelectedChapterId(chapterIdToSelect);
    }
  }, [currentDocument, loading, locationState, selectedChapterId]);

  // 章节内容解析
  useEffect(() => {
    const findChapter = (id: string) => {
      return DOC_SECTIONS.reduce<Chapter | null>((acc, section) => {
        if (acc) return acc;
        return currentDocument?.[section].chapters.find(c => c.id === id) || null;
      }, null);
    };

    if (selectedChapterId) {
      const chapter = findChapter(selectedChapterId);
      setSelectedChapter(chapter || null);
    } else {
      setSelectedChapter(null);
    }
  }, [selectedChapterId, currentDocument]);

  // 内容格式化工具函数
  const formatContent = useCallback((content: unknown) => {
    if (typeof content === 'string') {
      const cleanContent = removeBOM(content).trim();
      return cleanContent || '（空内容）';
    }
    
    if (content && typeof content === 'object') {
      try {
        return JSON.stringify(content, null, 2);
      } catch {
        return '（格式化失败）';
      }
    }

    return String(content);
  }, []);

  // 文档操作处理
  const handleCopyDocument = async () => {
    if (!currentDocument) return;

    const documentText = [
      currentDocument.title,
      '',
      '(审阅草稿)',
      '',
      ...DOC_SECTIONS.flatMap(section => [
        `--- ${currentDocument[section].title} ---`,
        ...currentDocument[section].chapters.map(
          chapter => `- ${chapter.title}`
        )
      ]),
      '====================================',
      ...DOC_SECTIONS.flatMap(section => [
        `--- ${currentDocument[section].title} ---`,
        ...currentDocument[section].chapters.map(chapter => [
          chapter.title,
          formatContent(chapter.content),
          '------------------------------------'
        ].join('\n\n'))
      ])
    ].join('\n\n');

    try {
      await navigator.clipboard.writeText(documentText);
      alert('已成功复制文档内容到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制内容');
    }
  };

  // 指令查看逻辑优化
  const handleViewInstructions = useCallback((taskId: string, taskTitle: string) => {
    const mockInstructions: Record<string, AtomizedInstruction[]> = {
      task_frontend_init: [
        { stepNumber: 1, purpose: '创建React+TS项目', command: 'npm create vite@latest ...', expectedOutcome: '项目初始化成功' },
        { stepNumber: 2, purpose: '安装路由库', command: 'npm install react-router-dom', expectedOutcome: '依赖安装完成' }
      ],
      task_auth_api: [
        { stepNumber: 1, purpose: '生成认证服务', command: 'nest generate service auth', expectedOutcome: '服务文件生成' },
        { stepNumber: 2, purpose: '安装JWT依赖', command: 'npm install @nestjs/jwt', expectedOutcome: '依赖安装完成' }
      ]
    };

    setSelectedTaskInstructions(mockInstructions[taskId] || []);
    setIsInstructionsDialogOpen(true);
  }, []);

  // 渲染逻辑
  if (loading) return (
    <Box p={4}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="text" sx={{ mt: 2 }} />
      <Skeleton variant="text" sx={{ mt: 1 }} />
    </Box>
  );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!currentDocument) return <Typography>文档数据异常</Typography>;

  const documentSections = DOC_SECTIONS.map(section => ({
    title: currentDocument[section].title,
    chapters: currentDocument[section].chapters
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ m: 2, p: 3 }}>
        {/* 标题区域 */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" align="center">
            {currentDocument.title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            (审阅草稿 - 项目ID: {projectId})
          </Typography>
        </Box>

        {/* 目录导航 */}
        <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
          {/* 左侧目录 */}
          <Paper sx={{ width: { xs: '100%', md: '30%' }, p: 1 }}>
            <List dense>
              {documentSections.map((section, idx) => (
                <React.Fragment key={section.title}>
                  <ListSubheader>{section.title}</ListSubheader>
                  {section.chapters.map(chapter => (
                    <ListItemButton
                      key={chapter.id}
                      selected={selectedChapterId === chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      sx={{ pl: 2 }}
                    >
                      <ListItemText primary={chapter.title} />
                    </ListItemButton>
                  ))}
                  {idx < documentSections.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* 内容区域 */}
          <Paper sx={{ flex: 1, p: 2 }}>
            {selectedChapter ? (
              <>
                <Typography variant="h5">{selectedChapter.title}</Typography>
                <Divider sx={{ my: 2 }} />
                {/* 特殊处理开发步骤章节 */}
                {selectedChapter.id === 'tech_dev_steps' ? (
                  <DevelopmentStepsContent content={selectedChapter.content} />
                ) : (
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {formatContent(selectedChapter.content)}
                  </Typography>
                )}
              </>
            ) : (
              <Typography color="text.secondary" align="center">
                请选择左侧章节查看内容
              </Typography>
            )}
          </Paper>
        </Box>

        {/* 操作按钮组 */}
        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={handleCopyDocument}
            startIcon={loading ? <Skeleton variant="circular" width={20} height={20} /> : undefined}
          >
            {loading ? '准备中...' : '复制文档'}
          </Button>
          {/* 其他操作按钮保持不变 */}
        </Box>
      </Paper>

      {/* 确认对话框 */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        {/* 对话框内容保持不变 */}
      </Dialog>

      {/* 指令查看对话框 */}
      <Dialog open={isInstructionsDialogOpen} onClose={() => setIsInstructionsDialogOpen(false)} maxWidth="md">
        {/* 对话框内容保持不变 */}
      </Dialog>
    </Box>
  );
};

// 开发步骤专用内容组件
const DevelopmentStepsContent: React.FC<{ content: unknown }> = ({ content }) => {
  const devSteps = safeJSONParse<{
    introduction?: string;
    tasks?: Array<{ taskId: string; title: string; description: string }>;
  }>(formatContent(content));

  if (!devSteps) return <Typography color="error">开发步骤配置错误</Typography>;

  return (
    <Box>
      {devSteps.introduction && (
        <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
          {devSteps.introduction}
        </Typography>
      )}
      {devSteps.tasks?.map((task, idx) => (
        <Box key={task.taskId} sx={{ mb: 2 }}>
          <Typography variant="h6">{task.title || `任务 ${idx + 1}`}</Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => console.log('执行指令:', task.taskId)}
            sx={{ mt: 1 }}
          >
            查看指令
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default PlanningDocumentViewerPage;