#!/usr/bin/env node

/**
 * Ergou CLI - 完整命令系统
 * 基于 claude-code-sourcemap 命令系统重构
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
    console.log('🤖 Ergou CLI - 开始对话');
    console.log(`模型：${options.model || 'auto'}`);
    console.log(`Provider: ${options.provider || 'auto'}`);
    console.log(`工具系统：${options.tools ? '✅ 已启用' : '❌ 未启用'}`);
    console.log('');
    
    // 导入 Provider 系统
    const { ProviderRegistry } = await import('./providers/base.js');
    const registry = ProviderRegistry.getInstance();
    
    // 创建 Provider
    const providerName = options.provider || 'aliyun';
    const provider = await registry.createProvider(providerName, {
      name: providerName,
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
    const { ProviderRegistry } = await import('./providers/base.js');
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
    console.log('⚙️  配置管理');
    console.log('');
    
    if (options.list) {
      console.log('当前配置:');
      console.log('  (配置文件位置：~/.ergou/config.json)');
      console.log('');
      console.log('💡 提示：配置文件尚未实现，使用环境变量配置');
      console.log('');
      console.log('可用环境变量:');
      console.log('  DASHSCOPE_API_KEY   - 阿里云 API Key');
      console.log('  ANTHROPIC_API_KEY   - Anthropic API Key');
      console.log('  DEEPSEEK_API_KEY    - DeepSeek API Key');
      console.log('  OPENAI_API_KEY      - OpenAI API Key');
    } else if (options.set) {
      console.log('⚠️  配置设置尚未实现');
    } else if (options.get) {
      console.log('⚠️  配置获取尚未实现');
    } else {
      console.log('用法:');
      console.log('  ergou config -l          列出配置');
      console.log('  ergou config -s key=val  设置配置');
      console.log('  ergou config -g key      获取配置');
    }
  });

/**
 * status - 系统状态
 */
program
  .command('status')
  .alias('s')
  .description('显示系统状态')
  .action(() => {
    console.log('🤖 Ergou CLI 状态\n');
    console.log(`版本：v${pkg.version}`);
    console.log(`Node: ${process.version}`);
    console.log(`平台：${process.platform} ${process.arch}`);
    console.log('');
    
    // 检查环境变量
    const envVars = [
      'DASHSCOPE_API_KEY',
      'ANTHROPIC_API_KEY',
      'DEEPSEEK_API_KEY',
      'OPENAI_API_KEY',
    ];
    
    console.log('环境变量:');
    envVars.forEach(key => {
      const value = process.env[key];
      const status = value ? '✅ 已设置' : '❌ 未设置';
      console.log(`  ${key}: ${status}`);
    });
    console.log('');
    
    console.log('💡 提示：至少配置一个 API Key 才能使用对话功能');
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
