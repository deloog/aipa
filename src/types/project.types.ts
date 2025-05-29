// src/types/project.types.ts

export interface Chapter {
    id: string;
    title: string;
    content: string; // 注意：mock数据中有一个 content 是 JSON.stringify 的结果，但其本身仍是字符串
  }
  
  export interface DocumentPart {
    title: string;
    chapters: Chapter[];
  }
  
  export interface PlanningDocument {
    title: string;
    requirementsSpec: DocumentPart;
    technicalPlan: DocumentPart;
    // 根据您的模拟数据，atomizedInstructions 似乎没有直接包含在 PlanningDocument 结构中，
    // 而是作为 ProjectPlan 的一个独立字段。
    // 如果 atomizedInstructions 也是 PlanningDocument 的一部分，请在此添加。
  }
  
  // 我们可以将 ProjectPlanSummary 和 FullProjectPlan 也移到这里，使其更通用
  export interface ProjectPlanSummary {
    id: string;
    projectName: string;
    status: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  
  export interface FullProjectPlan extends ProjectPlanSummary {
    documentData: PlanningDocument; // 包含需求、技术规划等
    // 如果原子化指令是项目计划的一部分，但不在 PlanningDocument 内部，可以在这里添加
    // atomizedInstructions?: any; // 或者更具体的类型
  }