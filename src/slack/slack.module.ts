import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './schemas/users.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }])],
  controllers: [SlackController],
  providers: [SlackService]
})
export class SlackModule {}
