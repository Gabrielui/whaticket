import { Request, Response } from "express";
import { isNil, head } from "lodash";
import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import path from "path";
import fs from "fs";
import { publicFolder } from "../../config/upload";

export const normalizeName = (inputString: string) => {
  let cleanString = inputString.replace(/[^\w\s.]/g, '');
  let words = cleanString.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  let resultString = words.join('');
  return resultString;
}

export const mediaUpload = async (req: Request, res: Response): Promise<Response> => {
    const { whatsappId } = req.params;
    const files = req.files as Express.Multer.File[];
    const file = head(files);

    try {

      const whatsapp = await Whatsapp.findByPk(whatsappId);
      let greetingMediaAttachmentTmp = [];
      const invalidOptions = [null, undefined, "", 'null', 'undefined', " "];
      if (invalidOptions.includes(whatsapp.greetingMediaAttachment)) {
        greetingMediaAttachmentTmp = [];
      } else {
        try {
          greetingMediaAttachmentTmp = JSON.parse(whatsapp.greetingMediaAttachment);
        } catch (error) {
          greetingMediaAttachmentTmp = [whatsapp.greetingMediaAttachment];
        }
      }
      if (greetingMediaAttachmentTmp instanceof Array === false) {
        greetingMediaAttachmentTmp = [greetingMediaAttachmentTmp];
      }

      let toRemove = [];
      for (const fFile of greetingMediaAttachmentTmp) {
        if (file.filename.includes(fFile)) {
          console.log('includes', fFile, 'in', file.filename);

          toRemove.push(fFile);
        } else {
          console.log('not includes', fFile, 'in', file.filename);
        }
      }
      console.log('toRemove', toRemove);

      for (const fFile of toRemove) {
        greetingMediaAttachmentTmp.splice(greetingMediaAttachmentTmp.indexOf(fFile), 1);
      }

      const oldName = file.filename;
      const newName = normalizeName(file.filename);
      file.filename = newName;

      const path = `${publicFolder}/company${whatsapp.companyId}/${oldName}`;
      if (fs.existsSync(path)) {
        fs.renameSync(path, `${publicFolder}/company${whatsapp.companyId}/${newName}`);
      }
      greetingMediaAttachmentTmp.push(file.filename);

      toRemove = [];
      for (const fFile of greetingMediaAttachmentTmp) {
        const path = `${publicFolder}/company${whatsapp.companyId}/`
        if (!fs.existsSync(path)) {
          toRemove.push(fFile);
        }
      }
      for (const fFile of toRemove) {
        greetingMediaAttachmentTmp.splice(greetingMediaAttachmentTmp.indexOf(fFile), 1);
      }

      whatsapp.greetingMediaAttachment = JSON.stringify(greetingMediaAttachmentTmp);

      await whatsapp.save();

      return res.status(200).json({ mensagem: "Arquivo adicionado!" });

    } catch (err: any) {
      throw new AppError(err.message);
    }
  };

export const deleteMedia = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { whatsappId } = req.params;

    try {
      const whatsapp = await Whatsapp.findByPk(whatsappId);
      const filePath = path.resolve("public", whatsapp.greetingMediaAttachment);
      const fileExists = fs.existsSync(filePath);
      if (fileExists) {
        fs.unlinkSync(filePath);
      }

      whatsapp.greetingMediaAttachment = null
      await whatsapp.save();
      return res.send({ message: "Arquivo excluído" });
    } catch (err: any) {
      throw new AppError(err.message);
    }
};
