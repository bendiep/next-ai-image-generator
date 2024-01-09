# AI Image Generator
A web application that allows users to generate AI images of themselves based on the prompt provided and sends the images out via. email.
This application is using APIs by [Replicate](https://replicate.com/) for AI image generation and face-swapping functionality.
This application is using APIs by [Resend](https://resend.com/) for email functionality.
This applicating is using APIs by [Trigger.dev](https://trigger.dev/) as an orchestration layer.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Run Application
```bash
npm run dev
# or
bun dev
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