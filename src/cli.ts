#!/usr/bin/env node
// src/cli.ts

import { Command } from 'commander';
import { saveCommand } from './commands/save.js';
import { pickCommand } from './commands/pick.js';
import { searchCommand } from './commands/search.js';
import { listCommand } from './commands/list.js';
import { showCommand } from './commands/show.js';
import { deleteCommand } from './commands/delete.js';
import { exportCommand } from './commands/export.js';

const program = new Command();

program
  .name('fav')
  .description('Bookmark and search your Claude Code responses')
  .version('0.1.0');

// Default action: fav [N] saves Nth response from bottom
program
  .argument('[position]', 'Response position from bottom (1 = last)', '1')
  .option('-t, --tag <tags...>', 'Add one or more tags')
  .option('-n, --note <note>', 'Add a note')
  .action(saveCommand);

program
  .command('pick')
  .description('Interactively select a response to save')
  .action(pickCommand);

program
  .command('search <query>')
  .description('Full-text search over saved favourites')
  .option('-t, --tag <tag>', 'Filter by tag')
  .action(searchCommand);

program
  .command('list')
  .description('List all favourites')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-p, --project <path>', 'Filter by project path')
  .option('-l, --limit <n>', 'Limit results')
  .action(listCommand);

program
  .command('show <id>')
  .description('Show full content of a favourite')
  .action(showCommand);

program
  .command('delete <id>')
  .description('Delete a favourite')
  .option('-f, --force', 'Skip confirmation')
  .action(deleteCommand);

program
  .command('export')
  .description('Export favourites as Markdown')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-p, --project <path>', 'Filter by project path')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .action(exportCommand);

program.parse();
