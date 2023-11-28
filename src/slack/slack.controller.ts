import { Controller, Post, Req, Res, Logger, Body } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('slack')
export class SlackController {
  private readonly slackApiUrl = 'https://slack.com/api';
  private readonly slackApiToken = "xoxb-6087353163408-6057864588662-FK5SZgv7JL5IZNBVkjMOd1e2";

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
            Authorization: `Bearer ${this.slackApiToken}`,
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
    const userId = 'U061WAK3RMY';

    // Post a message with a button
    await this.sendSlackMessageWithButton(userId);

    return 'OK';
  }

  // Helper method to send a Slack message with a button
  private async sendSlackMessageWithButton(userId: string): Promise<void> {
    const messagePayload = {
      channel: userId,
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

    try {
      const response = await axios.post(`${this.slackApiUrl}/chat.postMessage`, messagePayload, {
        headers: {
          Authorization: `Bearer ${this.slackApiToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Slack API Response:', response.data);
    } catch (error) {
      console.error('Error posting message to Slack:', error.message);
    }
  }
}
