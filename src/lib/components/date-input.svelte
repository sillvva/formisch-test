<script lang="ts">
	import { dateProxy } from '$lib/form/proxies/date.svelte';
	import { Field, type FormStore, type RequiredPath, type ValidPath } from '@formisch/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import * as v from 'valibot';

	type Schema = $$Generic<v.GenericSchema | v.GenericSchemaAsync>;

	interface Props extends Omit<HTMLInputAttributes, 'form' | 'value'> {
		form: FormStore<Schema>;
		path: ValidPath<v.InferInput<Schema>, RequiredPath>;
		type: 'date' | 'datetime-local' | 'time';
		minPath?: ValidPath<v.InferInput<Schema>, RequiredPath>;
		maxPath?: ValidPath<v.InferInput<Schema>, RequiredPath>;
	}

	const { form, path, minPath, maxPath, type, class: className, ...rest }: Props = $props();
</script>

<Field of={form} {path}>
	{#snippet children(field)}
		<fieldset class="fieldset">
			<svelte:boundary>
				{@const proxy = dateProxy(form, path, { type })}
				{@const minProxy = minPath ? dateProxy(form, minPath) : undefined}
				{@const maxProxy = maxPath ? dateProxy(form, maxPath) : undefined}

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
				<p class="label text-error">{field.errors?.[0]}</p>

				{#snippet failed(err)}
					<p class="label text-error">{err}</p>
				{/snippet}
			</svelte:boundary>
		</fieldset>
	{/snippet}
</Field>
