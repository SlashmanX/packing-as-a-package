import { Packer } from './index';

describe('Packer', () => {
	describe('pack', () => {
		it('should return the correct solution for a valid input file', async () => {
			const packer = new Packer();
			const solution = await packer.pack('./resources/example_input');
			expect(solution).toEqual('4\n-\n2,7\n8,9');
		});

		it('should throw a PackingError for an invalid input file', async () => {
			const packer = new Packer();
			await expect(
				packer.pack('./test/invalid_input.txt'),
			).rejects.toThrow(`Unable to load file: ./test/invalid_input.txt`);
		});
	});

	describe('_loadFile', () => {
		it('should return the contents of a valid input file', async () => {
			const packer = new Packer();
			const contents = await packer._loadFile(
				'./resources/example_input',
			);
			expect(contents).toEqual(
				'81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3) (4,72.30,€76) (5,30.18,€9) (6,46.34,€48)\n8 : (1,15.3,€34)\n75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52) (6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78)\n56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36) (6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)',
			);
		});

		it('should throw an error for an invalid file path', async () => {
			const packer = new Packer();
			await expect(
				packer._loadFile('./test/nonexistent_file.txt'),
			).rejects.toThrow();
		});
	});

	xdescribe('_parseInput', () => {
		it('should return the correct array of packages with weight and items', () => {
			const packer = new Packer();
			packer.rawInput =
				'81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3)\n8 : (1,15.3,€34)\n75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52) (6,76.25,€75) (7,60.02,€74) (8,93.18,€35)\n56 : (1,90.72,€13) (2,33.8,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36) (6,48.77,€79) (7,81.8,€45) (8,19.36,€79)\n';
			const expectedOutput = [
				[
					81,
					[
						{ index: 1, weight: 53.38, price: 45 },
						{ index: 2, weight: 88.62, price: 98 },
						{ index: 3, weight: 78.48, price: 3 },
					],
				],
				[8, [{ index: 1, weight: 15.3, price: 34 }]],
				[
					75,
					[
						{ index: 1, weight: 85.31, price: 29 },
						{ index: 2, weight: 14.55, price: 74 },
						{ index: 3, weight: 3.98, price: 16 },
						{ index: 4, weight: 26.24, price: 55 },
						{ index: 5, weight: 63.69, price: 52 },
						{ index: 6, weight: 76.25, price: 75 },
						{ index: 7, weight: 60.02, price: 74 },
						{ index: 8, weight: 93.18, price: 35 },
					],
				],
				[
					56,
					[
						{ index: 1, weight: 90.72, price: 13 },
						{ index: 2, weight: 33.8, price: 40 },
						{ index: 3, weight: 43.15, price: 10 },
						{ index: 4, weight: 37.97, price: 16 },
						{ index: 5, weight: 46.81, price: 36 },
						{ index: 6, weight: 48.77, price: 79 },
						{ index: 7, weight: 81.8, price: 45 },
						{ index: 8, weight: 19.36, price: 79 },
					],
				],
			];
			expect(packer._parseInput()).toEqual(expectedOutput);
		});
	});

	describe('_parseItem', () => {
		it('should return the correct PackingItem object for a valid input string', () => {
			const packer = new Packer();
			const item = '(1,53.38,€45)';
			const expectedOutput = { index: 1, weight: 53.38, price: 45 };
			expect(packer._parseItem(item)).toEqual(expectedOutput);
		});

		it('should throw error if weight of item is over 100', () => {
			const packer = new Packer();
			const item = '(1,153.38,€45)';
			expect(() => {
				packer._parseItem(item);
			}).toThrow(`Item weight exceeds maximum`);
		});

		it('should throw error if price of item is over 100', () => {
			const packer = new Packer();
			const item = '(1,53.38,€145)';
			expect(() => {
				packer._parseItem(item);
			}).toThrow(`Item price exceeds maximum`);
		});
	});

	describe('_printOutput', () => {
		it('should return the correct string containing indexes of items in each package', () => {
			const packer = new Packer();
			packer.packages = [
				{
					value: 81,
					items: [{ index: 2, weight: 88.62, price: 98 }],
				},
				{ value: 0, items: [] },
				{
					value: 75,
					items: [
						{ index: 1, weight: 85.31, price: 29 },
						{ index: 3, weight: 3.98, price: 16 },
						{ index: 5, weight: 63.69, price: 52 },
					],
				},
				{
					value: 56,
					items: [
						{ index: 1, weight: 90.72, price: 13 },
						{ index: 3, weight: 43.15, price: 10 },
						{ index: 6, weight: 48.77, price: 79 },
					],
				},
			];
			const expectedOutput = '2\n-\n1,3,5\n1,3,6';
			expect(packer._printOutput()).toEqual(expectedOutput);
		});
	});
});
