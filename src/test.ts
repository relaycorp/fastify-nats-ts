import Fastify = require('fastify');
import tap from 'tap';
import { ImportMock } from 'ts-mock-imports';
import * as nats from 'ts-nats';

import fastifyNats from './index';

const natsOpt: nats.NatsConnectionOptions = {
  servers: ['nats://demo.nats.io:4222'],
};

// tslint:disable-next-line:no-empty
ImportMock.mockFunction(nats, 'connect', { on: () => {} });

tap.test('fastify.nats should exist', async t => {
  const fastify = Fastify();

  await fastify.register(fastifyNats, natsOpt);

  await fastify.ready();

  t.ok(fastify.hasDecorator('nats'));
  // tslint:disable-next-line:no-console
  // @ts-ignore
  console.log(fastify.nats)
  // @ts-ignore
  t.ok(fastify.nats);

  await fastify.close();
});
