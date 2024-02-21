import { Controller, Post, Req, Res, Logger, Body ,HttpStatus} from '@nestjs/common';
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
        Logger.log("inside block action");
      }
      Logger.log(interactionPayload.view.id);
      const modal = {
        "title": {
          "type": "plain_text",
          "text": "My App xansmd cajhs cjhaw csjh ec ha schja shj ejh cjhe chj esvj j vce ",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "type": "modal",
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "option_1",
              "placeholder": {
                "type": "plain_text",
                "text": "First option"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Option 1"
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "title",
              "placeholder": {
                "type": "plain_text",
                "text": "What do you want to ask of the world?"
              }
            },
            "label": {
              "type": "plain_text",
              "text": "Title"
            }
          }
        ]
      }
      const users = await this.slackService.getAllUsers();
      const headers = {
        headers: {
          "Content-type": "application/json; charset=utf-8",
          "Authorization": "Bearer " + users[0].token
        }
      };
      
      const modalInfo = {
        "view_id": interactionPayload.view.id,
              "token": users[0].token,
              "trigger_id": interactionPayload.trigger_id,
              "view": modal
            };
      
            axios
              .post("https://slack.com/api/views.update", modalInfo, headers)
              .then(response => {
                const data = response.data;
                if (!data.ok) {
                  return data.error;
                }
              })
              .catch(error => {
                console.log("-Error: ", error);
              });

      // if (interactionPayload.type === 'block_actions') {
      //   try{
      //   const channelId = interactionPayload.channel.id;
      //   const responseUrl = interactionPayload.response_url;
      //   const triggerId = interactionPayload.trigger_id;
      //   Logger.log(`triggerId ${triggerId}`);
      //   Logger.log(`Interaction in channel ${channelId}`);
      //   await this.sendInitialModalView(triggerId);
      //   res.status(200).json({ response_action: 'clear' });
      //   } catch(e){
      //     Logger.log(e);
      //   }
      // } else if (interactionPayload.type === 'view_submission') {
      //   const submittedValues = interactionPayload.view.state.values;
      //   Logger.log(`Submitted values ${submittedValues}`);
      //   res.status(200).json({ response_action: 'clear' });
      // }
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
  
      const userId = payload.user_id;
      if (!userId) {
        throw new Error('Missing user ID in payload');
      }
  const modal = {
    "type": "modal",
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
    "title": {
      "type": "plain_text",
      "text": "App menu",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Hi <fakelink.toUser.com|@David>!* Here's how I can help you:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":calendar: *Create event*\nCreate a new event"
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Create event",
            "emoji": true
          },
          "style": "primary",
          "value": "click_me_123"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":clipboard: *List of events*\nChoose from different event lists"
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Choose list",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "My events",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "All events",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Event invites",
                "emoji": true
              },
              "value": "value-1"
            }
          ]
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":gear: *Settings*\nManage your notifications and team settings"
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Edit settings",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Notifications",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Team settings",
                "emoji": true
              },
              "value": "value-1"
            }
          ]
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Send feedback",
              "emoji": true
            },
            "value": "click_me_123"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "FAQs",
              "emoji": true
            },
            "value": "click_me_123"
          }
        ]
      }
    ]
  }
      const users = await this.slackService.getAllUsers();
      const headers = {
        headers: {
          "Content-type": "application/json; charset=utf-8",
          "Authorization": "Bearer " + users[0].token
        }
      };
      
      const modalInfo = {
              "token": users[0].token,
              "trigger_id": payload.trigger_id,
              "view": modal
            };
      
            axios
              .post("https://slack.com/api/views.open", modalInfo, headers)
              .then(response => {
                const data = response.data;
                if (!data.ok) {
                  return data.error;
                }
              })
              .catch(error => {
                console.log("-Error: ", error);
              });
    } catch (error) {
      console.error('Error handling slash command:', error);
      res.status(500).send('Internal Server Error');
    }
    res.status(HttpStatus.OK).send('Processing...');
  }
  
  private async sendInitialModalView(triggerId: any) {
    try {
      const users = await this.slackService.getAllUsers();
      
      const viewPayload = {
        type: 'modal',
        callback_id:"id_1",
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
              text: 'Pick an item from the dropdown list',
            },
            accessory: {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an item',
                emoji: true,
              },
              option_groups: [
                {
                  label: {
                    type: 'plain_text',
                    text: 'Options Group 1',
                    emoji: true,
                  },
                  options: [
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Loading...',
                        emoji: true,
                      },
                      value: 'loading_option',
                    },
                  ],
                },
              ],
              action_id: 'static_select-action',
            },
          },
          {
            type: 'section',
            block_id: 'external_section',
            text: {
              type: 'mrkdwn',
              text: 'External Data Source',
            },
            accessory: {
              action_id: 'external_select-action',
              type: 'external_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an item',
              },
              min_query_length: 0,
            },
          },
          {
            type: 'section',
            block_id: 'external_section_1',
            text: {
              type: 'mrkdwn',
              text: 'External Data Source',
            },
            accessory: {
              action_id: 'external_select-action-1',
              type: 'external_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an item',
              },
              min_query_length: 0,
            },
          },
          {
            type: 'section',
            block_id: 'overflow_section',
            text: {
              type: 'mrkdwn',
              text: 'This is a section block with an overflow menu.',
            },
            accessory: {
              type: 'overflow',
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Option 1',
                    emoji: true,
                  },
                  value: 'option-1',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Option 2',
                    emoji: true,
                  },
                  value: 'option-2',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Option 3',
                    emoji: true,
                  },
                  value: 'option-3',
                },
              ],
              action_id: 'overflow-action',
            },
          },
        ],
      };

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
