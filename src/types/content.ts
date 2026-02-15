/**
 * Official Artist Website Content Types
 * Premium architecture for global artist standard (Ariana Grande, Lil Uzi Vert, Travis Scott level)
 * Future-proof with clean interfaces (Java/C# mindset)
 */

export interface SocialLink {
  name: string;
  href: string;
  icon?: string;
  color?: string;
}

export interface HeroContent {
  artistName: string;
  subtitle: string;
  tagline: string; // e.g., "DESTINY OUT NOW"
  description: string;
  bgImage: string;
  logoText: string;
  ctaText?: string; // e.g., "Listen Now"
  ctaLink?: string;
}

/** Short bio for official artist website (not EPK-style long bio) */
export interface AboutContent {
  headline: string; // Short punchy headline
  paragraphs: string[]; // 2-3 paragraphs max
  images: string[]; // Photo strip
  monadeltaMention?: string;
}

/** New flat bio structure for mobile-first design */
export interface BioStat {
  value: string;
  label: string;
}

export interface BioContent {
  headline: string;
  shortBio: string;
  fullBio: string; // Markdown/newline separated
  images: string[];
  pullQuote?: string;
  quoteAttribution?: string;
  stats?: BioStat[];
}

/** Spotify/YouTube embed for music playback */
export interface MusicEmbed {
  type: 'spotify-artist' | 'spotify-album' | 'spotify-track' | 'youtube';
  url: string;
  title: string;
  subtitle?: string;
  height?: number;
}

/** Album for discography grid */
export interface Album {
  id: string;
  title: string;
  year: number;
  coverUrl: string;
  spotifyUrl: string;
  appleMusicUrl?: string;
  type: 'album' | 'single' | 'ep';
}

/** Upcoming release teaser */
export interface UpcomingRelease {
  title: string;
  year: number;
  description: string;
  type: 'album' | 'single' | 'ep';
}

/** YouTube video with metadata and category */
export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  category: 'music-video' | 'lyric-video' | 'audio' | 'behind-the-scenes';
  year?: number;
  featured?: boolean;
  isPlaylist?: boolean;
  thumbnailUrl?: string; // Optional custom thumbnail for playlists
}

/** Music video with YouTube embed - legacy */
export interface MusicVisual {
  videoUrl: string;
  title: string;
  description?: string;
}

/** Featured content card (cases, teasers, info) */
export interface FeaturedCard {
  title: string;
  content: string;
  type: 'Case' | 'Hint' | 'Info' | 'Upcoming' | 'Label';
  color?: string;
  link?: string;
  linkText?: string;
}

export interface MusicContent {
  title: string;
  description: string;
  platforms: SocialLink[];
  // Primary embeds - music is the hero
  discographyEmbed: MusicEmbed;
  alternateEmbed?: MusicEmbed;
  featuredAlbum: MusicEmbed;
  // Discography for album grid
  albums?: Album[];
  // YouTube integration - expanded for 14 videos
  youtubeChannel?: string;
  youtubeVideos?: YouTubeVideo[];
  visuals: MusicVisual[]; // Legacy
  // Upcoming releases
  upcomingRelease?: UpcomingRelease;
  // Featured cards
  featured?: FeaturedCard[];
  // Legacy
  latestAlbumEmbed?: string;
}

export interface GalleryItem {
  url: string;
  span?: string; // Optional legacy
  title?: string;
  subtitle?: string;
  caption?: string; // Added for new Gallery
  era?: string;
}

export interface GalleryContent {
  title: string;
  images: GalleryItem[];
}

/** Label/collective information */
export interface LabelInfo {
  name: string;
  url: string;
  description: string;
  logo?: string;
}

/** Newsletter signup content */
export interface NewsletterContent {
  headline: string;
  subheadline?: string;
  placeholder: string;
  buttonText: string;
}

/** Alternate social profile (e.g., Lucid ASH, Monadelta) */
export interface AltProfile {
  name: string;
  handle: string;
  href: string;
  platform: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface ContactContent {
  management: ContactInfo;
  press?: ContactInfo;
  socials: SocialLink[];
  label?: LabelInfo;
  newsletter?: NewsletterContent;
}

export interface ArtistData {
  id: 'lucid-ash' | 'ashwin-azer';
  name: string;
  legalName?: string; // For SEO
  domain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    gradientTo?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    canonicalUrl?: string;
    spotifyArtistId?: string;
    appleMusicId?: string;
    musicBrainzId?: string;
  };
  content: {
    hero: HeroContent;
    about?: AboutContent; // New short bio
    bio: BioContent; // Legacy full bio
    music: MusicContent;
    gallery: GalleryContent;
    contact: ContactContent;
  };
}
