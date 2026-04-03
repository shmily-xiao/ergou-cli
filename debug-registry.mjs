import { ProviderRegistry } from './src/providers/base.js';

console.log('导入所有 Provider...');
await import('./src/providers/zhipu.js');
await import('./src/providers/aliyun.js');
await import('./src/providers/anthropic.js');
await import('./src/providers/deepseek.js');
await import('./src/providers/openai.js');

const registry = ProviderRegistry.getInstance();
const providers = registry.listProviders();
console.log('已注册的 Provider:', providers);

console.log('\n尝试创建 zhipu provider...');
try {
  const provider = await registry.createProvider('zhipu', {
    name: 'zhipu',
    apiKey: 'sk-test',
  });
  console.log('✅ 创建成功:', provider.constructor.name);
} catch (err) {
  console.log('❌ 创建失败:', err.message);
}
