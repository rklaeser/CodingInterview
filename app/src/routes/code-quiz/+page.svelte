<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import type { Problem } from '$lib/types/problem';

	let quizState = $state<'start' | 'playing' | 'results'>('start');
	let problems = $state<Problem[]>([]);
	let selectedProblems = $state<Array<{
		problem: Problem;
		lines: string[];
		hiddenLineIndex: number;
		hiddenLineContent: string;
	}>>([]);
	let currentProblemIndex = $state(0);
	let userAnswers = $state<Record<string, string>>({});
	let score = $state(0);
	let totalQuestions = $state(0);
	let loading = $state(true);

	onMount(async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'codinginterview-problems'));
			// Filter only problems that have implementation code
			problems = querySnapshot.docs
				.map(doc => ({ ...doc.data(), id: doc.id } as Problem))
				.filter(p => p.implementation && p.implementation.code);
		} catch (error) {
			console.error('Error fetching problems:', error);
		} finally {
			loading = false;
		}
	});

	function startQuiz() {
		// Select 2 random problems
		const shuffled = [...problems].sort(() => Math.random() - 0.5);
		const selected = shuffled.slice(0, Math.min(2, shuffled.length));

		selectedProblems = selected.map(problem => {
			const code = problem.implementation!.code;
			const lines = code.split('\n');

			// Filter out empty lines and lines with only whitespace
			const nonEmptyLineIndices = lines
				.map((line, idx) => ({ line, idx }))
				.filter(({ line }) => line.trim().length > 0)
				.map(({ idx }) => idx);

			// Select a random non-empty line
			const randomIndex = nonEmptyLineIndices[
				Math.floor(Math.random() * nonEmptyLineIndices.length)
			];

			return {
				problem,
				lines,
				hiddenLineIndex: randomIndex,
				hiddenLineContent: lines[randomIndex]
			};
		});

		userAnswers = {};
		currentProblemIndex = 0;
		quizState = 'playing';
	}

	function updateAnswer(problemId: string, answer: string) {
		userAnswers[problemId] = answer;
	}

	function nextProblem() {
		if (currentProblemIndex < selectedProblems.length - 1) {
			currentProblemIndex++;
		}
	}

	function previousProblem() {
		if (currentProblemIndex > 0) {
			currentProblemIndex--;
		}
	}

	async function submitQuiz() {
		let correct = 0;

		selectedProblems.forEach(({ problem, hiddenLineContent }) => {
			const userAnswer = (userAnswers[problem.id] || '').trim();
			const correctAnswer = hiddenLineContent.trim();

			if (userAnswer === correctAnswer) {
				correct++;
			}
		});

		score = correct;
		totalQuestions = selectedProblems.length;

		// Save to Firebase
		try {
			await addDoc(collection(db, 'codinginterview-code-quiz-attempts'), {
				score: correct,
				total: totalQuestions,
				percentage: (correct / totalQuestions) * 100,
				problems: selectedProblems.map(({ problem, hiddenLineContent }) => ({
					id: problem.id,
					title: problem.title,
					hiddenLine: hiddenLineContent,
					userCodeAnswer: userAnswers[problem.id] || ''
				})),
				timestamp: serverTimestamp()
			});
		} catch (error) {
			console.error('Error saving quiz results:', error);
		}

		quizState = 'results';
	}

	function restartQuiz() {
		quizState = 'start';
		selectedProblems = [];
		userAnswers = {};
		score = 0;
		totalQuestions = 0;
		currentProblemIndex = 0;
	}

	$effect(() => {
		const current = selectedProblems[currentProblemIndex];
		if (current && quizState === 'playing') {
			// Auto-scroll to top when changing problems
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});
</script>

{#if loading}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600">Loading problems...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 py-8">
		<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Start Screen -->
			{#if quizState === 'start'}
				<div class="bg-white rounded-lg shadow-lg p-8 text-center">
					<h1 class="text-4xl font-bold mb-4">Code Completion Quiz</h1>
					<p class="text-gray-600 mb-8">
						Fill in the missing line of code. You'll see most of the solution with one line hidden.
					</p>
					<p class="text-sm text-gray-500 mb-8">
						{problems.length} problems available
					</p>
					<button
						onclick={startQuiz}
						disabled={problems.length === 0}
						class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300"
					>
						Start Quiz
					</button>
				</div>
			{/if}

			<!-- Playing Screen -->
			{#if quizState === 'playing' && selectedProblems.length > 0}
				{@const current = selectedProblems[currentProblemIndex]}
				<div class="bg-white rounded-lg shadow-lg overflow-hidden">
					<!-- Progress bar -->
					<div class="bg-gray-100 px-6 py-4 border-b">
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-semibold text-gray-700">
								Question {currentProblemIndex + 1} of {selectedProblems.length}
							</span>
							<span class="text-sm text-gray-600">
								{Math.round(((currentProblemIndex + 1) / selectedProblems.length) * 100)}% Complete
							</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div
								class="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style="width: {((currentProblemIndex + 1) / selectedProblems.length) * 100}%"
							></div>
						</div>
					</div>

					<!-- Problem content -->
					<div class="p-6">
						<h2 class="text-2xl font-bold mb-4">{current.problem.title}</h2>
						<p class="text-gray-700 mb-6">{current.problem.description}</p>

						{#if current.problem.implementation}
							<div class="mb-4">
								<p class="text-sm text-gray-600 mb-2">
									{current.problem.implementation.complexity}
								</p>
								{#if current.problem.implementation.notes}
									<p class="text-sm text-blue-600 italic mb-4">
										{current.problem.implementation.notes}
									</p>
								{/if}
							</div>
						{/if}

						<div class="bg-gray-50 rounded-lg p-4 mb-6">
							<h3 class="text-lg font-semibold mb-3">Fill in the missing line:</h3>
							<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">{#each current.lines as line, idx}{#if idx === current.hiddenLineIndex}<span class="block bg-yellow-400/20 border-l-4 border-yellow-400 pl-2 py-1">
{'  '.repeat(line.search(/\S|$/))}<span class="text-yellow-400">{'_'.repeat(Math.max(20, line.trim().length))}</span>
</span>{:else}{line}
{/if}{/each}</pre>
						</div>

						<!-- Answer input -->
						<div class="mb-6">
							<label for="answer" class="block text-sm font-semibold text-gray-700 mb-2">
								Your answer:
							</label>
							<input
								type="text"
								id="answer"
								value={userAnswers[current.problem.id] || ''}
								oninput={(e) => updateAnswer(current.problem.id, e.currentTarget.value)}
								placeholder="Type the missing line of code..."
								class="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<p class="text-xs text-gray-500 mt-2">
								Tip: Include exact spacing/indentation and punctuation
							</p>
						</div>

						<!-- Navigation buttons -->
						<div class="flex items-center justify-between">
							<button
								onclick={previousProblem}
								disabled={currentProblemIndex === 0}
								class="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>

							{#if currentProblemIndex === selectedProblems.length - 1}
								<button
									onclick={submitQuiz}
									class="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
								>
									Submit Quiz
								</button>
							{:else}
								<button
									onclick={nextProblem}
									class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
								>
									Next
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Results Screen -->
			{#if quizState === 'results'}
				<div class="bg-white rounded-lg shadow-lg p-8">
					<h1 class="text-4xl font-bold mb-4 text-center">Quiz Complete!</h1>
					<div class="text-center mb-8">
						<p class="text-6xl font-bold mb-2" class:text-green-600={score === totalQuestions} class:text-blue-600={score >= totalQuestions * 0.7 && score < totalQuestions} class:text-orange-600={score < totalQuestions * 0.7}>
							{score} / {totalQuestions}
						</p>
						<p class="text-xl text-gray-600">
							{Math.round((score / totalQuestions) * 100)}% Correct
						</p>
					</div>

					<!-- Review section -->
					<div class="border-t pt-6">
						<h2 class="text-2xl font-bold mb-4">Review</h2>
						<div class="space-y-6">
							{#each selectedProblems as { problem, hiddenLineContent, lines, hiddenLineIndex }}
								{@const userAnswer = (userAnswers[problem.id] || '').trim()}
								{@const correctAnswer = hiddenLineContent.trim()}
								{@const isCorrect = userAnswer === correctAnswer}

								<div class="border rounded-lg p-4" class:border-green-300={isCorrect} class:bg-green-50={isCorrect} class:border-red-300={!isCorrect} class:bg-red-50={!isCorrect}>
									<div class="flex items-start justify-between mb-2">
										<h3 class="font-semibold text-lg">{problem.title}</h3>
										<span class="text-2xl">{isCorrect ? '✓' : '✗'}</span>
									</div>

									<div class="space-y-3 text-sm">
										<div>
											<p class="font-semibold text-gray-700">Your answer:</p>
											<pre class="bg-white border rounded px-3 py-2 font-mono overflow-x-auto" class:border-green-400={isCorrect} class:border-red-400={!isCorrect}>{userAnswer || '(no answer)'}</pre>
										</div>

										{#if !isCorrect}
											<div>
												<p class="font-semibold text-gray-700">Correct answer:</p>
												<pre class="bg-white border border-green-400 rounded px-3 py-2 font-mono overflow-x-auto">{correctAnswer}</pre>
											</div>
										{/if}

										<!-- Show full code for reference -->
										<details class="mt-2">
											<summary class="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold">
												View full solution
											</summary>
											<pre class="mt-2 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">{lines.join('\n')}</pre>
										</details>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Action buttons -->
					<div class="flex justify-center gap-4 mt-8">
						<a
							href="/"
							class="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Back to Dashboard
						</a>
						<button
							onclick={restartQuiz}
							class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Take Another Quiz
						</button>
					</div>
				</div>
			{/if}
		</main>
	</div>
{/if}
