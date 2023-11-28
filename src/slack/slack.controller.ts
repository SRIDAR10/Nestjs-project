import { Controller, Post, Req, Res, Logger, Body } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('slack')
export class SlackController {
  @Post('/interactive')
  async handleSlackInteraction(
    @Body('payload') payload: string,
    @Res() res: Response,
  ): Promise<any> {
    const modal = {
      type: 'modal',
      callback_id: 'your-callback-id',
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
            text: 'Please enter some information:',
          },
          accessory: {
            type: 'input',
            element: {
              type: 'plain_text_input',
              action_id: 'input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Your Input Label',
            },
          },
        },
        {
          type: 'actions',
          block_id: 'actions-1',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Submit',
              },
              action_id: 'submit-action',
            },
          ],
        },
      ],
    };
    try {
      const interactionPayload = JSON.parse(payload);
      Logger.log(interactionPayload);
      const channelId = interactionPayload.channel.id;
      const responseUrl = interactionPayload.response_url;
      const triggerId = interactionPayload.trigger_id;

      axios
        .post(
          'https://slack.com/api/views.open',
          {
            trigger_id: triggerId,
            view: modal,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer xoxb-6054524842103-6081742571169-TM121pT2Cfg3ewxUHwj5KRPc`,
            },
          },
        )
        .then((response) => {
          console.log('Modal opened successfully:', response.data);
        })
        .catch((error) => {
          console.error(
            'Error opening modal:',
            error.response ? error.response.data : error.message,
          );
        });
      Logger.log(`Interaction in channel ${channelId}`);
      res.status(200).send('OK');
    } catch (error) {
      Logger.error('Error handling interaction:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
