import { syncBlocksToDatabase } from '@/lib/block-sync';

async function main() {
  const summary = await syncBlocksToDatabase();

  console.log(`Registered blocks: ${summary.totalRegistered}`);
  console.log(`Created: ${summary.created}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Unchanged: ${summary.unchanged}`);
  console.log(`Present in DB but missing in code: ${summary.missingInCode}`);
}

main().catch((error) => {
  console.error('Failed to sync blocks:', error);
  process.exitCode = 1;
});
