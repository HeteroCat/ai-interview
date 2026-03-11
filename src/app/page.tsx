import Link from 'next/link';
import { interviewTypes } from '@/types';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-bold text-gray-800">AI 面试助手</h1>
          </div>
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className="text-gray-800/80 hover:text-gray-800 transition-colors"
            >
              首页
            </Link>
            <Link 
              href="/resume" 
              className="text-gray-800/80 hover:text-gray-800 transition-colors"
            >
              简历分析
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            AI 模拟面试
          </h2>
          <p className="text-xl text-gray-800/70 max-w-2xl mx-auto">
            多种面试场景模拟，AI 智能评估，帮助你提升面试技巧，增强自信
          </p>
        </div>

        {/* Interview Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {interviewTypes.map((type) => (
            <Link
              key={type.id}
              href={`/interview/${type.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                <div className={`w-16 h-16 ${type.color} rounded-xl flex items-center justify-center text-3xl mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {type.name}
                </h3>
                <p className="text-gray-800/60 text-sm">
                  {type.description}
                </p>
                <div className="mt-4 flex items-center text-amber-700 text-sm">
                  <span>开始模拟</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📝
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">智能提问</h3>
            <p className="text-gray-800/50 text-sm">AI 根据选择自动生成针对性问题</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🎤
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">语音输入</h3>
            <p className="text-gray-800/50 text-sm">支持语音回答，模拟真实面试</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">详细评估</h3>
            <p className="text-gray-800/50 text-sm">多维度评估，提供改进建议</p>
          </div>
        </div>

        {/* Resume Upload CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              📄 基于简历的定制化面试
            </h3>
            <p className="text-gray-800/60 mb-6">
              上传你的简历，AI 将根据你的经历生成更加针对性的面试问题
            </p>
            <Link
              href="/resume"
              className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-gray-800 rounded-xl font-medium transition-colors"
            >
              上传简历开始
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-12">
        <div className="text-center text-gray-800/40 text-sm">
          © 2024 AI Interview Assistant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
