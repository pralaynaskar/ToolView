# ToolView: Your All-in-One Digital Toolkit

ToolView is a comprehensive, open-source web application built with Next.js, React, and ShadCN UI. Developed within Firebase Studio, it serves as a powerful showcase of modern web technologies, offering a massive collection of over 100 utilities, tools, mini-apps, and games.

## What Can It Do?

ToolView is designed to be your go-to digital swiss army knife. Its features are organized into several key categories:

-   **Calculators**: From a full-featured Scientific Calculator to specialized tools for finance (Loan, Investment, GST), algebra, and geometry.
-   **Unit Converters**: An extensive suite of converters for nearly every unit imaginable, including length, mass, temperature, data, speed, and energy.
-   **Text Tools**: Over 20 tools for text manipulation, such as case conversion, finding and replacing, sorting lines, and generating stylish fonts.
-   **Image Tools**: Utilities to resize, flip, round corners, or create beautiful gradient wallpapers.
-   **Developer Utilities**: Tools for developers, including JSON/CSS/HTML formatters, a Base Converter, and a Unicode Inspector.
-   **AI-Powered Features**: Engage with Google's Gemini models for chat and image generation, showcasing the power of Genkit.
-   **Mini-Apps & Games**: A collection of useful applications like a Weather app, Calendar, Notes, To-Do List, and classic games like Sudoku and a Memory Game.
-   **Modern, Themeable UI**: Built with ShadCN UI and Tailwind CSS, the entire application is responsive and features multiple color themes.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

-   [Node.js](https://nodejs.org/) (version 18.x or later is recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   A code editor of your choice, like [Visual Studio Code](https://code.visualstudio.com/).

## Getting Started & Local Deployment

To run ToolView on your local device, follow these steps:

**1. Clone the Repository**

First, get a copy of the project code. If you're in an environment like Firebase Studio, you already have it. Otherwise, clone it from your source control.

```bash
git clone https://github.com/pralaynaskar/ToolView.git
cd toolview
```

**2. Install Dependencies**

Navigate to the project directory and install the necessary packages using npm.

```bash
npm install
```

**3. Set Up Environment Variables**

Some features require API keys to function correctly. Create a new file named `.env.local` in the root of the project by copying the existing `.env` file.

```bash
cp .env .env.local
```

Now, open `.env.local` and add your API keys.

```plaintext
# For AI features (Gemini Chat, etc.)
# Get a key from Google AI Studio: https://makersuite.google.com/
GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"

# For the Weather App
# Get a key from: https://openweathermap.org/api
NEXT_PUBLIC_OPENWEATHER_API_KEY="YOUR_OPENWEATHERMAP_API_KEY"

# Optional: For AccuWeather provider
NEXT_PUBLIC_ACCUWEATHER_API_KEY="YOUR_ACCUWEATHER_API_KEY"
```
**Note:** Features that require these keys will show an error or be disabled until the keys are provided.

**4. Run the Development Servers**

ToolView uses two separate development servers: one for the Next.js frontend and one for the Genkit AI backend. You'll need to run both in separate terminal windows.

**Terminal 1: Start the Next.js App**

```bash
npm run dev
```
Your application will be available at `http://localhost:3000`.

**Terminal 2: Start the Genkit AI Server**

```bash
npm run genkit:watch
```
The Genkit server runs in watch mode and will be available at `http://localhost:3400`. The Next.js app is configured to automatically connect to it.

You're all set! You can now access and explore the full functionality of the ToolView application locally.
