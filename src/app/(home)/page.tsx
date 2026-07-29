import Link from 'next/link';
import { StaffCanvas } from '@/components/staff-animation';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#eae4d3]">
      <div className="flex-1 flex items-center justify-center w-full">
        <StaffCanvas />
      </div>
      <div className="pb-12">
        <Link
          href="/docs"
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-2"
        >
          Read Notes
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
