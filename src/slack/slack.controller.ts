import { Controller, Post, Req, Res, Logger, Body } from '@nestjs/common';
import { Response } from 'express';

@Controller('slack')
export class SlackController {
    @Post('/interactive')
    async handleSlackInteraction(@Body('payload') payload: string, @Res() res: Response): Promise<any> {
      try {
        const interactionPayload = JSON.parse(payload);
        Logger.log(interactionPayload);  
        // Extract relevant information
        const channelId = interactionPayload.channel.id;
        const responseUrl = interactionPayload.response_url;
  
        Logger.log(`Interaction in channel ${channelId}`);
        res.status(200).send('OK');
      } catch (error) {
        Logger.error('Error handling interaction:', error);
        res.status(500).send('Internal Server Error');
      }
    }
}