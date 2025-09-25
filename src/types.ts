export interface SSHConfig {
  host: string;
  username: string;
  password?: string;
  privateKey?: string;
  port?: number;
}

export interface DeployCommand {
  command: string;
  description: string;
  cwd?: string;
}

export interface DeployConfig {
  ssh: SSHConfig;
  projectPath: string;
  commands: DeployCommand[];
}

export interface DeployOptions {
  verbose?: boolean;
  dryRun?: boolean;
}