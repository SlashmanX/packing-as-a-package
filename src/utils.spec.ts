import { cleanNumbericInput } from './utils';

describe('cleanNumbericInput', () => {
	it('should allow for decimal points in input', () => {
		const input = '€12.34';
		const expectedOutput = '12.34';
		const actualOutput = cleanNumbericInput(input);
		expect(actualOutput).toEqual(expectedOutput);
	});
	it('should remove all non-numeric characters from the input string', () => {
		const input = '1a2b3c4d5e6f7g8h9i0j';
		const expectedOutput = '1234567890';
		const actualOutput = cleanNumbericInput(input);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it('should return an empty string if the input is empty', () => {
		const input = '';
		const expectedOutput = '';
		const actualOutput = cleanNumbericInput(input);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it('should return an empty string if the input contains no numeric characters', () => {
		const input = 'abcdefg';
		const expectedOutput = '';
		const actualOutput = cleanNumbericInput(input);
		expect(actualOutput).toEqual(expectedOutput);
	});
});

import { determinePackages } from './utils';
import { PackingItem, Package } from './types';

describe('determinePackages', () => {
	const items: PackingItem[] = [
		{ index: 1, weight: 53.38, price: 45 },
		{ index: 2, weight: 88.62, price: 98 },
		{ index: 3, weight: 78.48, price: 3 },
		{ index: 4, weight: 72.3, price: 76 },
		{ index: 5, weight: 30.18, price: 9 },
		{ index: 6, weight: 46.34, price: 48 },
	];
	const capacity = 81;

	it('should return the correct package object', () => {
		const expectedOutput: Package = {
			items: [items[3]],
			value: 76,
		};
		const actualOutput = determinePackages(items, capacity);
		expect(actualOutput).toEqual(expectedOutput);
	});
});
