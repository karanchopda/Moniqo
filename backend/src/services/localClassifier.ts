import { TRAINING_DATA } from './knowledgeBase';

export class LocalClassifier {
  private categoryCounts: { [key: string]: number } = {};
  private wordCounts: { [key: string]: { [word: string]: number } } = {};
  private vocabulary: Set<string> = new Set();
  private totalDocuments = 0;

  constructor() {
    this.train(TRAINING_DATA);
  }

  /**
   * Cleans and tokenizes a transaction description
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ') // Strip numbers and hashes
      .split(/\s+/)
      .filter(word => word.length > 2); // Ignore very short filler words
  }

  /**
   * Trains the model on a dataset
   */
  private train(data: { text: string; label: string }[]) {
    data.forEach(({ text, label }) => {
      const tokens = this.tokenize(text);
      this.totalDocuments++;
      this.categoryCounts[label] = (this.categoryCounts[label] || 0) + 1;

      if (!this.wordCounts[label]) this.wordCounts[label] = {};

      tokens.forEach(token => {
        this.vocabulary.add(token);
        this.wordCounts[label][token] = (this.wordCounts[label][token] || 0) + 1;
      });
    });
  }

  /**
   * Predicts the category for a given text
   */
  public predict(text: string): { label: string; confidence: number } {
    const tokens = this.tokenize(text);
    const scores: { [label: string]: number } = {};
    const categories = Object.keys(this.categoryCounts);

    categories.forEach(label => {
      // Start with log of prior probability: P(Label)
      let logProb = Math.log(this.categoryCounts[label] / this.totalDocuments);

      // Add log of likelihoods: P(Word|Label) with Laplace smoothing
      const totalWordsInLabel = Object.values(this.wordCounts[label]).reduce((a, b) => a + b, 0);
      
      tokens.forEach(token => {
        if (this.vocabulary.has(token)) {
          const count = this.wordCounts[label][token] || 0;
          logProb += Math.log((count + 1) / (totalWordsInLabel + this.vocabulary.size));
        }
      });

      scores[label] = logProb;
    });

    // Find label with highest log probability
    const bestLabel = categories.reduce((a, b) => (scores[a] > scores[b] ? a : b));
    
    // Convert log probability back to a heuristic confidence (0-1)
    // Note: This is an approximation for ranking
    const confidence = Math.exp(scores[bestLabel]) / categories.reduce((sum, l) => sum + Math.exp(scores[l]), 0);

    return { label: bestLabel, confidence: isNaN(confidence) ? 0.9 : confidence };
  }
}

export const moniqoBrain = new LocalClassifier();
