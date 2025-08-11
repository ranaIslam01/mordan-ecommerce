#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start server
console.log('🚀 Starting server...');
const server = spawn('npm', ['run', 'dev'], {
  cwd: join(__dirname, 'server'),
  stdio: 'pipe',
  env: { ...process.env, PORT: '8001' }
});

// Start client
console.log('🚀 Starting client...');
const client = spawn('npm', ['start'], {
  cwd: join(__dirname, 'client'),
  stdio: 'pipe',
  env: { ...process.env }
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`[SERVER] ${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.log(`[SERVER ERROR] ${data.toString().trim()}`);
});

// Handle client output
client.stdout.on('data', (data) => {
  console.log(`[CLIENT] ${data.toString().trim()}`);
});

client.stderr.on('data', (data) => {
  console.log(`[CLIENT ERROR] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.kill();
  client.kill();
  process.exit();
});

console.log('✅ Both services started! Client should be available on port 3000, Server on port 8001');
