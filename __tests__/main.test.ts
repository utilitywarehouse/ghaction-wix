import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { ExecFileSyncOptions, execFileSync } from 'child_process';
import { expect, beforeAll, afterAll, test } from '@jest/globals';

const outputDir: string = 'msi';
const simpleSourceFile: string = 'wix/simple.wxs';
const simpleMsiName: string = 'Simple';
const architecture: string = 'x64';
const extensions: string = 'WixUtilExtension';

const multiMsiName: string = 'Multi';
const multiSourceFile = 'wix/component.wxs,wix/complex.wxs';
const multiCandleExtraArguments: string = '-dlicensePath="./LICENSE"';

beforeAll(() => {
  cleanBuild();
});

afterAll(() => {
  cleanBuild();
});

function cleanBuild(): void {
  const rootDir = path.join(__dirname, '..');
  const rootDirFiles = fs.readdirSync(rootDir);
  rootDirFiles.forEach((file) => {
    if (file.match(/.*\.(wixobj?)/gi)) {
      const fullpath = path.join(rootDir, file);
      console.log(fullpath);
      fs.unlinkSync(fullpath);
    }
  });

  const msiDir = path.join(rootDir, outputDir);
  const msiDirFiles = fs.readdirSync(msiDir);
  msiDirFiles.forEach((file) => {
    if (file.match(/.*\.(msi?)/gi)) {
      const fullpath = path.join(msiDir, file);
      console.log(fullpath);
      fs.unlinkSync(fullpath);
    }
  });
}
// shows how the runner will run a javascript action with env / stdout protocol
test('test Simple MSI creation', () => {
  process.env['INPUT_SOURCEFILES'] = simpleSourceFile;
  process.env['INPUT_OUTPUTDIR'] = outputDir;
  process.env['INPUT_NAME'] = simpleMsiName;
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: ExecFileSyncOptions = {
    env: process.env,
  };
  console.log(execFileSync(np, [ip], options).toString());
});

test('test Complex MSI creation', () => {
  process.env['INPUT_SOURCEFILES'] = multiSourceFile;
  process.env['INPUT_OUTPUTDIR'] = outputDir;
  process.env['INPUT_NAME'] = multiMsiName;
  process.env['INPUT_ARCHITECTURE'] = architecture;
  process.env['INPUT_EXTENSIONS'] = extensions;
  process.env['INPUT_CANDLEEXTRAARGUMENTS'] = multiCandleExtraArguments;
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: ExecFileSyncOptions = {
    env: process.env,
  };
  console.log(execFileSync(np, [ip], options).toString());
});
