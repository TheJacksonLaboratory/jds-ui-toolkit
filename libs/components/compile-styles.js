const { execSync } = require('child_process');
const fs = require('fs');

// generate CSS first with minification
execSync(`npx tailwindcss \
  -i ./src/styles/tailwind.css \
  -o ./src/styles/temp.css \
  --config ../../tailwind.config.js \
  --content "./src/**/*.{html,ts}"`, {
  cwd: __dirname,
  stdio: 'inherit'
});

// copy CSS to output
const cssContent = fs.readFileSync('./src/styles/temp.css', 'utf8');
fs.writeFileSync('./src/styles/components-tailwind.css', cssContent);

// clean up temp file
fs.unlinkSync('./src/styles/temp.css');
console.log('✅ Tailwind CSS built and minified as CSS');