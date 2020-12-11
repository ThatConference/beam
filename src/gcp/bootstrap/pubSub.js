/* Bootstraps local emulator for use in testing */

import 'dotenv/config';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

const bootstrapPubSub = async () => {
  console.log('boostrap called');

  // Checks for development!!
  if (process.env.NODE_VER === 'production')
    throw new Error('unable to run bootstrap in production');
  if (!process.env.PUBSUB_EMULATOR_HOST)
    throw new Error(
      `env 'PUBSUB_EMULATOR_HOST' not set. Required to bootstrap emulator`,
    );
  if (!process.env.PUBSUB_PROJECT_ID)
    throw new Error(
      `env 'PUBSUB_PROJECT_ID' required by emulator. our default 'dev-that'`,
    );

  const create = {
    topic: 'stripe-events',
    subscription: 'manual-pull',
  };

  const [newTopic] = await pubSubClient.createTopic(create.topic);
  if (!newTopic) console.log('topic failed to be created. ');
  else console.log('new topic created:', newTopic);

  const [newSub] = await pubSubClient.createSubscription(
    create.topic,
    create.subscription,
    {
      retainAckedMessages: true,
    },
  );
  if (!newSub) console.log('subscription falied to cerate');
  else console.log('new subscription created', newSub);

  // const topicList = await pubSubClient.getTopics();
  // console.log('topic list: %O', topicList);
  return 'done';
};

export default bootstrapPubSub;
