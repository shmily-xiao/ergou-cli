#!/usr/bin/env node

/**
 * Ergou CLI - 完整命令系统 (带 Agent Loop)
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getMergedConfig } from './config/index.js';
import { runAgentLoop, type ToolDefinition } from './agent-loop.js';
import chalk from 'chalk';
import { toolRegistry } from './tools/registry-complete.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('ergou')
  .version(pkg.version)
  .description('🤖 Ergou CLI - 通用大模型 Agent 工具 (支持工具调用)');

// ========== chat 命令 ==========
program
  .command('chat [message...]')
  .alias('c')
  .description('开始对话或执行单条消息')
  .option('-m, --model <model>', '指定模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .option('-t, --tools', '启用工具系统', false)
  .option('--max-iterations <n>', '最大迭代次数', parseInt, 10)
  .option('-v, --verbose', '详细输出')
  .action(async (message, options) => {
    try {
      await handleChat(message, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ 错误：${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

async function handleChat(message: string[], options: any) {
  // 导入所有 Provider
  await import('./providers/zhipu.js');
  await import('./providers/aliyun.js');
  await import('./providers/anthropic.js');
  await import('./providers/deepseek.js');
  await import('./providers/openai.js');
  
  // 加载配置
  const config = await getMergedConfig();
  
  // 确定 Provider 和 API Key
  let providerName = options.provider || config.defaultProvider || 'zhipu';
  let apiKey: string | undefined;
  
  // 根据 Provider 选择环境变量
  if (providerName === 'aliyun' || providerName === 'qwen') {
    apiKey = process.env.DASHSCOPE_API_KEY;
  } else if (providerName === 'zhipu' || providerName === 'glm') {
    apiKey = process.env.ZHIPU_API_KEY;
  } else if (providerName === 'anthropic' || providerName === 'claude') {
    apiKey = process.env.ANTHROPIC_API_KEY;
  } else if (providerName === 'deepseek') {
    apiKey = process.env.DEEPSEEK_API_KEY;
  } else if (providerName === 'openai' || providerName === 'gpt') {
    apiKey = process.env.OPENAI_API_KEY;
  }
  
  // 如果没有环境变量，使用配置文件
  if (!apiKey && config.providers) {
    const providerConfig = config.providers[providerName as keyof typeof config.providers];
    if (providerConfig && typeof providerConfig === 'object' && 'apiKey' in providerConfig) {
      apiKey = providerConfig.apiKey as string | undefined;
    }
  }
  
  // 确定模型
  const defaultModel = providerName === 'zhipu' ? 'glm-5' : 
                       providerName === 'aliyun' ? 'qwen3.5-plus' :
                       providerName === 'anthropic' ? 'claude-sonnet-4-6' :
                       providerName === 'deepseek' ? 'deepseek-chat' :
                       'gpt-4o';
  
  const model = options.model || config.defaultModel || defaultModel;
  
  // 创建 Provider
  const { ProviderRegistry } = await import('./providers/base.js');
  const registry = ProviderRegistry.getInstance();
  
  const provider = await registry.createProvider(providerName, {
    name: providerName,
    apiKey,
  });
  
  // 显示配置信息
  console.log('🤖 Ergou CLI - 开始对话');
  console.log(`模型：${model}`);
  console.log(`Provider: ${providerName}`);
  console.log(`工具系统：${options.tools ? '✅ 已启用' : '❌ 未启用'}`);
  console.log(`最大迭代：${options.maxIterations}`);
  console.log('');
  
  // 初始化工具
  const tools: ToolDefinition[] = options.tools ? toolRegistry.getDefinitions() : [];
  if (options.tools) {
    console.log('🔧 加载工具...');
    console.log(`  ✅ 已加载 ${tools.length} 个工具 (完整 claude-code 工具集)\n`);
  }
  
  // 准备消息历史
  const messages: any[] = [];
  
  // 如果有消息，直接执行
  if (message.length > 0) {
    const query = message.join(' ');
    console.log(`📤 执行：${query}\n`);
    
    messages.push({ role: 'user', content: query });
    
    // 运行 Agent Loop
    const result = await runAgentLoop({
      provider,
      messages,
      model,
      tools,
      maxIterations: options.maxIterations || 10,
      verbose: options.verbose || false,
      onContent: (content) => {
        process.stdout.write(content);
      },
      onToolCall: (name, args) => {
        console.log(chalk.magenta(`\n🔧 工具：${name}`));
        if (options.verbose) {
          console.log(chalk.gray('参数：'), JSON.stringify(args, null, 2));
        }
      },
      onToolResult: (name, result) => {
        if (result.success !== false) {
          const output = result.output || result.data;
          const preview = typeof output === 'string' 
            ? output.slice(0, 200) + (output.length > 200 ? '...' : '')
            : JSON.stringify(output);
          console.log(chalk.green(`  ✅ 完成：${preview}`));
        } else {
          console.log(chalk.red(`  ❌ 错误：${result.error}`));
        }
      },
      executeTool: async (name, params) => await toolRegistry.execute(name, params),
    });
    
    console.log('');
    if (options.verbose) {
      console.log(chalk.blue('\n📊 统计:'));
      console.log(`  迭代次数：${result.iterations}`);
      console.log(`  工具调用：${result.toolCallsCount}`);
      console.log(`  结束原因：${result.stoppedReason}`);
    }
    
    return;
  }
  
  // 交互模式
  console.log('💬 输入消息开始对话 (输入 "quit" 退出):\n');
  
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
      
      messages.push({ role: 'user', content: input });
      
      console.log('');
      
      // 运行 Agent Loop
      try {
        const result = await runAgentLoop({
          provider,
          messages,
          model,
          maxIterations: options.maxIterations || 10,
          verbose: options.verbose || false,
          onContent: (content) => {
            process.stdout.write(content);
          },
          onToolCall: (name, args) => {
            console.log(chalk.magenta(`\n🔧 工具：${name}`));
            if (options.verbose) {
              console.log(chalk.gray('参数：'), JSON.stringify(args, null, 2));
            }
          },
          onToolResult: (name, result) => {
            if (result.success) {
              const output = result.output || result.data;
              const preview = typeof output === 'string' 
                ? output.slice(0, 200) + (output.length > 200 ? '...' : '')
                : JSON.stringify(output);
              console.log(chalk.green(`  ✅ 完成：${preview}`));
            } else {
              console.log(chalk.red(`  ❌ 错误：${result.error}`));
            }
          },
        });
        
        console.log('');
        
        // 保存 AI 回复到消息历史
        if (result.finalContent) {
          messages.push({ role: 'assistant', content: result.finalContent });
        }
        
      } catch (error) {
        console.error(chalk.red(`\n❌ 错误：${error instanceof Error ? error.message : String(error)}`));
      }
      
      console.log('');
      ask();
    });
  };
  
  ask();
}

// ========== status 命令 ==========
program
  .command('status')
  .alias('s')
  .description('显示系统状态')
  .action(async () => {
    const config = await getMergedConfig();
    
    console.log('🤖 Ergou CLI 状态\n');
    console.log(`版本：v${pkg.version}`);
    console.log(`Node: ${process.version}`);
    console.log(`平台：${process.platform} ${process.arch}`);
    console.log('');
    
    console.log('API Keys:');
    const hasAnyKey = !!(
      process.env.DASHSCOPE_API_KEY ||
      process.env.ZHIPU_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.DEEPSEEK_API_KEY ||
      process.env.OPENAI_API_KEY
    );
    
    if (process.env.DASHSCOPE_API_KEY) {
      console.log('  ✅ 阿里云：已配置');
    } else {
      console.log('  ❌ 阿里云：未配置');
    }
    
    if (process.env.ZHIPU_API_KEY) {
      console.log('  ✅ 智谱 GLM：已配置 ⭐');
    } else {
      console.log('  ❌ 智谱 GLM：未配置');
    }
    
    if (process.env.ANTHROPIC_API_KEY) console.log('  ✅ Anthropic：已配置');
    else console.log('  ❌ Anthropic：未配置');
    
    if (process.env.DEEPSEEK_API_KEY) console.log('  ✅ DeepSeek：已配置');
    else console.log('  ❌ DeepSeek：未配置');
    
    if (process.env.OPENAI_API_KEY) console.log('  ✅ OpenAI：已配置');
    else console.log('  ❌ OpenAI：未配置');
    
    console.log('');
    
    if (hasAnyKey) {
      console.log('✅ 状态正常，可以开始使用！');
      console.log('');
      console.log('快速开始:');
      console.log('  ergou chat                    # 开始对话');
      console.log('  ergou chat "写个快速排序"      # 单条消息');
      console.log('  ergou chat -t                 # 启用工具系统');
    } else {
      console.log('⚠️  未配置任何 API Key');
      console.log('');
      console.log('配置方法:');
      console.log('  export ZHIPU_API_KEY=sk-xxx  # 智谱 GLM (默认)');
      console.log('  export DASHSCOPE_API_KEY=xxx # 阿里云');
    }
  });

// ========== providers 命令 ==========
program
  .command('providers')
  .alias('p')
  .description('列出可用 Provider')
  .action(async () => {
    await import('./providers/zhipu.js');
    await import('./providers/aliyun.js');
    await import('./providers/anthropic.js');
    await import('./providers/deepseek.js');
    await import('./providers/openai.js');
    
    const { ProviderRegistry } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    const providers = registry.listProviders();
    
    console.log('\n🔌 可用 Provider:\n');
    providers.forEach((p, i) => {
      console.log(`${i + 1}. ${p}`);
    });
    console.log('');
  });

// ========== models 命令 ==========
program
  .command('models')
  .alias('m')
  .description('列出可用模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .action(async (options) => {
    await import('./providers/zhipu.js');
    await import('./providers/aliyun.js');
    await import('./providers/anthropic.js');
    await import('./providers/deepseek.js');
    await import('./providers/openai.js');
    
    const { ProviderRegistry } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    
    const providerName = options.provider || 'zhipu';
    
    try {
      const provider = await registry.createProvider(providerName, {
        name: providerName,
      });
      
      const models = await provider.listModels();
      
      console.log(`\n📚 ${providerName} 可用模型:\n`);
      models.forEach((model: any, i: number) => {
        console.log(`${i + 1}. ${model.id}`);
        console.log(`   显示名：${model.displayName}`);
        console.log(`   上下文：${model.contextWindow.toLocaleString()} tokens`);
        if (model.maxOutputTokens) {
          console.log(`   最大输出：${model.maxOutputTokens.toLocaleString()} tokens`);
        }
        console.log('');
      });
    } catch (error) {
      console.error('❌ 错误:', error instanceof Error ? error.message : String(error));
    }
  });

// 注册扩展命令
import { registerExtendedCommands } from './commands-extended.js';
registerExtendedCommands(program);

// 注册更多命令
import { registerMoreCommands } from './commands-more.js';
registerMoreCommands(program);

// 注册批量命令
import { registerAllCommands } from './commands-bulk.js';
import { registerImportantCommands } from './commands-bulk.js';
registerImportantCommands(program);
await registerAllCommands(program);

await program.parseAsync(process.argv);

// 如果没有命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
