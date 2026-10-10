const knownMessages: Array<[string, string]> = [
  ["invalid login credentials", "Email o contraseña incorrectos."],
  ["email not confirmed", "Primero confirmá tu email desde el enlace que te enviamos."],
  ["user already registered", "Ya existe una cuenta con ese email."],
  ["password should be", "La contraseña no cumple los requisitos de seguridad."],
  ["rate limit", "Hubo demasiados intentos. Esperá unos minutos y volvé a probar."],
  ["email rate limit", "Hubo demasiados envíos. Esperá unos minutos y volvé a probar."]
];

export function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  return knownMessages.find(([needle]) => normalized.includes(needle))?.[1]
    ?? "No pudimos completar la operación. Revisá los datos e intentá nuevamente.";
}
