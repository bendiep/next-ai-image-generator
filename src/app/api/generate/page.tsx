import { client } from "@/app/trigger";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Writable } from "stream";

//👇🏻 disables the default Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

//👇🏻 creates a writable stream that stores a chunk of data
const fileConsumer = (acc: any) => {
  const writable = new Writable({
    write: (chunk: any, _enc: any, next: () => void) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

const readFile = (req: NextApiRequest, saveLocally?: boolean) => {
  // @ts-ignore
  const chunks: any[] = [];
  const form = formidable({
    keepExtensions: true,
    fileWriteStreamHandler: () => fileConsumer(chunks),
  });

  return new Promise<{
    image: string;
    email: string;
    gender: string;
    userPrompt: string;
  }>((resolve, reject) => {
    form.parse(req, async (err, fields: any, files: any) => {
      //👇🏻 converts the image to base64
      const image = Buffer.concat(chunks).toString("base64");

      //👇🏻 logs the result
      console.log({
        image,
        email: fields.email[0],
        gender: fields.gender[0],
        userPrompt: fields.userPrompt[0],
      });

      if (err) reject(err);
      resolve({
        image,
        email: fields.email[0],
        gender: fields.gender[0],
        userPrompt: fields.userPrompt[0],
      });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //get the data from the form, including the image as a base64 string
    const result = await readFile(req, true);
    //send event to Trigger.dev
    const event = await client.sendEvent({
      name: "generate.avatar",
      payload: result,
    });
    res.status(200).json({ message: "Processing!", eventId: event.id });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ message: e.message });
      return;
    }

    res.status(500).json({ message: "Unknown error" });
  }
}