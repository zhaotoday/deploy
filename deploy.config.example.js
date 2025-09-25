// 部署配置示例
export default {
  ssh: {
    host: 'your-server.com',
    username: 'deploy',
    // 使用密码或私钥其中一种
    password: 'your-password',
    // privateKey: '/path/to/private/key',
    port: 22
  },
  projectPath: '/var/www/your-project',
  commands: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'pnpm install', description: '安装依赖' },
    { command: 'pnpm build && pnpm stop && pnpm start', description: '构建并重启' }
  ]
};

// 其他配置示例：

// npm 项目：
/*
export default {
  ssh: { host: 'server.com', username: 'user', privateKey: '~/.ssh/id_rsa' },
  projectPath: '/var/www/project',
  commands: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'npm install', description: '安装依赖' },
    { command: 'npm run build', description: '构建项目' },
    { command: 'pm2 restart app', description: '使用 PM2 重启' }
  ]
};
*/

// Docker 项目：
/*
export default {
  ssh: { host: 'server.com', username: 'user', privateKey: '~/.ssh/id_rsa' },
  projectPath: '/var/www/project',
  commands: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'docker-compose down', description: '停止容器' },
    { command: 'docker-compose up -d --build', description: '重新构建容器' }
  ]
};
*/