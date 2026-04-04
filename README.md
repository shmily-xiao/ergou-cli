# Ergou Code


## 快速启动

### 1. 安装依赖

```bash
bun install
bun link
```

### 2. 创建配置文件

配置文件路径: `~/.ergou/.claude.json`

**最简配置示例:**

```json
{
  "customApiEndpoint": {
    "provider": "openai",
    "baseURL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    "apiKey": "你的API密钥",
    "model": "glm-5"
  }
}
```

### 3. 启动

```bash
ergou
```

---

## 常用 API 配置示例

### 阿里云 DashScope (Anthropic 格式)

```json
{
  "customApiEndpoint": {
    "provider": "anthropic",
    "baseURL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    "apiKey": "你的API密钥",
    "model": "glm-5"
  }
}
```

### 阿里云 DashScope (OpenAI 格式)

```json
{
  "customApiEndpoint": {
    "provider": "openai",
    "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "apiKey": "你的API密钥",
    "model": "glm-5"
  }
}
```

### 其他 OpenAI 兼容接口

```json
{
  "customApiEndpoint": {
    "provider": "openai",
    "baseURL": "https://your-api-endpoint/v1",
    "apiKey": "你的API密钥",
    "model": "你的模型名"
  }
}
```

---

## 配置字段说明

| 字段 | 说明 |
|------|------|
| `provider` | `"anthropic"` 或 `"openai"` |
| `baseURL` | API 接口地址 |
| `apiKey` | API 密钥 |
| `model` | 默认模型名称 |

---

## 与原版的区别

| 项目 | Claude Code | Ergou Code |
|------|-------------|------------|
| 配置目录 | `~/.claude` | `~/.ergou` |
| 配置文件 | `.claude.json` | `.claude.json` |
| 命令名 | `claude` | `ergou` |
| 自定义 API | 不支持 | 支持 |

---

## 更新

```bash
git pull
bun install
bun link
```