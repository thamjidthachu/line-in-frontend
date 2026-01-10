#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = __dirname;

console.log('🧹 Cleaning build artifacts and caches...');

const dirsToClean = ['.next', 'node_modules', '.yarn/cache', 'dist'];
dirsToClean.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`  Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

const filesToClean = ['yarn.lock', 'package-lock.json'];
filesToClean.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  Removing ${file}...`);
    fs.unlinkSync(fullPath);
  }
});

console.log('\n📦 Installing dependencies...');
try {
  execSync('yarn install', { cwd: projectRoot, stdio: 'inherit' });
  console.log('\n✅ Installation complete!');
  console.log('\n🚀 To start the development server, run:');
  console.log('   yarn dev');
  console.log('\n📊 To check TypeScript types:');
  console.log('   yarn type-check');
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  process.exit(1);
}
