export const GAME_ROLES = ['Time', 'Point'] as const;

export type GameRole = (typeof GAME_ROLES)[number];

export interface Game {
  readonly code: string;
  readonly label: string;
  readonly role: GameRole;
}

export function toGame(code: string, data: Record<string, unknown>): Game | null {
  const { label, role } = data;
  return typeof label === 'string' && label &&
    GAME_ROLES.includes(role as GameRole)
    ? { code, label, role: role as GameRole }
    : null;
}
