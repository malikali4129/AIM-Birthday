
import { User, Birthday } from '../types';

const USERS_KEY = 'joyful_users_db';
const BIRTHDAYS_KEY = 'joyful_birthdays_db';
const SESSION_KEY = 'joyful_session';

export const db = {
  // --- Auth Operations ---
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  signup: (name: string, email: string, password: string): User => {
    const users = db.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = { id: Date.now().toString(), name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  login: (email: string, password: string): User => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  },

  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  getSession: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // --- Birthday Operations ---
  getBirthdays: (userId: string): Birthday[] => {
    const data = localStorage.getItem(BIRTHDAYS_KEY);
    const all: Birthday[] = data ? JSON.parse(data) : [];
    return all.filter(b => b.userId === userId);
  },

  saveBirthday: (birthday: Birthday) => {
    const data = localStorage.getItem(BIRTHDAYS_KEY);
    const all: Birthday[] = data ? JSON.parse(data) : [];
    localStorage.setItem(BIRTHDAYS_KEY, JSON.stringify([...all, birthday]));
  },

  deleteBirthday: (id: string) => {
    const data = localStorage.getItem(BIRTHDAYS_KEY);
    const all: Birthday[] = data ? JSON.parse(data) : [];
    localStorage.setItem(BIRTHDAYS_KEY, JSON.stringify(all.filter(b => b.id !== id)));
  }
};
