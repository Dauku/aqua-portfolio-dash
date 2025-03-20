
// Type definitions for our data models
export interface HeroData {
  id?: string;
  title: string;
  subtitle: string;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
}

export interface CareerItem {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'achievement';
}

export interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  location: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: 'web' | 'api' | 'software' | 'network' | 'data' | 'other';
  logoSvg?: string;
}
