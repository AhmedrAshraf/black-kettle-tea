// Mock admin service
// In a real app, this would connect to Firebase or Supabase

import { mockUsers } from './auth';
import { getRewards, addPunch } from './rewards';

// Get all users
export const getAllUsers = async () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(async () => {
      // Get users without passwords
      const users = await Promise.all(
        mockUsers.map(async (user) => {
          const { password, ...userWithoutPassword } = user;
          
          // Get rewards for each user
          const rewards = await getRewards(user.id);
          
          return {
            ...userWithoutPassword,
            punches: rewards.punches
          };
        })
      );
      
      resolve(users);
    }, 1000);
  });
};

// Update user rewards
export const updateUserRewards = async (userId, action) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(async () => {
      try {
        let rewards = await getRewards(userId);
        
        switch (action) {
          case 'add':
            if (rewards.punches < 9) {
              rewards.punches += 1;
            }
            break;
          case 'remove':
            if (rewards.punches > 0) {
              rewards.punches -= 1;
            }
            break;
          case 'reset':
            rewards.punches = 0;
            break;
          default:
            reject(new Error('Invalid action'));
            return;
        }
        
        // Update rewards in the mock database
        const rewardsIndex = mockRewards.findIndex(r => r.userId === userId);
        if (rewardsIndex !== -1) {
          mockRewards[rewardsIndex] = rewards;
        }
        
        resolve(rewards);
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

// Mock rewards data (imported from rewards.js in a real app)
const mockRewards = [
  {
    userId: '1',
    punches: 5,
    lastUpdated: '2025-10-15'
  },
  {
    userId: '2',
    punches: 8,
    lastUpdated: '2025-10-18'
  },
  {
    userId: '3',
    punches: 2,
    lastUpdated: '2025-10-10'
  }
];