import { Package, PackingItem } from './types';

/**
 *
 * @param {String} input string containing numbers which needs to be cleaned
 * @returns {String} string containing only numbers and decimal which can be passed into `parseInt` or `parseFloat`
 */
export const cleanNumbericInput = (input: string): string => {
	return input.replace(/[^0-9.,]/g, '');
};

/**
 *
 * @param {PackingItem[]} items array of items that can go into package
 * @param {number} capacity max capacity of package
 * @returns {Package} package object with value of package and items included
 */
export const determinePackages = (
	items: PackingItem[],
	capacity: number,
): Package => {
	const n = items.length;
	// This ensures price takes precedence over weight (when the weight is the same)
	items = items.sort((a, b) => a.weight - b.weight);
	const matrix: number[][] = new Array(n + 1)
		.fill(0)
		.map(() => new Array(capacity + 1).fill(0));
	const maxValues: number[][] = new Array(n + 1)
		.fill(0)
		.map(() => new Array(capacity + 1).fill(0));

	const selectedItems: PackingItem[] = [];

	// Convert the weights and capacity to integers
	const scaleFactor = 100;
	const scaledItems = items.map(({ index, weight, price }) => {
		return { index, weight: Math.round(weight * scaleFactor), price };
	});
	const integerCapacity = Math.round(capacity * scaleFactor);

	for (let i = 0; i <= n; i++) {
		for (let w = 0; w <= integerCapacity; w++) {
			if (i === 0 || w === 0) {
				matrix[i][w] = 0;
			} else if (scaledItems[i - 1].weight <= w) {
				const includeItemValue =
					matrix[i - 1][w - scaledItems[i - 1].weight] +
					scaledItems[i - 1].price;
				if (includeItemValue > matrix[i - 1][w]) {
					matrix[i][w] = includeItemValue;
					maxValues[i][w] = includeItemValue;
				} else {
					matrix[i][w] = matrix[i - 1][w];
					maxValues[i][w] = matrix[i - 1][w];
				}
			} else {
				matrix[i][w] = matrix[i - 1][w];
				maxValues[i][w] = matrix[i - 1][w];
			}
		}
	}

	let i = n;
	let w = integerCapacity;
	while (i > 0 && w > 0) {
		if (maxValues[i][w] !== matrix[i - 1][w]) {
			selectedItems.push(items[i - 1]);
			w -= scaledItems[i - 1].weight;
			i--;
		} else {
			i--;
		}
	}
	selectedItems.sort((a, b) => a.index - b.index);

	return { value: matrix[n][integerCapacity], items: selectedItems };
};
