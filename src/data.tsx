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
export type Page = 'home' | 'booth' | 'candidates' | 'journey' | 'eligibility' | 'methods' | 'quiz' | 'news';

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
  // ... other articles would go here, but omitted for brevity in this step
];
