import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock dependencies
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: any) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  Marker: () => <div data-testid="map-marker" />,
  InfoWindow: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      startChat: vi.fn().mockReturnValue({
        sendMessage: vi.fn().mockResolvedValue({
          response: { text: () => 'Mock AI response' }
        })
      })
    })
  }))
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('Civic Vote Application Integration Tests', () => {
  it('renders landing page correctly', () => {
    render(<App />);
    expect(screen.getByText(/Every Vote/i)).toBeDefined();
  });

  it('navigates to different sections via desktop nav', () => {
    render(<App />);
    
    // Candidates
    const candidatesLink = screen.getByRole('button', { name: /Candidates/i });
    fireEvent.click(candidatesLink);
    expect(screen.getByPlaceholderText(/Enter Constituency/i)).toBeDefined();

    // AI Desk
    const assistantLink = screen.getByRole('button', { name: /AI DESK/i });
    fireEvent.click(assistantLink);
    expect(screen.getByText(/Civic AI Desk/i)).toBeDefined();

    // Results
    const resultsLink = screen.getByRole('button', { name: /RESULTS/i });
    fireEvent.click(resultsLink);
    expect(screen.getByText(/Election Manifestation/i)).toBeDefined();
  });

  it('validates candidate search results filtering', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Candidates/i }));
    const searchInput = screen.getByPlaceholderText(/Enter Constituency/i);
    fireEvent.change(searchInput, { target: { value: 'Mumbai South' } });
    expect(screen.getByText(/Arvind Krishna/i)).toBeDefined();
  });

  it('allows opening AI assistant FAB and sending messages', async () => {
    render(<App />);
    const fabButton = screen.getByLabelText(/Open Civic Assistant/i);
    fireEvent.click(fabButton);
    const input = screen.getByPlaceholderText(/Type your query/i);
    fireEvent.change(input, { target: { value: 'How to vote?' } });
    fireEvent.click(screen.getByRole('button', { name: '' })); // The send button has no text but an icon
    
    await waitFor(() => {
      expect(screen.getByText(/Mock AI response/i)).toBeDefined();
    });
  });

  it('renders election results charts correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /RESULTS/i }));
    expect(screen.getByText(/National Seat Share/i)).toBeDefined();
    expect(screen.getByText(/Party Performance/i)).toBeDefined();
  });
});
