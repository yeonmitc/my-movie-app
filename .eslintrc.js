module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended', // ✅ Hooks 규칙 추가
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // ✅ 훅은 최상단에서만
    'react-hooks/exhaustive-deps': 'warn', // ✅ useEffect 의존성 검사
    'react/react-in-jsx-scope': 'off', // ✅ React 17+ JSX 자동 import 대응
  },
  settings: {
    react: {
      version: 'detect', // ✅ 자동으로 설치된 react 버전 감지
    },
  },
};
