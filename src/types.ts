export type TopWord = {
  word: string;
  count: number;
  percentage: number;
};

export type TextStats = {
  words: number;
  uniqueWords: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingMinutes: number;
  averageWordsPerSentence: number;
  averageCharactersPerWord: number;
  lexicalDensity: number;
  topWords: TopWord[];
};
