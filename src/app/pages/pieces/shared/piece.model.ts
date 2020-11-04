export class Piece{
    constructor(
        public id?:number,
        public nome?: string,
        public codigo?: string,
        public valor_bruto?: string,
        public tipo?: string,
        public status?: string,
        public photo?: string,
        public obs?: string,
        public peso?: string,
        public categoria?: string,
        public valor_banho?: string,
    ){}
}