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

describe('determinePackages', () => {});
