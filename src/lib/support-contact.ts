// WhatsApp support. The number is public-facing (a support line), unlike the
// contact-form recipient, which stays server-side. wa.me wants the number in
// international format with no "+", spaces or dashes. Shared by the contact
// page and the homepage's support banner.
export const WHATSAPP_NUMBER = "447951769553";
export const WHATSAPP_DISPLAY = "+44 7951 769553";
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Relate, I'd like some help with…")}`;
