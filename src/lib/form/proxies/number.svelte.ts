import {
	getErrors,
	getInput,
	setInput,
	type FormStore,
	type RequiredPath,
	type ValidPath
} from '@formisch/svelte';
import * as v from 'valibot';
import type { ProxyOptions } from '.';

export function numberProxy<
	Schema extends v.GenericSchema | v.GenericSchemaAsync,
	Options extends ProxyOptions,
	Empty extends null | undefined = Options['empty'] extends 'null' ? null : undefined
>(
	store: FormStore<Schema>,
	path: ValidPath<v.InferInput<Schema>, RequiredPath>,
	{ empty }: Options = {} as Options
) {
	const def = empty === 'null' ? (null as Empty) : (undefined as Empty);

	const num = $derived((getInput(store, { path }) as number | undefined) ?? def);
	let _value = $derived({
		value: num,
		errors: getErrors(store, { path })
	});

	return {
		get value() {
			if (typeof num !== 'number' && num !== def) {
				throw new Error('Path is not a number');
			}
			return _value.value;
		},
		set value(value: number | null | undefined) {
			const input = value ?? def;
			if (input === null || input === undefined || !isNaN(input)) {
				// @ts-ignore
				setInput(store, { path, input });
			} else {
				_value.value = input;
			}
		},
		get errors() {
			return _value.errors;
		}
	};
}
