// build-www.js — Copies web assets to www/ for Capacitor native builds
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DEST = path.join(__dirname, 'www');

// Files & folders to copy
const FILES = [
  'index.html',
  'about.html',
  'privacy.html',
  'styles.css',
  'i18n.js',
  'app.js',
  'sw.js',
  'manifest.json'
];
const DIRS = ['icons'];

// Clean & create www/
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}
fs.mkdirSync(DEST, { recursive: true });

// Copy files
FILES.forEach(function (file) {
  const src = path.join(SRC, file);
  const dest = path.join(DEST, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('  ✓ ' + file);
  } else {
    console.log('  ✗ ' + file + ' (not found, skipped)');
  }
});

// Copy directories
DIRS.forEach(function (dir) {
  const srcDir = path.join(SRC, dir);
  const destDir = path.join(DEST, dir);
  if (fs.existsSync(srcDir)) {
    copyDirSync(srcDir, destDir);
    console.log('  ✓ ' + dir + '/');
  }
});

console.log('\n✅ www/ built successfully.\n');

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(function (entry) {
    var srcPath = path.join(src, entry);
    var destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

