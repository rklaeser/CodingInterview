export interface Problem {
	id: string;
	title: string;
	description: string;
	categories: string[];
	subcategory?: string;
	implementation?: Implementation;
}

export interface Implementation {
	complexity: string;
	notes: string;
	code: string;
	pythonicCode?: string;
	pythonicNotes?: string;
}
