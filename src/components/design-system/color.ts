export const colors = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  white: '#ffffff',
  black: '#000000',
};

export function getColor(name: string): string {
  return colors[name as keyof typeof colors] || colors.white;
}
