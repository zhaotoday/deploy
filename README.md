# SSH 部署工具

一个简单的 SSH 部署工具，适用于前端项目。

## 安装

```bash
npm install -g ssh-deploy-cli
```

## 使用方法

### 1. 创建配置文件

在项目根目录创建 `deploy.config.js`：

```javascript
export default {
  ssh: {
    host: 'your-server.com',
    username: 'deploy',
    privateKey: '/path/to/private/key', // 或使用密码
    port: 22
  },
  projectPath: '/var/www/your-project',
  commands: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'npm install', description: '安装依赖' },
    { command: 'npm run build', description: '构建项目' },
    { command: 'pm2 restart app', description: '重启应用' }
  ]
};
```

### 2. 开始部署

```bash
# 基本部署
ssh-deploy

# 显示详细输出
ssh-deploy --verbose

# 干运行（显示将要执行的命令但不实际执行）
ssh-deploy --dry-run

# 使用自定义配置文件
ssh-deploy --config my-deploy.config.js
```

## 编程式使用

```javascript
import { SSHDeployer, defaultCommands } from 'ssh-deploy-cli';

const config = {
  ssh: {
    host: 'server.com',
    username: 'user',
    privateKey: '/path/to/key'
  },
  projectPath: '/var/www/project',
  commands: defaultCommands.pnpm // 或 defaultCommands.frontend, defaultCommands.docker
};

const deployer = new SSHDeployer(config, { verbose: true });
await deployer.deploy();
```

## 配置模板

### 前端项目 (npm)
```javascript
commands: [
  { command: 'git pull', description: '拉取最新代码' },
  { command: 'npm install', description: '安装依赖' },
  { command: 'npm run build', description: '构建项目' },
  { command: 'pm2 restart app', description: '重启应用' }
]
```

### 前端项目 (pnpm)
```javascript
commands: [
  { command: 'git pull', description: '拉取最新代码' },
  { command: 'pnpm install', description: '安装依赖' },
  { command: 'pnpm build && pnpm stop && pnpm start', description: '构建并重启' }
]
```

### Docker 项目
```javascript
commands: [
  { command: 'git pull', description: '拉取最新代码' },
  { command: 'docker-compose down', description: '停止容器' },
  { command: 'docker-compose up -d --build', description: '重新构建容器' }
]
```

## 命令行选项

- `--config, -c <路径>` - 配置文件路径（默认：deploy.config.js）
- `--verbose, -v` - 显示详细输出
- `--dry-run, -d` - 显示将要执行的命令但不实际执行
- `--help, -h` - 显示帮助信息

## 许可证

MIT