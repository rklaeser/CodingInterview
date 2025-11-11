# Sliding Window
# All about getting indexes right
# Time: O(n + k) = O(n)
# Space: O(1)
class Solution:
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

        return ans / k  # Return maximum average


# Sliding Window
# Slide together? Slid right in certain case // Slid left in certain case
class Solution:
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

        return length


# Prefix Sum
class Solution:
    def runningSum(self, nums: list[int]) -> list[int]:
        ans = [0] * len(nums)
        ans[0] = nums[0]
        for i in range(1, len(nums)):
            ans[i] = ans[i-1] + nums[i]
        return ans


class Solution:
    def minStartValue(self, nums: list[int]) -> int:
        sums = [0] * len(nums)
        sums[0] = nums[0]
        for i in range(1, len(nums)):
            sums[i] = sums[i-1] + nums[i]

        ans = 0  # add the + 1 at the end

        for i in range(len(sums)):
            ans = min(ans, sums[i])

        return -1 * ans + 1


# Two Pointers
# Time: O(n) | Space: O(1)
# Track the minimum price seen so far and calculate profit at each step. Update max profit when we find a better deal.
class Solution:
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

        return max_profit


# Sliding Window
# Time: O(n) | Space: O(min(n, m)) where m is charset size
# Use sliding window with a set to track characters. Shrink window when duplicate found.
class Solution:
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

        return max_length


# Two Pointers (after sorting)
# Time: O(n²) | Space: O(1) excluding output
# Sort first, then fix one number and use two pointers for the remaining two. Skip duplicates to avoid duplicate triplets.
class Solution:
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

        return result


# Sliding Window
# Time: O(n + m) | Space: O(m) where n=len(s), m=len(t)
# Use two hash maps to track character counts. Expand window until valid, then contract to find minimum. Track the smallest valid window.
class Solution:
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

        return "" if min_len == float('inf') else s[min_left:min_left + min_len]


# Sorting + Iteration
# Time: O(n log n) | Space: O(n) for output
# Sort intervals by start time. Iterate and merge overlapping intervals by comparing current start with previous end.
class Solution:
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

        return merged


# Bit Manipulation
# Time: O(n) | Space: O(1)
# XOR has the property that a ^ a = 0 and a ^ 0 = a. XORing all numbers cancels out duplicates, leaving only the single number.
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0

        for num in nums:
            result ^= num

        return result


# Hash Tables
# Time: O(n * k log k) | Space: O(n * k) where n=words, k=avg word length
# Use sorted string as hash key. All anagrams will have the same sorted representation.
class Solution:
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
        return list(anagrams.values())


# Hash Table + Heap/Sorting
# Time: O(n log k) with heap | Space: O(n)
# Count frequencies with hash map, then use min heap of size k to track k most frequent elements.
import heapq

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

        return result


# Binary Search
# Time: O(log n) | Space: O(1)
# Perform two binary searches: one to find leftmost occurrence, another for rightmost. Adjust boundaries based on whether we want first or last position.
class Solution:
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

        return [first, last]


# BFS (Breadth-First Search)
# Time: O(n) | Space: O(n)
# Use BFS with a queue. Process nodes level by level, tracking the size of each level.
from collections import deque

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

        return result


# DFS (Depth-First Search)
# Time: O(m * n) | Space: O(m * n) for recursion
# Use DFS to mark all connected land cells. Each DFS call explores one complete island. Count number of DFS calls needed.
class Solution:
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

        return count


# DFS (Depth-First Search)
# Time: O(n) | Space: O(h) where h is tree height
# Use DFS with global max variable. At each node, compute max path through that node. Return max single-branch path to parent.
class Solution:
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
        return max_sum


# DFS + Backtracking
# Time: O(m * n * 4^L) | Space: O(L) where L is word length
# Use DFS with backtracking. Try each cell as starting point, mark visited cells, and backtrack after exploring.
class Solution:
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

        return False


# Dynamic Programming - Counting Ways
# Time: O(n) | Space: O(1)
# This is the Fibonacci sequence. At each step, the number of ways equals the sum of ways to reach the previous two steps.
class Solution:
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

        return prev1


# Dynamic Programming - Optimization with Constraints
# Time: O(n) | Space: O(1)
# At each house, choose max of: rob current house + max from two houses back, or skip current house and take max from previous house.
class Solution:
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

        return prev1


# Recursion & Backtracking
# Time: O(n^(target/min)) | Space: O(target/min)
# Use backtracking to explore all combinations. Start from each candidate and recursively try adding it again or move to next candidate.
class Solution:
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
        return result


# Linked Lists - Pointer Manipulation
# Time: O(n) | Space: O(1)
# Use three pointers: prev, current, and next. Iteratively reverse each link by pointing current.next to prev.
class Solution:
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

        return prev


# Linked Lists - Two Pointer (Fast/Slow)
# Time: O(n) | Space: O(1)
# Floyd's cycle detection algorithm. Use two pointers: slow moves one step, fast moves two steps. If they meet, there's a cycle.
class Solution:
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

        return True


# Stack & Queue - Matching/Balancing
# Time: O(n) | Space: O(n)
# Use stack to track opening brackets. When closing bracket found, check if it matches top of stack. Stack must be empty at end.
class Solution:
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

        return len(stack) == 0


# Design Problems - Multiple Data Structures
# Time: O(1) average for all operations | Space: O(n)
# Use array for random access and hash map for O(1) lookup. For delete, swap element with last element then pop.
import random

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
        return random.choice(self.data)
