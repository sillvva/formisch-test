import {
	getErrors,
	getInput,
	setInput,
	type FormStore,
	type RequiredPath,
	type ValidPath
} from '@formisch/svelte';
import { format, parse, parseISO } from 'date-fns';
import * as v from 'valibot';
import type { ProxyOptions } from '.';

interface DateProxyOptions extends ProxyOptions {
	type?: 'date' | 'datetime-local' | 'time';
}
export function dateProxy<
	Schema extends v.GenericSchema | v.GenericSchemaAsync,
	Options extends DateProxyOptions,
	Empty extends null | undefined = Options['empty'] extends 'null' ? null : undefined
>(
	store: FormStore<Schema>,
	path: ValidPath<v.InferInput<Schema>, RequiredPath>,
	{ type = 'date', empty }: Options = {} as Options
) {
	const def = empty === 'null' ? (null as Empty) : (undefined as Empty);
	function fromDate(date: Date | Empty) {
		if (!date) return def;
		switch (type) {
			case 'date':
				return format(date, 'yyyy-MM-dd');
			case 'datetime-local':
				return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm');
			case 'time':
				return format(date, 'HH:mm');
		}
	}

	function toDate(value: string | Empty) {
		if (!value) return def;
		try {
			switch (type) {
				case 'date':
					return parse(value, 'yyyy-MM-dd', new Date());
				case 'datetime-local':
					return parseISO(value);
				case 'time':
					return parse(value, 'HH:mm', new Date());
			}
		} catch (err) {
			console.log(err);
		}
		return def;
	}

	const date = $derived((getInput(store, { path }) as Date | undefined) ?? def);
	let _value = $derived({
		value: fromDate(date),
		errors: getErrors(store, { path })
	});

	return {
		get value() {
			if (!(date instanceof Date) && date !== def) {
				throw new Error('Path is not a date');
			}
			return _value.value;
		},
		set value(value: string | null | undefined) {
			const input = toDate(value ?? def);
			if (!input || !isNaN(input.getTime())) {
				// @ts-ignore
				setInput(store, { path, input });
			} else {
				_value.value = value ?? def;
			}
		},
		get errors() {
			return _value.errors;
		}
	};
}
