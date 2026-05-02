import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { MOCK_CANDIDATES } from './data';

describe('Civic Voter App Tests', () => {
  it('renders the landing page with the main title', () => {
    render(<App />);
    expect(screen.getByText(/Every Vote/i)).toBeDefined();
    expect(screen.getByText(/India's Future/i)).toBeDefined();
  });

  it('navigates to Candidate Intelligence page', () => {
    render(<App />);
    const candidateLink = screen.getByRole('button', { name: /Candidates/i });
    fireEvent.click(candidateLink);
    expect(screen.getByText(/Know Your/i)).toBeDefined();
    expect(screen.getByText(/Representatives/i)).toBeDefined();
  });

  it('filters candidates based on search input', () => {
    render(<App />);
    // Navigate to candidates
    fireEvent.click(screen.getByRole('button', { name: /Candidates/i }));
    
    const searchInput = screen.getByPlaceholderText(/Enter Constituency/i);
    fireEvent.change(searchInput, { target: { value: 'Mumbai South' } });
    
    // Check if correct candidates are visible (Arvind Krishna is in Mumbai South)
    expect(screen.getByText(/Arvind Krishna/i)).toBeDefined();
    
    // Check for a candidate not in Mumbai South (Sanjay Singhania is in Delhi North)
    const delCandidate = screen.queryByText(/Sanjay Singhania/i);
    expect(delCandidate).toBeNull();
  });

  it('renders the news intelligence section', () => {
    render(<App />);
    const newsLink = screen.getByRole('button', { name: /Intelligence/i });
    fireEvent.click(newsLink);
    expect(screen.getByText(/Democratic Dispatch/i)).toBeDefined();
  });
});
