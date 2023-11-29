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
      //   Logger.log(interactionPayload);
      const channelId = interactionPayload.channel.id;
      const responseUrl = interactionPayload.response_url;
      const triggerId = interactionPayload.trigger_id;
      Logger.log('triggerId ', triggerId);
      Logger.log(`Interaction in channel ${channelId}`);
      this.sendInitialModalView(triggerId);
      res.status(200).send('OK');
    } catch (error) {
      Logger.error('Error handling interaction:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  // Helper method to open a Slack modal
  private async sendInitialModalView(triggerId: string): Promise<void> {
    const users = await this.slackService.getAllUsers();
    const viewPayload = {
      type: 'modal',
      callback_id: 'pg-update',
      title: {
        type: 'plain_text',
        text: 'Your Modal Title',
      },
      blocks: [
        {
          type: 'section',
          block_id: 'section-1',
          text: {
            type: 'mrkdwn',
            text: 'Choose an option from the dropdown:',
          },
          accessory: {
            type: 'static_select',
            action_id: 'select-1',
            placeholder: {
              type: 'plain_text',
              text: 'Select an option',
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Option 1',
                },
                value: 'option1',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Option 2',
                },
                value: 'option2',
              },
              // Add more options as needed
            ],
          },
        },
        {
          type: 'section',
          block_id: 'section-2',
          text: {
            type: 'mrkdwn',
            text: 'Choose an option from the second dropdown:',
          },
          accessory: {
            type: 'static_select',
            action_id: 'select-2',
            placeholder: {
              type: 'plain_text',
              text: 'Select an option',
            },
            options: [
              // Initial options will be empty and will be dynamically updated
            ],
          },
        },
      ],
      submit: {
        type: 'plain_text',
        text: 'Submit',
      },
    };
    try {
      await axios.post(
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
    } catch (e) {
      Logger.error(e);
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
      console.log('Slack API Response:', response.data);
    } catch (error) {
      console.error('Error posting message to Slack:', error.message);
    }
  }
}
