export { SSHDeployer } from './deployer.js';
export type { SSHConfig, DeployCommand, DeployConfig, DeployOptions } from './types.js';

// 默认命令模板
export const defaultCommands = {
  frontend: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'npm install', description: '安装依赖' },
    { command: 'npm run build', description: '构建项目' },
    { command: 'pm2 restart app || npm start', description: '重启应用' }
  ],
  
  pnpm: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'pnpm install', description: '安装依赖' },
    { command: 'pnpm build && pnpm stop && pnpm start', description: '构建并重启' }
  ],

  docker: [
    { command: 'git pull', description: '拉取最新代码' },
    { command: 'docker-compose down', description: '停止容器' },
    { command: 'docker-compose up -d --build', description: '重新构建并启动容器' }
  ]
};