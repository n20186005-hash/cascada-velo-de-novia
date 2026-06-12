'use client';

import { useTranslations } from 'next-intl';

export default function PipilaStory() {
  const t = useTranslations('pipilaStory');
  const sections = t.raw('sections') as Array<{
    id: string;
    title: string;
    content: string;
  }>;

  return (
    <section id="pipila-story" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p
          className="text-center mb-8 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-12 mx-auto" style={{ background: 'var(--accent)' }} />

        <div className="grid gap-8 md:gap-10">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-xl p-6 md:p-8 shadow-sm"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'var(--accent)' }}
                >
                  {index + 1}
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.title}
                </h3>
              </div>
              <p
                className="leading-relaxed ml-13"
                style={{ color: 'var(--text-secondary)' }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
