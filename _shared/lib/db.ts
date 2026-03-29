import Dexie, { type Table } from 'dexie';

// Database schema interfaces
export interface Project {
  id?: number;
  sessionId: string;
  themeId: string;
  originalImageBlob: Blob;
  originalImageUrl: string;
  originalImageKey: string;
  faceDetectionData?: {
    faces: Array<{
      index: number;
      boundingBox: { x: number; y: number; width: number; height: number };
      landmarks: Array<[number, number]>;
      confidence: number;
    }>;
    detectionTimestamp: Date;
  };
  characterAssignments: Array<{
    faceIndex: number;
    characterId: string;
    characterName: string;
  }>;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}

export interface Transformation {
  id?: number;
  projectId: number;
  generatedImageBlob: Blob;
  generatedImageUrl: string;
  generatedImageKey: string;
  prompt: string;
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed';
  generationTimestamp: Date;
  completedAt?: Date;
  errorMessage?: string;
  metadata: {
    modelUsed: string;
    generationDurationMs: number;
    imageSize: number;
  };
}

export interface ThemePackage {
  id: string;
  name: string;
  description: string;
  groupSizeRange: [number, number];
  characters: Array<{
    id: string;
    name: string;
    role: string;
    description: string;
    prompt: string;
  }>;
  environmentPrompt: string;
  colorPalette: string[];
  cachedAt: Date;
}

export interface SessionHistory {
  id?: number;
  projectId: number;
  createdAt: Date;
}

// Database class
export class TimeTravelStationDB extends Dexie {
  projects!: Table<Project>;
  transformations!: Table<Transformation>;
  themePackages!: Table<ThemePackage>;
  sessionHistory!: Table<SessionHistory>;

  constructor() {
    super('TimeTravelStationDB');
    this.version(1).stores({
      projects: '++id, sessionId, themeId, createdAt, status',
      transformations: '++id, projectId, generationStatus',
      themePackages: 'id',
      sessionHistory: '++id, projectId, createdAt'
    });
  }
}

// Export singleton instance
export const db = new TimeTravelStationDB();

// Storage quota utilities
export async function checkStorageQuota() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return {
      usedBytes: 0,
      quotaBytes: 0,
      percentUsed: 0,
      remainingBytes: 0
    };
  }

  const estimate = await navigator.storage.estimate();
  const usage = estimate.usage || 0;
  const quota = estimate.quota || 0;
  const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

  return {
    usedBytes: usage,
    quotaBytes: quota,
    percentUsed,
    remainingBytes: quota - usage
  };
}

// Cleanup old projects
export async function cleanupOldProjects(maxAge: number = 30 * 24 * 60 * 60 * 1000) {
  const cutoffDate = new Date(Date.now() - maxAge);
  const oldProjects = await db.projects
    .where('createdAt')
    .below(cutoffDate)
    .toArray();

  for (const project of oldProjects) {
    // Clean up Blobs
    URL.revokeObjectURL(project.originalImageUrl);
    
    // Delete associated transformations
    const transformations = await db.transformations
      .where('projectId')
      .equals(project.id!)
      .toArray();
    
    for (const transformation of transformations) {
      URL.revokeObjectURL(transformation.generatedImageUrl);
      await db.transformations.delete(transformation.id!);
    }
    
    // Delete project
    await db.projects.delete(project.id!);
  }

  return oldProjects.length;
}

// Initialize default theme packages
export async function initializeThemes() {
  const existingThemes = await db.themePackages.count();
  
  if (existingThemes > 0) {
    return; // Themes already initialized
  }

  const themes: ThemePackage[] = [
    {
      id: 'outlaw-gang',
      name: 'The Wild Bunch',
      description: 'Transform into a notorious outlaw gang riding through dusty frontier towns',
      groupSizeRange: [2, 8],
      characters: [
        {
          id: 'gang-leader',
          name: 'Gang Leader',
          role: 'The Boss',
          description: 'Commanding presence with weathered duster coat and wide-brimmed hat',
          prompt: 'Outlaw gang leader in black duster coat, wide-brimmed hat, bandana, leather vest, gun belt with revolvers'
        },
        {
          id: 'sharpshooter',
          name: 'Sharpshooter',
          role: 'The Marksman',
          description: 'Expert gunslinger with rifle and keen eyes',
          prompt: 'Western sharpshooter with rifle, cowboy hat, leather chaps, ammunition belt'
        },
        {
          id: 'bandit',
          name: 'Bandit',
          role: 'The Outlaw',
          description: 'Rugged bandit with bandana mask and worn leather',
          prompt: 'Western bandit with bandana mask, leather vest, worn jeans, gun holster'
        }
      ],
      environmentPrompt: 'Dusty frontier town main street, wooden buildings, hitching posts, tumbleweeds, dramatic sunset lighting, 1870s Old West atmosphere',
      colorPalette: ['#8B4513', '#D2691E', '#CD853F', '#DEB887'],
      cachedAt: new Date()
    },
    {
      id: 'saloon-scene',
      name: 'The Golden Nugget Saloon',
      description: 'Step into a lively saloon scene with card games and whiskey',
      groupSizeRange: [2, 6],
      characters: [
        {
          id: 'bartender',
          name: 'Bartender',
          role: 'The Barkeep',
          description: 'Friendly bartender with vest and bow tie',
          prompt: 'Western saloon bartender with white shirt, black vest, bow tie, handlebar mustache'
        },
        {
          id: 'gambler',
          name: 'Gambler',
          role: 'The Card Sharp',
          description: 'Dapper gambler in fine suit with playing cards',
          prompt: 'Western gambler in fancy suit, brocade vest, derby hat, holding playing cards'
        },
        {
          id: 'saloon-patron',
          name: 'Saloon Patron',
          role: 'The Regular',
          description: 'Regular customer enjoying drinks and conversation',
          prompt: 'Western saloon patron in casual frontier clothing, cowboy hat, enjoying whiskey'
        }
      ],
      environmentPrompt: 'Interior of Old West saloon, wooden bar counter, bottles on shelves, poker tables, oil lamps, warm golden lighting, 1870s atmosphere',
      colorPalette: ['#8B7355', '#CD853F', '#DAA520', '#F0E68C'],
      cachedAt: new Date()
    },
    {
      id: 'ranch-life',
      name: 'The Golden Horseshoe Ranch',
      description: 'Experience life on a working cattle ranch in the Old West',
      groupSizeRange: [2, 6],
      characters: [
        {
          id: 'rancher',
          name: 'Rancher',
          role: 'The Boss',
          description: 'Hardworking ranch owner overseeing the spread',
          prompt: 'Western rancher in work shirt, leather vest, cowboy hat, chaps, lasso'
        },
        {
          id: 'cowboy',
          name: 'Cowboy',
          role: 'The Wrangler',
          description: 'Skilled cowboy working with horses and cattle',
          prompt: 'Western cowboy in denim shirt, leather chaps, spurs, cowboy hat, bandana'
        },
        {
          id: 'ranch-hand',
          name: 'Ranch Hand',
          role: 'The Worker',
          description: 'Reliable ranch hand tending to daily chores',
          prompt: 'Western ranch hand in work clothes, cowboy hat, leather gloves, rope'
        }
      ],
      environmentPrompt: 'Wide open prairie with wooden ranch buildings, corrals, horses, cattle, wooden fences, dramatic sunset sky, 1870s ranch setting',
      colorPalette: ['#8B7355', '#9ACD32', '#87CEEB', '#DEB887'],
      cachedAt: new Date()
    }
  ];

  await db.themePackages.bulkAdd(themes);
}
