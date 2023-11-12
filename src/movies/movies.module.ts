import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesSchema } from './schemas/movies.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'movies', schema: MoviesSchema }])],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
