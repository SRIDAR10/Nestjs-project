import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IMovies } from './interfaces/movies.interface';
import { MovieDto } from './movies.dto';

@Injectable()
export class MoviesService {

    constructor(@InjectModel("movies") private readonly moviesModel :Model<IMovies>){}

    public async getAllMovies() {
        try{
        const movies = this.moviesModel.find().limit(20).exec();
        return movies;
        }catch(e){
            Logger.error(e);
        }
    }

    public async addMovies(movieDto : Partial<MovieDto>):Promise<MovieDto>{
    const movie =  new this.moviesModel(movieDto);
    return movie.save();
    }
}
