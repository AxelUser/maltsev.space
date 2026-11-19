export interface PostPreview {
	title: string;
	date: string;
	preview: string;
	slug: string;
	number: string;
	series: string;
	tags: string[];
	draft: boolean;
	placeholder?: string;
}

export interface ArticleAnalytics {
	slug: string;
	views: number;
}

/** A row of the all-notes index beside a post. */
export interface PostIndexEntry {
	slug: string;
	number: string;
	title: string;
	year: string;
}
