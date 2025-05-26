import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier'; // <--- 新增的导入

export default tseslint.config(
  { ignores: ['dist'] }, // 保持不变：忽略dist目录
  {
    // 这个对象是您原有的主要配置，我们基本保持不变
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // 通常React项目还需要指定JSX的解析，但tseslint.configs.recommended可能已包含
      // parser: tseslint.parser, // tseslint.config 应该会自动处理
      // parserOptions: {
      //   project: './tsconfig.json', // 如果有需要项目信息的规则
      //   ecmaFeatures: { jsx: true },
      // },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // 如果您之前安装了 eslint-plugin-react 并且希望使用它的规则（除了格式化相关的），
      // 可以在这里添加 'react': eslintPluginReact,
      // 并在下面的 rules 或 extends 中启用。
      // 但Vite的模板通常侧重于hooks和refresh，tseslint也覆盖了很多。
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 您可以在这里添加或覆盖其他 ESLint 规则
      // 例如，如果您也想使用 eslint-plugin-react 的推荐规则:
      // ...eslintPluginReact.configs.recommended.rules,
      // (但这需要先在 plugins 中注册 react)
    },
    // settings: { // 如果使用 eslint-plugin-react
    //   react: {
    //     version: 'detect', // 自动检测React版本
    //   },
    // },
  },
  eslintConfigPrettier, // <--- 将这个添加到配置序列的末尾
);