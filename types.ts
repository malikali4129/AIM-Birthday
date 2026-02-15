
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Birthday {
  id: string;
  userId: string; // Foreign key
  name: string;
  date: string; // ISO string YYYY-MM-DD
  category: 'Family' | 'Friend' | 'Work' | 'Other';
  themeColor: string;
  notes?: string;
}

export interface WishTemplate {
  id: string;
  category: string;
  text: string;
}

export type ViewState = 'dashboard' | 'create' | 'wish-maker' | 'auth';
