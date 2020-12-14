import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

const subscription = isProd => {
  const emHost = process.env.PUBSUB_EMULATOR_HOST;
  const psProjId = process.env.PUBSUB_PROJECT_ID;
  if (isProd && (emHost || psProjId))
    throw new Error(
      'Cannot access prod PubSub using local env PUBSUB_EMULATOR_HOST and PUBSUB_PROJECT_ID',
    );
  if (!isProd && !emHost && !psProjId)
    throw new Error(
      'Both env PUBSUB_EMULATOR_HOST and PUBSUB_PROJECT_ID are requried for accessing emulator',
    );

  function list() {
    return pubSubClient.getSubscriptions().then(data => {
      const [subscriptions] = data;
      return subscriptions.map(t => t.name);
    });
  }

  return {
    list,
  };
};

export default subscription;
