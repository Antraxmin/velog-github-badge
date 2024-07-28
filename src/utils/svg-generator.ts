import { FeedItem } from './rss-parser';

export function generateSVG(items: FeedItem[], theme: string): string {
  const width = 400;
  const height = 200;
  const backgroundColor = theme === 'dark' ? '#333' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#333';

  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      <text x="10" y="30" fill="${textColor}" font-size="16" font-weight="bold">Latest Velog Posts</text>
  `;

  items.forEach((item, index) => {
    svg += `
      <text x="10" y="${60 + index * 30}" fill="${textColor}" font-size="14">${truncate(item.title, 40)}</text>
    `;
  });

  svg += '</svg>';
  return svg;
}

function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}