/**
 * Map of the 20 delivered photos (src/assets/photos/1–20, original filenames kept).
 * Components import photos through this map only, never by bare file number.
 * Used as provided (Jan's call, 2026-10-22).
 */
import type { ImageMetadata } from 'astro';

import p1 from '../assets/photos/1.jpg';
import p2 from '../assets/photos/2.jpg';
import p3 from '../assets/photos/3.jpg';
import p4 from '../assets/photos/4.jpg';
import p5 from '../assets/photos/5.jpg';
import p6 from '../assets/photos/6.jpg';
import p7 from '../assets/photos/7.jpg';
import p8 from '../assets/photos/8.jpg';
import p9 from '../assets/photos/9.jpg';
import p10 from '../assets/photos/10.jpg';
import p11 from '../assets/photos/11.jpg';
import p12 from '../assets/photos/12.jpg';
import p13 from '../assets/photos/13.jpg';
import p14 from '../assets/photos/14.jpg';
import p15 from '../assets/photos/15.png';
import p16 from '../assets/photos/16.png';
import p17 from '../assets/photos/17.jpg';
import p18 from '../assets/photos/18.png';
import p19 from '../assets/photos/19.png';
import p20 from '../assets/photos/20.jpg';

export type PhotoSection = 'hero' | 'exclusive-use' | 'spaces' | 'food' | 'why-100' | 'your-day' | 'not-a-hotel' | 'unused';

export interface VenuePhoto {
  /** Original file number as delivered by the client. */
  file: number;
  src: ImageMetadata;
  /** What the photo shows. */
  description: string;
  /** Where it's used on the page. */
  section: PhotoSection;
  orientation: 'portrait' | 'square' | 'landscape';
  alt: string;
  /** CSS object-position for crops, when the default centre crop loses something. */
  focus?: string;
}

export const photos = {
  gardenStaircase: {
    file: 1,
    src: p1,
    description: 'Curved stone staircase with balustrades in sunny formal gardens.',
    section: 'spaces',
    orientation: 'portrait',
    alt: 'A curved stone staircase with carved balustrades leading up through the gardens.',
    // Keep the top: the file has a text band along its bottom edge, which the card crop hides.
    focus: 'center top',
  },
  departureCar: {
    file: 2,
    src: p2,
    description: 'Vintage green car with "Just married" bunting leaving through stone gate piers down a tree-lined drive.',
    section: 'exclusive-use',
    orientation: 'portrait',
    alt: 'A vintage green car decorated with bunting driving through stone gateposts down a tree-lined drive.',
  },
  vintageConvertible: {
    file: 3,
    src: p3,
    description: 'Cream vintage convertible with flowers on the boot.',
    section: 'unused',
    orientation: 'square',
    alt: 'A cream vintage convertible with flowers tied to the back.',
  },
  gardenReception: {
    file: 4,
    src: p4,
    description: 'Elevated view of tables laid on a lawn between clipped hedges.',
    section: 'unused',
    orientation: 'portrait',
    alt: 'Tables laid for a wedding meal on a lawn between clipped hedges.',
  },
  champagneFountain: {
    file: 5,
    src: p5,
    description: 'Tiered stone fountain filled with ice and bottles of champagne.',
    section: 'your-day',
    orientation: 'portrait',
    alt: 'A tiered stone fountain filled with ice and bottles of champagne.',
  },
  champagneTower: {
    file: 6,
    src: p6,
    description: 'Bride pouring a champagne tower while the groom laughs beside her.',
    section: 'why-100',
    orientation: 'portrait',
    alt: 'A bride pouring champagne into a tower of glasses as the groom laughs beside her.',
  },
  sharingFeast: {
    file: 7,
    src: p7,
    description: 'Guests serving each other from sharing platters at a candlelit long table.',
    section: 'your-day',
    orientation: 'portrait',
    alt: 'Guests passing platters of roast lamb, potatoes and greens along a candlelit table.',
  },
  gettingReady: {
    file: 8,
    src: p8,
    description: 'Bridesmaids in robes cheering as the bride sings into a hairbrush, standing on a chair.',
    section: 'spaces',
    orientation: 'portrait',
    alt: 'Bridesmaids in matching robes cheering as the bride sings into a hairbrush.',
  },
  goldenHourRun: {
    file: 9,
    src: p9,
    description: 'Couple running hand in hand down a tree-lined path at golden hour.',
    section: 'not-a-hotel',
    orientation: 'portrait',
    alt: 'A couple running hand in hand down a tree-lined path in low evening sun.',
  },
  bridalParty: {
    file: 10,
    src: p10,
    description: 'Bridal party cheering around the kissing couple between tall hedges.',
    section: 'unused',
    orientation: 'portrait',
    alt: 'A bridal party cheering around the couple between tall hedges.',
  },
  lawnCeremony: {
    file: 11,
    src: p11,
    description: 'Ceremony on a lawn beside a pond, aisle lined with white flowers.',
    section: 'unused',
    orientation: 'portrait',
    alt: 'A couple making their vows with guests seated either side of a flower-lined aisle.',
  },
  candlelitToast: {
    file: 12,
    src: p12,
    description: 'Guests raising coupe glasses over a candlelit dinner table.',
    section: 'spaces',
    orientation: 'portrait',
    alt: 'Guests raising coupe glasses over a candlelit dinner table.',
  },
  eveningDancing: {
    file: 13,
    src: p13,
    description: 'Bride dancing with friends under chandeliers at the evening party.',
    section: 'your-day',
    orientation: 'portrait',
    alt: 'The bride dancing with friends under glowing chandeliers.',
  },
  ornateHall: {
    file: 14,
    src: p14,
    description: 'Bride seated in an ornate hall with statues and a gilt mirror.',
    section: 'your-day',
    orientation: 'portrait',
    alt: 'A bride seated in an ornate hall beside a gilt mirror and a vase of flowers.',
  },
  panelledRoom: {
    file: 15,
    src: p15,
    description: 'Couple in a dark oak-panelled room lit by a tall window.',
    section: 'spaces',
    orientation: 'portrait',
    alt: 'A couple in a dark oak-panelled room lit by a tall window.',
  },
  sparklerSendOff: {
    file: 16,
    src: p16,
    description: 'Couple kissing beneath an arch of sparklers held by their guests.',
    section: 'unused',
    orientation: 'portrait',
    alt: 'A couple kissing beneath an arch of sparklers held by their guests.',
  },
  hamCarving: {
    file: 17,
    src: p17,
    description: 'Waiter carving a leg of cured ham at an outdoor table.',
    section: 'food',
    orientation: 'portrait',
    alt: 'A waiter in a bow tie carving a leg of cured ham.',
  },
  crostini: {
    file: 18,
    src: p18,
    description: 'Crostini with whipped cheese, roasted cherry tomatoes and black sesame.',
    section: 'food',
    orientation: 'portrait',
    alt: 'Crostini topped with whipped cheese, roasted cherry tomatoes and black sesame.',
  },
  canapes: {
    file: 19,
    src: p19,
    description: 'Smoked salmon canapés on tasting spoons beside cream-filled pastry cups.',
    section: 'food',
    orientation: 'portrait',
    alt: 'Smoked salmon canapés on tasting spoons beside cream-filled pastry cups.',
  },
  manorFromAbove: {
    file: 20,
    src: p20,
    description: 'Aerial view of the stone Georgian house with wisteria, guests on the lawns, countryside beyond.',
    section: 'hero',
    orientation: 'portrait',
    alt: 'Ashden Manor from above: a stone Georgian house with wisteria on its walls, wedding guests on the lawns and rolling countryside beyond.',
  },
} satisfies Record<string, VenuePhoto>;

export type PhotoKey = keyof typeof photos;

/** Hero photo (proposed; Jan to confirm, see CLAUDE.md Current Build State). */
export const heroPhoto: VenuePhoto = photos.manorFromAbove;
