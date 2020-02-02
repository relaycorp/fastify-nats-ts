import { FastifyInstance, Plugin } from 'fastify';
import fp = require('fastify-plugin');
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as nats from 'ts-nats';

async function fastifyNats(
  fastify: FastifyInstance,
  options: nats.NatsConnectionOptions,
  next: (err?: Error) => void,
): Promise<void> {
  const natsClient = await nats.connect(options);
  natsClient.on('connect', () => {
    fastify.decorate('nats', natsClient).addHook('onClose', close);
    next();
  });

  natsClient.on('error', err => {
    next(err);
  });
}

function close(fastify: FastifyInstance, done: () => void): void {
  // @ts-ignore
  const natsClient: nats.Client = fastify.nats;
  natsClient.close();

  done();
}

const PLUGIN: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  nats.NatsConnectionOptions
> = fp(fastifyNats, {
  fastify: '2.x',
  name: 'fastify-nats-ts',
});

export default PLUGIN;
