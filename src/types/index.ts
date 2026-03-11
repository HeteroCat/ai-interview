// 面试类型定义
export type InterviewType = 'technical' | 'behavioral' | 'stress' | 'general';

export interface InterviewTypeOption {
  id: InterviewType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  content: string;
  type: InterviewType;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Answer {
  questionId: string;
  content: string;
  audioUrl?: string;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  type: InterviewType;
  questions: Question[];
  answers: Answer[];
  resumeText?: string;
  startedAt: number;
  completedAt?: number;
}

export interface Report {
  sessionId: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailedFeedback: {
    questionId: string;
    score: number;
    feedback: string;
  }[];
}

// 面试类型配置
export const interviewTypes: InterviewTypeOption[] = [
  {
    id: 'technical',
    name: '技术面',
    description: '考察专业技能和理论知识',
    icon: '💻',
    color: 'bg-blue-500',
  },
  {
    id: 'behavioral',
    name: '行为面',
    description: '考察软技能和经验案例',
    icon: '🤝',
    color: 'bg-green-500',
  },
  {
    id: 'stress',
    name: '压力面',
    description: '考察抗压能力和应变能力',
    icon: '🔥',
    color: 'bg-red-500',
  },
  {
    id: 'general',
    name: '通用面',
    description: '综合考察各方面能力',
    icon: '📋',
    color: 'bg-purple-500',
  },
];
