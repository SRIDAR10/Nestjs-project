import { Controller, Post, Req, Res, Logger, Body } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  private slackApiToken: string;
  constructor(private slackService: SlackService) {}

  private readonly slackApiUrl = 'https://slack.com/api';

  @Post('/interactive')
  async handleSlackInteraction(
    @Body('payload') payload: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const interactionPayload = JSON.parse(payload);
      Logger.log(interactionPayload);
      const channelId = interactionPayload.channel.id;
      const responseUrl = interactionPayload.response_url;
      const triggerId = interactionPayload.trigger_id;
      Logger.log(`triggerId ${triggerId}`);
      Logger.log(`Interaction in channel ${channelId}`);
      await this.sendInitialModalView(triggerId);
      res.status(200).send('OK');
    } catch (error) {
      Logger.error('Error handling interaction:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  private async sendInitialModalView(triggerId: string): Promise<void> {
    Logger.log(triggerId);
    const users = await this.slackService.getAllUsers();

    const viewPayload = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'My App',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Test block with multi static select',
          },
          accessory: {
            type: 'multi_static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select options',
              emoji: true,
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                  emoji: true,
                },
                value: 'value-0',
              },
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                  emoji: true,
                },
                value: 'value-1',
              },
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                  emoji: true,
                },
                value: 'value-2',
              },
            ],
            action_id: 'multi_static_select-action',
          },
        },
      ],
    };

    try {
      const response = await axios.post(
        `${this.slackApiUrl}/views.open`,
        {
          trigger_id: triggerId,
          view: viewPayload,
        },
        {
          headers: {
            Authorization: `Bearer ${users[0]?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Log the response from views.open
      Logger.log('Slack API Response (views.open):', response.data);
    } catch (e) {
      Logger.error(e.response.data);
    }
  }

  @Post('/post-message-with-button')
  async postMessageWithButton(@Body() body: any): Promise<string> {
    await this.sendSlackMessageWithButton();
    return 'OK';
  }

  private async sendSlackMessageWithButton(): Promise<void> {
    const users = await this.slackService.getAllUsers();
    Logger.log(users[0].userId);
    const messagePayload = {
      channel: users[0]?.userId,
      text: 'Click the button to open the modal:',
      attachments: [
        {
          text: ' ',
          callback_id: 'open-modal-button',
          actions: [
            {
              name: 'open-modal',
              text: 'Open Modal',
              type: 'button',
              value: 'open-modal',
            },
          ],
        },
      ],
    };
    Logger.log(users[0]?.token);
    try {
      const response = await axios.post(
        `${this.slackApiUrl}/chat.postMessage`,
        messagePayload,
        {
          headers: {
            Authorization: `Bearer ${users[0]?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      Logger.log(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error posting message to Slack:', error.message);
    }
  }
}
