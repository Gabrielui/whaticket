import sequelize from "../../database";
import Queue from "../../models/Queue";
import Ticket from "../../models/Ticket";
import { getIO } from "../../libs/socket";
import WhatsappQueue from "../../models/WhatsappQueue";

export const TicketTaskMoveToQueue = async () => {
  const io = getIO();
  console.log('Iniciando atualização de tickets sem fila');
  const tickets = await sequelize.query(`select * from "Tickets" WHERE status = 'pending' and "updatedAt" <= (NOW() - INTERVAL '1 MINUTE') and ("queueId" = 0 or "queueId" is null) and ("userId" = 0 or "userId" is null)`, {
    model: Ticket,
    mapToModel: true
  }) as Ticket[];

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const queue = await Queue.findOne({
      where: {
        companyId: ticket.companyId
      },
      order: [["id", "ASC"]]
    });
    if (queue === null) {
      console.log('Não foi encontrado fila para a empresa: ', ticket.companyId);
      continue;
    }
    const whatsAppQueue = await WhatsappQueue.findOne({
      where: {
        queueId: queue.id
      }
    });
    const dataToUpdate = {
      status: 'pending',
      queueId: queue?.id,
      chatbot: false,
    } as any;
    if (whatsAppQueue) {
      dataToUpdate.whatsappId = whatsAppQueue.id;
    }
    console.log('Atualizando ticket: ', ticket.id, 'para a fila: ', queue?.id);
    try {
      await Ticket.update(dataToUpdate, {
        where: {
          id: ticket.id,
        },
      });

      io.to(ticket.status)
      .to("notification")
      .to(ticket.id.toString())
      .emit(`company-${ticket.companyId}-ticket`, {
        action: "update",
        ticket
      });


      // io.to(ticket.status)
      // .to("notification")
      // .to(ticket.id.toString())
      // .emit(`company-${ticket.companyId}-ticket`, {
      //   action: "update",
      //   ticket
      // });
    } catch (error) {
      console.log('TicketTaskMoveToQueue, ticketId: ', ticket.id, error);
    }
  }
  console.log('Atualizado ', tickets.length, 'tickets');
}
