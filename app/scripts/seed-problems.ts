import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyCLRGBtd5UdVsm_9bdiYEK-7LYyt0gnAwc",
	authDomain: "codinginterview-f9a20.firebaseapp.com",
	projectId: "codinginterview-f9a20",
	storageBucket: "codinginterview-f9a20.firebasestorage.app",
	messagingSenderId: "264875171841",
	appId: "1:264875171841:web:12d3a929329ea751782000",
	measurementId: "G-6TBTNMWFND"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const problems = [
	// Problems with implementations
	{
		id: 'find-max-average',
		title: 'Find Max Average',
		description: 'You have an array and need to find the maximum average of a subarray of size k.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Sliding Window',
		implementation: {
			complexity: 'Time: O(n + k) = O(n) | Space: O(1)',
			notes: 'All about getting indexes right',
			code: `class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        left = 0
        curr = 0

        # Build the initial window of size k
        for right in range(k):
            curr += nums[right]

        ans = curr  # Initialize max sum with the first window

        # Move the window through the list
        for right in range(k, len(nums)):
            curr += nums[right]  # Include new element
            curr -= nums[left]   # Remove old element
            left += 1            # Move left pointer

            ans = max(ans, curr)  # Update maximum sum

        return ans / k  # Return maximum average`,
			pythonicCode: `class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        # Use sum() for initial window - more Pythonic
        curr = sum(nums[:k])
        ans = curr

        # Enumerate for cleaner iteration
        for i in range(k, len(nums)):
            curr += nums[i] - nums[i - k]
            ans = max(ans, curr)

        return ans / k`,
			pythonicNotes: 'Uses sum() for initial window, eliminates left pointer tracking'
		}
	},
	{
		id: 'longest-ones',
		title: 'Longest Ones',
		description: 'Given a binary array and a number k, find the maximum number of consecutive 1s if you can flip at most k 0s.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Sliding Window',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'Slide together? Slid right in certain case // Slid left in certain case',
			code: `class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        left = 0
        right = 0
        zs = 0
        length = 0

        while right < len(nums):
            # Expand the window
            if nums[right] == 0:
                zs += 1

            # If more than k zeroes, shrink the window from the left
            while zs > k:
                if nums[left] == 0:
                    zs -= 1
                left += 1

            # Update the max length of the valid window
            length = max(length, right - left + 1)

            right += 1

        return length`,
			pythonicCode: `class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        left = 0
        zeros = 0

        # Enumerate provides cleaner (index, value) pairs
        for right, num in enumerate(nums):
            if num == 0:
                zeros += 1

            # Shrink window if too many zeros
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1

        # Return window size directly
        return right - left + 1 if nums else 0`,
			pythonicNotes: 'Uses enumerate() instead of manual index tracking, better variable naming'
		}
	},
	{
		id: 'running-sum',
		title: 'Running Sum',
		description: 'Given an array, return the running sum (prefix sum) of the array.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Prefix Sum',
		implementation: {
			complexity: 'Time: O(n) | Space: O(n)',
			notes: '',
			code: `class Solution:
    def runningSum(self, nums: list[int]) -> list[int]:
        ans = [0] * len(nums)
        ans[0] = nums[0]
        for i in range(1, len(nums)):
            ans[i] = ans[i-1] + nums[i]
        return ans`,
			pythonicCode: `from itertools import accumulate

class Solution:
    def runningSum(self, nums: list[int]) -> list[int]:
        # itertools.accumulate is the Pythonic way for running sums
        return list(accumulate(nums))`,
			pythonicNotes: 'Uses itertools.accumulate() - the standard library solution for prefix sums'
		}
	},
	{
		id: 'min-start-value',
		title: 'Min Start Value',
		description: 'Given an array of integers, find the minimum positive starting value such that the step-by-step sum is never less than 1.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Prefix Sum',
		implementation: {
			complexity: 'Time: O(n) | Space: O(n)',
			notes: '',
			code: `class Solution:
    def minStartValue(self, nums: list[int]) -> int:
        sums = [0] * len(nums)
        sums[0] = nums[0]
        for i in range(1, len(nums)):
            sums[i] = sums[i-1] + nums[i]

        ans = 0  # add the + 1 at the end

        for i in range(len(sums)):
            ans = min(ans, sums[i])

        return -1 * ans + 1`,
			pythonicCode: `from itertools import accumulate

class Solution:
    def minStartValue(self, nums: list[int]) -> int:
        # Use accumulate and min with generator expression
        min_sum = min(accumulate(nums))
        return max(1, 1 - min_sum)`,
			pythonicNotes: 'Uses accumulate() and combines loops into single expression'
		}
	},

	// Quiz problems with implementations
	{
		id: 'stock-profit',
		title: 'Best Time to Buy and Sell Stock',
		description: 'Find the maximum profit from buying and selling stock once. You must buy before you sell.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Two Pointers',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'Track the minimum price seen so far and calculate profit at each step. Update max profit when we find a better deal.',
			code: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0

        for price in prices:
            # Update minimum price if current price is lower
            min_price = min(min_price, price)

            # Calculate profit if we sold at current price
            profit = price - min_price

            # Update max profit if current profit is higher
            max_profit = max(max_profit, profit)

        return max_profit`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'longest-substring',
		title: 'Longest Substring Without Repeating Characters',
		description: 'Find the length of the longest substring without repeating characters.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Sliding Window',
		implementation: {
			complexity: 'Time: O(n) | Space: O(min(n, m)) where m is charset size',
			notes: 'Use sliding window with a set to track characters. Shrink window when duplicate found.',
			code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_length = 0

        for right in range(len(s)):
            # Shrink window while we have duplicates
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1

            # Add current character to set
            char_set.add(s[right])

            # Update max length
            max_length = max(max_length, right - left + 1)

        return max_length`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'three-sum',
		title: 'Three Sum',
		description: 'Find all unique triplets that sum to zero. The solution set must not contain duplicate triplets.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Two Pointers (after sorting)',
		implementation: {
			complexity: 'Time: O(n²) | Space: O(1) excluding output',
			notes: 'Sort first, then fix one number and use two pointers for the remaining two. Skip duplicates to avoid duplicate triplets.',
			code: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []

        for i in range(len(nums) - 2):
            # Skip duplicate values for first number
            if i > 0 and nums[i] == nums[i - 1]:
                continue

            left = i + 1
            right = len(nums) - 1

            while left < right:
                total = nums[i] + nums[left] + nums[right]

                if total == 0:
                    result.append([nums[i], nums[left], nums[right]])

                    # Skip duplicates for second number
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # Skip duplicates for third number
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1

                    left += 1
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1

        return result`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'min-window',
		title: 'Minimum Window Substring',
		description: 'Return the minimum window substring of s that contains all characters of t.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Sliding Window',
		implementation: {
			complexity: 'Time: O(n + m) | Space: O(m) where n=len(s), m=len(t)',
			notes: 'Use two hash maps to track character counts. Expand window until valid, then contract to find minimum. Track the smallest valid window.',
			code: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not t or not s:
            return ""

        # Count characters needed
        target_count = {}
        for char in t:
            target_count[char] = target_count.get(char, 0) + 1

        required = len(target_count)  # Unique characters needed
        formed = 0  # Unique characters formed with desired frequency
        window_counts = {}

        left = 0
        min_len = float('inf')
        min_left = 0

        for right in range(len(s)):
            char = s[right]
            window_counts[char] = window_counts.get(char, 0) + 1

            # Check if frequency matches
            if char in target_count and window_counts[char] == target_count[char]:
                formed += 1

            # Try to contract window
            while left <= right and formed == required:
                # Update result if this window is smaller
                if right - left + 1 < min_len:
                    min_len = right - left + 1
                    min_left = left

                # Remove leftmost character
                char = s[left]
                window_counts[char] -= 1
                if char in target_count and window_counts[char] < target_count[char]:
                    formed -= 1

                left += 1

        return "" if min_len == float('inf') else s[min_left:min_left + min_len]`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'merge-intervals',
		title: 'Merge Intervals',
		description: 'Merge all overlapping intervals.',
		categories: ['Array/String Manipulation', 'Sorting & Searching'],
		subcategory: 'Sorting + Iteration',
		implementation: {
			complexity: 'Time: O(n log n) | Space: O(n) for output',
			notes: 'Sort intervals by start time. Iterate and merge overlapping intervals by comparing current start with previous end.',
			code: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        if not intervals:
            return []

        # Sort by start time
        intervals.sort(key=lambda x: x[0])

        merged = [intervals[0]]

        for current in intervals[1:]:
            last = merged[-1]

            # Check if current overlaps with last merged interval
            if current[0] <= last[1]:
                # Merge by extending the end time
                last[1] = max(last[1], current[1])
            else:
                # No overlap, add as new interval
                merged.append(current)

        return merged`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'single-number',
		title: 'Single Number',
		description: 'Find the single element that appears only once when all others appear twice. Must use linear time and constant extra space.',
		categories: ['Array/String Manipulation'],
		subcategory: 'Bit Manipulation',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'XOR has the property that a ^ a = 0 and a ^ 0 = a. XORing all numbers cancels out duplicates, leaving only the single number.',
			code: `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0

        for num in nums:
            result ^= num

        return result`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'group-anagrams',
		title: 'Group Anagrams',
		description: 'Group words that are anagrams of each other together.',
		categories: ['Hash Tables/Sets'],
		implementation: {
			complexity: 'Time: O(n * k log k) | Space: O(n * k) where n=words, k=avg word length',
			notes: 'Use sorted string as hash key. All anagrams will have the same sorted representation.',
			code: `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        anagrams = {}

        for word in strs:
            # Sort the word to get the key
            key = ''.join(sorted(word))

            # Add word to the list for this key
            if key not in anagrams:
                anagrams[key] = []
            anagrams[key].append(word)

        # Return all grouped anagrams
        return list(anagrams.values())`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'top-k-frequent',
		title: 'Top K Frequent Elements',
		description: 'Return the k most frequent elements.',
		categories: ['Hash Tables/Sets'],
		subcategory: 'Hash Table + Heap/Sorting',
		implementation: {
			complexity: 'Time: O(n log k) with heap | Space: O(n)',
			notes: 'Count frequencies with hash map, then use min heap of size k to track k most frequent elements.',
			code: `import heapq

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        # Count frequencies
        count = {}
        for num in nums:
            count[num] = count.get(num, 0) + 1

        # Use heap to find k most frequent
        # Python heapq is min heap, so negate frequencies
        heap = []
        for num, freq in count.items():
            heapq.heappush(heap, (-freq, num))

        # Extract k most frequent
        result = []
        for _ in range(k):
            freq, num = heapq.heappop(heap)
            result.append(num)

        return result`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'binary-search-range',
		title: 'Find First and Last Position',
		description: 'Find starting and ending position of target in sorted array. Must run in O(log n) time.',
		categories: ['Sorting & Searching'],
		subcategory: 'Binary Search',
		implementation: {
			complexity: 'Time: O(log n) | Space: O(1)',
			notes: 'Perform two binary searches: one to find leftmost occurrence, another for rightmost. Adjust boundaries based on whether we want first or last position.',
			code: `class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        def findFirst(nums, target):
            left, right = 0, len(nums) - 1
            result = -1

            while left <= right:
                mid = (left + right) // 2

                if nums[mid] == target:
                    result = mid
                    right = mid - 1  # Continue searching left
                elif nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid - 1

            return result

        def findLast(nums, target):
            left, right = 0, len(nums) - 1
            result = -1

            while left <= right:
                mid = (left + right) // 2

                if nums[mid] == target:
                    result = mid
                    left = mid + 1  # Continue searching right
                elif nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid - 1

            return result

        first = findFirst(nums, target)
        last = findLast(nums, target)

        return [first, last]`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'level-order',
		title: 'Binary Tree Level Order Traversal',
		description: 'Return the level order traversal of a binary tree (nodes at each depth grouped together).',
		categories: ['Trees & Graphs'],
		subcategory: 'BFS (Breadth-First Search)',
		implementation: {
			complexity: 'Time: O(n) | Space: O(n)',
			notes: 'Use BFS with a queue. Process nodes level by level, tracking the size of each level.',
			code: `from collections import deque

class Solution:
    def levelOrder(self, root) -> list[list[int]]:
        if not root:
            return []

        result = []
        queue = deque([root])

        while queue:
            level_size = len(queue)
            level = []

            # Process all nodes at current level
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)

                # Add children for next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(level)

        return result`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'num-islands',
		title: 'Number of Islands',
		description: 'Count the number of islands (groups of connected land cells) in a grid.',
		categories: ['Trees & Graphs'],
		subcategory: 'DFS (Depth-First Search)',
		implementation: {
			complexity: 'Time: O(m * n) | Space: O(m * n) for recursion',
			notes: 'Use DFS to mark all connected land cells. Each DFS call explores one complete island. Count number of DFS calls needed.',
			code: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0

        rows, cols = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            # Base cases: out of bounds or water
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
                return

            # Mark as visited by changing to water
            grid[r][c] = '0'

            # Explore all 4 directions
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    dfs(r, c)
                    count += 1

        return count`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'max-path-sum',
		title: 'Binary Tree Maximum Path Sum',
		description: 'Find the maximum path sum in a binary tree. A path can start and end at any node.',
		categories: ['Trees & Graphs'],
		subcategory: 'DFS (Depth-First Search)',
		implementation: {
			complexity: 'Time: O(n) | Space: O(h) where h is tree height',
			notes: 'Use DFS with global max variable. At each node, compute max path through that node. Return max single-branch path to parent.',
			code: `class Solution:
    def maxPathSum(self, root) -> int:
        max_sum = float('-inf')

        def dfs(node):
            nonlocal max_sum

            if not node:
                return 0

            # Get max path from left and right (ignore negative paths)
            left = max(0, dfs(node.left))
            right = max(0, dfs(node.right))

            # Max path through this node
            path_through_node = node.val + left + right

            # Update global max
            max_sum = max(max_sum, path_through_node)

            # Return max single-branch path
            return node.val + max(left, right)

        dfs(root)
        return max_sum`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'word-search',
		title: 'Word Search',
		description: 'Find if a word exists in a 2D board grid using sequentially adjacent cells. The same cell cannot be used more than once.',
		categories: ['Trees & Graphs', 'Recursion & Backtracking'],
		subcategory: 'DFS + Backtracking',
		implementation: {
			complexity: 'Time: O(m * n * 4^L) | Space: O(L) where L is word length',
			notes: 'Use DFS with backtracking. Try each cell as starting point, mark visited cells, and backtrack after exploring.',
			code: `class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r, c, index):
            # Found complete word
            if index == len(word):
                return True

            # Out of bounds or wrong character
            if (r < 0 or r >= rows or c < 0 or c >= cols or
                board[r][c] != word[index]):
                return False

            # Mark as visited
            temp = board[r][c]
            board[r][c] = '#'

            # Explore all 4 directions
            found = (dfs(r + 1, c, index + 1) or
                    dfs(r - 1, c, index + 1) or
                    dfs(r, c + 1, index + 1) or
                    dfs(r, c - 1, index + 1))

            # Backtrack: restore cell
            board[r][c] = temp

            return found

        # Try each cell as starting point
        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True

        return False`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'climbing-stairs',
		title: 'Climbing Stairs',
		description: 'How many distinct ways can you climb n stairs if you can climb 1 or 2 steps at a time?',
		categories: ['Dynamic Programming'],
		subcategory: 'Counting Ways',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'This is the Fibonacci sequence. At each step, the number of ways equals the sum of ways to reach the previous two steps.',
			code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n

        # Keep track of last two values
        prev2 = 1  # Ways to reach step 1
        prev1 = 2  # Ways to reach step 2

        for i in range(3, n + 1):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current

        return prev1`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'house-robber',
		title: 'House Robber',
		description: 'Find the maximum amount of money you can rob from houses when you cannot rob two adjacent houses.',
		categories: ['Dynamic Programming'],
		subcategory: 'Optimization with Constraints',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'At each house, choose max of: rob current house + max from two houses back, or skip current house and take max from previous house.',
			code: `class Solution:
    def rob(self, nums: list[int]) -> int:
        if not nums:
            return 0
        if len(nums) == 1:
            return nums[0]

        # Keep track of max at previous two positions
        prev2 = nums[0]
        prev1 = max(nums[0], nums[1])

        for i in range(2, len(nums)):
            current = max(prev1, prev2 + nums[i])
            prev2 = prev1
            prev1 = current

        return prev1`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'combination-sum',
		title: 'Combination Sum',
		description: 'Find all unique combinations of candidates that sum to target. The same number may be chosen unlimited times.',
		categories: ['Recursion & Backtracking'],
		subcategory: 'Find All Combinations',
		implementation: {
			complexity: 'Time: O(n^(target/min)) | Space: O(target/min)',
			notes: 'Use backtracking to explore all combinations. Start from each candidate and recursively try adding it again or move to next candidate.',
			code: `class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []

        def backtrack(start, current, remaining):
            # Found valid combination
            if remaining == 0:
                result.append(current[:])
                return

            # Exceeded target
            if remaining < 0:
                return

            # Try each candidate starting from 'start' index
            for i in range(start, len(candidates)):
                current.append(candidates[i])
                # Can reuse same element, so pass 'i' not 'i+1'
                backtrack(i, current, remaining - candidates[i])
                current.pop()  # Backtrack

        backtrack(0, [], target)
        return result`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'reverse-linked-list',
		title: 'Reverse Linked List',
		description: 'Reverse a linked list in-place and return the new head.',
		categories: ['Linked Lists'],
		subcategory: 'Pointer Manipulation',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: 'Use three pointers: prev, current, and next. Iteratively reverse each link by pointing current.next to prev.',
			code: `class Solution:
    def reverseList(self, head):
        prev = None
        current = head

        while current:
            # Save next node
            next_node = current.next

            # Reverse the link
            current.next = prev

            # Move pointers forward
            prev = current
            current = next_node

        return prev`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'linked-list-cycle',
		title: 'Linked List Cycle',
		description: 'Determine if a linked list has a cycle.',
		categories: ['Linked Lists'],
		subcategory: 'Two Pointer (Fast/Slow)',
		implementation: {
			complexity: 'Time: O(n) | Space: O(1)',
			notes: "Floyd's cycle detection algorithm. Use two pointers: slow moves one step, fast moves two steps. If they meet, there's a cycle.",
			code: `class Solution:
    def hasCycle(self, head) -> bool:
        if not head or not head.next:
            return False

        slow = head
        fast = head.next

        while slow != fast:
            # If fast reaches end, no cycle
            if not fast or not fast.next:
                return False

            slow = slow.next
            fast = fast.next.next

        return True`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'valid-parentheses',
		title: 'Valid Parentheses',
		description: 'Determine if a string of brackets is valid (all brackets properly closed and nested).',
		categories: ['Stack & Queue'],
		subcategory: 'Matching/Balancing',
		implementation: {
			complexity: 'Time: O(n) | Space: O(n)',
			notes: 'Use stack to track opening brackets. When closing bracket found, check if it matches top of stack. Stack must be empty at end.',
			code: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}

        for char in s:
            if char in mapping:
                # Closing bracket
                if not stack or stack[-1] != mapping[char]:
                    return False
                stack.pop()
            else:
                # Opening bracket
                stack.append(char)

        return len(stack) == 0`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	},
	{
		id: 'random-data-structure',
		title: 'Insert Delete GetRandom O(1)',
		description: 'Design a data structure supporting insert, delete, and getRandom all in O(1) average time.',
		categories: ['Design Problems'],
		subcategory: 'Multiple Data Structures',
		implementation: {
			complexity: 'Time: O(1) average for all operations | Space: O(n)',
			notes: 'Use array for random access and hash map for O(1) lookup. For delete, swap element with last element then pop.',
			code: `import random

class RandomizedSet:
    def __init__(self):
        self.data = []  # Store values
        self.index_map = {}  # Map value to index

    def insert(self, val: int) -> bool:
        if val in self.index_map:
            return False

        self.data.append(val)
        self.index_map[val] = len(self.data) - 1
        return True

    def remove(self, val: int) -> bool:
        if val not in self.index_map:
            return False

        # Get index of element to remove
        index = self.index_map[val]
        last_element = self.data[-1]

        # Swap with last element
        self.data[index] = last_element
        self.index_map[last_element] = index

        # Remove last element
        self.data.pop()
        del self.index_map[val]

        return True

    def getRandom(self) -> int:
        return random.choice(self.data)`,
			pythonicCode: '',
			pythonicNotes: ''
		}
	}
];

async function seedProblems() {
	console.log('Starting to seed problems...');

	for (const problem of problems) {
		try {
			await setDoc(doc(db, 'codinginterview-problems', problem.id), problem);
			console.log(`✓ Added: ${problem.title}`);
		} catch (error) {
			console.error(`✗ Error adding ${problem.title}:`, error);
		}
	}

	console.log(`\nDone! Seeded ${problems.length} problems.`);
	process.exit(0);
}

seedProblems();
