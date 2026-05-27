const { spawn } = require('child_process');
const dir = '/Users/chad/Downloads/wdp-next';
const nodeBin = process.execPath;
const nextBin = dir + '/node_modules/next/dist/bin/next';
const child = spawn(nodeBin, [nextBin, 'dev', '--webpack'], {
  cwd: dir,
  env: { ...process.env, PATH: nodeBin.replace('/node', '') + ':' + (process.env.PATH || '') },
  stdio: 'inherit'
});
child.on('exit', (code) => process.exit(code || 0));
