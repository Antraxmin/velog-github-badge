export interface Feed {
    items: FeedItem[];
}

export interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    likes: number;
}