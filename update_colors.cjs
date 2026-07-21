const fs = require('fs');
const path = require('path');

const replacements = {
  // Backgrounds & Surfaces (Dark to Light)
  "#332421": "#000000",
  "#1E1410": "#050505",
  "#2A1D1A": "#0A0A0A",
  "#47332E": "#111111",
  "#1A0F0C": "#000000",
  
  // Text & Accents (Light to Dark)
  "#EDE8D0": "#FFFFFF",
  "#D8CDB8": "#E5E5E5",
  "#D4A96A": "#FFFFFF",
  "#C97B4B": "#CCCCCC",
  "#E8C99A": "#E0E0E0",
  "#A89080": "#999999",

  // RGBA strings
  "rgba(212,169,106": "rgba(255,255,255",
  "rgba(201,123,75": "rgba(204,204,204",
  "rgba(237,232,208": "rgba(255,255,255",
  "rgba(232,201,154": "rgba(224,224,224",
  "rgba(216,205,184": "rgba(229,229,229",
  "rgba(37,25,24": "rgba(10,10,10",
  "rgba(61,41,37": "rgba(17,17,17",
  "rgba(42,29,26": "rgba(10,10,10",
  "rgba(71,51,46": "rgba(26,26,26",
  "rgba(26,15,12": "rgba(0,0,0",
  
  // Specific linear gradients
  "linear-gradient(135deg, #D4A96A, #C97B4B)": "linear-gradient(135deg, #FFFFFF, #999999)",
  "btn-gold": "btn-mono",
  "shimmer-text": "shimmer-text-mono"
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      for (const [search, replace] of Object.entries(replacements)) {
        // Simple string replaceAll (case-insensitive for hex codes where applicable)
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

const targets = [
  path.join(__dirname, 'src/app/components'),
  path.join(__dirname, 'src/app/App.tsx'),
  path.join(__dirname, 'src/styles/theme.css'),
  path.join(__dirname, 'index.html')
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    if (fs.statSync(target).isDirectory()) {
      processDirectory(target);
    } else {
      let content = fs.readFileSync(target, 'utf8');
      let modified = false;
      for (const [search, replace] of Object.entries(replacements)) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(target, content, 'utf8');
        console.log(`Updated: ${target}`);
      }
    }
  }
}
