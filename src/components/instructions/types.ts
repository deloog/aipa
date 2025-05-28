export interface AtomizedInstruction {
    stepNumber: number;
    purpose: string;
    command?: string;
    codeSnippet?: string;
    filePath?: string;
    content?: string;
    expectedOutcome?: string;
    verificationMethod?: string;
    notes?: string;
    // id?: string; // 我们在DialogueMessage中为key添加了id，这里也可以考虑，但stepNumber也许能作key
  }