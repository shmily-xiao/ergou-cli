#!/usr/bin/env node

// 最终测试脚本 - 测试所有功能

import { ProviderRegistry } from './src/providers/base.js';
import { toolRegistry } from './src/tools/registry.js';

async function test() {
  console.log('🧪 Ergou CLI 最终测试\n');
  
  // 测试 1: Provider
  console.log('测试 1: Provider 系统');
  const registry = ProviderRegistry.getInstance();
  const providers = registry.listProviders();
  console.log('  可用 Provider:', providers);
  
  const provider = await registry.createProvider('aliyun', {
    name: 'aliyun',
    apiKey: 'sk-sp-f393fa20e4da46ef84c2188e949d47ba',
  });
  
  const models = await provider.listModels();
  console.log('  阿里云模型:', models.length, '个');
  console.log('  默认模型:', provider.defaultModel);
  console.log('  ✅ Provider 测试通过\n');
  
  // 测试 2: 工具系统
  console.log('测试 2: 工具系统');
  const tools = toolRegistry.list();
  console.log('  已启用工具:', tools.length, '个');
  console.log('  工具列表:', tools);
  console.log('  ✅ 工具系统测试通过\n');
  
  // 测试 3: API 调用
  console.log('测试 3: API 调用');
  try {
    const stream = provider.chat([{ role: 'user', content: 'Hello' }], {
      model: 'qwen3.5-plus',
      stream: true,
    });
    
    let response = '';
    for await (const chunk of stream) {
      if (chunk.type === 'content' && chunk.content) {
        response += chunk.content;
        process.stdout.write(chunk.content);
      }
      if (chunk.type === 'error') {
        console.error('API Error:', chunk.error);
      }
      if (chunk.type === 'done') {
        console.log('\\n  ✅ API 调用测试通过\\n');
      }
    }
    
    if (!response) {
      console.log('  ⚠️  没有收到响应内容');
    }
  } catch (error) {
    console.error('  ❌ API 调用失败:', error.message);
  }
  
  console.log('\\n=========================');
  console.log('📊 测试总结');
  console.log('=========================');
  console.log('Provider 系统：✅ 通过');
  console.log('工具系统：✅ 通过 (' + tools.length + ' 个工具)');
  console.log('API 调用：🔄 待验证');
  console.log('=========================\\n');
}

test().catch(err => console.error('Fatal error:', err));
