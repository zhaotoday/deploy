import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync } from 'fs';
import type { DeployConfig, DeployOptions, DeployCommand } from './types.js';

export class SSHDeployer {
  private ssh = new NodeSSH();
  private config: DeployConfig;
  private options: DeployOptions;

  constructor(config: DeployConfig, options: DeployOptions = {}) {
    this.config = config;
    this.options = options;
  }

  async deploy(): Promise<boolean> {
    const spinner = ora('正在连接服务器...').start();

    try {
      // 连接服务器
      await this.connect();
      spinner.succeed(chalk.green(`✅ 已连接到 ${this.config.ssh.host}`));

      // 执行命令
      for (const cmd of this.config.commands) {
        const success = await this.executeCommand(cmd);
        if (!success) {
          console.log(chalk.red('\n❌ 部署失败'));
          return false;
        }
      }

      console.log(chalk.green('\n🎉 部署完成！'));
      return true;

    } catch (error) {
      spinner.fail(chalk.red('❌ 连接失败'));
      console.error(chalk.red(`错误: ${error instanceof Error ? error.message : error}`));
      return false;
    } finally {
      this.disconnect();
    }
  }

  private async connect(): Promise<void> {
    const { ssh } = this.config;
    
    await this.ssh.connect({
      host: ssh.host,
      username: ssh.username,
      password: ssh.password,
      privateKey: ssh.privateKey ? readFileSync(ssh.privateKey) : undefined,
      port: ssh.port || 22,
      readyTimeout: 20000,
    });
  }

  private async executeCommand(cmd: DeployCommand): Promise<boolean> {
    const spinner = ora(cmd.description).start();

    if (this.options.dryRun) {
      spinner.succeed(chalk.blue(`[试运行] ${cmd.description}: ${cmd.command}`));
      return true;
    }

    try {
      if (this.options.verbose) {
        console.log(chalk.blue(`\n📝 执行命令: ${cmd.command}`));
      }

      const result = await this.ssh.execCommand(cmd.command, {
        cwd: cmd.cwd || this.config.projectPath,
        onStdout: this.options.verbose ? (chunk) => process.stdout.write(chalk.gray(chunk.toString())) : undefined,
        onStderr: this.options.verbose ? (chunk) => process.stderr.write(chalk.yellow(chunk.toString())) : undefined,
      });

      if (result.code === 0) {
        spinner.succeed(chalk.green(`✅ ${cmd.description}`));
        return true;
      } else {
        spinner.fail(chalk.red(`❌ ${cmd.description}`));
        if (result.stderr) {
          console.error(chalk.red(`错误: ${result.stderr}`));
        }
        return false;
      }
    } catch (error) {
      spinner.fail(chalk.red(`❌ ${cmd.description}`));
      console.error(chalk.red(`错误: ${error instanceof Error ? error.message : error}`));
      return false;
    }
  }

  private disconnect(): void {
    if (this.ssh.isConnected()) {
      this.ssh.dispose();
    }
  }
}