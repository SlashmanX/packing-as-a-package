/* eslint-disable @typescript-eslint/no-explicit-any */
import { Packer } from '.';

const P = new Packer();

async function test() {
	const result = await P.pack('./resources/example_input');
	console.log(result);
}
test();
