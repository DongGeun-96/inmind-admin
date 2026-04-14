export type BoardType =
  | 'emotion'
  | 'cheer'
  | 'pet_loss'
  | 'human_loss'
  | 'depression'
  | 'recovery'
  | 'love'
  | 'career'
  | 'marriage'
  | 'family'
  | 'relationship'
  | 'workplace'
  | 'study'
  | 'parenting'
  | 'healing_food'
  | 'healing_place'
  | 'healing_book'
  | 'healing_movie'
  | 'healing_quote'
  | 'healing_etc'
  | 'community_free'
  | 'tips';

export interface User {
  id: string;
  nickname: string;
  email: string;
  username?: string | null;
  created_at: string;
  is_banned: boolean;
  role: 'user' | 'admin';
}

export interface Post {
  id: string;
  user_id: string;
  board_type: BoardType;
  title: string;
  content: string;
  is_anonymous: boolean;
  is_public: boolean;
  is_notice: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'nickname'>;
  comment_count?: number;
  empathy_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  user?: Pick<User, 'nickname'>;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  reason: string;
  created_at: string;
  is_handled: boolean;
  action?: 'resolved' | 'resolved_delete_only' | 'dismissed' | null;
  target_content?: string | null;
  target_user_id?: string | null;
  target_user_nickname?: string | null;
}

export interface Inquiry {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  reply: string | null;
  status: 'pending' | 'answered';
  created_at: string;
  replied_at: string | null;
  user?: { nickname: string; email: string } | null;
}

export const BOARD_CONFIG: Record<
  BoardType,
  { label: string; category: string }
> = {
  emotion: { label: '오늘의 감정 기록', category: '마음의공간' },
  cheer: { label: '응원 한마디', category: '마음의공간' },
  pet_loss: { label: '반려동물 이별', category: '이야기나눔' },
  human_loss: { label: '소중한 사람 이별', category: '이야기나눔' },
  depression: { label: '우울·불안 나눔', category: '이야기나눔' },
  recovery: { label: '회복 후기', category: '이야기나눔' },
  love: { label: '연애', category: '고민상담소' },
  career: { label: '취업', category: '고민상담소' },
  marriage: { label: '결혼', category: '고민상담소' },
  family: { label: '가족', category: '고민상담소' },
  relationship: { label: '인간관계', category: '고민상담소' },
  workplace: { label: '직장생활', category: '고민상담소' },
  study: { label: '학업', category: '고민상담소' },
  parenting: { label: '육아', category: '고민상담소' },
  healing_food: { label: '음식', category: '힐링플레이스' },
  healing_place: { label: '장소', category: '힐링플레이스' },
  healing_book: { label: '책', category: '힐링플레이스' },
  healing_movie: { label: '영화/드라마', category: '힐링플레이스' },
  healing_quote: { label: '문구', category: '힐링플레이스' },
  healing_etc: { label: '기타', category: '힐링플레이스' },
  community_free: { label: '자유', category: '커뮤니티' },
  tips: { label: '꿀팁공유', category: '커뮤니티' },
};

export const CATEGORIES = [
  { name: '마음의공간', boards: ['emotion', 'cheer'] as BoardType[] },
  { name: '이야기나눔', boards: ['pet_loss', 'human_loss', 'depression', 'recovery'] as BoardType[] },
  { name: '고민상담소', boards: ['love', 'career', 'marriage', 'family', 'relationship', 'workplace', 'study', 'parenting'] as BoardType[] },
  { name: '힐링플레이스', boards: ['healing_food', 'healing_place', 'healing_book', 'healing_movie', 'healing_quote', 'healing_etc'] as BoardType[] },
  { name: '커뮤니티', boards: ['community_free', 'tips'] as BoardType[] },
];
