<script lang="ts">
	import DateInput from '$lib/components/date-input.svelte';
	import Input from '$lib/components/input.svelte';
	import { Form, createForm, getAllErrors } from '@formisch/svelte';
	import * as v from 'valibot';

	const PaymentFormSchema = v.object({
		date: v.date(),
		num: v.number(),
		owner: v.pipe(v.string('Please enter your name.'), v.nonEmpty('Please enter your name.'))
	});

	const paymentForm = createForm({
		schema: PaymentFormSchema,
		initialInput: {
			date: new Date()
		}
	});

	let output = $state<v.InferOutput<typeof PaymentFormSchema>>();
</script>

<Form of={paymentForm} onsubmit={(result) => (output = result)}>
	<Input type="text" form={paymentForm} path={['owner']} />
	<Input type="number" form={paymentForm} path={['num']} min={0} max={100} />
	<DateInput type="datetime-local" form={paymentForm} path={['date']} />
	<button type="submit" class="btn btn-primary">Submit</button>
</Form>

<pre>{JSON.stringify(output, null, 2)}</pre>
<pre>{JSON.stringify(getAllErrors(paymentForm), null, 2)}</pre>
