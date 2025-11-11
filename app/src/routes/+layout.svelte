<script lang="ts">
	import '../app.css';

	let { children } = $props();
	let sidebarExpanded = $state(false);

	function toggleSidebar() {
		sidebarExpanded = !sidebarExpanded;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Top Navigation Bar -->
	<header class="fixed top-0 left-0 right-0 h-14 bg-gray-50 flex items-center px-4 z-50">
		<button
			onclick={toggleSidebar}
			class="p-2 hover:bg-gray-200 rounded-full transition-colors"
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<h1 class="ml-4 text-xl font-bold text-gray-900">CodingInterview</h1>
	</header>

	<!-- Sidebar -->
	<aside
		class="fixed top-14 left-0 bottom-0 bg-gray-50 transition-all duration-300 z-40 {sidebarExpanded ? 'w-56' : 'w-20'}"
	>
		<nav class="p-2">
			<a
				href="/"
				class="flex {sidebarExpanded ? 'flex-row items-center gap-6 px-4' : 'flex-col items-center gap-1 px-2'} py-3 rounded-lg hover:bg-gray-100 transition-colors group"
			>
				<svg class="w-6 h-6 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
				{#if sidebarExpanded}
					<span class="text-sm font-medium text-gray-900">Dashboard</span>
				{:else}
					<span class="text-xs text-gray-600">Dashboard</span>
				{/if}
			</a>

			<a
				href="/classification"
				class="flex {sidebarExpanded ? 'flex-row items-center gap-6 px-4' : 'flex-col items-center gap-1 px-2'} py-3 rounded-lg hover:bg-gray-100 transition-colors group"
			>
				<svg class="w-6 h-6 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
				</svg>
				{#if sidebarExpanded}
					<span class="text-sm font-medium text-gray-900">Learn</span>
				{:else}
					<span class="text-xs text-gray-600">Learn</span>
				{/if}
			</a>

			<a
				href="/quiz"
				class="flex {sidebarExpanded ? 'flex-row items-center gap-6 px-4' : 'flex-col items-center gap-1 px-2'} py-3 rounded-lg hover:bg-gray-100 transition-colors group"
			>
				<svg class="w-6 h-6 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				{#if sidebarExpanded}
					<span class="text-sm font-medium text-gray-900">Quiz</span>
				{:else}
					<span class="text-xs text-gray-600">Quiz</span>
				{/if}
			</a>
		</nav>
	</aside>

	<!-- Main content -->
	<main class="pt-14 transition-all duration-300 {sidebarExpanded ? 'ml-56' : 'ml-20'}">
		{@render children?.()}
	</main>
</div>
