'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateResumeQuestions } from '@/data/questions';

function ResumeContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedType, setSelectedType] = useState<'technical' | 'behavioral' | 'general'>('technical');
  const [fileName, setFileName] = useState('');
  
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // 动态导入 pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.staticfile.org/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };
  
  const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return await extractTextFromPDF(file);
    } else if (extension === 'txt') {
      return await file.text();
    } else {
      throw new Error('暂仅支持 PDF 和 TXT 格式，请将简历转换为 PDF 后上传');
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    
    try {
      // 实际解析文件
      const text = await extractTextFromFile(file);
      
      if (!text || text.trim().length < 50) {
        throw new Error('简历内容提取失败，请确保文件内容清晰');
      }
      
      setResumeText(text);
      setUploaded(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : '文件处理失败，请重试');
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleStartInterview = () => {
    // 根据简历生成问题
    const questions = generateResumeQuestions(resumeText);
    
    // 存储问题和简历信息
    sessionStorage.setItem('resumeQuestions', JSON.stringify(questions));
    sessionStorage.setItem('resumeText', resumeText);
    
    router.push(`/interview/resume-${selectedType}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-4xl">📄</span>
            <h1 className="text-3xl font-bold text-gray-800">简历分析</h1>
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
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">上传简历</h2>
            
            {!uploaded ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 rounded-xl p-12 text-center cursor-pointer hover:border-amber-500 hover:bg-white/5 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">正在解析简历...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📁</div>
                    <p className="text-gray-600 mb-2">点击或拖拽文件到此处</p>
                    <p className="text-gray-400 text-sm">支持 PDF、TXT 格式</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-700">{fileName} - 上传成功</span>
                  </div>
                  <button
                    onClick={() => {
                      setUploaded(false);
                      setResumeText('');
                      setFileName('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    重新上传
                  </button>
                </div>
                
                {/* Resume Preview */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-gray-700 font-medium mb-4">简历内容预览</h3>
                  <pre className="text-gray-600 text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                    {resumeText}
                  </pre>
                </div>
              </div>
            )}
          </div>
          
          {/* Interview Type Selection */}
          {uploaded && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">选择面试类型</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'technical', name: '技术面', icon: '💻', desc: '基于简历技能提问' },
                  { id: 'behavioral', name: '行为面', icon: '🤝', desc: '基于项目经验提问' },
                  { id: 'general', name: '通用面', icon: '📋', desc: '综合能力考察' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      selectedType === type.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <h3 className="text-gray-800 font-medium mb-1">{type.name}</h3>
                    <p className="text-gray-500 text-sm">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Start Button */}
          {uploaded && (
            <div className="text-center">
              <button
                onClick={handleStartInterview}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎯 开始针对性面试
              </button>
              <p className="text-gray-500 text-sm mt-4">
                AI 将根据你的简历生成 {5} 个针对性问题
              </p>
            </div>
          )}
          
          {/* Tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span> 建议
              </h3>
              <ul className="text-gray-500 text-sm space-y-2">
                <li>• 上传完整的简历以获得更准确的问题</li>
                <li>• 确保简历包含项目经验描述</li>
                <li>• 突出你的核心技能和成就</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                <span className="text-xl mr-2">🔒</span> 隐私保护
              </h3>
              <ul className="text-gray-500 text-sm space-y-2">
                <li>• 简历仅用于生成面试问题</li>
                <li>• 不会保存或泄露您的个人信息</li>
                <li>• 面试结束后数据自动清除</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    }>
      <ResumeContent />
    </Suspense>
  );
}
