import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, MapPin, Clock, Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

type RunState = 'idle' | 'running' | 'paused';

export default function RunningPage() {
  const [runState, setRunState] = useState<RunState>('idle');
  const [elapsed, setElapsed] = useState(0);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Mock rankings
  const rankings = [
    { rank: 1, name: '김병장', distance: '12.4km', unit: '1사단' },
    { rank: 2, name: '이상병', distance: '10.2km', unit: '3사단' },
    { rank: 3, name: '박일병', distance: '8.7km', unit: '7사단' },
    { rank: 4, name: '용사', distance: '0.0km', unit: '-' },
  ];

  return (
    <AppLayout>
      <div className="space-y-4 p-4">
        <h2 className="title-korean text-lg text-foreground">🏃 뜀걸음 측정</h2>

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="led-panel p-6 text-center"
        >
          <p className="text-xs text-muted-foreground mb-2">경과 시간</p>
          <div className="font-mono text-5xl led-text text-primary tracking-widest">
            {formatTime(elapsed)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <MapPin size={16} className="mx-auto text-accent" />
              <p className="font-mono text-sm text-foreground mt-1">0.0</p>
              <p className="text-[10px] text-muted-foreground">km</p>
            </div>
            <div>
              <Clock size={16} className="mx-auto text-accent" />
              <p className="font-mono text-sm text-foreground mt-1">0'00"</p>
              <p className="text-[10px] text-muted-foreground">페이스</p>
            </div>
            <div>
              <Zap size={16} className="mx-auto text-accent" />
              <p className="font-mono text-sm text-foreground mt-1">0</p>
              <p className="text-[10px] text-muted-foreground">kcal</p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-center gap-4">
            {runState === 'idle' && (
              <Button
                onClick={() => setRunState('running')}
                className="h-14 w-14 rounded-full bg-primary text-primary-foreground"
              >
                <Play size={24} />
              </Button>
            )}
            {runState === 'running' && (
              <>
                <Button
                  onClick={() => setRunState('paused')}
                  variant="outline"
                  className="h-14 w-14 rounded-full"
                >
                  <Pause size={24} />
                </Button>
                <Button
                  onClick={() => { setRunState('idle'); setElapsed(0); }}
                  variant="outline"
                  className="h-14 w-14 rounded-full border-destructive text-destructive"
                >
                  <Square size={24} />
                </Button>
              </>
            )}
            {runState === 'paused' && (
              <>
                <Button
                  onClick={() => setRunState('running')}
                  className="h-14 w-14 rounded-full bg-primary text-primary-foreground"
                >
                  <Play size={24} />
                </Button>
                <Button
                  onClick={() => { setRunState('idle'); setElapsed(0); }}
                  variant="outline"
                  className="h-14 w-14 rounded-full border-destructive text-destructive"
                >
                  <Square size={24} />
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Rankings */}
        <div className="led-panel">
          <div className="bg-muted/50 px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">🏆 주간 랭킹</span>
          </div>
          <div className="divide-y divide-border">
            {rankings.map((r) => (
              <div key={r.rank} className="flex items-center gap-3 px-4 py-3">
                <span className={`font-mono text-lg font-bold ${r.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {r.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.unit}</p>
                </div>
                <span className="font-mono text-sm text-foreground">{r.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
