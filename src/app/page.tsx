"use client";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const router = useRouter();

  const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
    console.log('here');
    e.preventDefault();
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("gender", gender);
      formData.append("email", email);
      formData.append("userPrompt", userPrompt);
      const result = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const json = await result.json();
      router.push(`/result/${json.eventId}`);
    } catch (err) {
      console.error({ err });
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 md:p-8">
      <Head>
        <title>Avatar Generator</title>
      </Head>
      <header className="mb-8 flex w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Avatar Generator</h1>
        <p className="opacity-60">
          Upload a picture of yourself and generate your avatar
        </p>
      </header>

      <form
        method="POST"
        className="flex w-full flex-col md:w-[60%]"
        onSubmit={(e) => handleFileUpload(e)}
      >
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          required
          className="mb-3 border-[1px] px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="gender">Gender</label>
        <select
          className="mb-4 rounded border-[1px] px-4 py-3"
          name="gender"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label htmlFor="image">Upload your picture</label>
        <input
          name="image"
          type="file"
          className="mb-3 rounded-md border-[1px] px-4 py-2"
          accept=".png, .jpg, .jpeg"
          required
          onChange={({ target }) => {
            if (target.files) {
              const file = target.files[0];
              setSelectedFile(file);
            }
          }}
        />
        <label htmlFor="prompt">
          Add custom prompt for your avatar
          <span className="opacity-60">(optional)</span>
        </label>
        <textarea
          rows={4}
          className="w-full border-[1px] p-3"
          name="prompt"
          id="prompt"
          value={userPrompt}
          placeholder="Copy image prompts from https://lexica.art"
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="mt-5 rounded bg-blue-500 px-6 py-4 text-lg text-white hover:bg-blue-700"
        >
          Generate Avatar
        </button>
      </form>
    </main>
  );
}
