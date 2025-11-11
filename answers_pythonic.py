# Sliding Window
# All about getting indexes right
# Time: O(n + k) = O(n)
# Space: O(1)
from itertools import accumulate

class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        # Use sum() for initial window - more Pythonic
        curr = sum(nums[:k])
        ans = curr

        # Enumerate for cleaner iteration
        for i in range(k, len(nums)):
            curr += nums[i] - nums[i - k]
            ans = max(ans, curr)

        return ans / k


# Sliding Window
# Slide together? Slid right in certain case // Slid left in certain case
class Solution:
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
        return right - left + 1 if nums else 0


# Prefix Sum
from itertools import accumulate

class Solution:
    def runningSum(self, nums: list[int]) -> list[int]:
        # itertools.accumulate is the Pythonic way for running sums
        return list(accumulate(nums))


# Prefix Sum
from itertools import accumulate

class Solution:
    def minStartValue(self, nums: list[int]) -> int:
        # Use accumulate and min with generator expression
        min_sum = min(accumulate(nums))
        return max(1, 1 - min_sum)
