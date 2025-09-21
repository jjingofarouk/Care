const fs = require('fs');
const path = require('path');

// Path to schema.prisma (in the same directory as this script)
const SCHEMA_PATH = path.join(__dirname, 'schema.prisma');
const OUTPUT_PATH = path.join(__dirname, 'models.txt');

function extractModels() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error('❌ schema.prisma not found in:', SCHEMA_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const modelRegex = /^\s*model\s+(\w+)\s*{/gm;

  const modelNames = new Set();
  let match;
  while ((match = modelRegex.exec(content)) !== null) {
    modelNames.add(match[1]);
  }

  const sortedModels = Array.from(modelNames).sort();
  fs.writeFileSync(OUTPUT_PATH, sortedModels.join('\n'), 'utf8');

  console.log(`✅ Extracted ${sortedModels.length} models to ${OUTPUT_PATH}`);
}

extractModels();