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
- 

## Live link: https://bitmemory.vercel.app/

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Chillestmofo/bitmemory/issues).

## License

This project is open source and available under the [MIT License](LICENSE).
