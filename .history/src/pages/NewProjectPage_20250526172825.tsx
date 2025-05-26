// src/pages/NewProjectPage.tsx
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import { useNavigate } from 'react-router-dom'; // 后续步骤处理提交逻辑时可能需要


const NewProjectPage: React.FC = () => {
  // const navigate = useNavigate(); // 后续步骤使用
  const [projectName, setProjectName] = useState('');
  const [initialIdea, setInitialIdea] = useState('');
  // const [selectedFile, setSelectedFile] = useState<File | null>(null); // 后续处理文件上传

  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleInitialIdeaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialIdea(event.target.value);
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setSelectedFile(event.target.files[0]);
  //     console.log('Selected file:', event.target.files[0].name);
  //   }
  // };

  const handleSubmit = () => {
    // 在后续步骤 (步骤4) 中，我们将在这里添加提交项目信息到后端的逻辑
    console.log('项目名称:', projectName);
    console.log('初步项目想法:', initialIdea);
    // console.log('选择的文件:', selectedFile ? selectedFile.name : '未选择');
    alert('项目信息提交逻辑待实现！');
    // 校验 projectName 是否为空等基础校验可以在这里添加
    if (!projectName.trim()) {
      alert('项目名称不能为空！');
      return;
    }
    // 后续调用API服务等
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center', // 表单通常左对齐或拉伸，而不是居中
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          创建新项目规划
        </Typography>

        <TextField
          label="项目名称"
          variant="outlined"
          fullWidth
          required // 标记为必填字段 (视觉上)
          value={projectName}
          onChange={handleProjectNameChange}
          sx={{ mb: 3 }} // margin-bottom
          // error={!projectName} // 简单的即时校验示例
          // helperText={!projectName ? "项目名称不能为空" : ""}
        />

        <TextField
          label="您的初步项目想法"
          variant="outlined"
          fullWidth
          multiline // 允许多行输入
          rows={6}    // 默认显示的行数
          value={initialIdea}
          onChange={handleInitialIdeaChange}
          placeholder="请用自然语言描述您的项目大概想做什么，主要解决什么问题，面向哪些用户等..."
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label" // 使按钮表现得像一个文件选择标签
          >
            上传参考文件 (可选)
            {/* 隐藏的文件输入框，实际的文件选择由它处理 */}
            {/* <input type="file" hidden onChange={handleFileChange} /> */}
            <input type="file" hidden onChange={() => alert('文件上传功能待实现')} />
          </Button>
          {/* {selectedFile && <Typography sx={{ ml: 2, display: 'inline' }}>已选择: {selectedFile.name}</Typography>} */}
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ alignSelf: 'flex-start' }} // 使提交按钮不完全拉伸，并左对齐
        >
          开始智能规划
        </Button>
      </Box>
    </Container>
  );
};

export default NewProjectPage;