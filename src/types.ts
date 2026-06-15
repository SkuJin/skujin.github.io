export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  title: string;
  iconName: string;
  clicks: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface BioConfig {
  name: string;
  displayName: string;
  description: string;
  avatarUrl: string;
  isVerified: boolean;
  statusText: string;
  statusIcon: string;
  location: string;
  currentActivity: {
    type: 'playing' | 'coding' | 'streaming' | 'listening' | 'idle';
    name: string;
    details: string;
    state: string;
  };
  socialLinks: SocialLink[];
  themeId: string;
  skills: string[];
  customWidgets: {
    showClock: boolean;
    showDiscord: boolean;
    showGuestbook: boolean;
    showStats: boolean;
    showSkills: boolean;
  };
  viewsCount: number;
}

export interface BioTheme {
  id: string;
  name: string;
  backgroundClass: string;
  cardClass: string;
  textClass: string;
  accentClass: string;
  badgeClass: string;
  glowColor: string;
  animationBg?: string; // e.g. 'stars', 'grid', 'sunset', 'cyberpunk', 'glass'
}
