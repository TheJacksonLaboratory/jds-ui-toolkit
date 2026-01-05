const fs = require('fs-extra');
const path = require('path');

async function copyStyles() {
  try {
    const srcDir = path.join(__dirname, 'src', 'styles');
    const destDir = path.join(__dirname, '..', '..', 'dist', 'libs', 'components', 'styles');

    // ensure destination directory exists
    await fs.ensureDir(destDir);

    // copy all files from src/styles to dist/libs/components/styles, excluding tailwind.css
    await fs.copy(srcDir, destDir, {
      filter: (src) => {
        const fileName = path.basename(src);
        return fileName !== 'tailwind.css';
      }
    });

    console.log('Styles copied successfully (excluding tailwind.css)!');
  } catch (error) {
    console.error('Error copying styles:', error);
    process.exit(1);
  }
}

copyStyles();