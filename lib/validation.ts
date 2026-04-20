import { z } from 'zod';

const GENRES = ["Afrobeats","Afrobeats Gospel","Amapiano","Highlife","Afro-Fusion","Pop","R&B/Soul","Gospel","Hip-Hop/Rap","Drill/Trap","Reggae/Dancehall","Rock/Alternative","Country","Jazz/Blues","EDM/Electronic","Latin/Reggaeton","Folk/Acoustic","K-Pop","Indie","Worship/Praise",""] as const;
const MOODS = ["Celebratory","Triumphant","Empowering","Spiritual","Party/Hype","Energetic","Romantic","Melancholic","Reflective","Nostalgic","Rebellious","Dark/Moody","Peaceful","Majestic","Raw/Gritty",""] as const;
const LANGUAGES = ["English","French","Portuguese","Spanish","Korean-English Mix","Multilingual Mix","Nigerian Pidgin","Yoruba-English Mix","Igbo-English Mix","Patois/Jamaican Creole","Swahili"] as const;
const VOCALISTS = ["Male","Female","Group/Choir","Duet","Rapper + Singer",""] as const;
const STRUCTURES = ["Standard","Short","Epic","Hook-Heavy","Chant-Driven","Freestyle"] as const;
const TEMPOS = ["Slow (70–90 BPM)","Medium (90–110 BPM)","Upbeat (110–130 BPM)","High Energy (130–150 BPM)","Flat (150+ BPM)","AI Decides"] as const;

export const GenerateSchema = z.object({
  title: z.string().max(100, 'Title too long').optional().default(''),
  topic: z.string()
    .min(5, 'Concept must be at least 5 characters')
    .max(800, 'Concept too long — keep it under 800 characters')
    .transform(s => s.trim()),
  genre: z.enum(GENRES).optional().default(''),
  mood: z.enum(MOODS).optional().default(''),
  language: z.enum(LANGUAGES).default('English'),
  vocalist: z.enum(VOCALISTS).optional().default(''),
  structure: z.enum(STRUCTURES).default('Standard'),
  tempo: z.enum(TEMPOS).default('AI Decides'),
  auto_cues: z.boolean().default(true),
  call_response: z.boolean().default(false),
  metadata_header: z.boolean().default(true),
  notes: z.string().max(400, 'Notes too long').optional().default(''),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;

// Strip any HTML/script injection attempts
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')           // remove HTML tags
    .replace(/javascript:/gi, '')       // remove js: protocol
    .replace(/on\w+\s*=/gi, '')         // remove event handlers
    .trim();
}
