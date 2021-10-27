import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as io from '@actions/io';
import * as os from 'os';
import { buildCommandLine } from './helpers';
import { execSync } from 'child_process';
import { sep } from 'path';

async function run(): Promise<void> {
  try {
    const docker: string = await io.which('docker', true);
    const containerWorkspace = '/workspace';
    const githubWorkspace = process.env['GITHUB_WORKSPACE'] || process.cwd();
    const image: string = core.getInput('image') || 'quay.io/utilitywarehouse/docker-wix';
    const msiName: string = core.getInput('name', { required: true });
    const sourceFile: string = core.getInput('sourceFiles', { required: true });
    const outputDir: string = core.getInput('outputDir', { required: true });
    const architecture: string = core.getInput('architecture');
    const extensions: string = core.getInput('extensions');
    const candleExtraArguments: string = core.getInput('candleExtraArguments');
    const lightExtraArguments: string = core.getInput('lightExtraArguments');
    const candleExe: string = core.getInput('candleExecutable');
    const lightExe: string = core.getInput('lightExecutable');
    const args = buildCommandLine(
      msiName,
      sourceFile,
      containerWorkspace,
      outputDir,
      architecture,
      extensions,
      candleExtraArguments,
      lightExtraArguments,
      candleExe,
      lightExe,
    );

    core.startGroup('Pulling WiX Toolset Docker image');
    await exec.exec(docker, ['pull', image]);
    core.endGroup();

    core.startGroup('Build MSI using Candle & Light');
    const envFile = `${os.tmpdir()}${sep}env.txt`;
    fs.writeFileSync(envFile, execSync(`env`, { encoding: 'utf8' }).trim());
    core.info(`Building the MSI using the following commands: ${args}`);
    await exec.exec(docker, [
      'run',
      '--rm',
      '--env-file',
      envFile,
      '--workdir',
      containerWorkspace,
      '--volume',
      `${githubWorkspace}:${containerWorkspace}`,
      image,
      'sh',
      '-c',
      args,
    ]);
    fs.unlinkSync(envFile);
    core.endGroup();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
