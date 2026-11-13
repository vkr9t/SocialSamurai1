import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PlatformType } from '../../types';
import { Btn, Card, Field, PageHeader, PlatformBadge, cx, inputCls } from '../ui';

const ideasFor = (platform: PlatformType, idea: string, brand: string) => {
  const i = idea.trim().replace(/[.?!]+$/, '');
  if (platform === 'x')
    return [
      `${i.charAt(0).toUpperCase()}${i.slice(1)}. Here’s what we learned building ${brand}:`,
      `Unpopular opinion: ${i.charAt(0).toLowerCase()}${i.slice(1)}. Most teams find out too late.`,
      `How are you handling this? ${i.charAt(0).toUpperCase()}${i.slice(1)}. Curious what’s working for you.`,
    ];
  return [
    `What we learned about ${i.toLowerCase()} (and what we’d do differently)\n\nWe’ve been building ${brand} and kept running into this. A few things that actually helped:\n\n1. \n2. \n3. \n\nWhat’s worked for you?`,
    `Question for the community: ${i.charAt(0).toLowerCase()}${i.slice(1)}?\n\nContext: we’re a small team building ${brand}. Would love to hear how others approach it.`,
  ];
};

const defaultWhen = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
};

export const Create: React.FC = () => {
  const { profile, schedulePost, setCurrentView } = useApp();
  const [platform, setPlatform] = useState<PlatformType>('x');
  const [idea, setIdea] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [when, setWhen] = useState(defaultWhen());
  const limit = platform === 'x' ? 280 : 40000;
  const over = text.length > limit;

  const generate = () => {
    const o = ideasFor(platform, idea, profile.brand);
    setOptions(o);
    setText(o[0]);
  };

  const submit = (status: 'scheduled' | 'draft') => {
    schedulePost({ platform, content: text.trim(), when: new Date(when).toISOString(), status });
    setText('');
    setIdea('');
    setOptions([]);
  };

  return (
    <div>
      <PageHeader title="Create post" lead="Turn an idea into a post for X or Reddit, in your brand voice. You can edit everything before it’s scheduled." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-medium text-steel/85">Platform</p>
            <div role="radiogroup" aria-label="Platform" className="inline-flex rounded-full p-1 ring-1 ring-white/12">
              {(['x', 'reddit'] as PlatformType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={platform === p}
                  onClick={() => {
                    setPlatform(p);
                    setOptions([]);
                  }}
                  className={cx('flex h-8 items-center gap-2 rounded-full px-4 text-[13px]', platform === p ? 'bg-white text-black' : 'text-steel/75 hover:text-paper')}
                >
                  {p === 'x' ? 'X' : 'Reddit'}
                </button>
              ))}
            </div>
          </div>
          <Field label="What do you want to say?" htmlFor="idea" hint={`Written in your voice: ${profile.voice.toLowerCase()}.`}>
            <textarea
              id="idea"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Replying beats broadcasting for early-stage founders"
              className={cx(inputCls, 'resize-y')}
            />
          </Field>
          <Btn variant="accent" disabled={idea.trim().length < 6} onClick={generate}>
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Draft it for me
          </Btn>
          {options.length > 0 && (
            <div>
              <p className="mb-2 text-[13px] font-medium text-steel/85">Options</p>
              <ul className="space-y-2">
                {options.map((o, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setText(o)}
                      className={cx(
                        'w-full whitespace-pre-line rounded-xl p-3 text-left text-[13.5px] leading-relaxed ring-1 transition-colors line-clamp-3',
                        text === o ? 'bg-samurai/10 text-paper ring-samurai/50' : 'text-steel/80 ring-white/10 hover:ring-white/25'
                      )}
                    >
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <PlatformBadge platform={platform} withLabel />
            <span className={cx('text-[12.5px] tabular-nums', over ? 'text-paper' : 'text-steel/55')}>
              {text.length}
              {platform === 'x' && ` / ${limit}`}
            </span>
          </div>
          <Field label="Post" htmlFor="post-text">
            <textarea id="post-text" rows={9} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write here, or draft it from an idea." className={cx(inputCls, 'resize-y leading-relaxed')} />
          </Field>
          {over && <p className="text-[13px] text-paper">Over X’s 280-character limit. Trim it before scheduling.</p>}
          <Field label="Publish time" htmlFor="when" hint="Scheduling is simulated in the preview.">
            <input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={cx(inputCls, '[color-scheme:dark]')} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Btn variant="primary" disabled={!text.trim() || over || !when} onClick={() => submit('scheduled')}>
              Schedule
            </Btn>
            <Btn variant="secondary" disabled={!text.trim()} onClick={() => submit('draft')}>
              Save as draft
            </Btn>
            <Btn variant="ghost" onClick={() => setCurrentView('calendar')}>
              View calendar
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};
