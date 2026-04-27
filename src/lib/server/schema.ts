import type z from 'zod'

export type ShapeOf<T extends Record<string, unknown>> = Readonly<
	Readonly<{
		[K in keyof T]: z.core.$ZodType<T[K], unknown, z.core.$ZodTypeInternals<T[K], unknown>>
	}>
>
