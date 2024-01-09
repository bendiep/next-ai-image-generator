import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { Replicate } from "@trigger.dev/replicate";
import { z } from "zod";

const replicate = new Replicate({
  id: "replicate",
  // @ts-ignore
  apiKey: process.env.REPLICATE_API_TOKEN,
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
  //👇🏻 integrates Replicate
  integrations: { replicate },
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

    const imageGenerated = await io.replicate.run("create-model", {
      // @ts-ignore
      identifier: process.env.STABILITY_AI_URI || '',
      input: {
        prompt: `${
          userPrompt
            ? userPrompt
            : `A professional ${gender} portrait suitable for a social media avatar. Please ensure the image is appropriate for all audiences.`
        }`,
      },
    });

    const swappedImage = await io.replicate.run("create-image", {
      // @ts-ignore
      identifier: process.env.FACESWAP_AI_URL,
      input: {
        // @ts-ignore
        target_image: await urlToBase64(imageGenerated.output),
        swap_image: "data:image/png;base64," + image,
      },
    });

		await io.logger.info("Swapped image: ", {swappedImage.output});
		await io.logger.info("✨ Congratulations, your image has been swapped! ✨");
	},
});
