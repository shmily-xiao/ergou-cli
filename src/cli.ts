#!/usr/bin/env node

/**
 * Ergou CLI - 主入口
 * 通用大模型终端 Agent 工具
 */

import { Command } from 'commander';
import { ProviderRegistry } from './providers/base';
import { toolRegistry } from './tools/registry';
import type { Message, ChatOptions } from './types';

const pkg = {
  name: 'ergou-cli',
  version: '0.2.0',
  description: 'Universal LLM-powered coding agent',
};

const program = new Command();

program
  .name(pkg.name)
  .version(pkg.version)
  .description(pkg.description);

program
  .command('chat')
  .description('开始对话')
  .option('-m, --model <model>', '指定模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .option('-s, --stream', '流式输出', true)
  .option('-t, --tools', '启用工具系统', false)
  .action(async (options) => {
    console.log('🤖 Ergou CLI - 开始对话');
    console.log(`模型：${options.model || 'auto'}`);
    console.log(`Provider: ${options.provider || 'auto'}`);
    console.log(`工具系统：${options.tools ? '✅ 已启用' : '❌ 未启用'}`);
    console.log('');
    
    const registry = ProviderRegistry.getInstance();
    
    // 自动选择 Provider
    let provider;
    if (options.provider) {
      provider = await registry.createProvider(options.provider, {
        name: options.provider,
      });
    } else {
      // 默认使用阿里云
      provider = await registry.createProvider('aliyun', {
        name: 'aliyun',
      });
    }
    
    const models = await provider.listModels();
    const selectedModel = options.model || provider.defaultModel;
    
    console.log(`✅ 已加载 ${models.length} 个模型`);
    console.log(`📍 使用模型：${selectedModel}`);
    
    // 初始化工具系统
    if (options.tools) {
      const tools = toolRegistry.list();
      console.log(`🔧 已加载 ${tools.length} 个工具：${tools.join(', ')}`);
    }
    console.log('');
    
    // 交互模式
    console.log('💬 输入消息开始对话 (输入 "quit" 退出):');
    console.log('');
    
    const messages: Message[] = [];
    
    // 简单的 REPL
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const ask = async () => {
      rl.question('> ', async (input) => {
        if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
          console.log('👋 再见！');
          rl.close();
          return;
        }
        
        messages.push({
          role: 'user',
          content: input,
        });
        
        console.log('');
        console.log('🤖 思考中...');
        console.log('');
        
        try {
          const chatOptions: ChatOptions = {
            model: selectedModel,
            stream: options.stream,
          };
          
          // 如果启用工具，添加工具定义
          if (options.tools) {
            chatOptions.tools = toolRegistry.getToolDefinitions();
          }
          
          const stream = provider.chat(messages, chatOptions);
          
          let response = '';
          let hasToolUse = false;
          
          for await (const chunk of stream) {
            if (chunk.type === 'content' && chunk.content) {
              response += chunk.content;
              process.stdout.write(chunk.content);
            }
            
            if (chunk.type === 'tool_use') {
              hasToolUse = true;
              const toolName = chunk.toolName || 'unknown';
              const toolInput = chunk.toolInput || {};
              
              console.log('');
              console.log(`🔧 使用工具：${toolName}`);
              console.log(`参数：`, JSON.stringify(toolInput, null, 2));
              console.log('');
              
              // 执行工具
              const toolResult = await executeTool(toolName, toolInput);
              console.log('工具结果:', toolResult);
              
              // 添加工具使用到消息
              const toolUseId = chunk.toolUseId || `tool_${Date.now()}`;
              
              messages.push({
                role: 'assistant',
                content: response,
              });
              
              messages.push({
                role: 'user',
                content: [{
                  type: 'tool_result',
                  tool_use_id: toolUseId,
                  content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult, null, 2),
                }],
              });
              
              // 继续对话
              console.log('🤖 继续处理...');
              console.log('');
              await ask();
              return;
            }
            
            if (chunk.type === 'error') {
              console.error('❌ 错误:', chunk.error);
            }
            
            if (chunk.type === 'done') {
              console.log('');
              console.log('');
              if (chunk.usage) {
                console.log(`📊 Token 使用：`);
                console.log(`   输入：${chunk.usage.inputTokens}`);
                console.log(`   输出：${chunk.usage.outputTokens}`);
                console.log(`   总计：${chunk.usage.totalTokens || chunk.usage.inputTokens + chunk.usage.outputTokens}`);
              }
              console.log('');
            }
          }
          
          if (!hasToolUse) {
            messages.push({
              role: 'assistant',
              content: response,
            });
          }
        } catch (error) {
          console.error('❌ 错误:', error instanceof Error ? error.message : error);
        }
        
        console.log('');
        ask();
      });
    };
    
    ask();
  });

program
  .command('models')
  .description('列出可用模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .action(async (options) => {
    console.log('📚 可用模型列表');
    console.log('');
    
    const registry = ProviderRegistry.getInstance();
    const providerName = options.provider || 'aliyun';
    
    try {
      const provider = await registry.createProvider(providerName, {
        name: providerName,
      });
      
      const models = await provider.listModels();
      
      console.log(`Provider: ${providerName}`);
      console.log(`默认模型：${provider.defaultModel}`);
      console.log('');
      console.log('模型列表:');
      console.log('');
      
      models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.id}`);
        console.log(`   显示名：${model.displayName}`);
        console.log(`   上下文：${model.contextWindow.toLocaleString()} tokens`);
        if (model.maxOutputTokens) {
          console.log(`   最大输出：${model.maxOutputTokens.toLocaleString()} tokens`);
        }
        if (model.pricing) {
          console.log(`   价格：$${model.pricing.inputPerMillion}/$${model.pricing.outputPerMillion} per 1M tokens`);
        }
        console.log('');
      });
    } catch (error) {
      console.error('❌ 错误:', error instanceof Error ? error.message : error);
    }
  });

program
  .command('providers')
  .description('列出可用 Provider')
  .action(() => {
    const registry = ProviderRegistry.getInstance();
    const providers = registry.listProviders();
    
    console.log('🔌 可用 Provider:');
    console.log('');
    
    providers.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider}`);
    });
    
    console.log('');
    console.log('使用 -p 或 --provider 指定 Provider');
  });

/**
 * 执行工具
 */
async function executeTool(name: string, input: Record<string, unknown>): Promise<any> {
  try {
    console.log(`🔧 执行工具：${name}`);
    
    const result = await toolRegistry.execute(name, input);
    
    console.log(`✅ 工具执行完成`);
    return result;
  } catch (error) {
    console.error(`❌ 工具执行失败:`, error instanceof Error ? error.message : error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

program.parse();

// 如果没有命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
