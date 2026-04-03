#!/usr/bin/env node

import { fetch } from 'undici';

const API_KEY = 'sk-sp-f393fa20e4da46ef84c2188e949d47ba';
const BASE_URL = 'https://coding.dashscope.aliyuncs.com/v1';

async function test() {
  console.log('🧪 测试阿里云 API...\n');
  
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen3.5-plus',
      messages: [{ role: 'user', content: '写一个快速排序，TypeScript' }],
      stream: false,
    }),
  });
  
  console.log('Status:', response.status);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Error:', error);
    return;
  }
  
  const data = await response.json();
  console.log('\\n✅ 响应成功!');
  console.log('Content:', data.choices?.[0]?.message?.content);
}

test().catch(console.error);
