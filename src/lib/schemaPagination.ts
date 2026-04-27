import z from 'zod'

export const schemaPagination = {
	take: z.coerce.number().default(20),
	skip: z.coerce.number().default(0)
}
