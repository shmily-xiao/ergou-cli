#!/usr/bin/env node

/**
 * Ergou CLI - 完整命令系统
 * 基于 claude-code-sourcemap 命令系统重构
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getMergedConfig } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json 版本
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('ergou')
  .version(pkg.version)
  .description('🤖 Ergou CLI - 通用大模型 Agent 工具 (基于 Claude Code 重构)');

// ========== 核心命令 ==========

/**
 * chat - 开始对话
 */
program
  .command('chat [message...]')
  .alias('c')
  .description('开始对话或执行单条消息')
  .option('-m, --model <model>', '指定模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .option('-s, --stream', '流式输出', true)
  .option('-t, --tools', '启用工具系统', false)
  .option('--non-interactive', '非交互模式')
  .action(async (message, options) => {
    // 先导入所有 Provider 以触发注册
    await import('./providers/aliyun.js');
    await import('./providers/anthropic.js');
    await import('./providers/deepseek.js');
    await import('./providers/openai.js');
    
    // 加载配置
    const config = await getMergedConfig();
    
    console.log('🤖 Ergou CLI - 开始对话');
    console.log(`模型：${options.model || config.defaultModel || 'auto'}`);
    console.log(`Provider: ${options.provider || config.defaultProvider || 'auto'}`);
    console.log(`工具系统：${options.tools ? '✅ 已启用' : '❌ 未启用'}`);
    console.log('');
    
    // 导入 Provider 系统
    const { ProviderRegistry } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    
    // 创建 Provider (使用配置中的 API Key)
    const providerName = options.provider || config.defaultProvider || 'aliyun';
    const providerConfig = config.providers?.[providerName as keyof typeof config.providers];
    
    const provider = await registry.createProvider(providerName, {
      name: providerName,
      apiKey: providerConfig?.apiKey,
      baseUrl: providerConfig?.baseUrl,
    });
    
    const models = await provider.listModels();
    const selectedModel = options.model || provider.defaultModel;
    
    console.log(`✅ 已加载 ${models.length} 个模型`);
    console.log(`📍 使用模型：${selectedModel}`);
    
    // 如果有消息，直接执行
    if (message.length > 0) {
      const query = message.join(' ');
      console.log('');
      console.log(`📤 执行：${query}`);
      console.log('');
      
      try {
        const stream = provider.chat([{ role: 'user', content: query }], {
          model: selectedModel,
          stream: options.stream,
        });
        
        let response = '';
        for await (const chunk of stream) {
          if (chunk.type === 'content' && chunk.content) {
            response += chunk.content;
            process.stdout.write(chunk.content);
          }
          
          if (chunk.type === 'done' && chunk.usage) {
            console.log('');
            console.log(`📊 Token: ${chunk.usage.inputTokens} → ${chunk.usage.outputTokens}`);
          }
        }
        
        console.log('');
      } catch (error) {
        console.error('❌ 错误:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
      return;
    }
    
    // 交互模式
    console.log('💬 输入消息开始对话 (输入 "quit" 退出):');
    console.log('');
    
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const messages: any[] = [];
    
    const ask = async () => {
      rl.question('> ', async (input) => {
        if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
          console.log('👋 再见！');
          rl.close();
          return;
        }
        
        messages.push({ role: 'user', content: input });
        
        try {
          const stream = provider.chat(messages, {
            model: selectedModel,
            stream: options.stream,
          });
          
          let response = '';
          for await (const chunk of stream) {
            if (chunk.type === 'content' && chunk.content) {
              response += chunk.content;
              process.stdout.write(chunk.content);
            }
          }
          
          messages.push({ role: 'assistant', content: response });
        } catch (error) {
          console.error('❌ 错误:', error instanceof Error ? error.message : error);
        }
        
        console.log('');
        ask();
      });
    };
    
    ask();
  });

/**
 * models - 列出模型
 */
program
  .command('models')
  .alias('m')
  .description('列出可用模型')
  .option('-p, --provider <provider>', '指定 Provider')
  .action(async (options) => {
    // 先导入所有 Provider 以触发注册
    await import('./providers/aliyun.js');
    await import('./providers/anthropic.js');
    await import('./providers/deepseek.js');
    await import('./providers/openai.js');
    
    const { ProviderRegistry, getAvailableProviders } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    
    const providerName = options.provider || 'aliyun';
    
    try {
      const provider = await registry.createProvider(providerName, {
        name: providerName,
      });
      
      const models = await provider.listModels();
      
      console.log(`\n📚 ${providerName} 可用模型:\n`);
      
      models.forEach((model, i) => {
        console.log(`${i + 1}. ${model.id}`);
        console.log(`   显示名：${model.displayName}`);
        console.log(`   上下文：${model.contextWindow.toLocaleString()} tokens`);
        if (model.maxOutputTokens) {
          console.log(`   最大输出：${model.maxOutputTokens.toLocaleString()} tokens`);
        }
        if (model.pricing) {
          console.log(`   价格：$${model.pricing.inputPerMillion}/$${model.pricing.outputPerMillion} per 1M`);
        }
        console.log('');
      });
    } catch (error) {
      console.error('❌ 错误:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * providers - 列出 Provider
 */
program
  .command('providers')
  .alias('p')
  .description('列出可用 Provider')
  .action(async () => {
    // 先导入所有 Provider 以触发注册
    await import('./providers/aliyun.js');
    await import('./providers/anthropic.js');
    await import('./providers/deepseek.js');
    await import('./providers/openai.js');
    
    const { ProviderRegistry } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    const providers = registry.listProviders();
    
    console.log('\n🔌 可用 Provider:\n');
    
    providers.forEach((provider, i) => {
      console.log(`${i + 1}. ${provider}`);
    });
    
    console.log('\n使用 -p 或 --provider 指定 Provider\n');
  });

/**
 * config - 配置管理
 */
program
  .command('config [action]')
  .alias('cfg')
  .description('配置管理')
  .option('-l, --list', '列出配置')
  .option('-s, --set <key=value>', '设置配置')
  .option('-g, --get <key>', '获取配置')
  .action(async (action, options) => {
    const { loadConfig, saveConfig, getMergedConfig } = await import('./config/index.js');
    
    console.log('⚙️  配置管理');
    console.log('');
    
    if (options.list) {
      const config = await getMergedConfig();
      
      console.log('配置文件位置：~/.ergou/config.json');
      console.log('');
      console.log('当前配置:');
      console.log(`  默认 Provider: ${config.defaultProvider}`);
      console.log(`  默认模型：${config.defaultModel}`);
      console.log('');
      
      console.log('Provider API Keys:');
      if (config.providers?.aliyun?.apiKey) {
        console.log(`  ✅ 阿里云：已配置 (${maskKey(config.providers.aliyun.apiKey)})`);
      } else {
        console.log(`  ❌ 阿里云：未配置 (DASHSCOPE_API_KEY)`);
      }
      
      if (config.providers?.anthropic?.apiKey) {
        console.log(`  ✅ Anthropic：已配置 (${maskKey(config.providers.anthropic.apiKey)})`);
      } else {
        console.log(`  ❌ Anthropic：未配置 (ANTHROPIC_API_KEY)`);
      }
      
      if (config.providers?.deepseek?.apiKey) {
        console.log(`  ✅ DeepSeek：已配置 (${maskKey(config.providers.deepseek.apiKey)})`);
      } else {
        console.log(`  ❌ DeepSeek：未配置 (DEEPSEEK_API_KEY)`);
      }
      
      if (config.providers?.openai?.apiKey) {
        console.log(`  ✅ OpenAI：已配置 (${maskKey(config.providers.openai.apiKey)})`);
      } else {
        console.log(`  ❌ OpenAI：未配置 (OPENAI_API_KEY)`);
      }
      
      console.log('');
      console.log('UI 配置:');
      console.log(`  主题：${config.ui?.theme || 'dark'}`);
      console.log(`  显示 Token 使用：${config.ui?.showTokenUsage ? '✅' : '❌'}`);
      console.log(`  显示成本：${config.ui?.showCost ? '✅' : '❌'}`);
    } else if (options.set) {
      const [key, value] = options.set.split('=');
      if (!key || !value) {
        console.log('❌ 错误：格式应为 key=value');
        return;
      }
      
      const config = await loadConfig();
      
      // 简单实现，后续完善
      console.log(`⚠️  配置设置 "${key}=${value}" 尚未完全实现`);
      console.log('💡 提示：请直接编辑 ~/.ergou/config.json 文件');
    } else if (options.get) {
      const config = await loadConfig();
      console.log('⚠️  配置获取尚未完全实现');
      console.log('💡 提示：使用 ergou config -l 查看所有配置');
    } else {
      console.log('用法:');
      console.log('  ergou config -l          列出配置');
      console.log('  ergou config -s key=val  设置配置');
      console.log('  ergou config -g key      获取配置');
      console.log('');
      console.log('示例:');
      console.log('  ergou config -l');
      console.log('  ergou config -s defaultProvider=anthropic');
    }
  });

/**
 * 脱敏显示 API Key
 */
function maskKey(key: string): string {
  if (key.length <= 8) return '***';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

/**
 * status - 系统状态
 */
program
  .command('status')
  .alias('s')
  .description('显示系统状态')
  .action(async () => {
    const { getMergedConfig } = await import('./config/index.js');
    const config = await getMergedConfig();
    
    console.log('🤖 Ergou CLI 状态\n');
    console.log(`版本：v${pkg.version}`);
    console.log(`Node: ${process.version}`);
    console.log(`平台：${process.platform} ${process.arch}`);
    console.log('');
    
    // 检查配置
    console.log('配置状态:');
    console.log(`  默认 Provider: ${config.defaultProvider}`);
    console.log(`  默认模型：${config.defaultModel}`);
    console.log('');
    
    // 检查 API Keys
    const hasAnyKey = !!(
      config.providers?.aliyun?.apiKey ||
      config.providers?.anthropic?.apiKey ||
      config.providers?.deepseek?.apiKey ||
      config.providers?.openai?.apiKey
    );
    
    console.log('API Keys:');
    if (config.providers?.aliyun?.apiKey) {
      console.log(`  ✅ 阿里云：已配置`);
    } else {
      console.log(`  ❌ 阿里云：未配置`);
    }
    
    if (config.providers?.anthropic?.apiKey) {
      console.log(`  ✅ Anthropic：已配置`);
    } else {
      console.log(`  ❌ Anthropic：未配置`);
    }
    
    if (config.providers?.deepseek?.apiKey) {
      console.log(`  ✅ DeepSeek：已配置`);
    } else {
      console.log(`  ❌ DeepSeek：未配置`);
    }
    
    if (config.providers?.openai?.apiKey) {
      console.log(`  ✅ OpenAI：已配置`);
    } else {
      console.log(`  ❌ OpenAI：未配置`);
    }
    
    console.log('');
    
    if (hasAnyKey) {
      console.log('✅ 状态正常，可以开始使用！');
      console.log('');
      console.log('快速开始:');
      console.log('  ergou chat                    # 开始对话');
      console.log('  ergou chat "写个快速排序"      # 单条消息');
    } else {
      console.log('⚠️  未配置任何 API Key');
      console.log('');
      console.log('配置方法:');
      console.log('  1. 环境变量 (推荐用于测试):');
      console.log('     export DASHSCOPE_API_KEY=your-key');
      console.log('');
      console.log('  2. 配置文件 (推荐用于生产):');
      console.log('     编辑 ~/.ergou/config.json');
    }
  });

/**
 * version - 显示版本
 */
program
  .command('version')
  .alias('v')
  .description('显示版本号')
  .action(() => {
    console.log(`ergou-cli v${pkg.version}`);
  });

// ========== 帮助优化 ==========

program.addHelpText('after', `

📚 使用示例:

  # 开始对话
  $ ergou chat
  
  # 单条消息
  $ ergou chat "解释一下这段代码"
  
  # 指定 Provider 和模型
  $ ergou chat -p aliyun -m qwen3.5-plus
  
  # 启用工具系统
  $ ergou chat --tools
  
  # 列出模型
  $ ergou models -p anthropic
  
  # 查看状态
  $ ergou status

🔗 相关链接:

  GitHub: https://github.com/shmily-xiao/ergou-cli
  文档：/Users/shmily/workspace/ergou-cli/docs/
`);

program.parse();

// 如果没有命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
