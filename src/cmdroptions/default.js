import { version, description } from '../../package.json';

export default program => {
  program
    .version(version)
    .description(description)
    .on('--help', () => {
      console.log('\n    Command-specific help:');
      console.log('      dev-that [command] -h');
      console.log('\n    Note: Commands are case-sensitive');
    });
};
