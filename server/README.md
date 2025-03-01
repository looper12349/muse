# DSA Teaching Assistant - Backend

This repository contains the backend for a Data Structures and Algorithms (DSA) Teaching Assistant chat application. The application helps users learn and understand DSA problems from LeetCode by providing guidance, hints, and building intuition without giving direct solutions.

## Overview

The DSA Teaching Assistant is a chat-based application where users can:
1. Submit a LeetCode problem URL
2. Ask specific questions or express doubts about the problem
3. Receive guidance from an AI assistant that helps them understand the problem without providing a direct solution

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **LLM Integration**: OpenAI GPT or Google Gemini API
- **Web Scraping**: Axios, Cheerio (for fetching problem details)

## Project Structure

```
server/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # MongoDB models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Helper utilities
├── app.js              # Express app setup
├── server.js           # Server entry point
├── package.json        # Dependencies
└── .env                # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- OpenAI API key or Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/looper12349/muse.git
   cd muse/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/dsa-assistant
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=30d
   LLM_PROVIDER=openai  # 'openai' or 'google'
   LLM_API_KEY=your_api_key_here
   LLM_MODEL=gpt-4-turbo  # For OpenAI, use 'gemini-pro' for Google
   ```

4. Start the server:
   ```
   npm run dev
   ```

The server will be running at `http://localhost:5000`.

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details

### Problems

- `POST /api/problems` - Submit a LeetCode URL to create a problem
- `GET /api/problems/:id` - Get problem details by ID

### Threads

- `POST /api/threads` - Create a new conversation thread for a problem
- `GET /api/threads` - Get all threads for the current user
- `GET /api/threads/:id` - Get a specific thread with messages
- `POST /api/threads/:id/messages` - Send a message in a thread and get AI response

## LLM Integration Architecture

The backend uses a prompt engineering approach to generate helpful responses:

1. When a user submits a LeetCode problem URL, the system:
   - Validates the URL
   - Scrapes basic problem details (title, difficulty, etc.)
   - Stores the problem in the database

2. When a user asks a question:
   - The system gathers the conversation context and problem details
   - Constructs a carefully designed prompt for the LLM
   - Sends the prompt to either OpenAI's GPT or Google's Gemini API
   - Processes the response and sends it back to the user

3. The prompt engineering ensures the LLM:
   - Provides helpful guidance rather than direct solutions
   - Uses the Socratic method to lead users to their own understanding
   - Offers relevant examples and hints
   - Identifies edge cases and optimization opportunities

## Prompt Design

The system uses a carefully crafted system prompt that instructs the LLM to:
- Act as a teaching assistant specializing in DSA
- Never provide direct solutions
- Break down complex problems into manageable steps
- Use the Socratic method to guide users
- Explain relevant data structures and algorithms
- Help identify edge cases and optimizations

This prompt engineering ensures that the assistant helps users develop their problem-solving skills rather than simply providing answers.

## License

MIT