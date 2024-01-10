import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/app/trigger";
import { Replicate } from "@trigger.dev/replicate";
import { Resend } from "@trigger.dev/resend";
import { z } from "zod";

const replicate = new Replicate({
  id: "replicate",
  // @ts-ignore
  apiKey: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

//👇🏻 converts an image URL to a data URI
const urlToBase64 = async (image: string) => {
  const response = await fetch(image);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const mimeType = "image/png";
  const dataURI = `data:${mimeType};base64,${base64String}`;
  return dataURI;
};

//👇🏻 Trigger.dev Job Definition
client.defineJob({
  id: "generate-avatar",
  name: "Generate Avatar",
  //👇🏻 integrates Replicate & Resend
  integrations: { replicate, resend },
  version: "0.0.1",
  trigger: eventTrigger({
    name: "generate.avatar",
    schema: z.object({
      image: z.string(),
      email: z.string(),
      gender: z.string(),
      userPrompt: z.string().nullable(),
    }),
  }),
  run: async (payload, io, ctx) => {
    const { image, email, gender, userPrompt } = payload;

    //👇🏻 trigger image generation via. Replicate's Stability AI Model
    await io.logger.info("Replicate - Stability AI Model - Process started!");
    const imageGenerated = await io.replicate.run("create-model", {
      // @ts-ignore
      identifier: process.env.STABILITY_AI_URI,
      input: {
        prompt: `${
          userPrompt
            ? userPrompt
            : `A professional ${gender} portrait suitable for a social media avatar. Please ensure the image is appropriate for all audiences.`
        }`,
      },
    });
    console.log("Replicate - Stability AI Model - Image URL: ", imageGenerated.output[0]);
    await io.logger.info("Replicate - Stability AI Model - Process completed!");

    //👇🏻 trigger image generation via. Replicate's Face-Swap AI Model
    await io.logger.info("Replicate - Face-Swap AI Model - Process started!");
    const imageGeneratedBase64 = await urlToBase64(imageGenerated.output);
    const swappedImage = await io.replicate.run("create-image", {
      // @ts-ignore
      identifier: process.env.FACESWAP_AI_URI,
      input: {
        target_image: imageGeneratedBase64,
        swap_image: image,
      },
    });
    console.log("Replicate - Face-Swap AI Model - Image URL: ", swappedImage.output);
    await io.logger.info("Replicate - Face-Swap AI Model - Process completed!");

    //👇🏻 sends the swapped image to the user
    await io.logger.info("Resend - Send Email - Process started!");
    await io.resend.emails.send("send-email", {
      from: "faceswap-avatar@resend.dev",
      to: [email],
      subject: "Your avatar is ready! 🌟🤩",
      text: `Hi! \n\nView and download your avatar here - ${swappedImage.output}`,
    });
    await io.logger.info("Resend - Send Email - Process completed!");

    return {
      image: swappedImage.output,
    };
	},
});
