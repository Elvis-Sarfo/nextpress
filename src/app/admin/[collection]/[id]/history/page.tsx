'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Version {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  data: Record<string, unknown>;
}

export default function VersionHistoryPage() {
  const params = useParams<{ collection: string; id: string }>();
  const router = useRouter();
  const { collection, id } = params;

  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/admin/collections/${collection}/${id}/versions`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setVersions(data.versions ?? []);
      })
      .catch(() => setError('Failed to load version history'))
      .finally(() => setIsLoading(false));
  }, [collection, id]);

  const handleRestore = async (version: Version) => {
    if (!confirm(`Restore version ${version.version}? Current content will be overwritten.`)) return;
    setRestoringId(version.id);
    try {
      const res = await fetch(`/api/admin/collections/${collection}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(version.data),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error ?? 'Restore failed');
        return;
      }
      setRestoreSuccess(version.version);
      setTimeout(() => {
        router.push(`/admin/${collection}/${id}`);
      }, 1200);
    } catch {
      alert('Network error');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/${collection}/${id}`}>
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Version History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Restore a previous version of this document
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : versions.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          <Clock className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p className="font-medium">No version history yet</p>
          <p className="text-sm mt-1">Versions are saved automatically when you update this document.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Version</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Saved</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">By</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {versions.map((v, i) => (
                <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium">
                    v{v.version}
                    {i === 0 && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-sans text-primary">
                        latest
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {v.createdBy || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {restoreSuccess === v.version ? (
                      <span className="text-green-600 text-xs font-medium">Restored ✓</span>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={restoringId !== null || i === 0}
                        onClick={() => handleRestore(v)}
                      >
                        {restoringId === v.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="mr-1.5 h-3 w-3" />
                        )}
                        {i === 0 ? 'Current' : 'Restore'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
