# Teetto Career Pivot Web App

A Next.js web application designed for seniors (50-60s) to transform their career experience into business opportunities.

## Features

- **Senior-Friendly Design**: Large fonts (text-xl to text-5xl), high contrast, simple UI
- **Career Analysis**: Input past career experience and get business ideas
- **PDF Report Generation**: Download a professional PDF with business blueprint
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Brand Colors**: Primary Orange (#FF8C00), Secondary Dark Green (#006400)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: html2canvas + jsPDF
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
career-pivot-app/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main application logic and UI
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   └── ui/
│       └── card.tsx        # Reusable card component
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Vercel will auto-detect Next.js and configure everything

5. Click "Deploy"

### Manual Deploy (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Future Enhancements

### OpenAI Integration

To replace mock data with real AI generation:

1. Install OpenAI SDK:
```bash
npm install openai
```

2. Add environment variable:
```env
OPENAI_API_KEY=your_api_key_here
```

3. Update `generateBusinessIdeas` function in `app/page.tsx`:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateBusinessIdeas = async (career: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a business consultant helping seniors find business opportunities based on their career experience."
      },
      {
        role: "user",
        content: `Generate 3 business ideas based on this career: ${career}`
      }
    ],
  });
  
  // Parse and return ideas
};
```

## Key Features Explanation

### 1. Landing Section
- Eye-catching headline emphasizing value of experience
- Clear call-to-action button
- Smooth scroll to input section

### 2. Career Input (Step 1)
- Large, accessible text area
- Helpful example prompt
- Loading animation during processing
- Mock AI generation (ready for OpenAI integration)

### 3. Business Ideas Selection (Step 2)
- 3 professional cards with problem/solution format
- Hover effects and selection highlighting
- Click to select an idea

### 4. PDF Report (Step 3)
- Preview of the report content
- One-click PDF download
- Professional formatting with:
  - Header with branding
  - Career summary
  - Selected business idea
  - Encouraging message
  - QR code placeholder

## Accessibility Features

- **Large Text**: Minimum 18px (text-lg) for body text
- **High Contrast**: Dark text on light backgrounds
- **Clear CTAs**: Large, bold buttons with descriptive text
- **Smooth Scrolling**: Gentle navigation between sections
- **Simple Language**: Encouraging, non-technical copy

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Support

For questions or issues, contact: support@teetto.com
