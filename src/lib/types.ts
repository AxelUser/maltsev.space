export interface PostPreview {
	title: string;
	date: string;
	preview: string;
	slug: string;
	series: string;
	tags: string[];
	draft: boolean;
	placeholder?: string;
}

export interface ArticleAnalytics {
	slug: string;
	views: number;
}
