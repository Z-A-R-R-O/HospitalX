"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brain, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle, AlertTriangle, User, ChevronLeft, Volume2 } from 'lucide-react';
import { SCREENING_QUESTIONS, CATEGORY_ORDER } from '@/lib/screening/questions';
import { calculateScreeningResult } from '@/lib/screening/engine';
import { saveScreening } from '@/lib/offline/db';
import { queueScreeningSync } from '@/lib/offline/sync-queue';
import type { QuestionResponse, ScreeningResult, ScreeningCategory } from '@/lib/screening/types';
import type { OfflineScreening } from '@/lib/offline/types';
import { v4 as uuidv4 } from 'uuid'; // Assuming standard uuid available, standard in nextjs/react projects often

type FlowState = 'consent' | 'intro' | 'question' | 'computing' | 'result';

export default function ActiveScreeningPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');
  const resolvedParams = use(params);
  
  const [flowState, setFlowState] = useState<FlowState>('consent');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [localScreeningId, setLocalScreeningId] = useState<string>('');
  
  // Ephemeral state for current question
  const [observation, setObservation] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Timer for total duration
  const [elapsed, setElapsed] = useState(0);

  // Phase 5: Voice and Localization
  const [isHindi, setIsHindi] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // Stop audio on unmount or navigation
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const glassStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(30px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '20px',
  };

  useEffect(() => {
    if (!patientId) {
      router.push('/health-worker/screen');
    }
  }, [patientId, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (flowState === 'question' || flowState === 'intro') {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [flowState]);

  // Handle countdown timer for timed questions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (flowState === 'question' && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => (t ? t - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [flowState, timeLeft]);

  const handleBegin = () => {
    setStartedAt(Date.now());
    setLocalScreeningId(uuidv4());
    transitionToNextCategoryOrQuestion(0, true);
  };

  const transitionToNextCategoryOrQuestion = (nextIndex: number, isInitial: boolean = false) => {
    const currentQuestion = SCREENING_QUESTIONS[nextIndex === 0 ? 0 : nextIndex - 1];
    const nextQuestion = SCREENING_QUESTIONS[nextIndex];

    if (nextQuestion && (!currentQuestion || currentQuestion.category !== nextQuestion.category)) {
      setFlowState('intro');
      setTimeout(() => {
        setQuestionIndex(nextIndex);
        setFlowState('question');
        setTimeLeft(nextQuestion.timeLimit || null);
        setObservation('');
      }, 1500);
    } else {
      setQuestionIndex(nextIndex);
      setFlowState('question');
      setTimeLeft(nextQuestion?.timeLimit || null);
      setObservation('');
    }
  };

  const handleAnswer = async (score: number, selectedOptionLabel: string) => {
    const currentQ = SCREENING_QUESTIONS[questionIndex];
    const newResponse: QuestionResponse = {
      questionId: currentQ.id,
      category: currentQ.category,
      score,
      maxScore: currentQ.maxScore,
      selectedOption: selectedOptionLabel,
      observation: observation.trim() || undefined,
      answeredAt: Date.now(),
    };

    const newResponses = [...responses];
    newResponses[questionIndex] = newResponse;
    setResponses(newResponses);

    if (questionIndex < SCREENING_QUESTIONS.length - 1) {
      transitionToNextCategoryOrQuestion(questionIndex + 1);
    } else {
      // Completed
      setFlowState('computing');
      const completedAt = Date.now();
      const finalResult = calculateScreeningResult(newResponses, startedAt, completedAt);
      
      const offlineScreening: OfflineScreening = {
        localId: localScreeningId,
        idempotencyKey: uuidv4(),
        patientLocalId: patientId!,
        workerId: 'current-worker', // Should come from auth context normally
        status: 'completed',
        responses: newResponses as any, // Type adaptation if needed
        totalScore: finalResult.totalScore,
        maxScore: finalResult.maxScore,
        riskLevel: finalResult.riskLevel,
        observations: newResponses.map(r => r.observation).filter(Boolean) as string[],
        durationSeconds: finalResult.completedInSeconds,
        startedAt,
        completedAt,
      };

      try {
        await saveScreening(offlineScreening);
        await queueScreeningSync(offlineScreening);
      } catch (err) {
        console.error('Error saving screening:', err);
      }

      setTimeout(() => {
        setResult(finalResult);
        setFlowState('result');
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      const prevQ = SCREENING_QUESTIONS[questionIndex - 1];
      setQuestionIndex(questionIndex - 1);
      setFlowState('question');
      setTimeLeft(prevQ.timeLimit || null);
      setObservation(responses[questionIndex - 1]?.observation || '');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = SCREENING_QUESTIONS[questionIndex];

  // Map category to emoji/label (fallback if types constants not fully loaded in this snippet)
  const categoryDetails: Record<string, { label: string; icon: string }> = {
    orientation_memory: { label: 'Orientation & Memory', icon: '🧠' },
    speech_language: { label: 'Speech & Language', icon: '🗣️' },
    motor_function: { label: 'Motor Function', icon: '🤚' },
    tremor_coordination: { label: 'Tremor & Coordination', icon: '🎯' },
    daily_impact: { label: 'Daily Impact', icon: '🏠' }
  };

  if (!patientId) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', color: '#fff', fontFamily: 'SF Pro Display, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar showing Timer and Language Toggle */}
      {['intro', 'question'].includes(flowState) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ArrowLeft size={20} />
             <span>Cancel</span>
          </button>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsHindi(!isHindi)}
              style={{
                ...glassStyle, padding: '4px 12px', fontSize: '0.9rem', cursor: 'pointer', 
                color: isHindi ? 'var(--blue, #277cf4)' : '#fff', fontWeight: isHindi ? 700 : 400
              }}
            >
              {isHindi ? 'हिंदी' : 'English'}
            </button>
            <div style={{ ...glassStyle, padding: '6px 12px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red, #ef4148)', animation: 'pulse 2s infinite' }} />
              {formatTime(elapsed)}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* STATE: CONSENT */}
        {flowState === 'consent' && (
          <div style={{ ...glassStyle, padding: '2.5rem', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldAlert size={32} color="var(--blue, #277cf4)" />
            </div>
            <h1 style={{ textAlign: 'center', margin: '0 0 1.5rem', fontSize: '1.8rem', fontWeight: 700 }}>
              {isHindi ? 'स्क्रीनिंग सहमति' : 'Screening Consent'}
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle size={20} style={{ color: 'var(--green, #0a9c6d)', marginTop: '4px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>
                  {isHindi ? 'यह स्क्रीनिंग उन पैटर्नों की पहचान करने में मदद करती है जिनके लिए विशेषज्ञ मूल्यांकन की आवश्यकता हो सकती है।' : 'This screening helps identify patterns that may warrant specialist evaluation.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <AlertTriangle size={20} style={{ color: 'var(--orange, #ef9519)', marginTop: '4px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 600 }}>
                  {isHindi ? 'यह कोई निदान (diagnosis) नहीं है।' : 'This is NOT a diagnosis.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <User size={20} style={{ color: 'var(--purple, #7357e8)', marginTop: '4px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>
                  {isHindi ? 'स्वास्थ्य कार्यकर्ता आपसे प्रश्न पूछेगा और कुछ गतिविधियों का निरीक्षण करेगा।' : 'The health worker will ask you questions and observe some movements.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle size={20} style={{ color: 'var(--blue, #277cf4)', marginTop: '4px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>
                  {isHindi ? 'चिकित्सीय समीक्षा के लिए आपकी प्रतिक्रियाएं दर्ज की जाएंगी।' : 'Your responses will be recorded for medical review.'}
                </p>
              </div>
            </div>

            <button 
              onClick={handleBegin}
              style={{
                width: '100%', padding: '16px', borderRadius: '100px', background: 'var(--blue, #277cf4)', 
                color: '#fff', fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                marginBottom: '1rem', boxShadow: '0 4px 12px rgba(39, 124, 244, 0.4)', transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isHindi ? 'मैं समझता हूँ, स्क्रीनिंग शुरू करें' : 'I Understand, Begin Screening'}
            </button>
            <button 
              onClick={() => router.back()}
              style={{
                width: '100%', padding: '16px', borderRadius: '100px', background: 'transparent', 
                color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500, border: 'none', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* STATE: CATEGORY INTRO */}
        {flowState === 'intro' && currentQ && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {categoryDetails[currentQ.category]?.icon || '🧠'}
            </div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem', fontWeight: 700 }}>
              Now: {categoryDetails[currentQ.category]?.label || currentQ.category}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>Prepare for the next set of questions.</p>
          </div>
        )}

        {/* STATE: QUESTION */}
        {flowState === 'question' && currentQ && (
          <div style={{ animation: 'slideInRight 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{categoryDetails[currentQ.category]?.icon}</span>
                  {categoryDetails[currentQ.category]?.label}
                </span>
                <span>Question {questionIndex + 1} of {SCREENING_QUESTIONS.length}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${((questionIndex + 1) / SCREENING_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--blue, #277cf4)', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 600, margin: 0, lineHeight: 1.3, flex: 1 }}>
                  {isHindi ? (currentQ.hindiText || currentQ.text) : currentQ.text}
                </h2>
                <button
                  onClick={() => playAudio(isHindi ? (currentQ.hindiText || currentQ.text) : currentQ.text, isHindi ? 'hi-IN' : 'en-IN')}
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', 
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isPlaying ? 'var(--blue, #277cf4)' : '#fff', cursor: 'pointer', marginLeft: '1rem'
                  }}
                  title="Read Aloud"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--orange, #ef9519)', margin: 0, padding: '12px 16px', background: 'rgba(239, 149, 25, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--orange, #ef9519)' }}>
                {isHindi ? 'निर्देश' : 'Instruction'}: {isHindi ? (currentQ.hindiInstruction || currentQ.instruction) : currentQ.instruction}
              </p>
            </div>

            {timeLeft !== null && (
              <div style={{ alignSelf: 'center', margin: '0 0 2rem', padding: '1rem 2rem', ...glassStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Limit</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'monospace', color: timeLeft <= 5 ? 'var(--red, #ef4148)' : '#fff' }}>
                  {timeLeft}s
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', flex: 1 }}>
              {currentQ.options.map((opt) => {
                let tint = '';
                if (opt.score === 0) tint = 'rgba(10, 156, 109, 0.15)'; // Green
                if (opt.score === 1) tint = 'rgba(239, 149, 25, 0.15)'; // Orange
                if (opt.score === 2) tint = 'rgba(239, 65, 72, 0.15)'; // Red

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.score, opt.label)}
                    style={{
                      ...glassStyle,
                      background: tint,
                      padding: '1.25rem',
                      textAlign: 'left',
                      border: `1px solid ${opt.score === 0 ? 'rgba(10,156,109,0.3)' : opt.score === 1 ? 'rgba(239,149,25,0.3)' : 'rgba(239,65,72,0.3)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#fff' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{opt.description}</div>
                      </div>
                      <div style={{ 
                        background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px', 
                        fontSize: '0.8rem', fontWeight: 700, color: '#fff'
                      }}>
                        {opt.score} pt{opt.score !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Observations (Optional)</label>
              <textarea
                value={observation}
                onChange={e => setObservation(e.target.value)}
                placeholder="Note any visible tremors, hesitation, etc..."
                style={{
                  ...glassStyle,
                  width: '100%',
                  padding: '12px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  resize: 'none',
                  height: '80px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {questionIndex > 0 && (
              <button 
                onClick={handlePrevious}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem',
                  cursor: 'pointer', padding: '8px 0', alignSelf: 'flex-start'
                }}
              >
                <ChevronLeft size={20} />
                Previous Question
              </button>
            )}
          </div>
        )}

        {/* STATE: COMPUTING */}
        {flowState === 'computing' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', padding: '4rem 0' }}>
            <div style={{ 
              width: '100px', height: '100px', margin: '0 auto 2rem', 
              background: 'rgba(39, 124, 244, 0.1)', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}>
              <Brain size={48} color="var(--blue, #277cf4)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Analyzing Responses...</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Applying neurological scoring models</p>
          </div>
        )}

        {/* STATE: RESULT */}
        {flowState === 'result' && result && (
          <div style={{ animation: 'slideInUp 0.5s ease', paddingBottom: '2rem' }}>
            
            <div style={{ 
              background: result.riskLevel === 'low_concern' ? 'var(--green, #0a9c6d)' : 
                          result.riskLevel === 'review_recommended' ? 'var(--orange, #ef9519)' : 
                          'var(--red, #ef4148)',
              padding: '1.5rem',
              borderRadius: '20px 20px 0 0',
              textAlign: 'center',
              color: '#fff'
            }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 700, textTransform: 'capitalize' }}>
                {result.riskLevel.replace(/_/g, ' ')}
              </h2>
              <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>{result.confidenceStatement}</p>
            </div>

            <div style={{ ...glassStyle, borderRadius: '0 0 20px 20px', padding: '1.5rem', marginBottom: '1.5rem', borderTop: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Total Score</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{result.totalScore} <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)' }}>/ {result.maxScore}</span></div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                  {Math.round(result.percentage)}%
                </div>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ 
                  width: `${result.percentage}%`, height: '100%', 
                  background: result.percentage > 50 ? 'var(--red, #ef4148)' : result.percentage > 25 ? 'var(--orange, #ef9519)' : 'var(--green, #0a9c6d)' 
                }} />
              </div>

              <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 600 }}>Category Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.categoryScores.map(cs => (
                  <div key={cs.category} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '140px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      {categoryDetails[cs.category]?.label || cs.category}
                    </span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                      <div style={{ width: `${(cs.score / cs.maxScore) * 100}%`, height: '100%', background: '#fff', borderRadius: '3px' }} />
                    </div>
                    <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>
                      {cs.score}/{cs.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.contributingObservations.length > 0 && (
              <div style={{ ...glassStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 600 }}>Key Observations</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                  {result.contributingObservations.map((obs, i) => (
                    <li key={i}><strong>{obs.question}:</strong> {obs.finding}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ 
              background: 'rgba(239, 65, 72, 0.1)', border: '1px solid var(--red, #ef4148)', 
              borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertTriangle size={24} color="var(--red, #ef4148)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', color: 'var(--red, #ef4148)', fontWeight: 600 }}>DISCLAIMER</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {result.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.riskLevel !== 'low_concern' && (
                <button 
                  onClick={() => router.push(`/health-worker/referral/new?screening=${localScreeningId}`)}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '100px', background: 'var(--purple, #7357e8)', 
                    color: '#fff', fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  Create Referral <ArrowRight size={20} />
                </button>
              )}
              <button 
                onClick={() => router.push('/health-worker/screen')}
                style={{
                  width: '100%', padding: '16px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', 
                  color: '#fff', fontSize: '1.1rem', fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
                }}
              >
                Save & Return Home
              </button>
            </div>

          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(39, 124, 244, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(39, 124, 244, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(39, 124, 244, 0); } }
      `}} />
    </div>
  );
}
