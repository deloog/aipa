// src/services/project.service.ts

// 模拟创建一个新的项目规划，并返回一个模拟的项目ID
export const createProject = async (projectName: string): Promise<{ projectId: string }> => {
    console.log('[API STUB] project.service.ts: createProject called with projectName:', projectName);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500)); 
  
    // 返回一个假的projectId
    const mockProjectId = `mock_project_${Date.now()}`;
    console.log('[API STUB] project.service.ts: returning mock projectId:', mockProjectId);
    return Promise.resolve({ projectId: mockProjectId });
  };
  
  // 未来可以添加更多与项目相关的API调用函数，例如：
  // export const getProjectPlans = async (): Promise<any[]> => { ... };
  // export const getProjectPlanById = async (projectId: string): Promise<any> => { ... };