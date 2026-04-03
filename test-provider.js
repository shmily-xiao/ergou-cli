#!/usr/bin/env node

import { ProviderRegistry } from './dist/index.js';

async function test() {
  console.log('🧪 测试 Provider...\n');
  
  const registry = ProviderRegistry.getInstance();
  
  const provider = await registry.createProvider('aliyun', {
    name: 'aliyun',
    apiKey: 'sk-sp-f393fa20e4da46ef84c2188e949d47ba',
  });
  
  console.log('Provider 创建成功');
  console.log('默认模型:', provider.defaultModel);
  
  const models = await provider.listModels();
  console.log('可用模型:', models.length);
  
  console.log('\n发送消息...');
  const stream = provider.chat([{ role: 'user', content: 'Hello' }], {
    model: 'qwen3.5-plus',
    stream: true,
  });
  
  let response = '';
  for await (const chunk of stream) {
    console.log('Chunk:', chunk.type);
    if (chunk.type === 'content' && chunk.content) {
      response += chunk.content;
      process.stdout.write(chunk.content);
    }
    if (chunk.type === 'error') {
      console.error('Error:', chunk.error);
    }
    if (chunk.type === 'done') {
      console.log('\n完成');
      console.log('Response:', response);
    }
  }
}

test().catch(err => console.error('Error:', err));
