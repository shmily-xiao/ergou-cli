#!/usr/bin/env node

import { fetch } from 'undici';

// 尝试不同的 API Key 格式
const API_KEYS = [
  'sk-sp-f393fa20e4da46ef84c2188e949d47ba',
  'sk-sp-f393fa20e4da46ef84c2188e949d47ba',
];

const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

async function test() {
  console.log('🧪 测试阿里云 API (不同 Key 格式)...\n');
  
  for (const apiKey of API_KEYS) {
    console.log(`测试 Key: ${apiKey.substring(0, 10)}...`);
    
    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen3.5-plus',
          messages: [{ role: 'user', content: 'Hello' }],
          stream: false,
        }),
      });
      
      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 成功!');
        console.log('Content:', data.choices?.[0]?.message?.content?.substring(0, 100));
        return;
      } else {
        const error = await response.text();
        console.log('❌ 失败:', error.substring(0, 200));
      }
    } catch (err) {
      console.log('❌ 错误:', err.message);
    }
    
    console.log('');
  }
}

test().catch(console.error);
