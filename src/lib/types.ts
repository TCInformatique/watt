import type { Snippet } from 'svelte'
import type { Contact, Member, User } from '@prisma/client'

export type UserBasic = Pick<User, 'id' | 'role'> & { contact: Contact }
export type MemberWithContact = Member & { contact: Contact }

export type SnippetLike<Args extends unknown[] = unknown[]> =
	| Snippet<Args>
	| ((...args: Args) => ReturnType<Snippet>)

export type Optional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }
