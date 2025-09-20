// prisma/scripts/watch-schema.js
const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.join(__dirname, '..', 'modules');

function watchSchema() {
  console.log('👀 Watching for schema changes...');
  console.log(`📁 Watching directory: ${MODULES_DIR}`);
  
  // Initial build
  require('./build-schema.js');
  
  // Watch for changes
  fs.watch(MODULES_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.prisma')) {
      console.log(`\n📝 File changed: ${filename}`);
      
      // Small delay to ensure file write is complete
      setTimeout(() => {
        try {
          require('./build-schema.js');
        } catch (error) {
          console.error('❌ Rebuild failed:', error.message);
        }
      }, 100);
    }
  });
  
  console.log('\n✅ Watcher started. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping schema watcher...');
  process.exit(0);
});

watchSchema();
