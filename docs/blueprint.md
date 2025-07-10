# **App Name**: CampusConnect AI

## Core Features:

- User Authentication: Enable user authentication via Google or email/password through Firebase Authentication.
- Interest Tag Collection: Collect interest tags (2-3) from users during their first login and store them in Firestore under the 'users' collection.
- Ask Gemini: Provide a text input box where students can type technical questions. Use a tool to manage user questions, query Gemini Pro API, and display the AI response on screen.
- Question/Answer Storage: Store the user's question and the AI-generated answer in Firestore under the 'questions' collection.
- Find Collaborators: Display a list of users with similar interest tags retrieved from Firestore. Show their display name and interest tags. Add a 'Connect' button that doesn't implement chat functionality for the MVP.
- Event Discovery + Bookmarking: Fetch events from Firestore ('events' collection) that match the user's interest tags. Display event details as cards with a 'Bookmark' button. Save bookmarked event IDs to /users/{uid}/bookmarkedEvents.
- "Did You Mean" Suggestions from Gemini: After Gemini responds to a question, generate 'Did You Mean' suggestions by sending a secondary prompt to Gemini to suggest 2 related or alternative ways to ask the original question. Display these suggestions in a subtle info box.
- User Profile Page: Add a user profile page displaying displayName, email, and interestTags from /users/{uid}, and recent questions from /questions. Include an 'Edit Interests' button to let users update their tags.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a modern, trustworthy feel.
- Background color: Very light Indigo (#E8EAF6). The background color is a lighter, desaturated version of the primary to keep a clean, consistent look.
- Accent color: Purple (#7E57C2), slightly analogous to Indigo and offset in brightness and saturation, will direct user attention to key interactive elements and notifications.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text; 'Inter' (sans-serif) for longer text, when needed.
- Use simple, outline-style icons from a library like FontAwesome or Material Icons to represent different interest tags and actions.
- Maintain a clean, responsive layout using flexbox and/or grid. Use Tailwind CSS spacing and sizing utilities for consistent spacing.
- Subtle transitions and animations on button hovers and content loading to enhance user experience without being distracting.