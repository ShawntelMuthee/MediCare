const fs = require('fs');
const path = require('path');
const uiDir = path.join(__dirname, 'frontend', 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.jsx'));
let combined = 'import React, { useState, useEffect, useRef } from "react";\n\n';
files.forEach(f => {
  let content = fs.readFileSync(path.join(uiDir, f), 'utf-8');
  content = content.replace(/import .* from .*;/g, '');
  content = content.replace(/export default function/g, 'export function');
  combined += `// --- ${f} ---\n\n${content}\n\n`;
});
fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'components', 'ui.jsx'), combined);
