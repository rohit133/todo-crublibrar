'use client';
import { useEffect } from 'react';
import { TodoList } from '@/components/todos/TodoList';

export default function Home() {
  useEffect(() => {
    // Check for API credentials
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiKey || !apiUrl) {
      console.warn('API credentials not found. Please set API_KEY and API_URL in your .env file.');
    }
  }, []);

  return (
    <main>
      <TodoList />
    </main>
  );
}
