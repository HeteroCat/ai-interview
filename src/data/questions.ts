import { Question, InterviewType } from '@/types';

// 模拟问题库
export const questionBank: Record<InterviewType, Question[]> = {
  technical: [
    { id: 't1', content: '请介绍一下你最擅长的技术栈，以及为什么选择它？', type: 'technical', difficulty: 'easy' },
    { id: 't2', content: '解释一下什么是HTTP协议，以及HTTPS和HTTP的区别？', type: 'technical', difficulty: 'medium' },
    { id: 't3', content: '请描述一下React的生命周期函数，以及Hooks的出现解决了什么问题？', type: 'technical', difficulty: 'medium' },
    { id: 't4', content: '什么是数据库索引？什么时候应该使用索引，什么时候不应该使用？', type: 'technical', difficulty: 'hard' },
    { id: 't5', content: '请解释一下什么是 RESTful API 设计原则？', type: 'technical', difficulty: 'medium' },
  ],
  behavioral: [
    { id: 'b1', content: '请描述一次你成功解决团队冲突的经历，你是如何处理的？', type: 'behavioral', difficulty: 'easy' },
    { id: 'b2', content: '讲一个你曾经失败的项目，从中学到了什么？', type: 'behavioral', difficulty: 'medium' },
    { id: 'b3', content: '如果你的同事不同意你的方案，你会怎么做？', type: 'behavioral', difficulty: 'medium' },
    { id: 'b4', content: '请描述一次你需要在很短时间内完成重要任务的经历。', type: 'behavioral', difficulty: 'hard' },
    { id: 'b5', content: '你为什么想加入我们公司？', type: 'behavioral', difficulty: 'easy' },
  ],
  stress: [
    { id: 's1', content: '你觉得你凭什么能胜任这个岗位？', type: 'stress', difficulty: 'hard' },
    { id: 's2', content: '如果我们不录用你，你会怎么做？', type: 'stress', difficulty: 'hard' },
    { id: 's3', content: '你的简历中有一些空白期，能解释一下吗？', type: 'stress', difficulty: 'medium' },
    { id: 's4', content: '你认为自己最大的缺点是什么？', type: 'stress', difficulty: 'medium' },
    { id: 's5', content: '如果让你和上级发生冲突，你会怎么处理？', type: 'stress', difficulty: 'hard' },
  ],
  general: [
    { id: 'g1', content: '请简单介绍一下自己。', type: 'general', difficulty: 'easy' },
    { id: 'g2', content: '你未来3-5年的职业规划是什么？', type: 'general', difficulty: 'medium' },
    { id: 'g3', content: '你有什么问题想问我吗？', type: 'general', difficulty: 'easy' },
    { id: 'g4', content: '请描述一次你学习新技术的经历。', type: 'general', difficulty: 'medium' },
    { id: 'g5', content: '你期望的薪资是多少？', type: 'general', difficulty: 'hard' },
  ],
};

// 获取指定类型的随机问题
export function getRandomQuestions(type: InterviewType, count: number = 5): Question[] {
  const questions = [...questionBank[type]];
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// AI 模拟生成针对性问题 (基于简历)
export function generateResumeQuestions(resumeText: string): Question[] {
  // 模拟 AI 分析简历后生成问题
  const baseQuestions = questionBank.technical.slice(0, 2);
  
  // 这里可以添加基于简历内容的智能问题生成逻辑
  return [
    ...baseQuestions,
    { id: 'r1', content: '根据你的简历，你在项目中遇到的最大技术挑战是什么？如何解决的？', type: 'technical', difficulty: 'medium' },
    { id: 'r2', content: '请详细介绍你在简历中提到的XXX项目，你具体负责什么？', type: 'general', difficulty: 'medium' },
    { id: 'r3', content: '你在项目中是如何与团队协作的？', type: 'behavioral', difficulty: 'easy' },
  ];
}

// 模拟 AI 评估回答
export function evaluateAnswer(question: Question, answer: string): { score: number; feedback: string } {
  const length = answer.length;
  
  let score = 0;
  let feedback = '';
  
  if (length < 10) {
    score = 20;
    feedback = '回答过于简短，建议更详细地阐述你的观点。';
  } else if (length < 50) {
    score = 50;
    feedback = '回答有一定内容，但可以更加具体和深入。';
  } else if (length < 150) {
    score = 75;
    feedback = '回答比较完整，但如果能结合具体案例会更好。';
  } else {
    score = 90;
    feedback = '回答非常详尽，展现了很好的表达能力。';
  }
  
  // 根据问题类型调整评分
  if (question.type === 'technical' && answer.toLowerCase().includes('具体')) {
    score = Math.min(score + 5, 100);
  }
  
  return { score, feedback };
}

// 生成最终报告
export function generateReport(questions: Question[], answers: { questionId: string; content: string }[]): any {
  const detailedFeedback = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    const evaluation = evaluateAnswer(q, answer?.content || '');
    return {
      questionId: q.id,
      question: q.content,
      answer: answer?.content || '',
      score: evaluation.score,
      feedback: evaluation.feedback,
    };
  });
  
  const overallScore = Math.round(
    detailedFeedback.reduce((sum, f) => sum + f.score, 0) / detailedFeedback.length
  );
  
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];
  
  if (overallScore >= 80) {
    strengths.push('整体表现优秀');
    strengths.push('表达能力较强');
  } else if (overallScore >= 60) {
    strengths.push('基本能回答问题');
    weaknesses.push('回答深度有待加强');
  } else {
    weaknesses.push('回答内容不够充分');
    weaknesses.push('需要更多准备');
  }
  
  suggestions.push('建议多加练习面试技巧');
  suggestions.push('可以准备一些常见问题的回答模板');
  suggestions.push('注意保持自信的态度');
  
  return {
    overallScore,
    strengths,
    weaknesses,
    suggestions,
    detailedFeedback,
  };
}
