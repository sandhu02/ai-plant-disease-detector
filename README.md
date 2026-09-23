# AgriGuard • AI Plant Disease Detector

A mobile-first web app that detects plant diseases from leaf photos and provides actionable organic and chemical solutions.

## Features

- **Instant Camera Capture**: Native device camera support (including Google Pixel & mobile browsers) plus photo gallery upload.
- **Zero-Prompt Diagnosis**: Purely image-driven—no text input required from the user.
- **Actionable Treatment Plans**:
  - 🌿 **Organic & Biological Remedies**: Eco-safe steps and prevention.
  - 🧪 **Chemical Controls**: Targeted active ingredients and application advice.
  - 🩺 **Rapid Metrics**: Pathogen type, moisture factor, and spread risk.
- **Hands-Free Audio**: Voice readout for field use.
- **Field History**: Automatically saves scan reports on the device.

## Getting Started

### 1. Environment Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop or `http://<your-local-ip>:3000` on your mobile device.

## Tech Stack

- **Framework**: Next.js (App Router) + React 19
- **Styling**: Tailwind CSS (Agriculture UI Kit theme)
- **AI Engine**: Gemini Vision API
