export interface Settings {
  theme?: string;
  language?: string;
}

export async function loadSettings(): Promise<Settings> { return {}; }
export async function saveSettings(settings: Settings): Promise<void> {}
