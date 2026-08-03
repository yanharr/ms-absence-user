import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AuthService } from './auth.service';

@Injectable()
export class AuthRabbitConsumerService implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = process.env.RABBITMQ_EXCHANGE;
    const queue = process.env.RABBITMQ_QUEUE;

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    });
    await channel.bindQueue(queue, exchange, queue);

    channel.consume(queue, async (msg) => {
      if (!msg) {
        return;
      }

      try {
        const payload = JSON.parse(msg.content.toString());
        if (payload.event === 'user.create') {
          await this.authService.registerUserEmployee(payload.employee_id, payload.password);
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false);
        }
      } catch (error) {
        console.error('Failed to process RabbitMQ message', error);
        channel.nack(msg, false, true);
      }
    });
  }
}
