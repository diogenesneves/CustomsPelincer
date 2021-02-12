export class Client{
    constructor(
        public id?:number,
        public nome?: string,
        public endereco?: string,
        public celular?: string,
        public atendente?: string,
        public status?: string,
        public obs?: string
    ){}
}