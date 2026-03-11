'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DetailedFeedback {
  questionId: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

interface Report {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailedFeedback: DetailedFeedback[];
}

export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  useEffect(() => {
    const savedReport = localStorage.getItem('interviewReport');
    if (savedReport) {
      setReport(JSON.parse(savedReport));
    }
  }, []);
  
  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🤔</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">暂无面试记录</h2>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-gray-800 rounded-xl transition-colors"
          >
            开始面试
          </Link>
        </div>
      </div>
    );
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-4xl">📊</span>
            <h1 className="text-3xl font-bold text-gray-800">面试评估报告</h1>
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-800/80 hover:text-gray-800 transition-colors">
              首页
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overall Score */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="relative w-40 h-40 mb-6 md:mb-0 md:mr-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-800/10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(report.overallScore / 100) * 440} 440`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {report.overallScore >= 80 ? '表现优秀！🎉' :
                   report.overallScore >= 60 ? '表现良好，继续加油！💪' :
                   '需要更多准备 📚'}
                </h2>
                <p className="text-gray-800/60">
                  {report.overallScore >= 80 ? '你的面试表现非常出色，展现了很强的能力' :
                   report.overallScore >= 60 ? '整体表现不错，还有一些方面可以改进' :
                   '建议多加练习，提升面试技巧'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-purple-500 text-gray-800'
                  : 'bg-white/10 text-gray-800/60 hover:text-gray-800'
              }`}
            >
              📋 总览
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'details'
                  ? 'bg-purple-500 text-gray-800'
                  : 'bg-white/10 text-gray-800/60 hover:text-gray-800'
              }`}
            >
              💬 详细反馈
            </button>
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✅</span> 优点
                </h3>
                <ul className="space-y-3">
                  {report.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-800/80">
                      <span className="text-green-400">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span> 待改进
                </h3>
                <ul className="space-y-3">
                  {report.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-800/80">
                      <span className="text-yellow-400">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Suggestions */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span> 改进建议
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 text-gray-800/70"
                    >
                      <span className="text-purple-400 font-medium">{index + 1}.</span> {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {report.detailedFeedback.map((item, index) => (
                <div
                  key={item.questionId}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-amber-700 font-medium">
                        {index + 1}
                      </span>
                      <h4 className="text-gray-800 font-medium">{item.question}</h4>
                    </div>
                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getScoreBg(item.score)} text-gray-800 font-bold`}>
                      {item.score}分
                    </div>
                  </div>
                  
                  <div className="ml-11 space-y-3">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-800/50 text-sm mb-2">你的回答：</p>
                      <p className="text-gray-800/80">{item.answer}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-400">💬</span>
                      <p className="text-gray-800/60 text-sm">{item.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-gray-800 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 再次练习
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('interviewReport');
                window.location.href = '/';
              }}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-gray-800 rounded-xl font-medium transition-colors"
            >
              清除记录
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
