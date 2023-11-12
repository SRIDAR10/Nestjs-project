import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://sridar:sridar@atlascluster.zn27u56.mongodb.net/sample_mflix?retryWrites=true&w=majority'),
    MoviesModule],
})
export class AppModule {}