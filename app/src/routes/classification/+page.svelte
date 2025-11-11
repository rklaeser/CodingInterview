<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import type { Problem } from '$lib/types/problem';

	let expandedProblems = $state<Record<string, boolean>>({});
	let showPythonic = $state<Record<string, boolean>>({});
	let problems = $state<Problem[]>([]);
	let loading = $state(true);

	function toggleExpand(id: string) {
		expandedProblems[id] = !expandedProblems[id];
	}

	function togglePythonic(id: string) {
		showPythonic[id] = !showPythonic[id];
	}

	onMount(async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'codinginterview-problems'));
			problems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Problem));
		} catch (error) {
			console.error('Error fetching problems:', error);
		} finally {
			loading = false;
		}
	});

	// Helper function to get problems by category and optional subcategory
	function getProblemsByCategory(category: string, subcategory?: string): Problem[] {
		return problems.filter(p =>
			p.categories.includes(category) &&
			(!subcategory || p.subcategory === subcategory)
		);
	}

	// Render a problem card
	function renderProblem(problem: Problem, color: string) {
		return { problem, color, hasImplementation: !!problem.implementation };
	}
</script>

{#if loading}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600">Loading problems...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="bg-white rounded-lg shadow p-6 mb-6">
				<h1 class="text-3xl font-bold mb-4">Learn Problem Patterns</h1>
				<p class="text-gray-600">Problems organized by data structures and algorithms patterns</p>
			</div>

			<!-- Quick Reference: Trigger Words -->
			<div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 mb-6 text-white">
				<h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
					<span>⚡</span> Quick Reference: Trigger Words
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-blue-300">Array/String:</span>
						<p class="text-gray-200 mt-1">longest/shortest substring, maximum profit, two sum, sliding window, overlapping intervals</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-green-300">Hash Tables:</span>
						<p class="text-gray-200 mt-1">group, anagrams, frequency, k most/least, existence checks</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-purple-300">Sorting & Searching:</span>
						<p class="text-gray-200 mt-1">O(log n), sorted array, binary search</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-yellow-300">Trees & Graphs:</span>
						<p class="text-gray-200 mt-1">binary tree, grid, connected, islands, path, level order, adjacent cells</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-red-300">Dynamic Programming:</span>
						<p class="text-gray-200 mt-1">how many ways, maximum/minimum with constraints, cannot use adjacent</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-indigo-300">Backtracking:</span>
						<p class="text-gray-200 mt-1">find all combinations/permutations, generate all, same element unlimited times</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-pink-300">Linked Lists:</span>
						<p class="text-gray-200 mt-1">linked list, reverse, cycle, in-place</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-teal-300">Stack & Queue:</span>
						<p class="text-gray-200 mt-1">valid, matching, balanced, nested, properly closed</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-orange-300">Design:</span>
						<p class="text-gray-200 mt-1">design a data structure, O(1) for multiple operations, supports [X] and [Y]</p>
					</div>
					<div class="bg-white/10 rounded p-3">
						<span class="font-semibold text-cyan-300">Bit Manipulation:</span>
						<p class="text-gray-200 mt-1">constant space + linear time, appears twice except one, XOR</p>
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<!-- 1. Array/String Manipulation -->
				{#if getProblemsByCategory('Array/String Manipulation').length > 0}
					<div class="bg-white rounded-lg shadow overflow-hidden">
						<div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
							<h2 class="text-2xl font-bold text-white">1. Array/String Manipulation</h2>
						</div>
						<div class="p-6 space-y-6">
							<!-- Two Pointers -->
							{#if getProblemsByCategory('Array/String Manipulation', 'Two Pointers').length > 0}
								<div>
									<h4 class="font-bold text-blue-700 mb-3">Two Pointers</h4>
									<div class="space-y-4">
										{#each getProblemsByCategory('Array/String Manipulation', 'Two Pointers') as problem}
											<div class="border-l-4 border-blue-500 pl-4">
												{#if problem.implementation}
													<button onclick={() => toggleExpand(problem.id)} class="w-full text-left">
														<h3 class="font-semibold text-lg hover:text-blue-600 flex items-center gap-2">
															{expandedProblems[problem.id] ? '▼' : '▶'} {problem.title}
														</h3>
													</button>
													{#if expandedProblems[problem.id]}
														<div class="mt-4 bg-gray-50 rounded-lg p-4">
															<div class="flex items-center justify-between mb-3">
																<div>
																	<p class="text-sm text-gray-600">{problem.implementation.complexity}</p>
																	{#if problem.implementation.notes}
																		<p class="text-sm text-blue-600 italic mt-1">{problem.implementation.notes}</p>
																	{/if}
																</div>
																{#if problem.implementation.pythonicCode}
																	<button
																		onclick={() => togglePythonic(problem.id)}
																		class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {showPythonic[problem.id]
																			? 'bg-purple-600 text-white hover:bg-purple-700'
																			: 'bg-blue-500 text-white hover:bg-blue-600'}"
																	>
																		{showPythonic[problem.id] ? 'Hide' : 'Show'} Pythonic
																	</button>
																{/if}
															</div>
															{#if showPythonic[problem.id] && problem.implementation.pythonicCode}
																<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
																	<div>
																		<h4 class="text-sm font-semibold text-gray-700 mb-2">Standard</h4>
																		<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
																	</div>
																	<div>
																		<h4 class="text-sm font-semibold text-purple-700 mb-2">Pythonic Version ✨</h4>
																		<pre class="bg-purple-950 text-purple-50 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.pythonicCode}</code></pre>
																		{#if problem.implementation.pythonicNotes}
																			<p class="text-xs text-purple-600 mt-2 italic">{problem.implementation.pythonicNotes}</p>
																		{/if}
																	</div>
																</div>
															{:else}
																<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
															{/if}
														</div>
													{/if}
												{:else}
													<h3 class="font-semibold text-lg">{problem.title}</h3>
													<p class="text-gray-700 mt-2">{problem.description}</p>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Sliding Window -->
							{#if getProblemsByCategory('Array/String Manipulation', 'Sliding Window').length > 0}
								<div>
									<h4 class="font-bold text-blue-700 mb-3">Sliding Window</h4>
									<div class="space-y-4">
										{#each getProblemsByCategory('Array/String Manipulation', 'Sliding Window') as problem}
											<div class="border-l-4 border-blue-500 pl-4">
												{#if problem.implementation}
													<button onclick={() => toggleExpand(problem.id)} class="w-full text-left">
														<h3 class="font-semibold text-lg hover:text-blue-600 flex items-center gap-2">
															{expandedProblems[problem.id] ? '▼' : '▶'} {problem.title}
														</h3>
													</button>
													{#if expandedProblems[problem.id]}
														<div class="mt-4 bg-gray-50 rounded-lg p-4">
															<div class="flex items-center justify-between mb-3">
																<div>
																	<p class="text-sm text-gray-600">{problem.implementation.complexity}</p>
																	{#if problem.implementation.notes}
																		<p class="text-sm text-blue-600 italic mt-1">{problem.implementation.notes}</p>
																	{/if}
																</div>
																{#if problem.implementation.pythonicCode}
																	<button
																		onclick={() => togglePythonic(problem.id)}
																		class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {showPythonic[problem.id]
																			? 'bg-purple-600 text-white hover:bg-purple-700'
																			: 'bg-blue-500 text-white hover:bg-blue-600'}"
																	>
																		{showPythonic[problem.id] ? 'Hide' : 'Show'} Pythonic
																	</button>
																{/if}
															</div>
															{#if showPythonic[problem.id] && problem.implementation.pythonicCode}
																<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
																	<div>
																		<h4 class="text-sm font-semibold text-gray-700 mb-2">Standard</h4>
																		<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
																	</div>
																	<div>
																		<h4 class="text-sm font-semibold text-purple-700 mb-2">Pythonic Version ✨</h4>
																		<pre class="bg-purple-950 text-purple-50 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.pythonicCode}</code></pre>
																		{#if problem.implementation.pythonicNotes}
																			<p class="text-xs text-purple-600 mt-2 italic">{problem.implementation.pythonicNotes}</p>
																		{/if}
																	</div>
																</div>
															{:else}
																<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
															{/if}
														</div>
													{/if}
												{:else}
													<h3 class="font-semibold text-lg">{problem.title}</h3>
													<p class="text-gray-700 mt-2">{problem.description}</p>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Other subcategories dynamically -->
							{#if true}
								{@const otherSubcategories = [...new Set(getProblemsByCategory('Array/String Manipulation')
									.filter(p => p.subcategory && !['Two Pointers', 'Sliding Window'].includes(p.subcategory))
									.map(p => p.subcategory))]}
								{#each otherSubcategories as subcategory}
								<div>
									<h4 class="font-bold text-blue-700 mb-3">{subcategory}</h4>
									<div class="space-y-4">
										{#each getProblemsByCategory('Array/String Manipulation', subcategory) as problem}
											<div class="border-l-4 border-blue-500 pl-4">
												{#if problem.implementation}
													<button onclick={() => toggleExpand(problem.id)} class="w-full text-left">
														<h3 class="font-semibold text-lg hover:text-blue-600 flex items-center gap-2">
															{expandedProblems[problem.id] ? '▼' : '▶'} {problem.title}
														</h3>
													</button>
													{#if expandedProblems[problem.id]}
														<div class="mt-4 bg-gray-50 rounded-lg p-4">
															<div class="flex items-center justify-between mb-3">
																<div>
																	<p class="text-sm text-gray-600">{problem.implementation.complexity}</p>
																	{#if problem.implementation.notes}
																		<p class="text-sm text-blue-600 italic mt-1">{problem.implementation.notes}</p>
																	{/if}
																</div>
																{#if problem.implementation.pythonicCode}
																	<button
																		onclick={() => togglePythonic(problem.id)}
																		class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {showPythonic[problem.id]
																			? 'bg-purple-600 text-white hover:bg-purple-700'
																			: 'bg-blue-500 text-white hover:bg-blue-600'}"
																	>
																		{showPythonic[problem.id] ? 'Hide' : 'Show'} Pythonic
																	</button>
																{/if}
															</div>
															{#if showPythonic[problem.id] && problem.implementation.pythonicCode}
																<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
																	<div>
																		<h4 class="text-sm font-semibold text-gray-700 mb-2">Standard</h4>
																		<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
																	</div>
																	<div>
																		<h4 class="text-sm font-semibold text-purple-700 mb-2">Pythonic Version ✨</h4>
																		<pre class="bg-purple-950 text-purple-50 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.pythonicCode}</code></pre>
																		{#if problem.implementation.pythonicNotes}
																			<p class="text-xs text-purple-600 mt-2 italic">{problem.implementation.pythonicNotes}</p>
																		{/if}
																	</div>
																</div>
															{:else}
																<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
															{/if}
														</div>
													{/if}
												{:else}
													<h3 class="font-semibold text-lg">{problem.title}</h3>
													<p class="text-gray-700 mt-2">{problem.description}</p>
												{/if}
											</div>
										{/each}
									</div>
								</div>
								{/each}
							{/if}
						</div>
					</div>
				{/if}

				<!-- 2-9: Similar pattern for other categories -->
				<!-- For brevity, I'll create a reusable component approach -->
				{#if true}
					{@const categories = [
						{ name: 'Hash Tables/Sets', color: 'green' },
						{ name: 'Sorting & Searching', color: 'purple' },
						{ name: 'Trees & Graphs', color: 'yellow' },
						{ name: 'Dynamic Programming', color: 'red' },
						{ name: 'Recursion & Backtracking', color: 'indigo' },
						{ name: 'Linked Lists', color: 'pink' },
						{ name: 'Stack & Queue', color: 'teal' },
						{ name: 'Design Problems', color: 'orange' }
					]}

					{#each categories as {name, color}, idx}
					{@const categoryProblems = getProblemsByCategory(name)}
					{#if categoryProblems.length > 0}
						<div class="bg-white rounded-lg shadow overflow-hidden">
							<div class="bg-gradient-to-r from-{color}-500 to-{color}-600 px-6 py-4">
								<h2 class="text-2xl font-bold text-white">{idx + 2}. {name}</h2>
							</div>
							<div class="p-6 space-y-6">
								{#if true}
									{@const subcategories = [...new Set(categoryProblems.map(p => p.subcategory).filter(Boolean))]}
									{#if subcategories.length > 0}
									{#each subcategories as subcategory}
										<div>
											<h4 class="font-bold text-{color}-700 mb-3">{subcategory}</h4>
											<div class="space-y-4">
												{#each getProblemsByCategory(name, subcategory) as problem}
													<div class="border-l-4 border-{color}-500 pl-4">
														{#if problem.implementation}
															<button onclick={() => toggleExpand(problem.id)} class="w-full text-left">
																<h3 class="font-semibold text-lg hover:text-{color}-600 flex items-center gap-2">
																	{expandedProblems[problem.id] ? '▼' : '▶'} {problem.title}
																</h3>
															</button>
															{#if expandedProblems[problem.id]}
																<div class="mt-4 bg-gray-50 rounded-lg p-4">
																	<div class="mb-3">
																		<p class="text-sm text-gray-600">{problem.implementation.complexity}</p>
																		{#if problem.implementation.notes}
																			<p class="text-sm text-{color}-600 italic mt-1">{problem.implementation.notes}</p>
																		{/if}
																	</div>
																	<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
																</div>
															{/if}
														{:else}
															<h3 class="font-semibold text-lg">{problem.title}</h3>
															<p class="text-gray-700 mt-2">{problem.description}</p>
															{#if problem.subcategory}
																<p class="text-{color}-600 mt-2 italic">{problem.subcategory}</p>
															{/if}
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/each}
								{:else}
									<!-- No subcategories -->
									<div class="space-y-4">
										{#each categoryProblems as problem}
											<div class="border-l-4 border-{color}-500 pl-4">
												{#if problem.implementation}
													<button onclick={() => toggleExpand(problem.id)} class="w-full text-left">
														<h3 class="font-semibold text-lg hover:text-{color}-600 flex items-center gap-2">
															{expandedProblems[problem.id] ? '▼' : '▶'} {problem.title}
														</h3>
													</button>
													{#if expandedProblems[problem.id]}
														<div class="mt-4 bg-gray-50 rounded-lg p-4">
															<div class="mb-3">
																<p class="text-sm text-gray-600">{problem.implementation.complexity}</p>
																{#if problem.implementation.notes}
																	<p class="text-sm text-{color}-600 italic mt-1">{problem.implementation.notes}</p>
																{/if}
															</div>
															<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{problem.implementation.code}</code></pre>
														</div>
													{/if}
												{:else}
													<h3 class="font-semibold text-lg">{problem.title}</h3>
													<p class="text-gray-700 mt-2">{problem.description}</p>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
								{/if}
							</div>
						</div>
					{/if}
					{/each}
				{/if}
			</div>
		</main>
	</div>
{/if}
