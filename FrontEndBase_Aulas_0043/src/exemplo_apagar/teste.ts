import ClsValidacao from "../Utils/ClsValidacao"

let clsValidacao: ClsValidacao = new ClsValidacao()
let erro: { [key: string]: string } = {}

console.log( clsValidacao.tamanho( 'senha', { senha: 'Fleek' }, erro, true, false, 6, 10, 'Campo deve ter entre 6 e 10 caracteres.' ) )

console.log( JSON.stringify( erro ) )

export { }