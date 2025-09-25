import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { SSHDeployer } from './deployer.js';
import type { DeployConfig } from './types.js';

function showHelp() {
  console.log(chalk.cyan(`
SSH 部署工具

用法:
  ssh-deploy [选项]

选项:
  --config, -c <路径>    配置文件路径 (默认: deploy.config.js)
  --verbose, -v          显示详细输出
  --dry-run, -d          显示将要执行的命令但不实际执行
  --help, -h             显示此帮助信息

配置文件示例:
  export default {
    ssh: {
      host: 'your-server.com',
      username: 'deploy',
      privateKey: '/path/to/key'
    },
    projectPath: '/var/www/project',
    commands: [
      { command: 'git pull', description: '拉取最新代码' },
      { command: 'npm install', description: '安装依赖' },
      { command: 'npm run build', description: '构建项目' }
    ]
  };
  `));
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // Parse arguments
  const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] ||
                    args[args.indexOf('--config') + 1] ||
                    args[args.indexOf('-c') + 1] ||
                    'deploy.config.js';
  
  const verbose = args.includes('--verbose') || args.includes('-v');
  const dryRun = args.includes('--dry-run') || args.includes('-d');

  // Load config
  const fullConfigPath = resolve(process.cwd(), configPath);
  
  if (!existsSync(fullConfigPath)) {
    console.error(chalk.red(`❌ 配置文件未找到: ${fullConfigPath}`));
    console.log(chalk.yellow('请创建 deploy.config.js 文件或使用 --config 指定路径'));
    process.exit(1);
  }

  let config: DeployConfig;
  try {
    // Try to import as ES module first, then CommonJS
    try {
      const module = await import(`file://${fullConfigPath}`);
      config = module.default || module;
    } catch {
      // Fallback to require for CommonJS
      delete require.cache[fullConfigPath];
      config = require(fullConfigPath);
    }
  } catch (error) {
    console.error(chalk.red(`❌ 加载配置失败: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }

  // Validate config
  if (!config.ssh?.host || !config.ssh?.username || !config.projectPath || !config.commands) {
    console.error(chalk.red('❌ 配置无效: 缺少必需字段 (ssh.host, ssh.username, projectPath, commands)'));
    process.exit(1);
  }

  // Deploy
  const deployer = new SSHDeployer(config, { verbose, dryRun });
  const success = await deployer.deploy();
  
  process.exit(success ? 0 : 1);
}

main().catch(console.error);