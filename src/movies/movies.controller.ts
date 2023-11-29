import { Body, Controller, Get, Post} from '@nestjs/common';
import {MoviesService} from "./movies.service"
import { Logger } from '@nestjs/common';
import { MovieDto } from './movies.dto';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService : MoviesService){}

    @Get()
    async getAllMovies(){
        Logger.log("inside get all movies");
        return this.moviesService.getAllMovies();
    }

    @Post("/create-movie")
    async addMovie(@Body() movieDto:Partial<MovieDto>):Promise<MovieDto>{
        Logger.log("inside add movies");
        return this.moviesService.addMovies(movieDto);
    }
}