'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import type { InteractiveConfig } from '@/data/interactives';
import type { LessonBlock } from '@/lib/lesson-parser';
import type { WorldGuide } from '@/data/world-themes';
import LessonScene from './LessonScene';
import QuizTap from '../games/QuizTap';
import DragMatch from '../games/DragMatch';
import Reorder from '../games/Reorder';
import MemoryPairs from '../games/MemoryPairs';
import FillBlank from '../games/FillBlank';
import HotspotScene from '../games/HotspotScene';
import CodeSandbox from '../playgrounds/CodeSandbox';
import PromptLab from '../playgrounds/PromptLab';
import ChainSim from '../playgrounds/ChainSim';
import ColorMixer from '../playgrounds/ColorMixer';
import PasswordMeter from '../playgrounds/PasswordMeter';

function Engine({ config }: { config: InteractiveConfig }) {
  switch (config.kind) {
    case 'quiz-tap': return <QuizTap config={config} />;
    case 'drag-match': return <DragMatch config={config} />;
    case 'reorder': return <Reorder config={config} />;
    case 'memory-pairs': return <MemoryPairs config={config} />;
    case 'fill-blank': return <FillBlank config={config} />;
    case 'hotspot': return <HotspotScene config={config} />;
    case 'code-sandbox': return <CodeSandbox config={config} />;
    case 'prompt-lab': return <PromptLab config={config} />;
    case 'chain-sim': return <ChainSim config={config} />;
    case 'color-mixer': return <ColorMixer config={config} />;
    case 'password-meter': return <PasswordMeter config={config} />;
  }
}

/** Hôte d'interactif : monte le moteur correspondant, puis propose de lire
 *  la leçon en dessous (l'interactif est le plat principal, la leçon l'accompagnement).
 *  NB : « Lire la leçon » ne doit jamais matcher /^(Suivant|Aller au quiz)$/ (e2e). */
export default function InteractiveHost({
  config,
  blocks,
  guide,
}: {
  config: InteractiveConfig;
  blocks: LessonBlock[];
  guide: WorldGuide;
}) {
  const [showLesson, setShowLesson] = useState(false);

  return (
    <div>
      <Engine config={config} />
      {blocks.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowLesson((visible) => !visible)}
            aria-expanded={showLesson}
            className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {showLesson ? 'Masquer la leçon' : 'Lire la leçon'}
          </button>
          {showLesson && (
            <div className="mt-4">
              <LessonScene blocks={blocks} guide={guide} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
