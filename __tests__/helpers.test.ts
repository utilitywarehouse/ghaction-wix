import { expect, test } from '@jest/globals';
import { buildCommandLine, buildLightCommandLine, buildCandleCommandLine } from '../src/helpers';

const workspace: string = '/workspace';
const workspaceRoot = `z:${workspace}`;
const outputDir: string = 'msi';
const simpleSourceFile: string = 'wix/simple.wxs';
const simpleSourceFiles: string[] = simpleSourceFile.split(',');
const simpleMsiName: string = 'Simple';
const architecture: string = 'x64';
const extensions: string = 'WixUtilExtension';

const multiMsiName: string = 'Multi';
const multiSourceFile = 'wix/component.wxs, wix/complex.wxs';
const multiCandleExtraArguments: string = '-dlicensePath="./LICENSE"';

test('Simple light command line output', () => {
  const lightCmdLine = buildLightCommandLine(simpleSourceFiles, workspaceRoot, 'Simple', outputDir);
  expect(lightCmdLine).toEqual(
    expect.stringMatching(
      'light -nologo -spdb -o z:/workspace/msi/Simple.msi -b z:/workspace -sval z:/workspace/simple.wixobj',
    ),
  );
});

test('Light command line output with Extensions', () => {
  const lightCmdLine = buildLightCommandLine(
    simpleSourceFiles,
    workspaceRoot,
    'Simple',
    outputDir,
    extensions,
  );
  expect(lightCmdLine).toEqual(
    expect.stringMatching(
      'light -nologo -ext WixUtilExtension -spdb -o z:/workspace/msi/Simple.msi -b z:/workspace -sval z:/workspace/simple.wixobj',
    ),
  );
});

test('Simple Candle command line output', () => {
  const candleCmdLine = buildCandleCommandLine(simpleSourceFiles, workspaceRoot);
  expect(candleCmdLine).toEqual(
    expect.stringMatching('candle -nologo -o z:/workspace/ z:/workspace/wix/simple.wxs'),
  );
});

test('Simple Candle command line output with options', () => {
  const candleCmdLine = buildCandleCommandLine(
    simpleSourceFiles,
    workspaceRoot,
    architecture,
    extensions,
  );
  expect(candleCmdLine).toEqual(
    expect.stringMatching(
      'candle -nologo -o z:/workspace/ -arch x64 -ext WixUtilExtension z:/workspace/wix/simple.wxs',
    ),
  );
});

test('Simple full command line output', () => {
  const cmdLine = buildCommandLine(simpleMsiName, simpleSourceFile, workspace, outputDir);
  expect(cmdLine).toEqual(
    expect.stringMatching(
      'candle -nologo -o z:/workspace/ z:/workspace/wix/simple.wxs && light -nologo -spdb -o z:/workspace/msi/Simple.msi -b z:/workspace -sval z:/workspace/simple.wixobj',
    ),
  );
});

test('Multi source files full command line output', () => {
  const cmdLine = buildCommandLine(
    multiMsiName,
    multiSourceFile,
    workspace,
    outputDir,
    architecture,
    extensions,
    multiCandleExtraArguments,
  );
  expect(cmdLine).toEqual(
    expect.stringMatching(
      'candle -nologo -o z:/workspace/ -arch x64 -dlicensePath="./LICENSE" -ext WixUtilExtension z:/workspace/wix/component.wxs z:/workspace/wix/complex.wxs && light -nologo -ext WixUtilExtension -spdb -o z:/workspace/msi/Multi.msi -b z:/workspace -sval z:/workspace/component.wixobj z:/workspace/complex.wixobj',
    ),
  );
});
