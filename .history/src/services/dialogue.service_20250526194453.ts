// src/services/dialogue.service.ts

// 模拟初始化对话，并返回AI的首次回应
export const initiateDialogue = async (projectId: string, initialIdea: string): Promise<{ aiMessage: string }> => {
    console.log('[API STUB] dialogue.service.ts: initiateDialogue called with projectId:', projectId, 'and initialIdea:', initialIdea);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // 返回一个假的AI回应
    // 修正：移除HTML片段，并使用正确的模板字符串插值语法
    const mockAiMessage = `好的，我已收到您关于项目ID "${projectId}" 的初步想法：“${initialIdea}”。接下来，我们来深入探讨一下项目的核心目标用户和价值主张吧！`;
    console.log('[API STUB] dialogue.service.ts: returning mock aiMessage:', mockAiMessage);
    return Promise.resolve({ aiMessage: mockAiMessage });
  };
  export const continueDialogue = async (projectId: string, userMessage: string): Promise<{ aiMessage: string }> => {
    console.log('[API STUB] dialogue.service.ts: continueDialogue called with projectId:', projectId, 'and userMessage:', userMessage);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // 返回一个通用的、模拟的AI回应
    const mockAiMessage = `我理解了您说的：“${userMessage}”。关于这一点，您能再详细阐述一下吗？或者，我们接下来讨论项目的[下一个待定主题]？`;
    console.log('[API STUB] dialogue.service.ts: returning mock aiMessage for continueDialogue:', mockAiMessage);
    return Promise.resolve({ aiMessage: mockAiMessage });
  };  
  // 未来可以添加更多与对话相关的API调用函数，例如：
  // export const sendDialogueTurn = async (projectId: string, userMessage: string): Promise<{ aiMessage: string }> => { ... };