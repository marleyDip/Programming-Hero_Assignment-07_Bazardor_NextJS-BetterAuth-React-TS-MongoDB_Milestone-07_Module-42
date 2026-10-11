<div align="center">


# 🛒 বাজার দর | BazarDor

### Your Everyday Market Price Companion
### আজকের বাজারদর, এক নজরে

**Daily grocery prices for Bangladesh, all in one place.**

[**🌐 Live Demo**](https://sofian-bazardor.vercel.app) · [**🐛 Report a Bug**](../../issues) · [**💡 Request a Feature**](../../issues)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---


## 📖 About the Project

**বাজার দর (BazarDor)** is a responsive web application designed to help people in Bangladesh explore the latest available prices of essential daily products. Users can browse products, filter by category, compare prices, discover rising and falling price trends, and access personalized features through authentication.

The goal is to make market-price information easier to access, helping consumers make more informed and budget-conscious shopping decisions.

It is built with **Next.js (App Router)**, **TypeScript**, **MongoDB** and **Better Auth**, and is deployed on **Vercel**.

> Built as **Assignment 07 · Milestone 07 · Module 42** of the Programming Hero course.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Challenges & Solutions](#-challenges--solutions)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📌 Project Overview

| Property | Details |
| --- | --- |
| Project Name | বাজার দর (BazarDor) |
| Project Type | Market Price Information Platform |
| Framework | Next.js |
| Language | TypeScript |
| Authentication | Better Auth |
| Database | MongoDB |
| Styling | Tailwind CSS, DaisyUI |
| Repository | [GitHub Repository](https://github.com/marleyDip/Programming-Hero_Assignment-07_Bazardor_NextJS-BetterAuth-React-TS-MongoDB_Milestone-07_Module-42) |

---

## ✨ Key Features

### 1. 🛍️ Dynamic Product Listings

- Browse essential daily products with their available market prices.
- View product information in a clean, organized layout.
- Explore product details through dynamic routes.
- Fetch product data from the provided API.

### 2. 🔎 Category Filtering & Price Sorting

- Filter products by category.
- Browse category-specific product listings.
- Sort products by default order, lowest price, or highest price.
- Handle Bengali numerals correctly by comparing numeric values rather than strings.

### 3. 📈 Market Price Trends

- Explore products with rising prices.
- Discover products with falling prices.
- View market information in dedicated sections to understand price movements more easily.

### 4. 🔐 Authentication & Protected Routes

- Register and sign in using Better Auth.
- Support configured authentication providers, including social login where enabled.
- Protect pages that require an authenticated user.
- Access profile information and update personal details.

### 5. 📱 Responsive Design & User Experience

- Adapt the interface to mobile, tablet, and desktop screens.
- Display loading skeletons while product data is being fetched.
- Provide helpful empty states, error handling, and toast notifications.
- Include user-friendly navigation and custom 404 pages.
- Support dynamic product and category routes.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) | Application framework, routing, and server-side capabilities |
| **UI Library** | [React 19](https://react.dev/) | Component-based user interface |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Static typing and improved code reliability |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling and responsive layouts |
| **Authentication** | [Better Auth](https://www.better-auth.com/) | Authentication and session management |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL database for persistent application data |
| **Icons** | [Lucide React](https://lucide.dev/) | Icons and interface elements |
| **Deployment** | [Vercel](https://vercel.com/) | Deployment and hosting |
| **Icons** | [Lucide React](https://lucide.dev/) | Icons |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) | Alert & Notifications |

---

## 🧩 Challenges & Solutions

### 1. Handling Bengali Numerals During Price Sorting

**Challenge:**  
Market prices may be displayed using English numerals, such as `125` and `80`. Comparing these values as strings can produce an incorrect sorting order. Prices, dates and percentages had to read naturally in Bangla (for example `১,৮৫০ টাকা` and `রবিবার, ১১ অক্টোবর`), and the percentage change had to be correct, including the "no change" case where the old and new price are equal.

**Approach:**

- Normalize English numerals into their corresponding Bengali numerals.
- Convert the normalized values into numbers before comparison.
- Use a numeric comparator for ascending and descending price sorting.
- Preserve the intended default product order when no sorting option is selected.
- I wrote small, reusable formatting helpers built on the `Intl` API with the `bn-BD` locale for numbers and dates.
- One function computes the percentage change and returns a direction (up, down or none), which one badge component uses everywhere. That keeps the logic in one place and the UI consistent.

**Outcome:**  
Price sorting becomes more reliable while maintaining a Bengali-friendly interface.

### 2. Integrating Authentication With Protected Pages

**Challenge:**  
Authentication requires proper session handling, access control, and a consistent experience when users navigate to protected pages.

**Approach:**

- Integrate Better Auth for authentication and session management.
- Check authentication status before rendering protected content.
- Redirect unauthenticated users to the appropriate authentication page.
- Provide feedback through toast notifications and support profile updates.

**Outcome:**  
Authenticated users can access protected features through a more consistent and controlled workflow.

### 3. Reliable API Data Fetching & Production Deployment

**Challenge:**  
External APIs can fail or respond slowly, and dynamic routes may behave differently in production than in local development.

**Approach:**

- Centralize API requests to make data fetching easier to maintain.
- Configure a fallback API base URL where supported.
- Add loading skeletons, error handling, and empty states.
- Handle invalid product and category routes with appropriate 404 pages.
- Test direct navigation and page refreshes on dynamic routes after deployment.

**Outcome:**  
The application provides a more resilient browsing experience and is better prepared for production deployment.

### 4: Integrating Better Auth with MongoDB in Next.js

**Problem:**
Better Auth needs a database adapter, and in Next.js the MongoDB client can be created again and again during hot reloads in development, which opens too many connections.

**Approach:**

- I used the official `@better-auth/mongo-adapter` and created a single, reusable MongoDB client in one shared module.
- The auth config is created once in a server-only file and exposed through one API route, so all auth logic stays in a single place.

---

## 📂 Project Structure

The following is a conceptual overview; adjust the paths to match your actual repository.

```text
bazardor/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── category/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
|   |   ├── Auth/
│   │   ├── Category/
│   │   ├── Product/
│   │   ├── Home/
│   │   ├── Common/
│   │   ├── Profile/
│   │   ├── Layout/
│   │   └── Skeleton/
│   ├── lib/
|   |   ├── api.ts
│   │   ├── auth-client.ts
│   │   ├── auth-server.ts
│   │   ├── auth.ts
│   │   ├── formatters.ts
│   │   ├── product-sort.ts
│   │   ├── site-stats.ts
│   │   └── type.ts
│   └── proxy.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run BazarDor locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) — a version compatible with your Next.js installation.
- npm, or another supported package manager.
- A MongoDB database connection.
- The required authentication provider credentials if social login is enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/marleyDip/Programming-Hero_Assignment-07_Bazardor_NextJS-BetterAuth-React-TS-MongoDB_Milestone-07_Module-42.git
```

### 2. Navigate to the Project Directory

```bash
cd Programming-Hero_Assignment-07_Bazardor_NextJS-BetterAuth-React-TS-MongoDB_Milestone-07_Module-42
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add the environment variables required by your application.

See the [Environment Variables](#-environment-variables) section below.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Add the variables required by your actual configuration to `.env.local`.

Typical examples include:

```env
# Application URL
BETTER_AUTH_URL=http://localhost:3000

# Authentication secret
BETTER_AUTH_SECRET=your_generated_secret

# MongoDB connection
MONGODB_URI=your_mongodb_connection_string

# Social login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Optional API configuration
NEXT_PUBLIC_API_BASE_1=https://api.api-store.workers.dev/api/bazardor
NEXT_PUBLIC_API_BASE_2=https://api.abcz.workers.dev/api/bazardor
```

**Important:** These names are examples based on the project's technology stack and API configuration. Check your source code for the exact environment variable names your application expects. Never commit `.env.local`, database credentials, authentication secrets, or OAuth client secrets to GitHub.

---

## 📜 Available Scripts

The following are standard scripts for a typical Next.js project. Confirm their availability in your `package.json`.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run the configured linting checks, if available |

---

## 🔮 Future Improvements

- Add historical price charts to track changes over time.
- Introduce location-based market prices.
- Allow users to save favorite products.
- Provide price-drop alerts and notifications.
- Add more advanced search and filtering options.

---

## 👨‍💻 Author

<div align="center">

  <h2>✨ Md. Sofian Hasan ✨</h2>

  <p>
    <strong>Software Engineer | Full-Stack (MERN / PERN) Developer</strong>
  </p>

  <p align="center">

[![🌐 Portfolio](https://img.shields.io/badge/🌐_Portfolio-Visit_Website-0A0A0A?style=for-the-badge)](https://marleydip.netlify.app/)
&nbsp;
[![💻 GitHub](https://img.shields.io/badge/💻_GitHub-View_Profile-181717?style=for-the-badge&logo=github)](https://github.com/marleyDip)

</p>

</div>

<p align="center">
  Passionate about building <strong>modern, scalable, and user-focused web applications</strong> while continuously strengthening <b><i>JavaScript, TypeScript, problem-solving, and full-stack development skills</i></b>.
</p>

### 🚀 Tech Focus

<div align="center">

<img src="https://skillicons.dev/icons?i=js,ts,react,nextjs,tailwind,nodejs,express,nestjs,mongodb,postgres" alt="Tech Stack" />

<br /><br />

<img src="https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge" alt="MERN Stack" />
<img src="https://img.shields.io/badge/PERN-Stack-336791?style=for-the-badge" alt="PERN Stack" />

</div>
