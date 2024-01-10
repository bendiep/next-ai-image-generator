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
    const { email, image, gender, userPrompt } = payload;

    await io.logger.info("Avatar generation started!", { image });

    //👇🏻 trigger image generation via. Replicate's Stability AI Model
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

    if (imageGenerated.output === undefined || imageGenerated.error !== null) {
      if (imageGenerated.error !== null) {
        throw new Error(JSON.stringify(imageGenerated.error));
      }
      throw new Error("Character generation failed");
    }


    //👇🏻 trigger image generation via. Replicate's Face-Swap AI Model
    const swappedImage = await io.replicate.run("create-image", {
      // @ts-ignore
      identifier: process.env.FACESWAP_AI_URL,
      input: {
        // @ts-ignore
        target_image: await urlToBase64(imageGenerated.output),
        swap_image: "data:image/png;base64," + image,
      },
    });

    if (swappedImage.output === undefined || swappedImage.error !== null) {
      if (swappedImage.error !== null) {
        throw new Error(JSON.stringify(swappedImage.error));
      }
      throw new Error("Character generation failed");
    }

		await io.logger.info("Swapped image: ", swappedImage.output);
		await io.logger.info("✨ Congratulations, your image has been swapped! ✨");


    //👇🏻 -- Sends the swapped image to the user
    await io.resend.emails.send("send-email", {
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Your avatar is ready! 🌟🤩",
      text: `Hi! \n View and download your avatar here - ${swappedImage.output}`,
    });

    await io.logger.info(
      "✨ Congratulations, the image has been delivered! ✨"
    );
	},
});
