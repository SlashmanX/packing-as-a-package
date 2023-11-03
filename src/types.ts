export interface PackingItem {
	index: number;
	weight: number;
	price: number;
}

export interface Package {
	value: number;
	items: PackingItem[];
}
