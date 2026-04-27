<script lang="ts">
	import { useForm, InputPassword, InputText } from 'fuma'
	import { toast } from 'svelte-sonner'

	const { enhance } = useForm({
		onFail(fail) {
			if (fail && 'message' in fail) {
				toast.error(fail.message)
			}
		}
	})

	let action = $state<'register' | 'login'>('login')
</script>

<div class="h-screen grid place-content-center p-4">
	<form
		method="post"
		use:enhance
		action="?/{action}"
		class="border border-base-300 p-10 flex flex-col gap-4 shadow-lg rounded-lg w-md"
	>
		<h2 class="text-xl">
			{action === 'login' ? 'Connexion' : 'Nouveau compte'}
		</h2>

		<InputText label="Email" key="email" input={{ inputmode: 'email' }} />
		{#if action === 'register'}
			<div class="grid grid-cols-2 gap-2">
				<InputText label="Prénom" key="firstName"></InputText>
				<InputText label="Nom" key="lastName"></InputText>
			</div>
		{/if}

		<InputPassword label="Mot de passe" key="password" input={{ style: 'width: 100%;' }} />

		<button class="btn btn-primary">Valider</button>

		<button
			type="button"
			class="link link-hover text-sm"
			onclick={() => (action = action === 'login' ? 'register' : 'login')}
		>
			{action === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
		</button>
	</form>
</div>
