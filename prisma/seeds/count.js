const fs = require('fs').promises;

async function countPrismaModels(filePath) {
  try {
    // Read the schema file
    const content = await fs.readFile(filePath, 'utf-8');

    // Split content into lines and filter for model definitions
    // Match lines starting with 'model' followed by a name and opening brace
    const modelPattern = /^\s*model\s+\w+\s*{/;
    const modelCount = content
      .split('\n')
      .filter(line => modelPattern.test(line)).length;

    return modelCount;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File '${filePath}' not found.`);
    } else {
      console.error(`Error reading file: ${error.message}`);
    }
    return 0;
  }
}

// Specify the path to your schema.prisma file
const schemaFile = 'schema.prisma';

// Run the script and print the result
countPrismaModels(schemaFile)
  .then(count => {
    console.log(`Number of models in the Prisma schema: ${count}`);
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
  });