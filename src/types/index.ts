export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  interestTags: string[];
  bookmarkedEvents: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  eventURL: string;
  tags: string[];
  image: string;
}

export interface Question {
  id: string;
  userId: string;
  question: string;
  answer: string;
  createdAt: string;
}
