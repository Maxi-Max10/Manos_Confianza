const DEFAULT_MESSAGE =
  "Hola, vi tu perfil en Manos de Confianza y me gustaría conversar sobre una oportunidad laboral.";

export function createWhatsAppUrl(phone: string, message = DEFAULT_MESSAGE) {
  const normalizedPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
