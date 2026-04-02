# 🎯 Agent 监控大盘使用指南

## 📋 问题说明

**问题**: monitor.html 是静态页面，浏览器无法直接读取本地 JSON 文件（CORS 限制）

**解决方案**: 使用 HTTP 服务器提供文件访问

---

## 🚀 快速启动

### 方式 1: 使用启动脚本（推荐）

```bash
cd /Users/shmily/workspace/ergou-cli
chmod +x start-monitor.sh
./start-monitor.sh
```

然后在浏览器打开：**http://localhost:8080/monitor.html**

### 方式 2: 手动启动 Python 服务器

```bash
cd /Users/shmily/workspace/ergou-cli
python3 -m http.server 8080
```

然后在浏览器打开：**http://localhost:8080/monitor.html**

### 方式 3: 使用 http-server

```bash
cd /Users/shmily/workspace/ergou-cli
npx http-server -p 8080
```

然后在浏览器打开：**http://localhost:8080/monitor.html**

### 方式 4: 部署到 GitHub Pages（推荐用于远程访问）

1. 启用 GitHub Pages:
   - GitHub 仓库 → Settings → Pages
   - Source: Deploy from branch → main → / (root)
   - Save

2. 访问: `https://你的用户名.github.io/ergou-cli/monitor.html`

3. 数据会自动从 GitHub 读取

---

## 📊 数据更新

### 自动更新流程

```
1. Agent 执行任务
   ↓
2. 更新 AGENT_STATUS.json
   ↓
3. monitor.html 每 60 秒自动 fetch
   ↓
4. 页面自动刷新显示最新状态
```

### 手动更新数据

```bash
# 编辑 AGENT_STATUS.json
vim AGENT_STATUS.json

# 页面会在下次刷新时自动读取新数据
```

---

## 🔧 配置选项

### 修改刷新间隔

编辑 `monitor.html`:

```javascript
const CONFIG = {
    refreshInterval: 60,  // 修改为其他秒数，如 30 或 120
    dataFile: 'AGENT_STATUS.json',
    logFile: 'logs/agent-status.log'
};
```

### 修改端口

```bash
# 启动时指定端口
./start-monitor.sh 3000

# 或手动指定
python3 -m http.server 3000
```

---

## 📈 监控功能

### 实时显示

| 模块 | 更新频率 | 内容 |
|------|---------|------|
| Agent 状态 | 60 秒 | 工作状态、任务、进度 |
| 任务队列 | 60 秒 | 进行中、待执行、已完成 |
| 性能指标 | 60 秒 | 统计数据 |
| 执行日志 | 60 秒 | 最新日志 |

### 状态标识

- 🟢 **空闲** - Agent 可以接受新任务
- 🟡 **工作中** - Agent 正在执行任务
- 🔵 **审查中** - 等待代码审查
- ✅ **已完成** - 任务完成
- 🔴 **失败** - 任务失败

---

## 🐛 故障排除

### 问题 1: 页面显示"数据加载失败"

**原因**: 直接打开 file:// 协议，无法 fetch JSON

**解决**:
```bash
# 必须使用 HTTP 服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080/monitor.html
```

### 问题 2: 端口被占用

**解决**:
```bash
# 查看占用端口的进程
lsof -ti:8080

# 关闭进程
lsof -ti:8080 | xargs kill

# 或使用其他端口
./start-monitor.sh 3000
```

### 问题 3: 数据不更新

**检查**:
1. AGENT_STATUS.json 是否存在
2. JSON 格式是否正确
3. 浏览器控制台是否有错误

**解决**:
```bash
# 验证 JSON 格式
cat AGENT_STATUS.json | python3 -m json.tool

# 强制刷新页面
Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)
```

### 问题 4: GitHub Pages 数据不更新

**原因**: GitHub Pages 缓存

**解决**:
1. 等待几分钟让 GitHub 刷新
2. 强制刷新浏览器缓存
3. 或者在 URL 后添加时间戳:
   `monitor.html?t=1234567890`

---

## 🎨 自定义

### 添加新 Agent

编辑 `AGENT_STATUS.json`:

```json
{
  "agents": {
    "new-agent": {
      "status": "idle",
      "currentTask": null,
      "taskName": null,
      "model": "qwen3.5-plus",
      "progress": null
    }
  }
}
```

### 修改主题颜色

编辑 `monitor.html` 中的 CSS:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* 修改为你喜欢的颜色 */
}
```

---

## 📱 移动端访问

如果部署到服务器或 GitHub Pages，可以在手机上访问：

```
http://你的服务器 IP:8080/monitor.html
```

---

## 🔗 相关链接

- 项目仓库：https://github.com/shmily-xiao/ergou-cli
- 监控页面：monitor.html
- 状态文件：AGENT_STATUS.json
- 日志目录：logs/

---

_最后更新：2026-04-02_
_版本：1.0.0_
