import { FeedItem } from '../utils/rss-parser';

export function generateSVG(username: string, items: FeedItem[], theme: string, totalLikes: number, tags: string[]): string {
  const darkMode = theme === 'dark';
  const backgroundColor = darkMode ? '#0F172A' : '#F8FAFC';
  const textColor = darkMode ? '#E2E8F0' : '#334155';
  const accentColor = '#1EC997';
  const secondaryColor = darkMode ? '#64748B' : '#94A3B8';
  const cardColor = darkMode ? '#1E293B' : '#FFFFFF';

  const width = 480;
  const height = 240;

  const velogLogoUrl = "https://images.velog.io/images/velog/profile/9aa07f66-5fcd-41f4-84f2-91d73afcec28/green%20favicon.png";
  const userProfileUrl = `https://velog.io/@${username}`;

  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkMode ? '#1E293B' : '#EFF6FF'};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" rx="12" />
      
      <!-- Header -->
       <a href="${userProfileUrl}" target="_blank">
        <image xlink:href="${velogLogoUrl}" x="20" y="15" height="30" width="30" />
        <text x="60" y="37" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${username}</text>
      </a>
      
      <!-- Latest Posts -->
      <text x="20" y="75" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${accentColor}">Latest Posts</text>
  `;

  items.slice(0, 3).forEach((item, index) => {
    const yPos = 100 + index * 30;
    const title = item.title.length > 40 ? item.title.substring(0, 37) + '...' : item.title;
    const date = new Date(item.pubDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    svgContent += `
      <a href="${item.link}" target="_blank">
        <rect x="20" y="${yPos - 15}" width="${width - 40}" height="25" rx="4" fill="${cardColor}" filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.05))" />
        <text x="30" y="${yPos + 2}" font-family="Arial, sans-serif" font-size="12" fill="${textColor}">${title}</text>
        <text x="${width - 30}" y="${yPos + 2}" font-family="Arial, sans-serif" font-size="10" fill="${secondaryColor}" text-anchor="end">${date}</text>
      </a>
    `;
  });

  svgContent += `<text x="20" y="195" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${accentColor}">Top Tags</text>`;
  
  const tagWidth = 90;
  const tagSpacing = 10;
  tags.slice(0, 5).forEach((tag, index) => {
    const xPos = 20 + index * (tagWidth + tagSpacing);
    const tagUrl = `https://velog.io/search?q=${encodeURIComponent(tag)}`;
    svgContent += `
      <a href="${tagUrl}" target="_blank">
        <rect x="${xPos}" y="205" width="${tagWidth}" height="24" rx="12" fill="${cardColor}" filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.05))" />
        <text x="${xPos + tagWidth/2}" y="221" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">${tag}</text>
      </a>
    `;
  });

  svgContent += '</svg>';


  return svgContent;
}