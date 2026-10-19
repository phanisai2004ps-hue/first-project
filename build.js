const fs = require('fs');
const path = require('path');

async function build() {
  console.log('Building CuteCalc React bundle...');
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Load Babel Standalone
  const babelCachePath = path.join(__dirname, 'dist', 'babel.min.js');
  let babelSource = '';
  if (fs.existsSync(babelCachePath)) {
    babelSource = fs.readFileSync(babelCachePath, 'utf8');
  } else {
    console.log('Downloading Babel standalone for compilation...');
    const res = await fetch('https://unpkg.com/@babel/standalone@7.24.0/babel.min.js');
    babelSource = await res.text();
    fs.writeFileSync(babelCachePath, babelSource, 'utf8');
  }

  // Execute Babel in vm context
  const vm = require('vm');
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(babelSource, sandbox);
  const Babel = sandbox.Babel;

  // Read modular files in order
  const files = [
    'src/utils/calculatorEngine.js',
    'src/utils/audioEngine.js',
    'src/utils/horrorMessages.js',
    'src/components/AudioSettings.jsx',
    'src/components/CuteBackground.jsx',
    'src/components/CuteMascot.jsx',
    'src/components/GhostPremiumModal.jsx',
    'src/components/CuteCalculator.jsx',
    'src/components/HorrorOverlay.jsx',
    'src/app.jsx'
  ];

  let combinedCode = `
// CuteCalc Application Bundle
// Generated with Babel React preset
const { useState, useEffect, useRef } = React;
`;

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    let code = fs.readFileSync(filePath, 'utf8');

    // Remove import statements
    code = code.replace(/^import\s+.*?;?\s*$/gm, '');
    // Convert export default function Name to function Name
    code = code.replace(/^export\s+default\s+function\s+([A-Za-z0-9_]+)/gm, 'function $1');
    // Convert export function Name to function Name
    code = code.replace(/^export\s+function\s+([A-Za-z0-9_]+)/gm, 'function $1');
    // Convert export const Name to const Name
    code = code.replace(/^export\s+const\s+([A-Za-z0-9_]+)/gm, 'const $1');
    // Convert export default Name to // export default Name
    code = code.replace(/^export\s+default\s+.*?;?\s*$/gm, '');

    combinedCode += `\n/* --- File: ${file} --- */\n` + code;
  }

  // Add React mount code
  combinedCode += `
/* --- Mount App --- */
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
`;

  // Transpile with Babel React preset
  const transpiled = Babel.transform(combinedCode, {
    presets: ['react']
  }).code;

  fs.writeFileSync(path.join(distDir, 'bundle.js'), transpiled, 'utf8');
  console.log('CuteCalc bundle successfully built at dist/bundle.js! Size:', transpiled.length, 'bytes');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
