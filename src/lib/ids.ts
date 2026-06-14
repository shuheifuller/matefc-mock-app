let counter = 1000;

/** Deterministic-enough incremental ids for mock mutations (no Math.random). */
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter}`;
}
