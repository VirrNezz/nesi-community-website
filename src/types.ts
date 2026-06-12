export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface Friend {
  id: string;
  name: string;
  species: string;
  species_en?: string;
  avatarUrl: string; // fallback to default if empty
  characteristics: string[]; // ciri-ciri
  characteristics_en?: string[];
  type: 'normal' | 'sahabat' | 'pacar'; // normal (cyan), sahabat (gold), pacar (purple-to-pink)
  bio: string;
  bio_en?: string;
  socials: SocialLink[];
}

export interface Connection {
  id: string;
  platform: string;
  url: string;
  handle: string;
  color: string; // custom cyan / pink / gold hex/class
  iconName: string; // name in lucide icons map
  status: string; // active state text like "ONLINE", "ACTIVE", etc
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  question_en?: string;
  answer_en?: string;
}

export interface SoftwareItem {
  id: string;
  name: string;
  version: string;
  type: string;
  type_en?: string;
  status: string;
  description: string;
  description_en?: string;
}

export interface StackItem {
  id: string;
  name: string;
  category: string;
  category_en?: string;
  proficiencyLevel: number; // 0 to 100
  color: string;
}

export interface Contributor {
  id: string;
  name: string;
  role: string[];
  role_en?: string[];
  specs: string;
  specs_en?: string;
  avatarSeed: string;
  avatarUrl?: string;
}
