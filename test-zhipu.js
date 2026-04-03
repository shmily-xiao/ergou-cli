import { ProviderRegistry } from './dist/cli.js';

console.log('Testing Zhipu Provider...');

const registry = ProviderRegistry.getInstance();
const providers = registry.listProviders();
console.log('Available providers:', providers);

if (providers.includes('zhipu')) {
  console.log('✅ Zhipu provider is registered!');
} else {
  console.log('❌ Zhipu provider NOT registered!');
}
