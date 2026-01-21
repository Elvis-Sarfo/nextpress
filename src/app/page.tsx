import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CMS Platform</h1>
        <p className="text-muted-foreground mb-8">
          A modern, headless content management system
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/en"
            className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            View Website
          </Link>
        </div>
      </div>
    </main>
  );
}
