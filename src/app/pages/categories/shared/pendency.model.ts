export class Pendency{
    constructor(
        public id?:number,
        public nome?: string,
        public descricao?: string,
        public corDoBanho?: string,
        public foto?: string,
        public status?: string,
        public cliente_id?: string,
        public custom_piece_id?: string,
        public valor_bruto?: string,
        public valor?: string
    ){}
}