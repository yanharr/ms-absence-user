import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AuthService } from './auth.service';

@Injectable()
export class AuthRabbitConsumerService implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    const exchange = process.env.RABBITMQ_EXCHANGE;
    const queue = process.env.RABBITMQ_QUEUE;

    if (!rabbitmqUrl || !exchange || !queue) {
      throw new Error('RabbitMQ environment variables are not configured');
    }

    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

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

      console.log(`[RabbitMQ] Received message from queue: ${queue}`);

      try {
        const payload = JSON.parse(msg.content.toString());

        if (payload.event === 'user.create') {
          console.log(`[RabbitMQ] Processing user registration for employee: ${payload.employee_id}`);
          await this.authService.registerUserEmployee(payload.employee_id, payload.password);
          channel.ack(msg);
          console.log(`[RabbitMQ] User registered successfully for employee: ${payload.employee_id}`);
        } else {
          console.log('[RabbitMQ] Ignored message with unsupported event');
          channel.nack(msg, false, false);
        }
      } catch (error) {
        console.error('[RabbitMQ] Failed to process message', error);
        channel.nack(msg, false, true);
      }
    });
  }
}
