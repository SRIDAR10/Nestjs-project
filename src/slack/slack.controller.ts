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
      Logger.log(payload, interactionPayload, interactionPayload.type);

      if (interactionPayload.type === 'block_actions') {
        try{
        const channelId = interactionPayload.channel.id;
        const responseUrl = interactionPayload.response_url;
        const triggerId = interactionPayload.trigger_id;
        Logger.log(`triggerId ${triggerId}`);
        Logger.log(`Interaction in channel ${channelId}`);
        await this.sendInitialModalView(triggerId);
        res.status(200).json({ response_action: 'clear' });
        } catch(e){
          Logger.log(e);
        }
      } else if (interactionPayload.type === 'view_submission') {
        const submittedValues = interactionPayload.view.state.values;
        Logger.log(`Submitted values ${submittedValues}`);
        res.status(200).json({ response_action: 'clear' });
      }
      res.status(200).json({ response_action: 'clear' });
    } catch (error) {
      Logger.error('Error handling interaction:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Post('/slash-command')
  async handleSlashCommand(
    @Body() payload: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      Logger.log(`slash command payload content: ${JSON.stringify(payload)} token => ${payload?.token}`);
      await this.sendInitialModalView(payload?.trigger_id);
      
      // Send immediate response to acknowledge the command
      res.status(200).send('Processing...');
  
      // Open the modal without delay
      // await this.sendInitialModalView(payload?.trigger_id);
      return "OK";
    } catch (error) {
      Logger.error('Error handling interaction:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  private async sendInitialModalView(triggerId: any) {
   const users = await this.slackService.getAllUsers();
    try {
      const viewPayload={
        "type": "modal",
        "title": {
          "type": "plain_text",
          "text": "My App",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
            },
            "accessory": {
              "type": "image",
              "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
              "alt_text": "alt text for image"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
            },
            "accessory": {
              "type": "image",
              "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
              "alt_text": "alt text for image"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
            },
            "accessory": {
              "type": "image",
              "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
              "alt_text": "alt text for image"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Farmhouse",
                  "emoji": true
                },
                "value": "click_me_123"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Kin Khao",
                  "emoji": true
                },
                "value": "click_me_123",
                "url": "https://google.com"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Ler Ros",
                  "emoji": true
                },
                "value": "click_me_123",
                "url": "https://google.com"
              }
            ]
          }
        ]
      }
      
      // const viewPayload = {
      //   type: 'modal',
      //   callback_id:"id_1",
      //   title: {
      //     type: 'plain_text',
      //     text: 'My App',
      //     emoji: true,
      //   },
      //   submit: {
      //     type: 'plain_text',
      //     text: 'Submit',
      //     emoji: true,
      //   },
      //   close: {
      //     type: 'plain_text',
      //     text: 'Cancel',
      //     emoji: true,
      //   },
      //   blocks: [
      //     {
      //       type: 'section',
      //       text: {
      //         type: 'mrkdwn',
      //         text: 'Pick an item from the dropdown list',
      //       },
      //       accessory: {
      //         type: 'static_select',
      //         placeholder: {
      //           type: 'plain_text',
      //           text: 'Select an item',
      //           emoji: true,
      //         },
      //         option_groups: [
      //           {
      //             label: {
      //               type: 'plain_text',
      //               text: 'Options Group 1',
      //               emoji: true,
      //             },
      //             options: [
      //               {
      //                 text: {
      //                   type: 'plain_text',
      //                   text: 'Loading...',
      //                   emoji: true,
      //                 },
      //                 value: 'loading_option',
      //               },
      //             ],
      //           },
      //         ],
      //         action_id: 'static_select-action',
      //       },
      //     },
      //     {
      //       type: 'section',
      //       block_id: 'external_section',
      //       text: {
      //         type: 'mrkdwn',
      //         text: 'External Data Source',
      //       },
      //       accessory: {
      //         action_id: 'external_select-action',
      //         type: 'external_select',
      //         placeholder: {
      //           type: 'plain_text',
      //           text: 'Select an item',
      //         },
      //         min_query_length: 0,
      //       },
      //     },
      //     {
      //       type: 'section',
      //       block_id: 'external_section_1',
      //       text: {
      //         type: 'mrkdwn',
      //         text: 'External Data Source',
      //       },
      //       accessory: {
      //         action_id: 'external_select-action-1',
      //         type: 'external_select',
      //         placeholder: {
      //           type: 'plain_text',
      //           text: 'Select an item',
      //         },
      //         min_query_length: 0,
      //       },
      //     },
      //     {
      //       type: 'section',
      //       block_id: 'overflow_section',
      //       text: {
      //         type: 'mrkdwn',
      //         text: 'This is a section block with an overflow menu.',
      //       },
      //       accessory: {
      //         type: 'overflow',
      //         options: [
      //           {
      //             text: {
      //               type: 'plain_text',
      //               text: 'Option 1',
      //               emoji: true,
      //             },
      //             value: 'option-1',
      //           },
      //           {
      //             text: {
      //               type: 'plain_text',
      //               text: 'Option 2',
      //               emoji: true,
      //             },
      //             value: 'option-2',
      //           },
      //           {
      //             text: {
      //               type: 'plain_text',
      //               text: 'Option 3',
      //               emoji: true,
      //             },
      //             value: 'option-3',
      //           },
      //         ],
      //         action_id: 'overflow-action',
      //       },
      //     },
      //   ],
      // };

      Logger.log(`====\n ${users[0]?.token}`);

      const response = await axios.post(
        `${this.slackApiUrl}/views.open`,
        {
          trigger_id : triggerId,
          view: viewPayload,
        },
        {
          headers: {
            Authorization: `Bearer ${users[0]?.token}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000
        }
      );
  
      if (response.status === 200) {
        Logger.log('Modal opened successfully:\n', response.data);
      } else {
        Logger.error('Error opening modal. Status:\n', response.status);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === 'expired_trigger_id') {
        Logger.error('Trigger ID has expired. Obtain a new one and retry.');
      } else {
        Logger.error('Error while opening modal:', error.response ? error.response.data : error.message);
        Logger.error(error.stack);
      }
    }
  }

  @Post('/post-message-with-button')
  async postMessageWithButton(@Body() body: any): Promise<string> {
    await this.sendSlackMessageWithButton();
    return 'OK';
  }

  @Post('/options-for-dropdown')
  async optionsForDropdown(@Body() body: any): Promise<any> {
    console.log('Received payload from Slack:', body);
    const options = [
      {
        text: {
          type: 'plain_text',
          text: 'Option 1',
        },
        value: 'option_1',
      },
      {
        text: {
          type: 'plain_text',
          text: 'Option 2',
        },
        value: 'option_2',
      },
    ];
    return { options };
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
              value: 'userId====================>',
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
      Logger.log(JSON.stringify(response));
    } catch (error) {
      console.error('Error posting message to Slack:', error.message);
    }
  }
}
