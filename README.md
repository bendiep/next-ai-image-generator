# AI Image Generator
A web application that allows users to generate AI images of themselves based on the prompt provided and sends the images out via. email.\

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Functionality
- Upload images to a local directory in [Next.js](https://nextjs.org/)
- Create and manage long-running jobs with [Trigger.dev](https://trigger.dev/)
- Generate AI images using various models on [Replicate](https://replicate.com/)
- Send emails via [Resend](https://resend.com/) in [Trigger.dev](https://trigger.dev/)

## Run Application
```bash
# Start Next.js App
npm run dev

# Establish a tunnel between Trigger.dev and the Next.js App.
npx @trigger.dev/cli@latest dev
```

## Technology
- [Next.js](https://nextjs.org/) - a React framework for building full-stack web applications.
- [Trigger.dev](https://trigger.dev/) - a web platform that offers three communication methods: webhook, schedule, and event.
- [Replicate](https://replicate.com/) - a web platform that allows users to run models at scale in the cloud.
- [Resend](https://resend.com/) - an email API that enables you to send texts, attachments, and email templates easily.
- [Formidable](https://www.npmjs.com/package/formidable) - a library for parsing form data, especially file uploads.
- [Zod](https://zod.dev/) - a TypeScript-first type-checking and validation library that enables you to verify the data type of a job's payload.

## Resources
- [Tutorial](https://trigger.dev/blog/turn-your-face-into-a-super-hero) - a tutorial for building this application.
- [Lexica](https://lexica.art) - a good resource for finding image generation prompts.
