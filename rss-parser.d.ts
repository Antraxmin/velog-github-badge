declare module 'rss-parser' {
    class Parser {
      constructor(options?: any);
      parseURL(url: string): Promise<any>;
    }
    export = Parser;
  }