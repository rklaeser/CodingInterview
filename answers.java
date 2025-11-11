

// Sliding Window
// All about getting indexes right
// Time: O(n + k) = O(n)
// Space: O(1)
class Solution {
    public double findMaxAverage(int[] nums, int k) {
        int left = 0;
        int curr = 0;
        
        // Build the initial window of size k
        for (int right = 0; right < k; right++) {
            curr += nums[right];
        }
        
        double ans = curr; // Initialize max sum with the first window

        // Move the window through the list
        for (int right = k; right < nums.length; right++) {
            curr += nums[right];  // Include new element
            curr -= nums[left];    // Remove old element
            left++;                // Move left pointer
            
            ans = Math.max(ans, curr); // Update maximum sum
        }

        return ans / (double) k; // Return maximum average
    }
}

// Sliding Window
// Slide together? Slid right in certain case // Slid left in certain case
class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0, right = 0;
        int zs = 0, len = 0;
        
        while (right < nums.length) {
            // Expand the window
            if (nums[right] == 0) {
                zs++;
            }

            // If more than k zeroes, shrink the window from the left
            while (zs > k) {
                if (nums[left] == 0) {
                    zs--;
                }
                left++;
            }

            // Update the max length of the valid window
            len = Math.max(len, right - left + 1);
            
            right++;
        }
        
        return len;
    }
}


// Prefix Sum
class Solution {
    public int[] runningSum(int[] nums) {
        int[] ans = new int[nums.length];
        ans[0] = nums[0];
        for(int i = 1; i <= nums.length - 1; i++){
            ans[i] = ans[i-1] + nums[i];
        }
        return ans;
    }
}

class Solution {
    public int minStartValue(int[] nums) {
        int[] sums = new int[nums.length];
        sums[0] = nums[0];
        for(int i = 1; i <= nums.length -1; i++){
            sums[i] = sums[i-1]+ nums[i];
        }
        
        int ans = 0; // add the + 1 at the end
        
        for(int i = 0; i <= sums.length -1; i++){
            ans = Math.min(ans, sums[i]);
        }
        
        return -1*ans + 1;
    }
}