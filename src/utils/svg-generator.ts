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

  const userProfileUrl = `https://velog.io/@${username}`;

  const velogLogoInline = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px" height="30px" viewBox="0 0 192 192" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <path style="opacity:0.999" fill="#21c997" d="M 16.5,-0.5 C 69.1667,-0.5 121.833,-0.5 174.5,-0.5C 182.5,2.83333 188.167,8.5 191.5,16.5C 191.5,69.1667 191.5,121.833 191.5,174.5C 188.167,182.5 182.5,188.167 174.5,191.5C 121.833,191.5 69.1667,191.5 16.5,191.5C 8.5,188.167 2.83333,182.5 -0.5,174.5C -0.5,121.833 -0.5,69.1667 -0.5,16.5C 2.83333,8.5 8.5,2.83333 16.5,-0.5 Z"/>
  </g>
  <g>
    <path style="opacity:1" fill="#fcfefd" d="M 73.5,49.5 C 76.5184,49.3354 79.5184,49.502 82.5,50C 84.5524,50.9299 86.0524,52.4299 87,54.5C 91.213,77.1573 95.3796,99.824 99.5,122.5C 110.182,110.139 118.016,96.1394 123,80.5C 123.667,76.8333 123.667,73.1667 123,69.5C 119.977,64.9771 116.144,61.3104 111.5,58.5C 117,51.0537 124.333,48.2203 133.5,50C 139.694,52.1834 142.694,56.5168 142.5,63C 141.356,74.788 137.522,85.6213 131,95.5C 120.94,110.894 110.106,125.728 98.5,140C 92.2041,141.012 85.8708,141.512 79.5,141.5C 75.9183,116.422 71.7516,91.4217 67,66.5C 61.1263,64.5698 54.9596,63.9032 48.5,64.5C 48.2317,61.8806 48.565,59.3806 49.5,57C 57.6593,54.5553 65.6593,52.0553 73.5,49.5 Z"/>
  </g>
</svg>
  `;

  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkMode ? '#1E293B' : '#EFF6FF'};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" rx="12" />
      
      <!-- Header with a link to the user's profile -->
      <a href="${userProfileUrl}" target="_blank">
        <g transform="translate(20, 15)">
          ${velogLogoInline}
        </g>
        <text x="60" y="37" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">
          ${username}
        </text>
      </a>
      
      <!-- Latest Posts -->
      <text x="20" y="75" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${accentColor}">
        Latest Posts
      </text>
  `;

  items.slice(0, 3).forEach((item, index) => {
    const yPos = 100 + index * 30;
    const title = item.title.length > 40 ? item.title.substring(0, 37) + '...' : item.title;
    const date = new Date(item.pubDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    svgContent += `
      <a href="${item.link}" target="_blank">
        <rect x="20" y="${yPos - 15}" width="${width - 40}" height="25" rx="4" fill="${cardColor}" filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.05))" />
        <text x="30" y="${yPos + 2}" font-family="Arial, sans-serif" font-size="12" fill="${textColor}">
          ${title}
        </text>
        <text x="${width - 30}" y="${yPos + 2}" font-family="Arial, sans-serif" font-size="10" fill="${secondaryColor}" text-anchor="end">
          ${date}
        </text>
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
        <text x="${xPos + tagWidth / 2}" y="221" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">
          ${tag}
        </text>
      </a>
    `;
  });

  svgContent += '</svg>';

  return svgContent;
}
