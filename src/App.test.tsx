import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock Firebase
vi.mock('./lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return () => {};
    }),
  },
  db: {},
  handleFirestoreError: vi.fn(),
  OperationType: { WRITE: 'write', GET: 'get' }
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return () => {};
  }),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

// Mock components that use external libs to avoid complex setup
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders landing page correctly', () => {
    render(<App />);
    expect(screen.getByText(/Every Vote/i)).toBeDefined();
  });

  it('navigates to different sections via desktop nav', async () => {
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
    expect(screen.getByText(/Post-Election Analytics/i)).toBeDefined();
  });

  it('allows switching languages', async () => {
    render(<App />);
    const langBtn = screen.getByText(/English/i);
    fireEvent.click(langBtn);
    
    const hindiBtn = screen.getByText(/हिन्दी/i);
    fireEvent.click(hindiBtn);
    
    expect(screen.getByText(/होम/i)).toBeDefined();
  });

  it('opens and closes the feedback modal', async () => {
    render(<App />);
    const feedbackBtn = screen.getByText(/Provide Feedback/i);
    fireEvent.click(feedbackBtn);
    
    expect(screen.getByText(/Citizen Voice/i)).toBeDefined();
    
    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);
    
    await waitFor(() => {
      expect(screen.queryByText(/Citizen Voice/i)).toBeNull();
    });
  });
});
