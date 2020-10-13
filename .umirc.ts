import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // 删除配置式路由，启用约定式路由
  // routes: [
  // { path: '/', component: '@/pages/index' },
  // ],
  // 代理
  proxy: {
    '/api': {
      'target': 'http://public-api-v1.aspirantzhang.com',
      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
    },
  },
});
