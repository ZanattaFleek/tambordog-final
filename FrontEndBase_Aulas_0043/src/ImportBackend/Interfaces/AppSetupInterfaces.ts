export interface AppSetupInterface {
  idSetup: number
  emailResetSenha: EmailResetSenhaInterface
}

export interface EmailResetSenhaInterface {
  from: string
  requireTLS: boolean
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  },
  tls?: {
    ciphers: string
  }
}