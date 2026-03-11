'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { InterviewType, interviewTypes, Question } from '@/types';
import { getRandomQuestions, evaluateAnswer, generateReport } from '@/data/questions';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as InterviewType;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ questionId: string; content: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  
  const typeInfo = interviewTypes.find((t) => t.id === type);
  
  useEffect(() => {
    if (type) {
      const selectedQuestions = getRandomQuestions(type, 5);
      setQuestions(selectedQuestions);
    }
  }, [type]);
  
  // 语音识别设置
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
          setAnswer((prev) => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别功能');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    
    const currentQuestion = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, content: answer },
    ]);
    
    setAnswer('');
    setTranscript('');
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 完成所有问题，生成报告
      const allAnswers = [
        ...answers,
        { questionId: currentQuestion.id, content: answer },
      ];
      const report = generateReport(questions, allAnswers);
      
      // 将报告存储在 localStorage 中
      localStorage.setItem('interviewReport', JSON.stringify(report));
      router.push('/report');
    }
  };
  
  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
      setTranscript('');
    } else {
      router.push('/report');
    }
  };
  
  if (!typeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-800">无效的面试类型</p>
      </div>
    );
  }
  
  const currentQuestion = questions[currentIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-800/80 hover:text-gray-800 transition-colors">
            <span>←</span>
            <span>返回首页</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{typeInfo.icon}</span>
            <span className="text-gray-800 font-medium">{typeInfo.name}</span>
          </div>
        </div>
      </header>
      
      {/* Progress */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center justify-between text-gray-800/60 text-sm mb-2">
          <span>问题 {currentIndex + 1} / {questions.length}</span>
          <span>{Math.round(((currentIndex) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${typeInfo.color} transition-all duration-500`}
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Question */}
      <main className="container mx-auto px-6 py-8">
        {currentQuestion && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                  Q
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                    {currentQuestion.content}
                  </h2>
                  {currentQuestion.difficulty && (
                    <div className="mt-4 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {currentQuestion.difficulty === 'easy' ? '简单' :
                         currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Answer Input */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-gray-800 mb-4">请输入你的回答</h3>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="在这里输入你的回答..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-800 placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
              />
              
              {/* Voice Input */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-gray-800 animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 text-gray-800'
                  }`}
                >
                  <span className="text-lg">{isRecording ? '⏹️' : '🎤'}</span>
                  <span>{isRecording ? '停止录音' : '语音输入'}</span>
                </button>
                
                {transcript && (
                  <span className="text-gray-800/60 text-sm">正在识别...</span>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-800/60 hover:text-gray-800 transition-colors"
                >
                  跳过
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ${
                    answer.trim()
                      ? `${typeInfo.color} hover:opacity-90 text-gray-800 shadow-lg`
                      : 'bg-white/10 text-gray-800/40 cursor-not-allowed'
                  }`}
                >
                  提交回答
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
