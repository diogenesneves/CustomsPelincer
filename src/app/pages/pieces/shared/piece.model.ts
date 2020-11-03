export class Piece{
    constructor(
        public id?:number,
        public nome?: string,
        public codigo?: string,
        public valor?: string,
        public tipo?: string,
        public status?: string,
        public photo?: string,
        public obs?: string,
        public peso?: string,
        public simples_micro?: string,
        public simples_mini?: string,
        public simples_normalv?: string,
        public dupla_micro?: string,
        public dupla_mini?: string,
        public dupla_normal?: string,
    ){}
}