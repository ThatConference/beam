import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

const topic = isProd => {
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
    return pubSubClient.getTopics().then(data => {
      const [topics] = data;
      return topics.map(t => t.name);
    });
  }

  return {
    list,
  };
};

export default topic;
