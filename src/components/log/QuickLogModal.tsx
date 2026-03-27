import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MoodPicker } from './MoodPicker';
import { EnergySlider } from './EnergySlider';
import { TagSelector } from './TagSelector';
import { useMoodEntries } from '../../hooks/useMoodEntries';
import { formatTime } from '../../utils/dateHelpers';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function QuickLogModal({ isOpen, onClose, onSaved }: QuickLogModalProps) {
  const { addEntry } = useMoodEntries();
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function handleSave() {
    if (!mood) return;
    addEntry({ mood, energy, note: note.trim() || undefined, tags: tags.length > 0 ? tags : undefined });
    reset();
    onSaved?.();
    onClose();
  }

  function reset() {
    setMood(null);
    setEnergy(5);
    setNote('');
    setTags([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log Check-in">
      <div className="space-y-5">
        <div className="text-center text-sm text-gray-400">
          {formatTime(Date.now())}
        </div>

        <section>
          <h3 className="text-sm font-medium text-gray-300 mb-3">How's your mood?</h3>
          <MoodPicker value={mood} onSelect={setMood} />
        </section>

        <section>
          <EnergySlider value={energy} onChange={setEnergy} />
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Tags</h3>
          <TagSelector selected={tags} onChange={setTags} />
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Note (optional)</h3>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
          />
        </section>

        <Button
          onClick={handleSave}
          disabled={!mood}
          className="w-full"
          size="lg"
        >
          Save Check-in
        </Button>
      </div>
    </Modal>
  );
}
