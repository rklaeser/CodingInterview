<script lang="ts">
	import { db } from '$lib/firebase';
	import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';

	interface QuizAttempt {
		id: string;
		score: number;
		total: number;
		percentage: number;
		timestamp: any;
		type: 'category' | 'code';
		problems: Array<{
			id: string;
			title: string;
			correctCategories?: string[];
			userAnswer?: string[];
			hiddenLine?: string;
			userCodeAnswer?: string;
		}>;
	}

	let quizAttempts = $state<QuizAttempt[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let stats = $state({
		totalAttempts: 0,
		averageScore: 0,
		perfectScores: 0,
		bestStreak: 0
	});

	onMount(async () => {
		try {
			// Fetch category quiz attempts (without orderBy to avoid index requirement)
			const categorySnapshot = await getDocs(collection(db, 'codinginterview-quiz-attempts'));
			const categoryAttempts = categorySnapshot.docs.map(doc => ({
				id: doc.id,
				type: 'category' as const,
				...doc.data()
			} as QuizAttempt));

			// Fetch code quiz attempts (without orderBy to avoid index requirement)
			const codeSnapshot = await getDocs(collection(db, 'codinginterview-code-quiz-attempts'));
			const codeAttempts = codeSnapshot.docs.map(doc => ({
				id: doc.id,
				type: 'code' as const,
				...doc.data()
			} as QuizAttempt));

			// Merge and sort by timestamp in memory
			const allAttempts = [...categoryAttempts, ...codeAttempts];
			quizAttempts = allAttempts
				.sort((a, b) => {
					const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
					const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
					return timeB.getTime() - timeA.getTime();
				})
				.slice(0, 10);

			// Calculate stats
			if (quizAttempts.length > 0) {
				stats.totalAttempts = quizAttempts.length;
				stats.averageScore = quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizAttempts.length;
				stats.perfectScores = quizAttempts.filter(attempt => attempt.score === attempt.total).length;

				// Calculate best streak of perfect scores
				let currentStreak = 0;
				let maxStreak = 0;
				for (const attempt of quizAttempts) {
					if (attempt.score === attempt.total) {
						currentStreak++;
						maxStreak = Math.max(maxStreak, currentStreak);
					} else {
						currentStreak = 0;
					}
				}
				stats.bestStreak = maxStreak;
			}
		} catch (err) {
			console.error('Error fetching quiz attempts:', err);
			error = err instanceof Error ? err.message : 'Failed to load quiz attempts';
		} finally {
			loading = false;
		}
	});

	function formatDate(timestamp: any): string {
		if (!timestamp) return 'N/A';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(date);
	}

	function getScoreColor(percentage: number): string {
		if (percentage === 100) return 'text-green-600';
		if (percentage >= 66) return 'text-blue-600';
		if (percentage >= 33) return 'text-orange-600';
		return 'text-red-600';
	}

	function getScoreBgColor(percentage: number): string {
		if (percentage === 100) return 'bg-green-50 border-green-200';
		if (percentage >= 66) return 'bg-blue-50 border-blue-200';
		if (percentage >= 33) return 'bg-orange-50 border-orange-200';
		return 'bg-red-50 border-red-200';
	}
</script>

<div class="min-h-screen bg-gray-50">
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h1 class="text-3xl font-bold mb-4">Reed's Interview Practice Dashboard</h1>
			<p class="text-gray-600">Follow along to see Reed's progress</p>
		</div>

		{#if loading}
			<div class="bg-white rounded-lg shadow p-8 text-center">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
				<p class="text-gray-600 mt-4">Loading Reed's progress...</p>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg shadow p-8 text-center">
				<div class="text-6xl mb-4">⚠️</div>
				<h2 class="text-2xl font-bold mb-2 text-red-700">Error Loading Data</h2>
				<p class="text-red-600 mb-4">{error}</p>
				<p class="text-sm text-gray-600">This is likely a Firestore permissions issue. Check the console for details.</p>
			</div>
		{:else if quizAttempts.length === 0}
			<!-- No attempts yet -->
			<div class="bg-white rounded-lg shadow p-8 text-center">
				<div class="text-6xl mb-4">📝</div>
				<h2 class="text-2xl font-bold mb-2">No quiz attempts yet</h2>
				<p class="text-gray-600 mb-6">Quiz attempts will appear here once you complete them.</p>
			</div>
		{:else}
			<!-- Stats Overview -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm font-semibold text-gray-600 mb-1">Total Attempts</div>
					<div class="text-3xl font-bold text-blue-600">{stats.totalAttempts}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm font-semibold text-gray-600 mb-1">Average Score</div>
					<div class="text-3xl font-bold {getScoreColor(stats.averageScore)}">
						{stats.averageScore.toFixed(0)}%
					</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm font-semibold text-gray-600 mb-1">Perfect Scores</div>
					<div class="text-3xl font-bold text-green-600">{stats.perfectScores}</div>
				</div>
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-sm font-semibold text-gray-600 mb-1">Best Streak</div>
					<div class="text-3xl font-bold text-purple-600">{stats.bestStreak}</div>
				</div>
			</div>

			<!-- Recent Attempts -->
			<div class="bg-white rounded-lg shadow overflow-hidden">
				<div class="px-6 py-4 border-b border-gray-200">
					<h2 class="text-xl font-bold">Recent Quiz Attempts</h2>
				</div>
				<div class="divide-y divide-gray-200">
					{#each quizAttempts as attempt}
						<div class="p-6 hover:bg-gray-50 transition-colors">
							<div class="flex items-start justify-between mb-4">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<div class="text-2xl font-bold {getScoreColor(attempt.percentage)}">
											{attempt.score}/{attempt.total}
										</div>
										<div class="px-3 py-1 rounded-full text-sm font-semibold {getScoreBgColor(attempt.percentage)} border">
											{attempt.percentage.toFixed(0)}%
										</div>
										{#if attempt.type === 'code'}
											<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded border border-purple-300">
												Code Quiz
											</span>
										{:else}
											<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded border border-blue-300">
												Category Quiz
											</span>
										{/if}
										{#if attempt.score === attempt.total}
											<span class="text-2xl">🎉</span>
										{/if}
									</div>
									<div class="text-sm text-gray-600">
										{formatDate(attempt.timestamp)}
									</div>
								</div>
							</div>

							<!-- Problems breakdown -->
							<div class="space-y-2">
								{#if attempt.type === 'category'}
									{#each attempt.problems as problem}
										{@const isCorrect = [...(problem.userAnswer || [])].sort().join(',') === [...(problem.correctCategories || [])].sort().join(',')}
										<div class="flex items-start gap-2 text-sm">
											<span class="text-lg">{isCorrect ? '✓' : '✗'}</span>
											<div class="flex-1">
												<div class="font-medium">{problem.title}</div>
												<div class="text-gray-600">
													{#if (problem.userAnswer || []).length > 0}
														Your answer: {problem.userAnswer?.join(', ')}
													{:else}
														<span class="italic">No answer</span>
													{/if}
												</div>
												{#if !isCorrect}
													<div class="text-green-700">
														Correct: {problem.correctCategories?.join(', ')}
													</div>
												{/if}
											</div>
										</div>
									{/each}
								{:else if attempt.type === 'code'}
									{#each attempt.problems as problem}
										{@const isCorrect = (problem.userCodeAnswer || '').trim() === (problem.hiddenLine || '').trim()}
										<div class="flex items-start gap-2 text-sm">
											<span class="text-lg">{isCorrect ? '✓' : '✗'}</span>
											<div class="flex-1">
												<div class="font-medium">{problem.title}</div>
												<div class="text-gray-600">
													Your answer: <code class="bg-gray-100 px-1 rounded">{problem.userCodeAnswer || '(no answer)'}</code>
												</div>
												{#if !isCorrect}
													<div class="text-green-700">
														Correct: <code class="bg-green-100 px-1 rounded">{problem.hiddenLine}</code>
													</div>
												{/if}
											</div>
										</div>
									{/each}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</main>
</div>
