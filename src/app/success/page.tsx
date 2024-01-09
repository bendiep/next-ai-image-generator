import Link from "next/link";
import Head from "next/head";

export default function Success() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Head>
        <title>Success | Avatar Generator</title>
      </Head>
      <h2 className="mb-2 text-3xl font-bold">Thank you! 🌟</h2>
      <p className="mb-4 text-center">
        Your image will be delivered to your email, once it is ready! 💫
      </p>
      <Link
        href="/"
        className="rounded bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
      >
        Generate another
      </Link>
    </div>
  );
}
