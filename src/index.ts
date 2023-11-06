import { promises as fsp } from 'fs';
import { PackingError } from './PackingError';
import { Package, PackingItem } from './types';
import { determinePackages } from './utils';

export class Packer {
	rawInput: string;
	static MAX_WEIGHT = 100;
	static MAX_WEIGHT_PER_ITEM = 100;
	static MAX_COST_PER_ITEM = 100;
	packages: Package[] = [];
	/**
	 *
	 * @param {String} filePath relative or absolute file path
	 * @throws {PackingError} if unable to pack
	 * @returns {Promise<String>} solution
	 */
	async pack(filePath: string): Promise<string> {
		this.rawInput = await this._loadFile(filePath);
		const packages = this._parseInput();
		packages.forEach((pack) => {
			const [weight, items] = pack;
			this.packages.push(
				determinePackages(items as PackingItem[], weight as number),
			);
		});
		return this._formatOutput();
	}

	/**
	 *
	 * @param {String} filePath relative or absolute file path
	 * @returns {Promise<String>} file contents
	 */
	async _loadFile(filePath: string): Promise<string> {
		try {
			const contents = await fsp.readFile(filePath, {
				encoding: 'utf-8',
			});
			return contents;
		} catch (e) {
			throw new PackingError(`Unable to load file: ${filePath}`);
		}
	}

	/**
	 *
	 * @returns {Array<Array<Number|Array<PackingItem>>>} array of packages with weight and items
	 */

	_parseInput(): (number | PackingItem[])[][] {
		const input = this.rawInput;
		const inputVals: (number | PackingItem[])[][] = [];
		const lines = input.split('\n');
		lines.forEach((line) => {
			const [weight, items] = line.split(' : ');
			inputVals.push([
				parseInt(weight, 10),
				items.split(' ').map(this._parseItem),
			]);
		});
		return inputVals;
	}

	/**
	 *
	 * @param item raw string input from file
	 * @returns {PackingItem} object with index, weight, and price
	 */

	_parseItem(item: string): PackingItem {
		const [index, weight, price] = item
			.split(',')
			.map((val) => val.replace(/[^0-9.,]/g, ''));
		const parsedItem = {
			index: parseInt(index, 10),
			weight: parseFloat(weight),
			price: parseFloat(price),
		};

		if (parsedItem.weight > Packer.MAX_WEIGHT_PER_ITEM) {
			throw new PackingError('Item weight exceeds maximum');
		}
		if (parsedItem.price > Packer.MAX_COST_PER_ITEM) {
			throw new PackingError('Item price exceeds maximum');
		}

		return parsedItem;
	}
	/**
	 *
	 * @returns {String} string containing indexes of items in each package
	 */

	_formatOutput(): string {
		return this.packages
			.map((pack) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { value, items } = pack;
				const itemIndexes =
					items.map((item) => item.index).join(',') || '-';
				return `${itemIndexes}`;
			})
			.join('\n');
	}
}
