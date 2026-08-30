import type { HabitData } from '../state/useHabitStore';
import { dateKey } from './date';

const FORMAT = 'turtle-habit-tracker';
const VERSION = 1;

interface BackupFile {
  format: string;
  version: number;
  exportedAt: string;
  data: HabitData;
}

const filename = () => `turtle-${dateKey(new Date())}.json`;

/**
 * Hands the backup to the system. iOS has no real download in a home-screen
 * app, but it does have the share sheet — which is the better target anyway,
 * since it can put the file straight into Files, Mail or another device.
 */
export async function exportBackup(data: HabitData): Promise<'shared' | 'downloaded'> {
  const payload: BackupFile = {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  const json = JSON.stringify(payload, null, 2);
  const file = new File([json], filename(), { type: 'application/json' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'turtle — Sicherung' });
      return 'shared';
    } catch (error) {
      // A cancelled share sheet is a normal outcome, not a failure to report.
      if (error instanceof DOMException && error.name === 'AbortError') return 'shared';
    }
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename();
  link.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}

/** Reads a backup file back, rejecting anything that is not one of ours. */
export async function readBackup(file: File): Promise<HabitData> {
  const parsed: unknown = JSON.parse(await file.text());
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as BackupFile).format !== FORMAT
  ) {
    throw new Error('Das ist keine turtle-Sicherung.');
  }
  const { data } = parsed as BackupFile;
  if (typeof data !== 'object' || data === null || typeof data.marks !== 'object') {
    throw new Error('Die Sicherung ist unvollständig.');
  }
  return data;
}

/** How much history the backup holds — shown so the user can sanity-check it. */
export function countRecordedDays(data: HabitData): number {
  return Object.values(data.marks).filter(day => Object.keys(day ?? {}).length > 0)
    .length;
}
