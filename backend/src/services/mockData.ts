import bcrypt from 'bcryptjs';
import { InMemoryDatabase, UserEntity, SkillEntity, UserSkillEntity, AvailabilityEntity, ReviewEntity } from './db.js';

// Pre-computed bcrypt hash for 'Password123!'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

// Comprehensive list of 60 unique skills across multiple disciplines
export const MOCK_SKILLS_CATALOG: Array<{ id: string; name: string; category: string }> = [
  // Programming & Software Engineering
  { id: 'skill-1', name: 'JavaScript', category: 'Programming' },
  { id: 'skill-2', name: 'TypeScript', category: 'Programming' },
  { id: 'skill-3', name: 'Python', category: 'Programming' },
  { id: 'skill-4', name: 'Rust', category: 'Programming' },
  { id: 'skill-5', name: 'Go (Golang)', category: 'Programming' },
  { id: 'skill-6', name: 'Java', category: 'Programming' },
  { id: 'skill-7', name: 'C++', category: 'Programming' },
  { id: 'skill-8', name: 'Swift', category: 'Programming' },
  { id: 'skill-9', name: 'Kotlin', category: 'Programming' },
  { id: 'skill-10', name: 'SQL & Database Design', category: 'Programming' },

  // Web & Mobile Development
  { id: 'skill-11', name: 'React', category: 'Web Development' },
  { id: 'skill-12', name: 'Node.js', category: 'Backend Development' },
  { id: 'skill-13', name: 'Next.js', category: 'Web Development' },
  { id: 'skill-14', name: 'Vue.js', category: 'Web Development' },
  { id: 'skill-15', name: 'Tailwind CSS', category: 'Web Development' },
  { id: 'skill-16', name: 'GraphQL', category: 'Backend Development' },
  { id: 'skill-17', name: 'Docker & Containers', category: 'DevOps' },
  { id: 'skill-18', name: 'Kubernetes', category: 'DevOps' },
  { id: 'skill-19', name: 'Flutter App Dev', category: 'Mobile Development' },
  { id: 'skill-20', name: 'iOS App Development', category: 'Mobile Development' },

  // Design, UX & Creative
  { id: 'skill-21', name: 'Figma', category: 'Design' },
  { id: 'skill-22', name: 'UI/UX Design', category: 'Design' },
  { id: 'skill-23', name: 'Design Systems', category: 'Design' },
  { id: 'skill-24', name: 'Graphic Design', category: 'Design' },
  { id: 'skill-25', name: '3D Modeling (Blender)', category: 'Creative' },
  { id: 'skill-26', name: 'Motion Graphics', category: 'Creative' },
  { id: 'skill-27', name: 'Typography & Layout', category: 'Design' },
  { id: 'skill-28', name: 'Video Editing (Premiere)', category: 'Creative' },
  { id: 'skill-29', name: 'Audio Production', category: 'Creative' },
  { id: 'skill-30', name: 'User Research & Testing', category: 'Design' },

  // World Languages
  { id: 'skill-31', name: 'Spanish', category: 'Languages' },
  { id: 'skill-32', name: 'French', category: 'Languages' },
  { id: 'skill-33', name: 'German', category: 'Languages' },
  { id: 'skill-34', name: 'Japanese', category: 'Languages' },
  { id: 'skill-35', name: 'Mandarin Chinese', category: 'Languages' },
  { id: 'skill-36', name: 'Italian', category: 'Languages' },
  { id: 'skill-37', name: 'Arabic', category: 'Languages' },
  { id: 'skill-38', name: 'Portuguese', category: 'Languages' },
  { id: 'skill-39', name: 'Korean', category: 'Languages' },
  { id: 'skill-40', name: 'American Sign Language (ASL)', category: 'Languages' },

  // Data Science, AI & Mathematics
  { id: 'skill-41', name: 'Machine Learning', category: 'Data Science' },
  { id: 'skill-42', name: 'Deep Learning & PyTorch', category: 'Data Science' },
  { id: 'skill-43', name: 'Data Analysis with Pandas', category: 'Data Science' },
  { id: 'skill-44', name: 'Prompt Engineering', category: 'Artificial Intelligence' },
  { id: 'skill-45', name: 'Natural Language Processing', category: 'Data Science' },
  { id: 'skill-46', name: 'Computer Vision', category: 'Data Science' },
  { id: 'skill-47', name: 'Power BI & Dashboards', category: 'Data Science' },
  { id: 'skill-48', name: 'Applied Statistics', category: 'Mathematics' },

  // Business, Marketing & Soft Skills
  { id: 'skill-49', name: 'Public Speaking', category: 'Soft Skills' },
  { id: 'skill-50', name: 'Technical Writing', category: 'Soft Skills' },
  { id: 'skill-51', name: 'Product Management', category: 'Business' },
  { id: 'skill-52', name: 'Agile & Scrum Facilitation', category: 'Business' },
  { id: 'skill-53', name: 'SEO & Content Strategy', category: 'Marketing' },
  { id: 'skill-54', name: 'Growth Marketing', category: 'Marketing' },
  { id: 'skill-55', name: 'Financial Modeling', category: 'Business' },
  { id: 'skill-56', name: 'Negotiation Skills', category: 'Soft Skills' },
  { id: 'skill-57', name: 'Cybersecurity Fundamentals', category: 'Security' },
  { id: 'skill-58', name: 'Ethical Hacking & Pentesting', category: 'Security' },
  { id: 'skill-59', name: 'Brand Strategy', category: 'Marketing' },
  { id: 'skill-60', name: 'Executive Leadership Coaching', category: 'Business' },
];

export interface MockUserConfig {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  timezone: string;
  role: 'member' | 'moderator' | 'admin';
  teachSkills: Array<{ skillId: string; level: 'beginner' | 'intermediate' | 'advanced' }>;
  learnSkills: Array<{ skillId: string; level: 'beginner' | 'intermediate' | 'advanced' }>;
  weekdays: number[];
}

// 50 Diverse Users - each with at least 4 completely unique skills
export const MOCK_USERS_DATA: MockUserConfig[] = [
  {
    id: 'user-1',
    email: 'alex@example.com',
    displayName: 'Alex Vance',
    bio: 'Senior full-stack engineer passionate about React, TypeScript, and architectural patterns. Eager to master conversational Spanish and explore machine learning.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/New_York',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-11', level: 'advanced' },      // React
      { skillId: 'skill-2', level: 'advanced' },       // TypeScript
    ],
    learnSkills: [
      { skillId: 'skill-31', level: 'beginner' },      // Spanish
      { skillId: 'skill-41', level: 'intermediate' },  // Machine Learning
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-2',
    email: 'sam@example.com',
    displayName: 'Sam Rivera',
    bio: 'Native Spanish educator and Python data enthusiast. Looking to level up my front-end web engineering skills with React and TypeScript.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/New_York',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-31', level: 'advanced' },      // Spanish
      { skillId: 'skill-3', level: 'advanced' },        // Python
    ],
    learnSkills: [
      { skillId: 'skill-11', level: 'intermediate' },  // React
      { skillId: 'skill-2', level: 'beginner' },       // TypeScript
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-3',
    email: 'elena.rostova@example.com',
    displayName: 'Elena Rostova',
    bio: 'Lead product designer specializing in Figma systems and user research. Wanting to learn Rust for systems programming and brush up on French.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Berlin',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-21', level: 'advanced' },      // Figma
      { skillId: 'skill-23', level: 'advanced' },      // Design Systems
      { skillId: 'skill-30', level: 'intermediate' },  // User Research
    ],
    learnSkills: [
      { skillId: 'skill-4', level: 'beginner' },       // Rust
      { skillId: 'skill-32', level: 'intermediate' },  // French
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-4',
    email: 'marcus.vance@example.com',
    displayName: 'Marcus Vance',
    bio: 'Cloud architect and DevOps specialist. I build high-availability Kubernetes clusters and Docker pipelines. Seeking to learn Blender 3D modeling.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Chicago',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-17', level: 'advanced' },      // Docker
      { skillId: 'skill-18', level: 'advanced' },      // Kubernetes
      { skillId: 'skill-5', level: 'intermediate' },   // Go
    ],
    learnSkills: [
      { skillId: 'skill-25', level: 'beginner' },      // 3D Modeling (Blender)
      { skillId: 'skill-26', level: 'beginner' },      // Motion Graphics
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-5',
    email: 'priya.sharma@example.com',
    displayName: 'Priya Sharma',
    bio: 'Data scientist and NLP researcher. Passionate about transformers and deep learning with PyTorch. Looking to practice public speaking and presentation skills.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Kolkata',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-41', level: 'advanced' },      // Machine Learning
      { skillId: 'skill-42', level: 'advanced' },      // Deep Learning & PyTorch
      { skillId: 'skill-45', level: 'intermediate' },  // NLP
    ],
    learnSkills: [
      { skillId: 'skill-49', level: 'beginner' },      // Public Speaking
      { skillId: 'skill-51', level: 'beginner' },      // Product Management
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-6',
    email: 'lucas.silva@example.com',
    displayName: 'Lucas Silva',
    bio: 'Mobile engineer creating cross-platform Flutter and native iOS experiences. Native Portuguese speaker eager to exchange with Golang and cloud backend devs.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Sao_Paulo',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-19', level: 'advanced' },      // Flutter
      { skillId: 'skill-38', level: 'advanced' },      // Portuguese
    ],
    learnSkills: [
      { skillId: 'skill-5', level: 'intermediate' },   // Go
      { skillId: 'skill-17', level: 'beginner' },      // Docker
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-7',
    email: 'chloe.dupont@example.com',
    displayName: 'Chloé Dupont',
    bio: 'Brand strategist and native French speaker from Lyon. Interested in learning UI/UX design and modern web development basics.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Paris',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-32', level: 'advanced' },      // French
      { skillId: 'skill-59', level: 'advanced' },      // Brand Strategy
    ],
    learnSkills: [
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
      { skillId: 'skill-1', level: 'beginner' },       // JavaScript
    ],
    weekdays: [2, 3, 5],
  },
  {
    id: 'user-8',
    email: 'liam.chen@example.com',
    displayName: 'Liam Chen',
    bio: 'Staff backend engineer specializing in Go microservices and high-throughput SQL databases. Eager to master UI design in Figma and learn Japanese.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Los_Angeles',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-5', level: 'advanced' },       // Go
      { skillId: 'skill-10', level: 'advanced' },      // SQL
      { skillId: 'skill-12', level: 'advanced' },      // Node.js
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'intermediate' },  // Figma
      { skillId: 'skill-34', level: 'beginner' },      // Japanese
    ],
    weekdays: [1, 4, 6],
  },
  {
    id: 'user-9',
    email: 'kenji.sato@example.com',
    displayName: 'Kenji Sato',
    bio: 'Tokyo-based 3D artist and animator. Happy to teach Japanese and Blender 3D modeling in exchange for Python scripting and data analysis.',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Tokyo',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-34', level: 'advanced' },      // Japanese
      { skillId: 'skill-25', level: 'advanced' },      // 3D Modeling (Blender)
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'intermediate' },   // Python
      { skillId: 'skill-43', level: 'beginner' },      // Data Analysis
    ],
    weekdays: [0, 2, 5],
  },
  {
    id: 'user-10',
    email: 'hannah.schmidt@example.com',
    displayName: 'Hannah Schmidt',
    bio: 'German language instructor and technical documentation specialist. Seeking guidance on React frontend development and Tailwind CSS.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Berlin',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-33', level: 'advanced' },      // German
      { skillId: 'skill-50', level: 'advanced' },      // Technical Writing
    ],
    learnSkills: [
      { skillId: 'skill-11', level: 'beginner' },      // React
      { skillId: 'skill-15', level: 'beginner' },      // Tailwind CSS
    ],
    weekdays: [1, 3, 4],
  },
  {
    id: 'user-11',
    email: 'tariq.almansoor@example.com',
    displayName: 'Tariq Al-Mansoor',
    bio: 'Cybersecurity analyst and penetration tester. Teaching ethical hacking, network defense, and Arabic. Looking to learn Next.js and web design.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Dubai',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-57', level: 'advanced' },      // Cybersecurity
      { skillId: 'skill-58', level: 'advanced' },      // Ethical Hacking
      { skillId: 'skill-37', level: 'advanced' },      // Arabic
    ],
    learnSkills: [
      { skillId: 'skill-13', level: 'intermediate' },  // Next.js
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
    ],
    weekdays: [0, 1, 3],
  },
  {
    id: 'user-12',
    email: 'isabella.rossi@example.com',
    displayName: 'Isabella Rossi',
    bio: 'Creative director and motion designer from Milan. Teaching Italian and After Effects motion design. Seeking to learn Python for automation.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Rome',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-36', level: 'advanced' },      // Italian
      { skillId: 'skill-26', level: 'advanced' },      // Motion Graphics
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'beginner' },       // Python
      { skillId: 'skill-1', level: 'intermediate' },   // JavaScript
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-13',
    email: 'samuel.osei@example.com',
    displayName: 'Samuel Osei',
    bio: 'Fintech product manager and financial modeling coach. Eager to understand SQL data extraction and Docker container deployments.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Accra',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-51', level: 'advanced' },      // Product Management
      { skillId: 'skill-55', level: 'advanced' },      // Financial Modeling
    ],
    learnSkills: [
      { skillId: 'skill-10', level: 'intermediate' },  // SQL
      { skillId: 'skill-17', level: 'beginner' },      // Docker
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-14',
    email: 'maya.lin@example.com',
    displayName: 'Maya Lin',
    bio: 'Systems software developer passionate about Rust and memory safety. Happy to teach Rust and C++. Looking to learn UI/UX design and Mandarin.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Vancouver',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-4', level: 'advanced' },       // Rust
      { skillId: 'skill-7', level: 'advanced' },       // C++
    ],
    learnSkills: [
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
      { skillId: 'skill-35', level: 'beginner' },      // Mandarin
    ],
    weekdays: [2, 4, 5],
  },
  {
    id: 'user-15',
    email: 'noah.johansson@example.com',
    displayName: 'Noah Johansson',
    bio: 'Stockholm audio engineer and podcast producer. Offering audio mastering and sound design. Looking for coaching in Swift iOS development.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Stockholm',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-29', level: 'advanced' },      // Audio Production
      { skillId: 'skill-49', level: 'intermediate' },  // Public Speaking
    ],
    learnSkills: [
      { skillId: 'skill-8', level: 'intermediate' },   // Swift
      { skillId: 'skill-20', level: 'beginner' },      // iOS App Development
    ],
    weekdays: [0, 3, 5],
  },
  {
    id: 'user-16',
    email: 'aaliyah.khan@example.com',
    displayName: 'Aaliyah Khan',
    bio: 'SEO consultant and digital growth strategist. Teaching search optimization and copywriting. Looking to learn Python for data scraping.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/London',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-53', level: 'advanced' },      // SEO & Content Strategy
      { skillId: 'skill-54', level: 'advanced' },      // Growth Marketing
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'intermediate' },   // Python
      { skillId: 'skill-43', level: 'beginner' },      // Data Analysis
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-17',
    email: 'mateo.fernandez@example.com',
    displayName: 'Mateo Fernandez',
    bio: 'Full-stack TypeScript developer and GraphQL architect. Teaching Next.js, Node, and TypeScript. Excited to learn prompt engineering and AI workflows.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Mexico_City',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-13', level: 'advanced' },      // Next.js
      { skillId: 'skill-16', level: 'advanced' },      // GraphQL
    ],
    learnSkills: [
      { skillId: 'skill-44', level: 'intermediate' },  // Prompt Engineering
      { skillId: 'skill-41', level: 'beginner' },      // Machine Learning
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-18',
    email: 'meiling.zhou@example.com',
    displayName: 'Meiling Zhou',
    bio: 'Native Mandarin speaker and professional translator. Offering Mandarin lessons and cross-cultural communication. Looking to learn Figma design.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Shanghai',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-35', level: 'advanced' },      // Mandarin
      { skillId: 'skill-56', level: 'advanced' },      // Negotiation Skills
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'beginner' },      // Figma
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-19',
    email: 'carlos.mendoza@example.com',
    displayName: 'Carlos Mendoza',
    bio: 'iOS developer with 7 years of Swift experience. Eager to exchange iOS development knowledge for Tailwind CSS and React web patterns.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Bogota',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-8', level: 'advanced' },       // Swift
      { skillId: 'skill-20', level: 'advanced' },      // iOS App Development
    ],
    learnSkills: [
      { skillId: 'skill-15', level: 'intermediate' },  // Tailwind CSS
      { skillId: 'skill-11', level: 'beginner' },      // React
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-20',
    email: 'freja.lindqvist@example.com',
    displayName: 'Freja Lindqvist',
    bio: 'Agile coach and leadership consultant from Copenhagen. Teaching Scrum frameworks and executive coaching. Learning Python and data visualization.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Copenhagen',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-52', level: 'advanced' },      // Agile Coaching
      { skillId: 'skill-60', level: 'advanced' },      // Executive Leadership
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'beginner' },       // Python
      { skillId: 'skill-47', level: 'intermediate' },  // Power BI
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-21',
    email: 'benjamin.cohen@example.com',
    displayName: 'Benjamin Cohen',
    bio: 'Senior Java engineer specializing in Spring Boot and enterprise architectures. Wanting to learn modern TypeScript and Vue.js.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Jerusalem',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-6', level: 'advanced' },       // Java
      { skillId: 'skill-10', level: 'advanced' },      // SQL
    ],
    learnSkills: [
      { skillId: 'skill-2', level: 'intermediate' },   // TypeScript
      { skillId: 'skill-14', level: 'beginner' },      // Vue.js
    ],
    weekdays: [0, 1, 4],
  },
  {
    id: 'user-22',
    email: 'nadia.bouazizi@example.com',
    displayName: 'Nadia Bouazizi',
    bio: 'Data analyst and Power BI expert. Fluent in French and Arabic. Looking to learn machine learning algorithms and Spanish.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Tunis',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-47', level: 'advanced' },      // Power BI
      { skillId: 'skill-43', level: 'advanced' },      // Data Analysis
    ],
    learnSkills: [
      { skillId: 'skill-41', level: 'beginner' },      // Machine Learning
      { skillId: 'skill-31', level: 'beginner' },      // Spanish
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-23',
    email: 'henrik.olsen@example.com',
    displayName: 'Henrik Olsen',
    bio: 'Senior Kubernetes administrator and security specialist. Teaching cloud infrastructure. Looking to learn Figma design systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Oslo',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-18', level: 'advanced' },      // Kubernetes
      { skillId: 'skill-57', level: 'advanced' },      // Cybersecurity
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'beginner' },      // Figma
      { skillId: 'skill-23', level: 'beginner' },      // Design Systems
    ],
    weekdays: [2, 3, 5],
  },
  {
    id: 'user-24',
    email: 'fatima.zahra@example.com',
    displayName: 'Fatima Zahra',
    bio: 'UI designer and typography nerd. I design accessible, gorgeous interfaces. Looking to learn JavaScript and CSS animations.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Casablanca',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-27', level: 'advanced' },      // Typography
      { skillId: 'skill-22', level: 'advanced' },      // UI/UX Design
    ],
    learnSkills: [
      { skillId: 'skill-1', level: 'intermediate' },   // JavaScript
      { skillId: 'skill-15', level: 'beginner' },      // Tailwind CSS
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-25',
    email: 'oliver.taylor@example.com',
    displayName: 'Oliver Taylor',
    bio: 'Video editor and color grading specialist with DaVinci and Premiere. Seeking to learn React web development and Node.js.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Australia/Melbourne',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-28', level: 'advanced' },      // Video Editing
      { skillId: 'skill-26', level: 'intermediate' },  // Motion Graphics
    ],
    learnSkills: [
      { skillId: 'skill-11', level: 'beginner' },      // React
      { skillId: 'skill-12', level: 'beginner' },      // Node.js
    ],
    weekdays: [0, 3, 6],
  },
  {
    id: 'user-26',
    email: 'ananya.patel@example.com',
    displayName: 'Ananya Patel',
    bio: 'AI researcher and prompt engineering consultant. Happy to teach LLM prompting and AI workflows. Wanting to learn Go backend programming.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Toronto',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-44', level: 'advanced' },      // Prompt Engineering
      { skillId: 'skill-41', level: 'advanced' },      // Machine Learning
    ],
    learnSkills: [
      { skillId: 'skill-5', level: 'intermediate' },   // Go
      { skillId: 'skill-17', level: 'beginner' },      // Docker
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-27',
    email: 'dmitry.petrov@example.com',
    displayName: 'Dmitry Petrov',
    bio: 'C++ games and graphics developer. Teaching 3D math and C++ performance optimizations. Interested in learning UI/UX design in Figma.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Warsaw',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-7', level: 'advanced' },       // C++
      { skillId: 'skill-48', level: 'advanced' },      // Applied Statistics
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'beginner' },      // Figma
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-28',
    email: 'mia.novak@example.com',
    displayName: 'Mia Novak',
    bio: 'Copywriter and content strategist from Prague. Teaching engaging storytelling, SEO, and German. Looking to learn Python for automation.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Prague',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-53', level: 'advanced' },      // SEO
      { skillId: 'skill-33', level: 'intermediate' },  // German
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'beginner' },       // Python
      { skillId: 'skill-10', level: 'beginner' },      // SQL
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-29',
    email: 'lucas.moreau@example.com',
    displayName: 'Lucas Moreau',
    bio: 'Vue.js and Tailwind specialist. Happy to mentor on frontend component libraries. Seeking to learn public speaking and leadership coaching.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Brussels',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-14', level: 'advanced' },      // Vue.js
      { skillId: 'skill-15', level: 'advanced' },      // Tailwind CSS
    ],
    learnSkills: [
      { skillId: 'skill-49', level: 'intermediate' },  // Public Speaking
      { skillId: 'skill-60', level: 'beginner' },      // Executive Leadership
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-30',
    email: 'aisha.bello@example.com',
    displayName: 'Aisha Bello',
    bio: 'Fintech data engineer building scalable ETL pipelines with Python and SQL. Looking to learn React and modern frontend web design.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Lagos',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-3', level: 'advanced' },       // Python
      { skillId: 'skill-10', level: 'advanced' },      // SQL
    ],
    learnSkills: [
      { skillId: 'skill-11', level: 'beginner' },      // React
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-31',
    email: 'james.wilson@example.com',
    displayName: 'James Wilson',
    bio: 'American Sign Language (ASL) instructor and accessibility advocate. Eager to learn mobile app development in Flutter and TypeScript.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Denver',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-40', level: 'advanced' },      // ASL
      { skillId: 'skill-50', level: 'advanced' },      // Technical Writing
    ],
    learnSkills: [
      { skillId: 'skill-19', level: 'beginner' },      // Flutter
      { skillId: 'skill-2', level: 'intermediate' },   // TypeScript
    ],
    weekdays: [0, 2, 4],
  },
  {
    id: 'user-32',
    email: 'yuka.tanaka@example.com',
    displayName: 'Yuka Tanaka',
    bio: 'Illustrator and graphic artist from Kyoto. Teaching Japanese and digital illustration. Looking to learn web development with React.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Tokyo',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-24', level: 'advanced' },      // Graphic Design
      { skillId: 'skill-34', level: 'advanced' },      // Japanese
    ],
    learnSkills: [
      { skillId: 'skill-11', level: 'beginner' },      // React
      { skillId: 'skill-15', level: 'beginner' },      // Tailwind CSS
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-33',
    email: 'jorge.morales@example.com',
    displayName: 'Jorge Morales',
    bio: 'Agile coach and project leader. Teaching project management and negotiation. Looking to learn Python data analytics and Power BI.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Santiago',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-52', level: 'advanced' },      // Agile
      { skillId: 'skill-56', level: 'advanced' },      // Negotiation
    ],
    learnSkills: [
      { skillId: 'skill-43', level: 'intermediate' },  // Data Analysis
      { skillId: 'skill-47', level: 'beginner' },      // Power BI
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-34',
    email: 'amina.idris@example.com',
    displayName: 'Amina Idris',
    bio: 'Machine learning engineer focusing on computer vision and medical imaging. Happy to teach Python and PyTorch. Looking to practice French.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Cairo',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-46', level: 'advanced' },      // Computer Vision
      { skillId: 'skill-42', level: 'advanced' },      // Deep Learning
    ],
    learnSkills: [
      { skillId: 'skill-32', level: 'intermediate' },  // French
      { skillId: 'skill-49', level: 'beginner' },      // Public Speaking
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-35',
    email: 'leo.fischer@example.com',
    displayName: 'Leo Fischer',
    bio: 'Full-stack Go and React developer from Zurich. Passionate about microservices. Seeking to learn Spanish and 3D modeling in Blender.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Zurich',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-5', level: 'advanced' },       // Go
      { skillId: 'skill-11', level: 'advanced' },      // React
    ],
    learnSkills: [
      { skillId: 'skill-31', level: 'beginner' },      // Spanish
      { skillId: 'skill-25', level: 'beginner' },      // 3D Modeling (Blender)
    ],
    weekdays: [0, 3, 5],
  },
  {
    id: 'user-36',
    email: 'camille.laurent@example.com',
    displayName: 'Camille Laurent',
    bio: 'UX researcher and accessibility specialist. Teaching usability testing and inclusive design. Looking to learn TypeScript and GraphQL.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Paris',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-30', level: 'advanced' },      // User Research
      { skillId: 'skill-22', level: 'advanced' },      // UI/UX Design
    ],
    learnSkills: [
      { skillId: 'skill-2', level: 'intermediate' },   // TypeScript
      { skillId: 'skill-16', level: 'beginner' },      // GraphQL
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-37',
    email: 'arvind.nair@example.com',
    displayName: 'Arvind Nair',
    bio: 'Kubernetes reliability engineer and Docker mentor. Passionate about resilient systems. Looking to learn German and audio production.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Kolkata',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-18', level: 'advanced' },      // Kubernetes
      { skillId: 'skill-17', level: 'advanced' },      // Docker
    ],
    learnSkills: [
      { skillId: 'skill-33', level: 'beginner' },      // German
      { skillId: 'skill-29', level: 'beginner' },      // Audio Production
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-38',
    email: 'beatrice.rossi@example.com',
    displayName: 'Beatrice Rossi',
    bio: 'Italian language coach and brand storytelling strategist from Florence. Looking to learn web design in Figma and Next.js.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Rome',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-36', level: 'advanced' },      // Italian
      { skillId: 'skill-59', level: 'advanced' },      // Brand Strategy
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'intermediate' },  // Figma
      { skillId: 'skill-13', level: 'beginner' },      // Next.js
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-39',
    email: 'kieran.oconnor@example.com',
    displayName: 'Kieran O\'Connor',
    bio: 'Technical writer and documentation architect. Teaching API docs and clear technical communication. Looking to learn Rust and Go.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Dublin',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-50', level: 'advanced' },      // Technical Writing
      { skillId: 'skill-49', level: 'advanced' },      // Public Speaking
    ],
    learnSkills: [
      { skillId: 'skill-4', level: 'intermediate' },   // Rust
      { skillId: 'skill-5', level: 'beginner' },       // Go
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-40',
    email: 'leila.benali@example.com',
    displayName: 'Leïla Benali',
    bio: 'Growth marketing specialist and Arabic/French speaker. Teaching paid acquisition and conversion optimization. Looking to learn SQL.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Africa/Algiers',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-54', level: 'advanced' },      // Growth Marketing
      { skillId: 'skill-37', level: 'advanced' },      // Arabic
    ],
    learnSkills: [
      { skillId: 'skill-10', level: 'intermediate' },  // SQL
      { skillId: 'skill-47', level: 'beginner' },      // Power BI
    ],
    weekdays: [0, 2, 4],
  },
  {
    id: 'user-41',
    email: 'david.miller@example.com',
    displayName: 'David Miller',
    bio: 'Senior Java & Spring Cloud architect with 10+ years experience. Looking to learn modern UI design in Figma and conversational Japanese.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/New_York',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-6', level: 'advanced' },       // Java
      { skillId: 'skill-10', level: 'advanced' },      // SQL
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'beginner' },      // Figma
      { skillId: 'skill-34', level: 'beginner' },      // Japanese
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-42',
    email: 'zara.larsson@example.com',
    displayName: 'Zara Larsson',
    bio: 'Design systems engineer bridging the gap between Figma components and React code. Eager to explore prompt engineering and NLP.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/Stockholm',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-23', level: 'advanced' },      // Design Systems
      { skillId: 'skill-11', level: 'advanced' },      // React
    ],
    learnSkills: [
      { skillId: 'skill-44', level: 'intermediate' },  // Prompt Engineering
      { skillId: 'skill-45', level: 'beginner' },      // NLP
    ],
    weekdays: [2, 4, 6],
  },
  {
    id: 'user-43',
    email: 'gabriel.garcia@example.com',
    displayName: 'Gabriel Garcia',
    bio: 'Flutter and Dart enthusiast from Buenos Aires. Teaching mobile cross-platform patterns and Spanish. Seeking to learn Node.js and Docker.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Argentina/Buenos_Aires',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-19', level: 'advanced' },      // Flutter
      { skillId: 'skill-31', level: 'advanced' },      // Spanish
    ],
    learnSkills: [
      { skillId: 'skill-12', level: 'intermediate' },  // Node.js
      { skillId: 'skill-17', level: 'beginner' },      // Docker
    ],
    weekdays: [1, 2, 4],
  },
  {
    id: 'user-44',
    email: 'olivia.kim@example.com',
    displayName: 'Olivia Kim',
    bio: 'Product manager and agile coach in Seoul. Teaching product discovery, user story mapping, and Korean. Looking to learn Python.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Asia/Seoul',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-51', level: 'advanced' },      // Product Management
      { skillId: 'skill-39', level: 'advanced' },      // Korean
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'intermediate' },   // Python
      { skillId: 'skill-10', level: 'beginner' },      // SQL
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-45',
    email: 'julian.mercier@example.com',
    displayName: 'Julian Mercier',
    bio: 'Motion graphics artist and 3D visualizer from Montreal. Teaching Cinema 4D and After Effects. Looking to learn JavaScript and web animation.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Montreal',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-26', level: 'advanced' },      // Motion Graphics
      { skillId: 'skill-25', level: 'advanced' },      // 3D Modeling (Blender)
    ],
    learnSkills: [
      { skillId: 'skill-1', level: 'intermediate' },   // JavaScript
      { skillId: 'skill-11', level: 'beginner' },      // React
    ],
    weekdays: [0, 2, 5],
  },
  {
    id: 'user-46',
    email: 'layla.hassan@example.com',
    displayName: 'Layla Hassan',
    bio: 'Ethical hacker and application security researcher. Teaching web pentesting and security code audits. Looking to learn Rust and Italian.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/London',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-58', level: 'advanced' },      // Ethical Hacking
      { skillId: 'skill-57', level: 'advanced' },      // Cybersecurity
    ],
    learnSkills: [
      { skillId: 'skill-4', level: 'intermediate' },   // Rust
      { skillId: 'skill-36', level: 'beginner' },      // Italian
    ],
    weekdays: [1, 3, 6],
  },
  {
    id: 'user-47',
    email: 'ethan.walker@example.com',
    displayName: 'Ethan Walker',
    bio: 'Brand copywriter and content strategist. Teaching audience growth, copywriting, and public speaking. Looking to learn Python and Power BI.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Chicago',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-53', level: 'advanced' },      // SEO & Content Strategy
      { skillId: 'skill-49', level: 'advanced' },      // Public Speaking
    ],
    learnSkills: [
      { skillId: 'skill-3', level: 'intermediate' },   // Python
      { skillId: 'skill-47', level: 'beginner' },      // Power BI
    ],
    weekdays: [2, 4, 5],
  },
  {
    id: 'user-48',
    email: 'sophia.martinez@example.com',
    displayName: 'Sophia Martinez',
    bio: 'Data analyst and statistics instructor. Teaching applied statistics, hypothesis testing, and Pandas. Seeking to learn UI/UX design in Figma.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/Los_Angeles',
    role: 'member',
    teachSkills: [
      { skillId: 'skill-48', level: 'advanced' },      // Applied Statistics
      { skillId: 'skill-43', level: 'advanced' },      // Data Analysis
    ],
    learnSkills: [
      { skillId: 'skill-21', level: 'intermediate' },  // Figma
      { skillId: 'skill-22', level: 'beginner' },      // UI/UX Design
    ],
    weekdays: [1, 3, 5],
  },
  {
    id: 'user-49',
    email: 'mod@example.com',
    displayName: 'Sarah Jenkins (Moderator)',
    bio: 'SkillSwap Community Moderator & Trust/Safety Lead. Background in conflict resolution, ethics, and technical writing.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'America/New_York',
    role: 'moderator',
    teachSkills: [
      { skillId: 'skill-50', level: 'advanced' },      // Technical Writing
      { skillId: 'skill-56', level: 'advanced' },      // Negotiation Skills
    ],
    learnSkills: [
      { skillId: 'skill-57', level: 'intermediate' },  // Cybersecurity
      { skillId: 'skill-31', level: 'beginner' },      // Spanish
    ],
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: 'user-50',
    email: 'admin@example.com',
    displayName: 'Dr. Arthur Pendelton (Admin)',
    bio: 'Platform System Administrator & Engineering Director. Decades of distributed systems experience.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&auto=format&fit=crop&crop=faces&q=80',
    timezone: 'Europe/London',
    role: 'admin',
    teachSkills: [
      { skillId: 'skill-60', level: 'advanced' },      // Executive Leadership
      { skillId: 'skill-18', level: 'advanced' },      // Kubernetes
      { skillId: 'skill-4', level: 'advanced' },       // Rust
    ],
    learnSkills: [
      { skillId: 'skill-44', level: 'intermediate' },  // Prompt Engineering
      { skillId: 'skill-25', level: 'beginner' },      // 3D Modeling (Blender)
    ],
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  },
];

/**
 * Seeds the in-memory database with 50 diverse users, skills, availability, and social proof.
 */
export function seedMockDatabase(db: InMemoryDatabase): void {
  // 1. Populate Skills Catalog
  for (const s of MOCK_SKILLS_CATALOG) {
    db.skills.set(s.id, {
      id: s.id,
      name: s.name,
      category: s.category,
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
  }

  // 2. Populate 50 Users & their Skills + Availability
  let userSkillCounter = 1;
  let availCounter = 1;

  for (const u of MOCK_USERS_DATA) {
    const user: UserEntity = {
      id: u.id,
      email: u.email,
      passwordHash: DEFAULT_PASSWORD_HASH,
      displayName: u.displayName,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      timezone: u.timezone,
      role: u.role,
      status: 'active',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };
    db.users.set(user.id, user);

    // Assign Teach Skills (Unique per user)
    for (const ts of u.teachSkills) {
      const skill = db.skills.get(ts.skillId);
      const usId = `us-${userSkillCounter++}`;
      const userSkill: UserSkillEntity = {
        id: usId,
        userId: user.id,
        skillId: ts.skillId,
        intent: 'teach',
        level: ts.level,
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        skill,
      };
      db.userSkills.set(usId, userSkill);
    }

    // Assign Learn Skills (Unique per user, different from teach skills)
    for (const ls of u.learnSkills) {
      const skill = db.skills.get(ls.skillId);
      const usId = `us-${userSkillCounter++}`;
      const userSkill: UserSkillEntity = {
        id: usId,
        userId: user.id,
        skillId: ls.skillId,
        intent: 'learn',
        level: ls.level,
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        skill,
      };
      db.userSkills.set(usId, userSkill);
    }

    // Assign Weekly Availability
    for (const weekday of u.weekdays) {
      const avId = `av-${availCounter++}`;
      const availability: AvailabilityEntity = {
        id: avId,
        userId: user.id,
        weekday,
        startMinute: 540,  // 9:00 AM
        endMinute: 1140,   // 7:00 PM
        timezone: u.timezone,
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      };
      db.availability.set(avId, availability);
    }
  }

  // 3. Add Verified Reviews between reciprocal users for realistic social proof
  const sampleReviews: Array<{
    id: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    body: string;
  }> = [
    {
      id: 'rev-1',
      reviewerId: 'user-2',
      revieweeId: 'user-1',
      rating: 5,
      body: 'Alex is an exceptional React and TypeScript mentor! He explained state management concepts with total clarity.',
    },
    {
      id: 'rev-2',
      reviewerId: 'user-1',
      revieweeId: 'user-2',
      rating: 5,
      body: 'Sam made conversational Spanish engaging and fun. Our swap session was one of the most productive I have had.',
    },
    {
      id: 'rev-3',
      reviewerId: 'user-7',
      revieweeId: 'user-3',
      rating: 5,
      body: 'Elena’s Figma design system breakdown was masterclass level. Transformed how I think about layout tokens.',
    },
    {
      id: 'rev-4',
      reviewerId: 'user-5',
      revieweeId: 'user-4',
      rating: 5,
      body: 'Marcus gave me a clear, step-by-step introduction to Docker containerization. Highly recommend connecting with him!',
    },
    {
      id: 'rev-5',
      reviewerId: 'user-8',
      revieweeId: 'user-9',
      rating: 5,
      body: 'Kenji is a fantastic 3D Blender tutor. We walked through modeling topology and lighting in an hour.',
    },
    {
      id: 'rev-6',
      reviewerId: 'user-11',
      revieweeId: 'user-12',
      rating: 5,
      body: 'Isabella is so patient with Italian pronunciation. Truly a five-star skill exchange partner.',
    },
  ];

  for (const r of sampleReviews) {
    const rev: ReviewEntity = {
      id: r.id,
      sessionId: `session-mock-${r.id}`,
      reviewerId: r.reviewerId,
      revieweeId: r.revieweeId,
      rating: r.rating,
      body: r.body,
      status: 'visible',
      createdAt: new Date('2026-02-15T12:00:00.000Z'),
      reviewer: db.users.get(r.reviewerId),
      reviewee: db.users.get(r.revieweeId),
    };
    db.reviews.set(rev.id, rev);
  }

  console.log(`[Database Seed] Successfully loaded ${db.users.size} users, ${db.skills.size} skills, ${db.userSkills.size} user-skill mappings, and ${db.reviews.size} reviews.`);
}
