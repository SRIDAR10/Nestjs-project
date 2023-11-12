import { Document } from "mongoose";


export interface IMovies extends Document{
    readonly plot: String,
    readonly poster: String,
    readonly title: String,
    readonly released: Date,
    readonly directors: Array<String>,
    readonly imdb: Object,
}