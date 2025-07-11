const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, 'prisma', 'schema.prisma');
const OUTPUT_PATH = path.join(__dirname, 'models.txt');

function extractModelsFromSchema() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error('❌ schema.prisma not found at:', SCHEMA_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const modelRegex = /^\s*model\s+(\w+)\s*{/gm;

  const modelSet = new Set();
  let match;

  while ((match = modelRegex.exec(content)) !== null) {
    modelSet.add(match[1]);
  }

  const sortedModels = Array.from(modelSet).sort();
  fs.writeFileSync(OUTPUT_PATH, sortedModels.join('\n'), 'utf8');

  console.log(`✅ Extracted ${sortedModels.length} models to ${OUTPUT_PATH}`);
}

extractModelsFromSchema();