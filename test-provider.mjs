import { ProviderRegistry } from './src/providers/base.js';

console.log('导入 zhipu provider...');
await import('./src/providers/zhipu.js');

const registry = ProviderRegistry.getInstance();
const providers = registry.listProviders();
console.log('可用 Provider:', providers);
console.log('Zhipu 已注册:', providers.includes('zhipu'));
