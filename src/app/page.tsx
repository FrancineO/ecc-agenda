"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ClientUserService } from '../../services/ClientUserService';
import styles from './HomePage.module.css';

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Please enter your email address or Pega ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await ClientUserService.findUser(input.trim());
      
      if (user) {
        // Store user info in localStorage for current session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        const defaultDay = ClientUserService.getDefaultDay();
        router.push(`/${user.breakoutGroup}/${defaultDay}`);
      } else {
        setError('User not found. Please check your email address or Pega ID and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <Image 
            src="https://cdn-public.softwarereviews.com/production/logos/offerings/2543/large/pega-logo1.png"
            alt="PEGA Logo"
            width={200}
            height={80}
            className={styles.logo}
          />
          <h2 className={styles.subtitle}>ECC 2025 Conference Agenda</h2>
          <p className={styles.description}>
            Enter your email address or Pega ID to access your personalized agenda
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="userInput" className={styles.label}>
              Email Address or Pega ID
            </label>
            <input
              id="userInput"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., john.doe@pega.com or JDOE"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Finding your agenda...' : 'Access My Agenda'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.helpText}>
            Need help? Contact your event organizer or IT support.
          </p>
        </div>
      </div>
    </div>
  );
}
