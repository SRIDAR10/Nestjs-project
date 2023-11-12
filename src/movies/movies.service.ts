import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IMovies } from './interfaces/movies.interface';
import { MovieDto } from './movies.dto';

@Injectable()
export class MoviesService {

    constructor(@InjectModel("movies") private readonly moviesModel :Model<IMovies>){}

    public async getAllMovies() {
        const movies = this.moviesModel.find().exec();
        return movies;
    }

    public async addMovies(movieDto : Partial<MovieDto>):Promise<MovieDto>{
    const movie =  new this.moviesModel(movieDto);
    return movie.save();
    }
}
