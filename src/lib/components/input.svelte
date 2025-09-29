<script lang="ts">
	import { numberProxy } from '$lib/form/proxies/number.svelte';
	import {
		Field,
		type FormStore,
		type PathValue,
		type RequiredPath,
		type ValidPath
	} from '@formisch/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import * as v from 'valibot';

	type Schema = $$Generic<v.GenericSchema | v.GenericSchemaAsync>;
	type FieldPath = $$Generic<RequiredPath>;
	type FieldType = $$Generic<PathValue<v.InferInput<Schema>, FieldPath>>;

	interface Props extends Omit<HTMLInputAttributes, 'form' | 'value'> {
		form: FormStore<Schema>;
		path: ValidPath<v.InferInput<Schema>, FieldPath>;
		type: string extends FieldType
			? 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
			: number extends FieldType
				? 'number' | 'range'
				: never;
		minPath?: ValidPath<v.InferInput<Schema>, RequiredPath>;
		maxPath?: ValidPath<v.InferInput<Schema>, RequiredPath>;
	}

	const { form, path, minPath, maxPath, type, class: className, ...rest }: Props = $props();
</script>

<Field of={form} {path}>
	{#snippet children(field)}
		<fieldset class="fieldset">
			{#if type === 'number' || type === 'range'}
				<svelte:boundary>
					<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
					{@const proxy = numberProxy(form, path as any)}
					{@const minProxy = minPath ? numberProxy(form, minPath) : undefined}
					{@const maxProxy = maxPath ? numberProxy(form, maxPath) : undefined}
					<input
						name={field.props.name}
						{type}
						bind:value={proxy.value}
						class={['input', className]}
						{...rest}
						{...{
							...(minProxy ? { min: minProxy.value } : {}),
							...(maxProxy ? { max: maxProxy.value } : {})
						}}
					/>

					{#snippet failed(err)}
						<p class="label text-error">{err}</p>
					{/snippet}
				</svelte:boundary>
			{:else}
				<input {...field.props} {type} value={field.input} class={['input', className]} {...rest} />
			{/if}
			<p class="label text-error">{field.errors?.[0]}</p>
		</fieldset>
	{/snippet}
</Field>
