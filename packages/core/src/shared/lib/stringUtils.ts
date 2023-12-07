export function capitalize(s: string | undefined): string {
  if (s == null) return "";
  return (s.at(0)?.toUpperCase() ?? "") + s.slice(1);
}
