// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getProjectPlans, deleteProject, duplicateProject } from '../services/project.service';
import type { ProjectPlanSummary } from '../types/project.types'; // 导入 deleteProject 和 duplicateProject
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [projectPlans, setProjectPlans] = useState<ProjectPlanSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProjectPlans = async () => {
      try {
        setLoading(true);
        const plans = await getProjectPlans();
        setProjectPlans(plans);
        setError(null);
      } catch (err) {
        setError('获取项目列表失败，请稍后再试。');
        console.error(err);
        setProjectPlans([]); // 在出错时清空列表或显示错误信息
      } finally {
        setLoading(false);
      }
    };

    fetchProjectPlans();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('确定要删除这个项目规划吗？')) {
      try {
        await deleteProject(projectId);
        setProjectPlans(prevPlans => prevPlans.filter(plan => plan.id !== projectId));
      } catch (err) {
        setError('删除项目失败，请稍后再试。');
        console.error(err);
      }
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      await duplicateProject(projectId); // newPlan is not used, so we don't need to assign it
      // 刷新列表以包含复制的项目，或者直接将新项目添加到状态中
      // 为了简单起见，我们重新获取整个列表
      setLoading(true);
      const plans = await getProjectPlans();
      setProjectPlans(plans);
      setError(null);
    } catch (err) { 
      setError('复制项目失败，请稍后再试。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewProject = () => {
    console.log('“创建新项目规划”按钮被点击了！将导航到新项目页面...');
    // 3. 使用 navigate 函数进行页面跳转
    navigate('/projects/new'); // 我们将为新项目页面定义这个路径
  };

  const userName = "用户"; 

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          欢迎，{userName}！
        </Typography>
        <Typography component="p" variant="body1" sx={{ mb: 4 }}>
          在这里管理您的AI项目规划，或开始一个新的规划。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateNewProject} 
        >
          创建新项目规划
        </Button>

        {loading && <Typography sx={{ mt: 2 }}>正在加载项目列表...</Typography>}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {!loading && !error && projectPlans.length === 0 && (
          <Typography sx={{ mt: 2 }}>您还没有任何项目规划。</Typography>
        )}
        {!loading && !error && projectPlans.length > 0 && (
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography component="h2" variant="h5" gutterBottom>
              您的项目规划：
            </Typography>
            {projectPlans.map((plan) => (
              <Box key={plan.id} sx={{ mb: 2, p: 2, border: '1px solid grey', borderRadius: '4px' }}>
                <Typography variant="h6">{plan.projectName}</Typography>
                <Typography variant="body2">状态：{plan.status}</Typography>
                <Typography variant="caption">创建于：{new Date(plan.createdAt).toLocaleDateString()}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => navigate(`/projects/${plan.id}/review`)} sx={{ mr: 1 }}>查看详情</Button>
                  <Button size="small" onClick={() => handleDuplicateProject(plan.id)} sx={{ mr: 1 }}>复制</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteProject(plan.id)}>删除</Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;