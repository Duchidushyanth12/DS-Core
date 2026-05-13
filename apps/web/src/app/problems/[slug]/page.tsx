'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';
import { Play, Send, Code2, Loader2, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import confetti from 'canvas-confetti';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProblemSolvingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  interface ExecutionResult {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }

  interface ExecutionOutput {
    status: string;
    executionTime: number;
    memoryUsed: number;
    results: ExecutionResult[];
  }

  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState<ExecutionOutput | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const DEFAULT_BOILERPLATE: Record<string, string> = {
    javascript: `function solution() {\n  // Your code here\n  console.log("Hello World");\n}`,
    python: `def solution():\n    # Your code here\n    print("Hello World")`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello World");\n    }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    // Your code here\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`${API_URL}/api/problems/${slug}`);
        if (!response.ok) {
          if (response.status === 403) throw new Error("LOCKED");
          throw new Error("Failed to load problem");
        }
        const data = await response.json();
        setProblem(data);
      } catch (err: any) {
        if (err.message === "LOCKED") {
          setError("🔒 This problem is locked. Complete the previous pattern first.");
        } else {
          setError("Failed to load problem from API.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblem();
  }, [slug]);


  useEffect(() => {
    if (problem && !code) {
      setCode(DEFAULT_BOILERPLATE[language]);
    }
  }, [problem]);

  useEffect(() => {
    // Update boilerplate when language changes, but ONLY if the editor is empty or still has default boilerplate
    const currentBoilerplates = Object.values(DEFAULT_BOILERPLATE);
    if (!code || currentBoilerplates.includes(code.trim())) {
      setCode(DEFAULT_BOILERPLATE[language]);
    }
  }, [language]);

  const handleRunCode = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setOutput(null);
    try {
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          userId: userId || 'anonymous',
          language,
          code
        })
      });
      if (!response.ok) throw new Error("API Unreachable");
      const result = await response.json();
      
      const newOutput = {
        status: result.status,
        executionTime: result.executionTime || 0,
        memoryUsed: result.memoryUsed || 0,
        results: result.results || [
          { passed: result.status === 'ACCEPTED', input: 'Hidden', expected: 'Hidden', actual: result.status }
        ]
      };

      setOutput(newOutput);

      if (result.status === 'ACCEPTED') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#ffffff']
        });
      }
    } catch (err) {
      console.error("Execution API failed:", err);
      setError("Execution failed. Backend might be disconnected.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    await handleRunCode();
  };

  if (isLoading) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Initializing coding environment...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-500/10 p-6 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold mb-4">{error}</h2>
      <Link href="/patterns" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
        Back to Roadmap
      </Link>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Navbar */}
      <header className="glass flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/problems" className="hover:bg-white/5 p-1 rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-sm text-white">DS-corE</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-semibold text-sm">{problem.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-green-400" />}
            Run
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-blue-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description (Left Pane) */}
        <div className="w-1/2 overflow-y-auto border-r border-white/5 p-6 custom-scrollbar">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">{problem.title}</h2>
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              problem.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400' :
              problem.difficulty === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>{problem.difficulty}</span>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">{problem.pattern?.name}</span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{problem.description}</p>

            <h3 className="text-lg font-semibold mt-8 mb-4">Example 1:</h3>
            <div className="bg-secondary p-4 rounded-lg font-mono text-sm">
              <span className="text-muted-foreground">Input:</span> {problem.testCases?.[0]?.input || 'No input data'}<br/>
              <span className="text-muted-foreground">Output:</span> {problem.testCases?.[0]?.expectedOutput || 'No output data'}<br/>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">Constraints:</h3>
            <ul className="list-disc pl-5 bg-secondary/50 p-4 rounded-lg text-sm space-y-1">
              <li>Time Limit: {problem.timeLimit}ms</li>
              <li>Memory Limit: {problem.spaceLimit}MB</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>
        </div>

        {/* Editor & Output (Right Pane) */}
        <div className="w-1/2 flex flex-col">
          {/* Editor */}
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-full px-4 py-2 bg-[#1e1e1e] border-b border-white/5 z-10 flex justify-between items-center">
              <select 
                className="bg-transparent text-xs text-muted-foreground outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="pt-10 h-full w-full">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="h-64 border-t border-white/5 bg-[#18181b] overflow-y-auto">
            <div className="sticky top-0 bg-[#18181b] px-4 py-2 text-xs font-semibold text-muted-foreground uppercase border-b border-white/5 flex justify-between items-center">
              <span>Execution Output</span>
              {output?.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
            </div>
            <div className="p-4 font-mono text-sm">
              {!output && !isExecuting && (
                <div className="text-muted-foreground">Run code to see results here...</div>
              )}
              {isExecuting && (
                <div className="flex items-center gap-2 text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Executing in cloud sandbox...
                </div>
              )}
              {output && !isExecuting && (
                <div className="space-y-6">
                  {/* Summary Metrics */}
                  <div className="flex gap-4">
                    <div className={`px-3 py-1 rounded border ${
                      output.status === 'ACCEPTED' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <span className="text-xs font-bold uppercase tracking-wider">{output.status}</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-secondary border border-white/5">
                      <span className="text-muted-foreground text-xs uppercase tracking-wider">Time:</span>
                      <span className="ml-2 text-foreground text-xs font-mono">{output.executionTime}ms</span>
                    </div>
                  </div>

                  {/* Test Cases List */}
                  <div className="space-y-4">
                    {output.results.map((res: any, idx: number) => (
                      <div key={idx} className="overflow-hidden rounded-lg border border-white/5 bg-secondary/30">
                        <div className="px-4 py-2 bg-white/5 flex items-center justify-between">
                          <span className={`text-xs font-bold ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
                            Test Case {idx + 1}: {res.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Input</div>
                            <div className="bg-background/50 p-2 rounded text-xs font-mono border border-white/5">{res.input}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Expected</div>
                              <div className="bg-background/50 p-2 rounded text-xs font-mono border border-white/5 text-green-400/80">{res.expected}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Actual</div>
                              <div className="bg-background/50 p-2 rounded text-xs font-mono border border-white/5 text-foreground">{res.actual}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
