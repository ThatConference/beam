import 'dotenv/config';
import { program } from 'commander';
import cmdDefault from './cmdroptions/default';
import cmdPubsub from './cmdroptions/pubsub';

cmdDefault(program);
cmdPubsub(program);
// eslint-disable-next-line func-names
program.on('command:*', function (command) {
  const firstCommand = command[0];
  if (!this.commands.find(c => c._name === firstCommand)) {
    console.error(
      '\nInvalid Command: %s\nSee --help for list of commands.',
      program.args.join(' '),
    );
    process.exit(1);
  }
});
program.parse(process.argv);

if (program.args.length === 0) program.help();
