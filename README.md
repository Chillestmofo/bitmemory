# DSA Recall

A minimalist, spaced-repetition tracking system designed specifically for Data Structures and Algorithms (DSA) preparation. 

When grinding LeetCode, Codeforces, or general interview prep, the biggest hurdle isn't understanding a pattern once—it's remembering it during an interview months later. **DSA Recall** solves this by automating the spaced repetition schedule (Days 3, 7, 15, and 30) for every problem you solve, ensuring optimal retention into long-term memory.

## Features

- **Automated Spaced Repetition**: Log a problem and the system automatically schedules reviews for exactly when you are most likely to forget it.
- **Offline-First / Lazy Sign-Up**: Try the app instantly without an account. Your data is saved locally and seamlessly synced to the cloud if you choose to sign up later.
- **Visual Revision Queue**: A clean, 14-day calendar strip shows exactly how many revisions are due each day.
- **Insight Capture**: Upload screenshots of handwritten notes, dry-runs, or code directly to the problem log. Images are compressed client-side to ensure lightning-fast loads.
- **Comprehensive Analytics**: Track your consistency, total revisions completed, and identify which DSA topics you struggle with the most.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Pure vanilla CSS variables for a strict, distraction-free "cyanish" pixel-art aesthetic. No heavy UI frameworks.
- **Database & Auth**: Firebase (Firestore + Google Authentication)
- **Deployment**: Vercel

## Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Chillestmofo/bitmemory.git
   cd bitmemory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Chillestmofo/bitmemory/issues).

## License

This project is open source and available under the [MIT License](LICENSE).
