import Contact from "../models/Contact";
import Ticket from "../models/Ticket";

export const createJid = (ticket?: Ticket, contact?: Contact) => {
    let number: any;

    if (ticket) {
        number = `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`;
    }

    if (contact) {
        number = contact.isGroup ? `${contact.number}@g.us` : `${contact.number}@s.whatsapp.net`;
    }

    return number;
}