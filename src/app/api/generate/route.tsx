import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/trigger";

const readFile = (req: NextRequest, saveLocally?: boolean) => {
  return new Promise<{
    image: string;
    email: string;
    gender: string;
    userPrompt: string;
  }>(async (resolve, reject) => {
    req.formData()
      .then((data) => {
        resolve({
          image: data.get("image") as string,
          email: data.get("email") as string,
          gender: data.get("gender") as string,
          userPrompt: data.get("userPrompt") as string,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export async function POST(req: NextRequest) {
  try {
    // get the data from the form
    const result = await readFile(req, true);

    // send event to Trigger.dev
    await client.sendEvent({
      name: "generate.avatar",
      payload: result,
    });
    console.log("Processing!");
    return NextResponse.json({ message: "Processing!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error: ", e.message);
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
    console.log("Error: Unknown");
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
