/* Bootstraps local emulator for use in testing */

import 'dotenv/config';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub({ projectId: 'dev-that' });

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
    topicDeadletter: 'stripe-events-deadletter',
    subscription: 'manual-pull',
    pushSubName: 'push-sub',
    pushSubUrl: 'http://localhost:8080/stripe-event',
  };
  let newTopic;
  try {
    console.log('create topic', create.topic);
    [newTopic] = await pubSubClient.createTopic(create.topic);
    console.log('done creating topic');
  } catch (err) {
    console.error('Error creating Topic', err);
    throw err;
  }
  if (!newTopic) console.log('topic failed to be created. ');
  else console.log('new topic created:', newTopic.name);

  console.log(
    'creating manual pull subscripting which can be read by this cli',
  );
  const [newSub] = await pubSubClient.createSubscription(
    create.topic,
    create.subscription,
    {
      retainAckedMessages: true,
    },
  );
  if (!newSub) console.log('subscription falied to cerate');
  else console.log('new subscription created', newSub.name);

  console.log(
    'creating subscription which pushes to http end point (i.e. brinks)',
  );
  const [newPushSub] = await pubSubClient.createSubscription(
    create.topic,
    create.pushSubName,
    {
      pushEndpoint: create.pushSubUrl,
    },
  );
  if (!newPushSub) console.log('subscription falied to cerate');
  else
    console.log(
      `new subscription created: ${newPushSub.name} on pushEndpoint ${newPushSub.metadata.pushConfig.pushEndpoint}`,
    );

  // const topicList = await pubSubClient.getTopics();
  // console.log('topic list: %O', topicList);

  // TODO: add deadletter stuff

  return 'done';
};

export default bootstrapPubSub;
