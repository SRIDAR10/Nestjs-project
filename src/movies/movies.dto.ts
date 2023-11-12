export class MovieDto{
    readonly plot: String;
    readonly poster: String;
    readonly title: String;
    readonly released: Date;
    readonly directors: Array<String>;
    readonly imdb: Object;
}