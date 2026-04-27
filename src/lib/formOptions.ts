import type { UseFormOptions } from 'fuma'
import { toast } from 'svelte-sonner'

export const useDrawerFormOptions: (close: () => void) => UseFormOptions<unknown> = (close) => ({
	onError(err) {
		console.error(err)
	},
	onFail: (failure) => {
		if (failure && 'message' in failure) {
			toast.error(failure.message)
			return
		}
	},
	onSuccess: async () => {
		close()
		toast.success('Succès !')
	}
})
