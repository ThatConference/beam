import topic from '../gcp/pubsub/topic';
import subscription from '../gcp/pubsub/subscription';
import bootstrap from '../gcp/bootstrap/pubSub';
import message from '../gcp/pubsub/message';

const itemOptions = ['topic', 'subscription', 'subscriber'];
export default program => {
  program
    .command('bs-pubsub')
    .description('Bootstraps a local PubSub running gcloud emulator.')
    .action(() => bootstrap().then(msg => console.log(`m: ${msg}`)));

  program
    .command('list <item>')
    .description('Lists different items from PubSub')
    .on('--help', () => {
      console.log('\n available items to list');
      itemOptions.forEach(i => console.log(` * ${i}`));
    })
    .action(item => {
      switch (item) {
        case 'topics':
          topic()
            .list()
            .then(t => t.map(t1 => console.log(t1)));
          break;
        case 'subscriptions':
          subscription()
            .list()
            .then(s => s.map(s1 => console.log(s1)));

          break;
        case 'subscribers':
          // call subscibes
          console.error('not implemented yet');
          break;
        default:
          console.error(
            `Unknown item to list ${item}. See <cmd> -h for supported values`,
          );
      }
    });

  program
    .command('listenMessages <sub>')
    .description('listen for messages from topic/subscription')
    .on('--help', () => {
      console.log('\n<sub> (required) is the subscription to pull from');
    })
    .option(
      '-k, -noawk',
      `(optional) Don't Acknowledge receipt message which removes it from queue`,
    )
    .option(
      '-t, --timeout <int>',
      'The length of time to listen for messages. Default 10000 ms',
    )
    .action((sub, cmd) => {
      let timeout = 10000;
      if (cmd.timeout) timeout = Number(cmd.timeout);
      // eslint-disable-next-line no-restricted-globals
      if (cmd.timeout && isNaN(cmd.timeout)) {
        console.error('ERROR: Timeout must be a number');
        return -1;
      }
      if (timeout && timeout < 100) {
        console.error('ERROR: Timeout must be a positive number > 99');
        return -1;
      }
      if (timeout && !Number.isInteger(timeout)) {
        console.error('ERROR: Timeout must be an integer');
        return -1;
      }
      return message(false).listen({
        timeout: timeout || 10000,
        sub,
        isNoAck: cmd.noawk,
      });
    });
};
