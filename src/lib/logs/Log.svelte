<script lang="ts" module>
	import type { Component } from 'svelte'
	import type { LogType } from '@prisma/client'
	import { BellRingIcon } from '@lucide/svelte'
	import { page } from '$app/state'
	import type { LogWithAll, LogTyped } from '.'
	import LogOrgCreate from './LogOrgCreate.svelte'
	import LogOrgUpdate from './LogOrgUpdate.svelte'
	import LogMemberCreate from './LogMemberCreate.svelte'
	import LogMemberUpdate from './LogMemberUpdate.svelte'
	import LogMemberDelete from './LogMemberDelete.svelte'
	import LogInvitationAccept from './LogInvitationAccept.svelte'
	import LogInvitationDeclined from './LogInvitationDeclined.svelte'
	import LogMessage from './LogMessage.svelte'
	// import LogDebug from './LogDebug.svelte';

	const logComponents: { [T in LogType]: Component<LogTyped<T>> } = {
		org_create: LogOrgCreate,
		org_update: LogOrgUpdate,
		member_create: LogMemberCreate,
		member_update: LogMemberUpdate,
		member_delete: LogMemberDelete,
		invitation_declined: LogInvitationDeclined,
		invitation_accept: LogInvitationAccept,
		message_create: LogMessage
	}

	const intl = new Intl.DateTimeFormat('ch-fr', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
</script>

<script lang="ts" generics="T extends LogType">
	let { log }: { log: LogWithAll } = $props()

	// @ts-ignore
	let logProps = $derived(log) as LogTyped<T>
	let LogComponent = $derived(logComponents[logProps.type])
</script>

<div class="flex items-baseline gap-2">
	{#if log.createdBy}
		<span class="text-secondary">
			{log.createdBy.contact.firstName}
			{log.createdBy.contact.lastName}
		</span>
		{#if log.createdBy.orgId !== page.data.org?.id}
			<span class="text-accent">
				@{log.createdBy.org.name}
			</span>
		{/if}
	{:else}
		<div class="flex gap-1 items-center">
			<BellRingIcon class="h-4" />
			<span>Notification</span>
		</div>
	{/if}
	<span class="text-[0.72rem] font-light opacity-50">{intl.format(log.createdAt)}</span>
</div>

<LogComponent {...logProps}></LogComponent>
