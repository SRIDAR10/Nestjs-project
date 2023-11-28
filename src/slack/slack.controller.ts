import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { Response } from 'express';

@Controller('slack')
export class SlackController {
  @Post('/interactive')
  async handleSlackRequest(@Req() request: any, @Res() res: Response): Promise<any> {
    const payload = JSON.parse(request.body.payload);
    Logger.log('Slack Payload:', payload);
    res.status(200).send('OK');
  }
}