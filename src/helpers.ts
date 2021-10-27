export function buildCommandLine(
  msiName: string,
  sourceFile: string,
  workspace: string,
  outputDir: string,
  architecture?: string,
  extensions?: string,
  candleExtraArguments?: string,
  lightExtraArguments?: string,
  candlePath?: string,
  lightPath?: string,
): string {
  const workspaceRoot = `z:${workspace}`;
  const sourceFiles = sourceFile.split(',');

  const lightCmd: string = buildLightCommandLine(
    sourceFiles,
    workspaceRoot,
    msiName,
    outputDir,
    extensions,
    lightExtraArguments,
    lightPath,
  );

  const candleCmd: string = buildCandleCommandLine(
    sourceFiles,
    workspaceRoot,
    architecture,
    extensions,
    candleExtraArguments,
    candlePath,
  );

  return `${candleCmd} && ${lightCmd}`;
}

export function buildCandleCommandLine(
  sourceFiles: string[],
  workspaceRoot: string,
  architecture?: string,
  extensions?: string,
  candleExtraArguments?: string,
  candlePath?: string,
): string {
  const candleCmd: string[] = [];
  candleCmd.push(candlePath || 'candle');
  candleCmd.push('-nologo');
  candleCmd.push(`-o ${workspaceRoot}/`);
  if (architecture) {
    candleCmd.push(`-arch ${architecture}`);
  }
  if (candleExtraArguments) {
    candleCmd.push(candleExtraArguments);
  }

  if (extensions) {
    candleCmd.push(`-ext ${extensions}`);
  }

  for (const wixFile of sourceFiles) {
    candleCmd.push(`${workspaceRoot}/${wixFile.trim()}`);
  }
  return candleCmd.join(' ');
}

export function buildLightCommandLine(
  sourceFiles: string[],
  workspaceRoot: string,
  msiName: string,
  outputDir: string,
  extensions?: string | undefined,
  lightExtraArguments?: string | undefined,
  lightPath?: string | undefined,
): string {
  const msiPath = `${workspaceRoot}/${outputDir}/${msiName}.msi`;

  const lightCmd: string[] = [];
  lightCmd.push(lightPath || 'light');
  lightCmd.push('-nologo');

  if (lightExtraArguments) {
    lightCmd.push(lightExtraArguments);
  }

  if (extensions) {
    lightCmd.push(`-ext ${extensions}`);
  }
  lightCmd.push('-spdb');
  lightCmd.push(`-o ${msiPath}`);
  lightCmd.push(`-b ${workspaceRoot}`);
  lightCmd.push('-sval');

  for (const wixFile of sourceFiles) {
    const filename = wixFile.split('/').pop()?.split('.')[0];
    lightCmd.push(`${workspaceRoot}/${filename}.wixobj`);
  }
  return lightCmd.join(' ');
}
