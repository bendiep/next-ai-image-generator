# AI Image Generator
A web application that allows users to generate AI images of themselves based on the prompt provided and sends the images out via. email.\

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Functionality
- Upload images to a local directory in [Next.js](https://nextjs.org/)
- Create and manage long-running jobs with [Trigger.dev](https://trigger.dev/)
- Generate AI images using various models on [Replicate](https://replicate.com/)
- Send emails via [Resend](https://resend.com/) in [Trigger.dev](https://trigger.dev/)

## Setup
```bash
# Create '.env.local' file in root directory with the following Key/Value pairs.
# Account creation required for the following services to retrieve key values.

# Trigger.dev ~ Account Required
TRIGGER_API_KEY=<TRIGGER_API_KEY>
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY=<NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY>
TRIGGER_API_URL=https://api.trigger.dev

# Replicate ~ Account Required
REPLICATE_API_TOKEN=<REPLICATE_API_TOKEN>
STABILITY_AI_URI=stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316
FACESWAP_API_URI=lucataco/faceswap:9a4298548422074c3f57258c5d544497314ae4112df80d116f0d2109e843d20d

# Resend ~ Account Required
RESEND_API_KEY=<RESEND_API_KEY>
```

## Run Application
```bash
# Install Dependencies
npm install

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
- [Zod](https://zod.dev/) - a TypeScript-first type-checking and validation library that enables you to verify the data type of a job's payload.

## Limitations
- Image file size must be smaller than 150KB

## Resources
- [Tutorial](https://trigger.dev/blog/turn-your-face-into-a-super-hero) - a tutorial for building this application.
- [Lexica](https://lexica.art) - a good resource for finding image generation prompts.
