// src/services/project.service.ts
import type { PlanningDocument, FullProjectPlan, ProjectPlanSummary } from '../types/project.types'; // Chapter 和 DocumentPart 会被 PlanningDocument 间接使用

// 临时的ProjectPlan类型，应与后端Prisma模型（或其响应DTO）对齐
// 我们先定义一个基础版本，至少包含列表展示所需字段
export interface ProjectPlanSummary {
  id: string;
  projectName: string;
  status: string; // 例如：'DRAFT', 'REQUIREMENTS_CONFIRMED', 'TECH_PLAN_GENERATED' 等
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// 用于 getProjectPlanById 的更完整类型 (模拟)
// 理想情况下，这个 PlanningDocument 就是从后端获取的 ProjectPlan 记录中
// requirementsSpec, technicalPlan, atomizedInstructions 等字段解析/组合而成
export interface FullProjectPlan extends ProjectPlanSummary {
  documentData: PlanningDocument; // 包含需求、技术规划等
}


// 模拟创建一个新的项目规划，并返回一个模拟的项目ID
export const createProject = async (projectName: string): Promise<{ projectId: string }> => {
  console.log('[API STUB] project.service.ts: createProject called with projectName:', projectName);
  await new Promise(resolve => setTimeout(resolve, 300)); 
  const mockProjectId = `mock_project_${Date.now()}`;
  console.log('[API STUB] project.service.ts: returning mock projectId:', mockProjectId);
  return Promise.resolve({ projectId: mockProjectId });
};

// --- VV V V V 新增以下函数桩 VV V V V ---

// 模拟获取当前用户的所有项目规划列表
export const getProjectPlans = async (): Promise<ProjectPlanSummary[]> => {
  console.log('[API STUB] project.service.ts: getProjectPlans called');
  await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

  // 返回一个包含2-3个模拟ProjectPlan对象的数组
  const mockProjectPlans: ProjectPlanSummary[] = [
    { id: 'mock_project_1748415016254', projectName: '鲸灵提醒 (示例)', status: 'TECH_PLAN_GENERATED', createdAt: new Date(Date.now() - 100000000).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'mock_project_abcdef', projectName: 'AI写作助手', status: 'REQUIREMENTS_CONFIRMED', createdAt: new Date(Date.now() - 200000000).toISOString(), updatedAt: new Date(Date.now() - 50000000).toISOString() },
    { id: 'mock_project_uvwxyz', projectName: '个人作品集网站', status: 'DRAFT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  console.log('[API STUB] project.service.ts: returning mock project plans:', mockProjectPlans);
  return Promise.resolve(mockProjectPlans);
};

// 模拟获取单个项目规划详情 (返回包含完整文档数据的结构)
export const getProjectPlanById = async (projectId: string): Promise<FullProjectPlan | null> => {
  console.log('[API STUB] project.service.ts: getProjectPlanById called with projectId:', projectId);
  await new Promise(resolve => setTimeout(resolve, 400));

  // 这是一个非常重要的函数，它应该返回 PlanningDocumentViewerPage 所需的完整数据结构
  // 我们需要根据 projectId 返回一个之前在 DialoguePage 中定义的类似 generateMockRequirementsForReview 的数据结构
  const mockProjectName = projectId === 'mock_project_1748415016254' ? '鲸灵提醒 (示例)' : `项目 ${projectId}`;

  // 复用 DialoguePage 中的模拟数据生成逻辑 (可以考虑将其提取到共享工具函数中)
  const mockDocument: PlanningDocument = {
    title: `${mockProjectName} - 项目规划文档 (MVP)`,
    requirementsSpec: {
      title: '第一部分：项目需求规格说明书',
      chapters: [
        { id: `req_overview_${projectId}`, title: `1. 项目概述与愿景 (${mockProjectName})`, content: `这是项目“${mockProjectName}”的需求概述...\n(详情内容，ID: ${projectId})` },
        { id: `req_users_${projectId}`, title: `2. 目标用户画像 (${mockProjectName})`, content: `项目“${mockProjectName}”的目标用户是...\n(详情内容)` },
      ],
    },
    technicalPlan: {
      title: '第二部分：项目技术规划方案',
      chapters: [
        { id: `tech_stack_${projectId}`, title: '2.1. 推荐技术栈', content: '推荐技术栈：\n- 前端: React...\n理由: ...' },
        { id: `tech_architecture_${projectId}`, title: '2.2. 系统架构设计初步', content: '系统架构：\n- 采用多层架构...\n(详情内容)' },
        {
          id: `tech_dev_steps_${projectId}`, // 确保这个ID对于每个项目是可区分的，或者让内容本身包含projectId
          title: '2.6. 开发实施步骤与优先级建议 (示例)',
          content: JSON.stringify({
            introduction: `项目 ${mockProjectName} 的初步开发实施步骤：`,
            tasks: [
              { taskId: `task_init_backend_${projectId}`, title: '阶段0 - 任务1.1: 后端项目初始化', description: '初始化NestJS后端项目...' },
              { taskId: `task_auth_api_${projectId}`, title: '阶段0 - 任务1.2: 核心用户认证API骨架', description: '搭建用户认证模块...' },
            ]
          })
        },
      ],
    }
  };

  const fullProjectPlan: FullProjectPlan = {
    id: projectId,
    projectName: mockProjectName,
    status: 'TECH_PLAN_GENERATED', // 假设状态
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date().toISOString(),
    documentData: mockDocument,
  };
  console.log('[API STUB] project.service.ts: returning mock full project plan:', fullProjectPlan);
  return Promise.resolve(fullProjectPlan);
};

// 模拟复制项目规划
export const duplicateProject = async (projectId: string): Promise<ProjectPlanSummary> => {
  console.log('[API STUB] project.service.ts: duplicateProject called for projectId:', projectId);
  await new Promise(resolve => setTimeout(resolve, 600));
  const newProjectId = `mock_project_duplicated_${Date.now()}`;
  const duplicatedProject: ProjectPlanSummary = {
    id: newProjectId,
    projectName: `项目 ${projectId} (副本)`,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  console.log('[API STUB] project.service.ts: returning duplicated project summary:', duplicatedProject);
  return Promise.resolve(duplicatedProject);
};

// 模拟删除项目规划
export const deleteProject = async (projectId: string): Promise<void> => {
  console.log('[API STUB] project.service.ts: deleteProject called for projectId:', projectId);
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('[API STUB] project.service.ts: project deleted (simulated).');
  return Promise.resolve();
};

// --- ^ ^ ^ ^ 新增以上函数桩 ^ ^ ^ ^ ---