import { AlertTriangle } from 'lucide-react';

interface FallbackSectionProps {
  type: string;
}

export default function FallbackSection({ type }: FallbackSectionProps) {
  return (
    <div className="flex items-center justify-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 my-4">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <p className="text-amber-500">
        Unknown section type: <code className="font-mono bg-amber-500/20 px-2 py-0.5 rounded">{type}</code>
      </p>
    </div>
  );
}
