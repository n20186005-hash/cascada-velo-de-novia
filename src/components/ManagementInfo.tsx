import { useTranslations } from 'next-intl';

export default function ManagementInfo() {
  const t = useTranslations('management');

  return (
    <section className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-xl p-6 sm:p-8 border-l-4"
          style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--accent)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <h3
            className="font-display text-xl font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h3>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}
