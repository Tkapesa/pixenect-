const SOCIAL_LINKS = [
  { label: 'linkedin', href: '#' },
  { label: 'instagram', href: '#' },
  { label: 'facebook', href: '#' },
  { label: 'tiktok', href: '#' },
];

function FollowUs() {
  return (
    <div className="border-t-[0.5px] border-[rgba(240,240,248,0.1)]">
      <section
        aria-label="Follow us"
        className="mx-auto flex max-w-[1400px] flex-col gap-5 bg-transparent px-6 py-12 font-mono text-[#f0f0f8]"
      >
        <span className="text-[11px] uppercase tracking-[0.12em] text-[rgba(240,240,248,0.48)]">Follow us</span>
        <ul className="flex list-none flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[13px] text-[rgba(240,240,248,0.55)] transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-[rgba(240,240,248,0.92)] focus-visible:text-[#f0f0f8] focus-visible:outline-none"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default FollowUs;
