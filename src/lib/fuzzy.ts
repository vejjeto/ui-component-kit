export interface FuzzyMatchResult {
  match: boolean;
  score: number;
  indices: number[];
}

/** Score a subsequence query against a target string with contiguous, prefix, and word-boundary bonuses. */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { match: true, score: 0, indices: [] };
  }

  const lowerTarget = target.toLowerCase();
  const indices: number[] = [];
  let qIdx = 0;
  let score = 0;
  let consecutive = 0;

  for (
    let tIdx = 0;
    tIdx < lowerTarget.length && qIdx < cleanQuery.length;
    tIdx++
  ) {
    if (lowerTarget[tIdx] === cleanQuery[qIdx]) {
      indices.push(tIdx);
      const isStart = tIdx === 0;
      const prevChar = tIdx > 0 ? lowerTarget[tIdx - 1] : "";
      const isBoundary =
        isStart || prevChar === " " || prevChar === "-" || prevChar === "_";

      consecutive += 1;
      score += 10 + consecutive * 6 + (isBoundary ? 12 : 0) + (isStart ? 8 : 0);
      qIdx += 1;
    } else {
      consecutive = 0;
      score -= 1;
    }
  }

  if (qIdx < cleanQuery.length) {
    return { match: false, score: Number.NEGATIVE_INFINITY, indices: [] };
  }

  // Prefer shorter targets when match quality is tied
  score -= Math.max(0, target.length - cleanQuery.length) * 0.25;
  return { match: true, score, indices };
}

export interface FuzzyScoredItem<T> {
  item: T;
  score: number;
  indices: number[];
}

/** Filter and rank items by descending fuzzy score using one or more extracted text fields. */
export function fuzzyFilter<T>(
  items: readonly T[],
  query: string,
  getText: (item: T) => string,
): FuzzyScoredItem<T>[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return items.map((item) => ({ item, score: 0, indices: [] }));
  }

  const matched: FuzzyScoredItem<T>[] = [];
  for (const item of items) {
    const result = fuzzyMatch(cleanQuery, getText(item));
    if (result.match) {
      matched.push({ item, score: result.score, indices: result.indices });
    }
  }

  matched.sort((a, b) => b.score - a.score);
  return matched;
}
