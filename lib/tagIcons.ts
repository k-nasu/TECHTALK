type TagIconMap = {
  [key: string]: {
    icon: string;  // 絵文字またはSVGパス
    color: string; // Tailwind カラークラス
  };
};

export const TAG_ICONS: TagIconMap = {
  'React': {
    icon: '⚛️',
    color: 'bg-blue-100'
  },
  'TypeScript': {
    icon: '📘',
    color: 'bg-blue-50'
  },
  'Next.js': {
    icon: '/icons/nextjs.svg',
    color: 'bg-gray-100'
  },
  'Rails': {
    icon: '🛤️',
    color: 'bg-red-50'
  },
  'Ruby': {
    icon: '💎',
    color: 'bg-red-100'
  },
  'AWS': {
    icon: '☁️',
    color: 'bg-orange-50'
  },
  'Docker': {
    icon: '🐳',
    color: 'bg-blue-50'
  },
  'Git': {
    icon: '/icons/git.svg',
    color: 'bg-orange-50'
  },
  'GitHub': {
    icon: '/icons/github.svg',
    color: 'bg-gray-100'
  },
  'API': {
    icon: '🔌',
    color: 'bg-green-50'
  },
  'Database': {
    icon: '💾',
    color: 'bg-blue-50'
  },
  'SQL': {
    icon: '📊',
    color: 'bg-blue-50'
  },
  'Testing': {
    icon: '🧪',
    color: 'bg-purple-50'
  },
  'Security': {
    icon: '🔒',
    color: 'bg-red-50'
  }
};

export const getTagIcon = (tag: string) => {
  return TAG_ICONS[tag]?.icon || '📄';
};

export const getTagColor = (tag: string) => {
  return TAG_ICONS[tag]?.color || 'bg-gray-100';
};
