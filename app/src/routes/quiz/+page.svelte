<script lang="ts">
	import { db, auth, googleProvider } from '$lib/firebase';
	import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
	import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import type { User } from 'firebase/auth';
	import type { Problem } from '$lib/types/problem';

	let currentUser = $state<User | null>(null);
	let authLoading = $state(true);
	let problemsLoading = $state(true);
	const AUTHORIZED_EMAIL = 'reed.klaeser@gmail.com';

	// Problem pool loaded from Firestore
	let problemPool = $state<Array<{
		id: string;
		title: string;
		description: string;
		correctCategories: string[];
	}>>([]);

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			currentUser = user;
			authLoading = false;
		});

		// Load problems from Firestore
		getDocs(collection(db, 'codinginterview-problems'))
			.then(querySnapshot => {
				problemPool = querySnapshot.docs.map(doc => {
					const data = doc.data() as Problem;
					return {
						id: doc.id,
						title: data.title,
						description: data.description,
						correctCategories: data.categories
					};
				});
			})
			.catch(error => {
				console.error('Error fetching problems:', error);
			})
			.finally(() => {
				problemsLoading = false;
			});

		return () => unsubscribe();
	});

	$effect(() => {
		if (currentUser && currentUser.email !== AUTHORIZED_EMAIL) {
			alert('Access denied. This quiz is only available to authorized users.');
			handleSignOut();
		}
	});

	async function handleGoogleSignIn() {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (error) {
			console.error('Error signing in:', error);
			alert('Failed to sign in. Please try again.');
		}
	}

	async function handleSignOut() {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}

	const categories = [
		'Array/String Manipulation',
		'Hash Tables/Sets',
		'Sorting & Searching',
		'Trees & Graphs',
		'Dynamic Programming',
		'Recursion & Backtracking',
		'Linked Lists',
		'Stack & Queue',
		'Design Problems'
	];

	let quizState = $state<'start' | 'playing' | 'results'>('start');
	let selectedProblems = $state<typeof problemPool>([]);
	let userAnswers = $state<Record<string, string[]>>({});
	let currentProblemIndex = $state(0);
	let score = $state(0);
	let totalQuestions = $state(0);

	function startQuiz() {
		// Select 3 random problems
		const shuffled = [...problemPool].sort(() => Math.random() - 0.5);
		selectedProblems = shuffled.slice(0, 3);

		// Initialize user answers
		userAnswers = {};
		selectedProblems.forEach(p => {
			userAnswers[p.id] = [];
		});

		currentProblemIndex = 0;
		quizState = 'playing';
	}

	function toggleCategory(problemId: string, category: string) {
		const current = userAnswers[problemId] || [];
		if (current.includes(category)) {
			userAnswers[problemId] = current.filter(c => c !== category);
		} else {
			userAnswers[problemId] = [...current, category];
		}
	}

	async function submitQuiz() {
		// Calculate score
		let correct = 0;
		let total = 0;

		selectedProblems.forEach(problem => {
			const userAnswer = userAnswers[problem.id] || [];
			const correctAnswer = problem.correctCategories;

			// Check if arrays are equal (order doesn't matter)
			const userSorted = [...userAnswer].sort();
			const correctSorted = [...correctAnswer].sort();

			if (
				userSorted.length === correctSorted.length &&
				userSorted.every((val, idx) => val === correctSorted[idx])
			) {
				correct++;
			}
			total++;
		});

		score = correct;
		totalQuestions = total;

		// Save to Firebase
		try {
			await addDoc(collection(db, 'codinginterview-quiz-attempts'), {
				score: correct,
				total: total,
				percentage: (correct / total) * 100,
				problems: selectedProblems.map(p => ({
					id: p.id,
					title: p.title,
					correctCategories: p.correctCategories,
					userAnswer: userAnswers[p.id] || []
				})),
				timestamp: serverTimestamp()
			});
		} catch (error) {
			console.error('Error saving quiz attempt:', error);
		}

		quizState = 'results';
	}

	function restartQuiz() {
		startQuiz();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if authLoading || problemsLoading}
			<!-- Loading State -->
			<div class="bg-white rounded-lg shadow-lg p-8 text-center">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
				<p class="text-gray-600 mt-4">Loading...</p>
			</div>
		{:else if !currentUser}
			<!-- Login Screen -->
			<div class="bg-white rounded-lg shadow-lg p-8 text-center">
				<div class="mb-6">
					<svg class="w-20 h-20 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h1 class="text-3xl font-bold mb-4">Sign In Required</h1>
				<p class="text-gray-600 mb-8">
					This is Reed's personal coding interview practice app. Please sign in with an authorized account to access the quiz.
				</p>
				<button
					onclick={handleGoogleSignIn}
					class="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
				>
					<svg class="w-6 h-6" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Sign in with Google
				</button>
				<p class="text-sm text-gray-500 mt-6">
					<a href="/" class="text-blue-600 hover:underline">View Dashboard</a> or
					<a href="/classification" class="text-blue-600 hover:underline ml-1">Browse Problems</a>
				</p>
			</div>
		{:else}
			<!-- Signed In - Show Quiz -->
			<div class="mb-4 flex justify-end">
				<button
					onclick={handleSignOut}
					class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
				>
					Sign Out ({currentUser.email})
				</button>
			</div>

		{#if quizState === 'start'}
			<!-- Start Screen -->
			<div class="bg-white rounded-lg shadow-lg p-8 text-center">
				<h1 class="text-4xl font-bold mb-4">Reed's Problem Pattern Quiz</h1>
				<p class="text-gray-600 mb-8">
					Test your knowledge, Reed! You'll be given 3 random problems, and you need to classify each one into the correct category or categories.
				</p>
				<button
					onclick={startQuiz}
					class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
				>
					Start Quiz
				</button>
			</div>

		{:else if quizState === 'playing'}
			<!-- Quiz Screen -->
			<div class="mb-6">
				<div class="flex items-center justify-between mb-2">
					<h1 class="text-2xl font-bold">Problem Pattern Quiz</h1>
					<span class="text-gray-600">Question {currentProblemIndex + 1} of {selectedProblems.length}</span>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div
						class="bg-blue-600 h-2 rounded-full transition-all"
						style="width: {((currentProblemIndex + 1) / selectedProblems.length) * 100}%"
					></div>
				</div>
			</div>

			{#each selectedProblems as problem, idx}
				{#if idx === currentProblemIndex}
					<div class="bg-white rounded-lg shadow-lg p-8">
						<h2 class="text-2xl font-bold mb-4">{problem.title}</h2>
						<p class="text-gray-700 mb-6">{problem.description}</p>

						<div class="mb-8">
							<p class="font-semibold mb-3">Select all categories that apply:</p>
							<div class="space-y-2">
								{#each categories as category}
									<label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors {userAnswers[problem.id]?.includes(category) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}">
										<input
											type="checkbox"
											checked={userAnswers[problem.id]?.includes(category)}
											onchange={() => toggleCategory(problem.id, category)}
											class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
										/>
										<span class="ml-3 text-gray-900">{category}</span>
									</label>
								{/each}
							</div>
						</div>

						<div class="flex justify-between">
							<button
								onclick={() => currentProblemIndex--}
								disabled={currentProblemIndex === 0}
								class="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>

							{#if currentProblemIndex === selectedProblems.length - 1}
								<button
									onclick={submitQuiz}
									class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
								>
									Submit Quiz
								</button>
							{:else}
								<button
									onclick={() => currentProblemIndex++}
									class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
								>
									Next
								</button>
							{/if}
						</div>
					</div>
				{/if}
			{/each}

		{:else if quizState === 'results'}
			<!-- Results Screen -->
			<div class="bg-white rounded-lg shadow-lg p-8">
				<div class="text-center mb-8">
					<h1 class="text-4xl font-bold mb-4">Quiz Complete!</h1>
					<div class="text-6xl font-bold mb-2 {score === totalQuestions ? 'text-green-600' : score >= totalQuestions / 2 ? 'text-blue-600' : 'text-orange-600'}">
						{score} / {totalQuestions}
					</div>
					<p class="text-xl text-gray-600">
						{score === totalQuestions ? 'Perfect! 🎉' : score >= totalQuestions / 2 ? 'Good job! 👍' : 'Keep practicing! 💪'}
					</p>
				</div>

				<div class="mb-8">
					<h2 class="text-xl font-bold mb-4">Review Your Answers</h2>
					<div class="space-y-4">
						{#each selectedProblems as problem}
							{@const userAnswer = userAnswers[problem.id] || []}
							{@const correctAnswer = problem.correctCategories}
							{@const isCorrect = [...userAnswer].sort().join(',') === [...correctAnswer].sort().join(',')}

							<div class="border rounded-lg p-4 {isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}">
								<div class="flex items-start justify-between mb-2">
									<h3 class="font-semibold">{problem.title}</h3>
									<span class="text-2xl">{isCorrect ? '✓' : '✗'}</span>
								</div>
								<p class="text-sm text-gray-600 mb-3">{problem.description}</p>

								<div class="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p class="font-semibold mb-1">Your answer:</p>
										{#if userAnswer.length > 0}
											<ul class="list-disc list-inside">
												{#each userAnswer as cat}
													<li class={correctAnswer.includes(cat) ? 'text-green-700' : 'text-red-700'}>{cat}</li>
												{/each}
											</ul>
										{:else}
											<p class="text-gray-500 italic">No answer selected</p>
										{/if}
									</div>
									<div>
										<p class="font-semibold mb-1">Correct answer:</p>
										<ul class="list-disc list-inside text-green-700">
											{#each correctAnswer as cat}
												<li>{cat}</li>
											{/each}
										</ul>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="flex justify-center gap-4">
					<button
						onclick={restartQuiz}
						class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
					>
						Take Another Quiz
					</button>
					<a
						href="/classification"
						class="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
					>
						Back to Learn
					</a>
				</div>
			</div>
		{/if}
		{/if}
	</main>
</div>
