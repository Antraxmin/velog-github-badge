import { generateSVG } from '../svg-generator';
import { FeedItem } from '../rss-parser';

describe('SVG Generator', () => {
  const mockItems: FeedItem[] = [
    { title: 'Test Post 1', link: 'https://velog.io/test1', pubDate: '2023-01-01' },
    { title: 'Test Post 2', link: 'https://velog.io/test2', pubDate: '2023-01-02' },
  ];

  it('generates SVG with correct dimensions', () => {
    const svg = generateSVG(mockItems, 'light');
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="200"');
  });

  it('applies light theme correctly', () => {
    const svg = generateSVG(mockItems, 'light');
    expect(svg).toContain('fill="#fff"');
    expect(svg).toContain('fill="#333"');
  });

  it('applies dark theme correctly', () => {
    const svg = generateSVG(mockItems, 'dark');
    expect(svg).toContain('fill="#333"');
    expect(svg).toContain('fill="#fff"');
  });

  it('includes all feed items', () => {
    const svg = generateSVG(mockItems, 'light');
    mockItems.forEach(item => {
      expect(svg).toContain(item.title);
    });
  });

  it('truncates long titles', () => {
    const longTitleItem: FeedItem = {
      title: 'This is a very long title that should be truncated in the SVG output',
      link: 'https://velog.io/longpost',
      pubDate: '2023-01-03'
    };
    const svg = generateSVG([longTitleItem], 'light');
    expect(svg).toContain('This is a very long title that should...');
  });
});