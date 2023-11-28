import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('slack')
export class SlackController {
  @Post('/interactive')
  async handleSlackRequest(@Body() payload: any, @Res() res: Response): Promise<any> {
    Logger.log('Slack Payload:', payload);
    res.status(200).send('OK');
  }
}
