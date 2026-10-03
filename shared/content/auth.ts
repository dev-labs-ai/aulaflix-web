// Textos e regras das telas de autenticação (/entrar e /redefinir-senha) e do aviso de confirmação de e-mail.

export const AUTH_CODE_LENGTH = 6;
export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const AUTH_RESEND_SECONDS = 60;

export const authCopy = {
  /** Primeiro passo de /entrar: o e-mail decide se a pessoa entra ou cria a conta. */
  entry: {
    title: "Entre ou crie sua conta",
    body: "Comece pelo seu e-mail. Se ainda não tiver conta, você cria uma no passo seguinte.",
    submit: "Continuar",
    pending: "Verificando…",
  },
  signIn: {
    /** Botão do header e título da aba de /entrar. */
    title: "Entrar",
    heading: "Que bom ver você de novo",
    body: (email: string) => ["Digite a senha da conta ", email, "."] as const,
    submit: "Entrar",
    pending: "Entrando…",
    forgotPassword: "Esqueceu a senha?",
  },
  signUp: {
    heading: "Crie sua conta",
    body: (email: string) => ["Ainda não há conta com ", email, ". Falta só seu nome e uma senha."] as const,
    submit: "Criar conta",
    pending: "Criando conta…",
    confirmLater: "Depois mandamos um link para confirmar o e-mail. Você já pode estudar antes disso.",
  },
  /** Aviso no site para quem ainda não confirmou o e-mail da conta criada. */
  confirmEmail: {
    body: (email: string) => ["Confirme seu e-mail: mandamos um link para ", email, "."] as const,
    resend: "Reenviar link",
    resent: "Link reenviado.",
    simulate: "Protótipo: simular o clique no link",
  },
  forgot: {
    title: "Recuperar acesso",
    submit: "Receber código",
  },
  reset: {
    title: "Defina uma nova senha",
    body: (email: string) => ["Digite o código que mandamos para ", email, " e escolha a nova senha."] as const,
    submit: "Salvar e entrar",
  },
  back: "Voltar",
  divider: "ou",
  google: "Continuar com Google",
  github: "Continuar com GitHub",
  fields: {
    name: "Nome",
    namePlaceholder: "Seu nome",
    email: "E-mail",
    emailPlaceholder: "seu@email.com",
    password: "Senha",
    newPassword: "Nova senha",
    confirmNewPassword: "Repita a nova senha",
    passwordHint: `Mínimo de ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
    code: "Código",
    codeGroup: `Código de ${AUTH_CODE_LENGTH} dígitos`,
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
  },
  resend: {
    notReceived: "Não recebeu? Procure também na caixa de spam.",
    countdown: "Pedir outro código em",
    action: "Pedir outro código",
    sent: (email: string) => ["Mandamos um novo código para ", email, "."] as const,
  },
  prototype: {
    unavailable: "Protótipo: a autenticação ainda não está disponível.",
    passwordSaved: "Protótipo: senha redefinida. Com o backend conectado, você já entraria na sua conta.",
    goHome: "Ir para a página inicial",
  },
};

export const authErrors = {
  nameRequired: "Digite seu nome.",
  emailRequired: "Digite seu e-mail.",
  emailInvalid: "Esse e-mail não parece válido.",
  passwordRequired: "Digite sua senha.",
  wrongPassword: "Senha incorreta. Confira e tente de novo.",
  emailTaken: "Já existe uma conta com esse e-mail. Volte e entre com a senha.",
  passwordTooShort: `A senha precisa de no mínimo ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
  passwordMismatch: "As senhas digitadas são diferentes.",
};

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
