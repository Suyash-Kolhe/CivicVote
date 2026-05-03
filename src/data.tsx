import { ReactNode } from 'react';
import { UserCheck, Search, MapPin, Fingerprint, ShieldCheck, Building2 } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  icon: ReactNode;
  phase: 'Pre-Poll' | 'Polling Day' | 'Post-Poll';
  keyDate?: string;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  partyLogo: string;
  partyColor: string;
  partyIcon: string;
  constituency: string;
  education: string;
  assets: string;
  assetsDetail: string;
  liabilities: string;
  liabilitiesDetail: string;
  criminalCases: number;
  criminalDetail: string;
  manifesto: string[];
  attendance: number;
  debates: number;
  questions: number;
  bills: number;
  spending: string;
}

export interface NewsArticle {
  id: number;
  category: 'pre-poll' | 'polling-day' | 'post-poll';
  title: string;
  source: string;
  time: string;
  summary: string;
  url: string;
  importance: 'high' | 'normal';
  region?: string;
  constituency?: string;
}

export const INDIAN_ELECTION_STEPS: Step[] = [
  {
    id: 1,
    title: "Voter Registration",
    description: "Enroll locally to be included in the Electoral Roll.",
    longDescription: "Use Form 6 to register as a new voter. Eligibility: Indian citizenship and 18+ years of age.",
    icon: <UserCheck className="w-6 h-6" />,
    phase: "Pre-Poll",
    keyDate: "Year-Round (Revision cycles apply)"
  },
  {
    id: 2,
    title: "Verify Your Name",
    description: "Search the Electoral Roll to confirm eligibility.",
    longDescription: "Confirm your name is in the current Electoral Roll at the ECI search portal.",
    icon: <Search className="w-6 h-6" />,
    phase: "Pre-Poll",
  },
  {
    id: 3,
    title: "Booth Verification",
    description: "Identify your Polling Station and Part Number.",
    longDescription: "Check your Voter Information Slip (VIS) for specific polling station details.",
    icon: <MapPin className="w-6 h-6" />,
    phase: "Polling Day",
  },
  {
    id: 4,
    title: "EVM & VVPAT Voting",
    description: "Cast your vote electronically with paper verification.",
    longDescription: "Use Electronic Voting Machines (EVM) with VVPAT verification.",
    icon: <Fingerprint className="w-6 h-6" />,
    phase: "Polling Day",
  },
  {
    id: 5,
    title: "Mark of the Citizen",
    description: "Receiving the indelible ink marking.",
    longDescription: "Indelible ink is applied as a symbol of your exercised franchise.",
    icon: <ShieldCheck className="w-6 h-6" />,
    phase: "Polling Day",
  },
  {
    id: 6,
    title: "Declaration of Will",
    description: "Counting and official results by the ECI.",
    longDescription: "Votes are counted under RO supervision and results declared constituency-wise.",
    icon: <Building2 className="w-6 h-6" />,
    phase: "Post-Poll",
  }
];

// Mock data moved here to save App.tsx space
/**
 * Interface for AI Assistant messages
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Valid navigation pages for the application
 */
export type Page = 'home' | 'booth' | 'candidates' | 'journey' | 'eligibility' | 'methods' | 'quiz' | 'news' | 'assistant' | 'results';

export const ELECTION_DATE = new Date('2026-05-15');

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Dr. Arvind Krishna",
    party: "National Progress Party",
    partyLogo: "NPP",
    partyColor: "bg-emerald-600",
    partyIcon: "zap",
    constituency: "Mumbai South",
    education: "PhD in Public Policy (LSE)",
    assets: "₹12.5 Cr",
    assetsDetail: "Residential property in Mumbai (₹8Cr), Investments (₹4Cr), Savings (₹50L)",
    liabilities: "₹45 L",
    liabilitiesDetail: "Home Loan (₹40L), Personal Loan (₹5L)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Modernization of urban transport infrastructure",
      "Digital transparency in local governance",
      "Expansion of public healthcare clinics"
    ],
    attendance: 94,
    debates: 42,
    questions: 156,
    bills: 8,
    spending: "92%"
  },
  {
    id: 2,
    name: "Meera Deshmukh",
    party: "People's Democratic Alliance",
    partyLogo: "PDA",
    partyColor: "bg-blue-600",
    partyIcon: "users",
    constituency: "Mumbai South",
    education: "Masters in Social Work (TISS)",
    assets: "₹4.2 Cr",
    assetsDetail: "Inherited farmland (₹2Cr), Flat in Thane (₹1.5Cr), Gold (₹70L)",
    liabilities: "₹12 L",
    liabilitiesDetail: "Car Loan (₹10L), Education Loan (₹2L)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Affordable housing initiatives for slum redevelopment",
      "Strengthening of women safety protocols",
      "Environmental protection of coastal areas"
    ],
    attendance: 88,
    debates: 28,
    questions: 94,
    bills: 3,
    spending: "85%"
  },
  {
    id: 3,
    name: "Sanjay Singhania",
    party: "United Citizens Forum",
    partyLogo: "UCF",
    partyColor: "bg-orange-500",
    partyIcon: "globe",
    constituency: "Delhi North",
    education: "B.Tech (IIT), MBA (IIM)",
    assets: "₹25.8 Cr",
    assetsDetail: "Industrial units (₹15Cr), Luxury flat (₹10Cr), Stocks (₹80L)",
    liabilities: "₹2 Cr",
    liabilitiesDetail: "Business expansions loan (₹2Cr)",
    criminalCases: 1,
    criminalDetail: "1 pending case related to public protest in 2021 (Sec 144 violation).",
    manifesto: [
      "Tech-driven education reforms in govt schools",
      "Air quality improvement mission",
      "Support for Small and Medium Enterprises (SMEs)"
    ],
    attendance: 72,
    debates: 15,
    questions: 44,
    bills: 1,
    spending: "65%"
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    party: "National Progress Party",
    partyLogo: "NPP",
    partyColor: "bg-emerald-600",
    partyIcon: "zap",
    constituency: "Delhi North",
    education: "Graduate (Arts, DU)",
    assets: "₹1.5 Cr",
    assetsDetail: "Ancestral home (₹1.2Cr), Savings (₹30L)",
    liabilities: "₹5 L",
    liabilitiesDetail: "Personal loan (₹5L)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Clean water access for all residential colonies",
      "Improved waste management systems",
      "Community sports facilities"
    ],
    attendance: 96,
    debates: 34,
    questions: 112,
    bills: 5,
    spending: "98%"
  },
  {
    id: 5,
    name: "Anita Sharma",
    party: "People's Democratic Alliance",
    partyLogo: "PDA",
    partyColor: "bg-blue-600",
    partyIcon: "users",
    constituency: "Mumbai North",
    education: "LLM (Cyber Law)",
    assets: "₹6.8 Cr",
    assetsDetail: "Apartment in Bandra (₹5Cr), Jewelry (₹1Cr), Bonds (₹80L)",
    liabilities: "₹85 L",
    liabilitiesDetail: "Home Loan (₹80L), Credit Card (₹5L)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Cybercrime protection cell for senior citizens",
      "Street light automation project",
      "Revamping of municipal parks"
    ],
    attendance: 91,
    debates: 31,
    questions: 128,
    bills: 4,
    spending: "89%"
  },
  {
    id: 6,
    name: "Vikram Malhotra",
    party: "Independent",
    partyLogo: "IND",
    partyColor: "bg-gray-500",
    partyIcon: "sparkles",
    constituency: "Delhi South",
    education: "B.Com (SRCC)",
    assets: "₹18.2 Cr",
    assetsDetail: "Retail showrooms (₹12Cr), Fleet of taxis (₹4Cr), Fixed Deposits (₹2.2Cr)",
    liabilities: "₹3.5 Cr",
    liabilitiesDetail: "Commercial property mortgage (₹3.5Cr)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Tax rebates for local startups",
      "Zero-garbage constituency initiative",
      "Free high-speed public Wi-Fi zones"
    ],
    attendance: 65,
    debates: 8,
    questions: 22,
    bills: 0,
    spending: "45%"
  },
  {
    id: 7,
    name: "Priyanka Reddy",
    party: "National Progress Party",
    partyLogo: "NPP",
    partyColor: "bg-emerald-600",
    partyIcon: "zap",
    constituency: "Bangalore Central",
    education: "M.Sc Computer Science",
    assets: "₹32.5 Cr",
    assetsDetail: "Software firm equity (₹20Cr), Tech park office (₹10Cr), Luxury residence (₹2.5Cr)",
    liabilities: "₹0",
    liabilitiesDetail: "No active debts reported.",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "AI-driven traffic management system",
      "Green energy corridors for electric vehicles",
      "Skill development centers for gig workers"
    ],
    attendance: 82,
    debates: 45,
    questions: 189,
    bills: 12,
    spending: "95%"
  },
  {
    id: 8,
    name: "Dr. Ramesh Chennithala",
    party: "United Citizens Forum",
    partyLogo: "UCF",
    partyColor: "bg-orange-500",
    partyIcon: "globe",
    constituency: "Kochi",
    education: "MBBS, MD",
    assets: "₹9.4 Cr",
    assetsDetail: "Medical diagnostic center (₹6Cr), Residential villa (₹3Cr), Pharma stocks (₹40L)",
    liabilities: "₹1.2 Cr",
    liabilitiesDetail: "Medical equipment leasing (₹1.2Cr)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Universal health coverage for small-scale farmers",
      "Marine ecosystem rejuvenation project",
      "Upgrading of port handling technology"
    ],
    attendance: 78,
    debates: 22,
    questions: 67,
    bills: 2,
    spending: "72%"
  },
  {
    id: 9,
    name: "Sunita Rao",
    party: "People's Democratic Alliance",
    partyLogo: "PDA",
    partyColor: "bg-blue-600",
    partyIcon: "users",
    constituency: "Ahmedabad West",
    education: "B.A. (Literature)",
    assets: "₹3.1 Cr",
    assetsDetail: "Handicraft emporium (₹1.5Cr), Ancestral land (₹1Cr), Gold (₹60L)",
    liabilities: "₹15 L",
    liabilitiesDetail: "Business inventory loan (₹15L)",
    criminalCases: 0,
    criminalDetail: "No pending criminal cases.",
    manifesto: [
      "Promotion of local textile heritage",
      "Heritage walk revival and maintenance",
      "Women-only vocational training cells"
    ],
    attendance: 89,
    debates: 18,
    questions: 42,
    bills: 1,
    spending: "81%"
  },
  {
    id: 10,
    name: "Mohammad Aziz",
    party: "National Progress Party",
    partyLogo: "NPP",
    partyColor: "bg-emerald-600",
    partyIcon: "zap",
    constituency: "Lucknow Central",
    education: "Graduate (Law, AMU)",
    assets: "₹5.6 Cr",
    assetsDetail: "Legal chambers (₹2.5Cr), Residential property (₹2.5Cr), Insurance policies (₹60L)",
    liabilities: "₹40 L",
    liabilitiesDetail: "Home renovation loan (₹40L)",
    criminalCases: 2,
    criminalDetail: "Two pending cases related to civil rights advocacy protests in 2022.",
    manifesto: [
      "Fast-track legal aid for underprivileged",
      "Smart drainage and sewer systems",
      "Preservation of Awadhi cultural sites"
    ],
    attendance: 93,
    debates: 38,
    questions: 145,
    bills: 6,
    spending: "90%"
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the minimum age to vote in an Indian General Election?",
    options: ["16 Years", "18 Years", "21 Years", "25 Years"],
    correct: 1,
    explanation: "As per the 61st Constitutional Amendment Act, 1988, the voting age was reduced from 21 to 18 years."
  },
  {
    id: 2,
    question: "What does VVPAT stand for?",
    options: ["Voter Verified Paper Audit Trail", "Voter Validated Paper Account Trail", "Voice Verified Paper Audit Track", "Virtual Voter Paper Audit Tool"],
    correct: 0,
    explanation: "VVPAT allows voters to verify that their vote was cast correctly."
  }
];

export interface PartyResult {
  party: string;
  seats: number;
  color: string;
  percentage: number;
}

export const ELECTION_RESULTS: PartyResult[] = [
  { party: 'National Progress Alliance', seats: 285, color: '#2563eb', percentage: 42.5 },
  { party: 'United People\'s Front', seats: 195, color: '#dc2626', percentage: 38.2 },
  { party: 'Federal Coalition', seats: 45, color: '#16a34a', percentage: 12.1 },
  { party: 'Others', seats: 18, color: '#94a3b8', percentage: 7.2 }
];

export const CONSTITUENCY_RESULTS = [
  { name: 'Mumbai North', winner: 'Rajesh Kumar', party: 'NPA', votes: '54%', margin: '45,000' },
  { name: 'Delhi South', winner: 'Anjali Sharma', party: 'UPF', votes: '49%', margin: '12,000' },
  { name: 'Bangalore Central', winner: 'Siddharth Rao', party: 'NPA', votes: '61%', margin: '89,000' },
  { name: 'Chennai West', winner: 'M. Karunanidhi', party: 'FC', votes: '52%', margin: '23,000' },
];

export const ELECTION_NEWS_FEED: NewsArticle[] = [
  {
    id: 1,
    category: 'pre-poll',
    title: "ECI Announces Final Electoral Roll: 968 Million Voters Registered",
    source: "Press Information Bureau",
    time: "2h ago",
    summary: "Record increase in young voters and female participation reported.",
    url: "https://eci.gov.in",
    importance: 'high',
    region: 'National'
  }
];

// --- Translations ---
export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'ta';

export interface TranslationSet {
  nav: { [key: string]: string };
  home: { [key: string]: string };
  candidates: { [key: string]: string };
  common: { [key: string]: string };
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    nav: { home: 'Home', booths: 'Booths', candidates: 'Candidates', process: 'Process', eligibility: 'Eligibility', methods: 'Methods', quiz: 'Quiz', news: 'Intelligence', signin: 'Sign In', register: 'Register To Vote' },
    home: { badge: 'Official Non-Partisan Data', title1: 'Every Vote', title2: 'Counts For', title3: "India's Future", subtitle: 'Largest Democracy', cta: 'Start Voting Process' },
    candidates: { badge: 'Candidate Intelligence', title: 'Know Your', titleSpan: 'Representatives', searchPlaceholder: 'Enter Constituency (e.g., Mumbai South)...', manifestoTitle: 'View Manifesto' },
    common: { poweredBy: 'Powered by', lang: 'English' }
  },
  hi: {
    nav: { home: 'होम', booths: 'बूथ', candidates: 'उम्मीदवार', process: 'प्रक्रिया', eligibility: 'पात्रता', methods: 'तरीके', quiz: 'क्विज़', news: 'समाचार', signin: 'साइन इन', register: 'वोट के लिए रजिस्टर करें' },
    home: { badge: 'आधिकारिक गैर-पक्षपाती डेटा', title1: 'हर वोट', title2: 'जरूरी है', title3: "भारत के भविष्य के लिए", subtitle: 'सबसे बड़ा लोकतंत्र', cta: 'मतदान प्रक्रिया शुरू करें' },
    candidates: { badge: 'उम्मीदवार जानकारी', title: 'अपने', titleSpan: 'प्रतिनिधियों को जानें', searchPlaceholder: 'क्षेत्र दर्ज करें (उदा. मुंबई दक्षिण)...', manifestoTitle: 'घोषणापत्र देखें' },
    common: { poweredBy: 'द्वारा संचालित', lang: 'हिन्दी' }
  },
  bn: {
    nav: { home: 'হোম', booths: 'বুথ', candidates: 'প্রার্থী', process: 'প্রক্রিয়া', eligibility: 'যোগ্যতা', methods: 'পদ্ধতি', quiz: 'কুইজ', news: 'সংবাদ', signin: 'সাইন ইন', register: 'ভোটের জন্য নিবন্ধন করুন' },
    home: { badge: 'অফিসিয়াল নিরপেক্ষ ডেটা', title1: 'প্রতিটি ভোট', title2: 'গণনা করা হয়', title3: "ভারতের ভবিষ্যতের জন্য", subtitle: 'বৃহত্তম গণতন্ত্র', cta: 'ভোট প্রক্রিয়া শুরু করুন' },
    candidates: { badge: 'প্রার্থী বুদ্ধিমত্তা', title: 'আপনার', titleSpan: 'প্রতিনিধিদের জানুন', searchPlaceholder: 'নির্বাচনী এলাকা লিখুন (যেমন, মুম্বাই দক্ষিণ)...', manifestoTitle: 'ম্যানিফেস্টো দেখুন' },
    common: { poweredBy: 'দ্বারা চালিত', lang: 'বাংলা' }
  },
  mr: {
    nav: { home: 'होम', booths: 'बूथ', candidates: 'उमेदवार', process: 'प्रक्रिया', eligibility: 'पात्रता', methods: 'पद्धती', quiz: 'चाचणी', news: 'बातम्या', signin: 'साइन इन', register: 'मतदानासाठी नोंदणी करा' },
    home: { badge: 'अधिकृत गैर-पक्षपाती डेटा', title1: 'प्रत्येक मत', title2: 'महत्त्वाचे आहे', title3: "भारताच्या भविष्यासाठी", subtitle: 'सर्वात मोठी लोकशाही', cta: 'मतदान प्रक्रिया सुरू करा' },
    candidates: { badge: 'उमेदवार माहिती', title: 'तुमचे', titleSpan: 'प्रतिनिधी जाणून घ्या', searchPlaceholder: 'मतदारसंघ प्रविष्ट करा (उदा. मुंबई दक्षिण)...', manifestoTitle: 'जाहीरनामा पहा' },
    common: { poweredBy: 'द्वारे समर्थित', lang: 'मराठी' }
  },
  ta: {
    nav: { home: 'முகப்பு', booths: 'சாவடிகள்', candidates: 'வேட்பாளர்கள்', process: 'செயல்முறை', eligibility: 'தகுதி', methods: 'முறைகள்', quiz: 'வினாடி வினா', news: 'செய்திகள்', signin: 'உள்நுழைக', register: 'வாக்களிக்க பதிவு செய்யுங்கள்' },
    home: { badge: 'அதிகாரப்பூர்வ சார்பற்ற தரவு', title1: 'ஒவ்வொரு வாக்கும்', title2: 'முக்கியமானது', title3: "இந்தியாவின் எதிர்காலத்திற்காக", subtitle: 'மிகப்பெரிய ஜனநாயகம்', cta: 'வாக்குப்பதிவு செயல்முறையைத் தொடங்குங்கள்' },
    candidates: { badge: 'வேட்பாளர் நுண்ணறிவு', title: 'உங்கள்', titleSpan: 'பிரதிநிதிகளைத் தெரிந்து கொள்ளுங்கள்', searchPlaceholder: 'தொகுதியை உள்ளிடவும் (எ.கா., மும்பை தெற்கு)...', manifestoTitle: 'அறிக்கையைப் பார்க்கவும்' },
    common: { poweredBy: 'ஆல் இயக்கப்படுகிறது', lang: 'தமிழ்' }
  }
};

export const INDIAN_LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' }
];
