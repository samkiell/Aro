# PRD: Aro - The AI Aro Bot

## Overview
A single-page web app that generates "Aro" (Nigerian campus-style roasts) for OAU students based on their Department and Residential Hostel. 

## Target Audience
Great Ife students at BWAI OAU event looking for a laugh.

## Core Features
1. **The Burn Form:** Two simple dropdowns/inputs for Department and Hostel.
2. **Gemini Roaster:** An AI integration using Gemini 1.5 Flash to generate savage but funny roasts.
3. **The Burn Card:** A sleek, Framer Motion-animated card that reveals the roast.
4. **Share to WhatsApp:** A quick button to share the roast text to WhatsApp status.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **AI:** @google/generative-ai (Gemini 1.5 Flash)
- **Notifications:** react-hot-toast
- **Deployment:** Cloud Run / Vercel


Structure
/burn-oau
├── app/
│   ├── api/burn/route.ts   <-- Gemini Logic
│   ├── layout.tsx          <-- Providers & Toast
│   └── page.tsx            <-- The Burn UI
├── components/
│   ├── BurnForm.tsx        <-- Inputs
│   └── RoastDisplay.tsx    <-- Framer Motion Result
├── lib/
│   ├── gemini.ts           <-- SDK Config
│   └── constants.ts        <-- OAU Depts/Hostels list