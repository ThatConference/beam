import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

const message = isProd => {
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

  function listen({ timeout = 10000, sub, isNoAck }) {
    const subscription = pubSubClient.subscription(sub);
    let msgCount = 0;
    const messageHandler = msg => {
      console.log(`received message ${msg.id}`);
      console.log(`\tData: ${msg.data}`);
      console.log(`\tAttrib: ${msg.attributes}`);
      msgCount += 1;
      if (!isNoAck) msg.ack();
    };
    subscription.on('message', messageHandler);
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${msgCount} message(s) received.`);
    }, timeout);
  }

  return {
    listen,
  };
};

export default message;
