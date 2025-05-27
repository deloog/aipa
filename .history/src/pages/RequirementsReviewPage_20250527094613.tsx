// src/pages/RequirementsReviewPage.tsx
import React, { useState, useEffect } from 'react'; // 1. 导入 useState 和 useEffect
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider'; // 用于美化
import Button from '@mui/material/Button';

// 2. 定义数据结构接口
interface Chapter {
  id: string;
  title: string;
  content: string; // 每个章节的具体内容
  // 未来可以添加子章节等更复杂结构
}

interface RequirementsDocument {
  title: string;
  chapters: Chapter[];
}

// 3. 创建模拟的需求文档数据
// 我们以AIPA项目自身的需求规格为例来创建这份模拟数据
const mockDocumentData: RequirementsDocument = {
  title: 'AI项目规划助手 (AIPA) MVP - 项目需求规格说明书',
  chapters: [
    {
      id: 'overview',
      title: '1. 项目概述与愿景',
      content: '1.1. 项目名称: AI项目规划助手 (AIPA)\n1.2. 一句话核心定位: 一款AI赋能的“保姆级”项目规划工具...\n1.3. 项目要解决的核心问题: ...\n(此处省略详细内容，您可以从您的项目书中复制粘贴更多，或者保持简洁)',
    },
    {
      id: 'users',
      title: '2. 目标用户画像',
      content: '2.1. 主要用户群体描述: 核心用户：技术小白...\n2.2. 用户使用场景示例: 技术小白小明...\n(此处省略详细内容)',
    },
    {
      id: 'features',
      title: '3. 核心功能需求列表 (AIPA自身的功能)',
      content: '3.1. 【模块1】用户需求引导与交互：...\n3.2. 【模块2】项目技术规划生成与编排：...\n(此处省略详细内容)',
    },
    {
      id: 'data_entities',
      title: '4. AIPA核心数据实体 (概念模型)',
      content: '4.1. 用户 (User)\n4.2. 项目规划 (ProjectPlan)\n(此处省略详细内容)',
    },
    // 您可以根据您的AIPA项目需求规格文档，继续添加更多章节
  ],
};

const RequirementsReviewPage: React.FC = () => {
  // 4. 状态：存储当前选中的章节ID
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  // 5. 状态：存储当前显示的章节内容对象
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // 6. useEffect: 组件加载时，默认选中并显示第一个章节
  useEffect(() => {
    if (mockDocumentData.chapters.length > 0 && !selectedChapterId) {
      const firstChapterId = mockDocumentData.chapters[0].id;
      setSelectedChapterId(firstChapterId);
    }
  }, []); // 空依赖数组，仅在组件首次挂载时运行

  // 7. useEffect: 当selectedChapterId变化时，更新selectedChapter的内容
  useEffect(() => {
    if (selectedChapterId) {
      const chapter = mockDocumentData.chapters.find(c => c.id === selectedChapterId);
      setSelectedChapter(chapter || null);
    }
  }, [selectedChapterId]); // 依赖于selectedChapterId的变化

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId); // 更新选中的章节ID
    console.log('Selected chapter ID:', chapterId);
    // 滚动到章节顶部的逻辑可以在这里或在主内容区实现 (高级功能)
  };
  const formatDocumentForCopy = (doc: RequirementsDocument): string => {
    let formattedString = `${doc.title}\n\n(审阅草稿)\n\n`;
    formattedString += "目录：\n";
    doc.chapters.forEach(chapter => {
      formattedString += `- ${chapter.title}\n`;
    });
    formattedString += "\n====================================\n\n";

    doc.chapters.forEach(chapter => {
      formattedString += `${chapter.title}\n\n`;
      formattedString += `${chapter.content}\n\n------------------------------------\n\n`;
    });
    return formattedString;
  };

  const handleCopyDocument = async () => {
    console.log('“复制本文档内容”按钮被点击');
    const documentText = formatDocumentForCopy(mockDocumentData);
    try {
      await navigator.clipboard.writeText(documentText);
      alert('项目需求规格说明书已复制到剪贴板！');
    } catch (err) {
      console.error('复制到剪贴板失败:', err);
      alert('抱歉，复制失败，请检查浏览器权限或手动复制。');
    }
  };
  return (
    <Box
      sx={{ /* ... 外层背景Box样式保持不变 ... */
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(to right bottom, #3A4A5E, #1C2833)',
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Paper
        elevation={3}
        sx={{ /* ... Paper卡片样式保持不变 ... */
          padding: { xs: 1, sm: 2, md: 3 }, borderRadius: '8px', bgcolor: 'background.paper',
          width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', minHeight: '85vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
          {mockDocumentData.title} {/* 动态显示文档标题 */}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          (审阅草稿)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          display="flex"
          // 在小屏幕(xs)上垂直堆叠，在中等屏幕(sm)及以上水平并排
          flexDirection={{ xs: 'column', sm: 'row' }}
          sx={{
            flexGrow: 1, // 占据父级Paper卡片中可用的垂直空间
            width: '100%', // 占据父级Paper卡片的全部宽度
            gap: { xs: 2, sm: 3 }, // 列之间的间距，小屏幕上下间距，中屏幕左右间距
          }}
        >
          {/* 左侧：侧边栏目录 */}
          <Box
            sx={ ({
              width: { xs: '100%', sm: '30%', md: '25%' }, // 响应式宽度：sm占30%，md占25%
              minWidth: { sm: '200px' }, // 给侧边栏一个最小宽度，避免过窄
              display: 'flex', // 使内部Paper能够flexGrow
              flexDirection: 'column',
            })}
          >
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: 1.5, overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>目录</Typography>
              <List dense>
                {mockDocumentData.chapters.map((chapter) => (
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
            sx={(theme) => ({
              width: { xs: '100%', sm: '70%', md: '75%' }, // 响应式宽度：sm占70%，md占75%
              display: 'flex', // 使内部Paper能够flexGrow
              flexDirection: 'column',
            })}
          >
            <Paper elevation={0} variant="outlined" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}>
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
        <Divider sx={{ mt: 3, mb: 2 }} /> {/* 在按钮组前添加一条分割线，并增加上下边距 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end', // 按钮靠右对齐
            gap: 2, // 按钮之间的间距 (theme.spacing(2))
            paddingTop: 2, // 按钮区域的上内边距
            // paddingBottom: 1, // 可以按需调整下内边距
          }}
        >
          <Button
            variant="outlined" // 使用描边样式作为次要或普通操作
            onClick={handleCopyDocument} // <--- 2. 更新 onClick 事件处理函数
          >
            复制本文档内容
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              console.log('“我需要修改”按钮被点击');
              alert('“我需要修改”功能待实现 (例如返回对话界面)');
            }}
          >
            我需要修改
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log('“最终确认此需求规格”按钮被点击');
              alert('“最终确认此需求规格”功能待实现');
            }}
          >
            最终确认此需求规格
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequirementsReviewPage;