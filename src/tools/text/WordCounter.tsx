import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Clock, BookOpen, Mic, FileText, BarChart2 } from 'lucide-react';
import { copyToClipboard } from '../../utils/file';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleText = `Online tools should be fast, private, and accessible to everyone. With K27 Tools, every single computation happens directly in your browser without uploading your sensitive data to remote servers. This guarantees maximum privacy, instant responsiveness, and zero cloud hosting overhead.`;

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: '0 min',
        speakingTime: '0 min',
        topKeywords: [],
      };
    }

    const wordsArray = trimmed.match(/\b[\w'-]+\b/g) || [];
    const words = wordsArray.length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Sentences count
    const sentencesArray = text.match(/[^\.!\?]+[\.!\?]+/g) || (trimmed.length ? [trimmed] : []);
    const sentences = sentencesArray.length;

    // Paragraphs count
    const paragraphsArray = text.split(/\n+/).filter((p) => p.trim().length > 0);
    const paragraphs = paragraphsArray.length;

    // Reading time: 225 WPM
    const readingMinutes = Math.ceil(words / 225);
    const readingTime = words === 0 ? '0 sec' : words < 225 ? `${Math.ceil((words / 225) * 60)} sec` : `${readingMinutes} min`;

    // Speaking time: 130 WPM
    const speakingMinutes = Math.ceil(words / 130);
    const speakingTime = words === 0 ? '0 sec' : words < 130 ? `${Math.ceil((words / 130) * 60)} sec` : `${speakingMinutes} min`;

    // Keyword density
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'this', 'for', 'with', 'on', 'as', 'are', 'be', 'at', 'your', 'or', 'by', 'an']);
    wordsArray.forEach((w) => {
      const lower = w.toLowerCase();
      if (lower.length > 2 && !stopWords.has(lower)) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / (words || 1)) * 100).toFixed(1),
      }));

    return {
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      topKeywords,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="word-counter-component" className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Words</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.words}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Characters</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.chars}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">No Spaces</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.charsNoSpaces}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider">Sentences</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{stats.sentences}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-stone-400" />
            <span>Reading</span>
          </div>
          <div className="text-xl font-bold text-stone-900 mt-1.5">{stats.readingTime}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Mic className="w-3 h-3 text-stone-400" />
            <span>Speaking</span>
          </div>
          <div className="text-xl font-bold text-stone-900 mt-1.5">{stats.speakingTime}</div>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>Type or paste your text</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText(sampleText)}
              className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Load Sample Text
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => setText('')}
              className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="word-counter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste an essay, blog post, or article to analyze word count in real-time..."
          rows={12}
          className="w-full p-4 font-sans text-sm text-stone-800 bg-white focus:outline-none resize-y placeholder:text-stone-400 leading-relaxed"
        />
      </div>

      {/* Keyword Density Breakdown */}
      {stats.topKeywords.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
            <BarChart2 className="w-4 h-4 text-stone-700" />
            <span>Top Keyword Density (Excluding Stop Words)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {stats.topKeywords.map((kw, i) => (
              <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-900 truncate capitalize">{kw.word}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {kw.count}x ({kw.percent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
