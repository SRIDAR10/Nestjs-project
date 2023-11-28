import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://sridar:sridar@atlascluster.zn27u56.mongodb.net/sample_mflix?retryWrites=true&w=majority'),
    MoviesModule,
    SlackModule],
})
export class AppModule {}