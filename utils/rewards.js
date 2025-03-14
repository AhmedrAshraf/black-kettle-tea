// Rewards service
const userRewards = new Map();

export const getRewards = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rewards = userRewards.get(userId) || { punches: 0 };
      resolve(rewards);
    }, 300);
  });
};

export const addPunch = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rewards = userRewards.get(userId) || { punches: 0 };
      rewards.punches = Math.min(rewards.punches + 1, 9);
      userRewards.set(userId, rewards);
      resolve(rewards);
    }, 300);
  });
};

export const redeemReward = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let rewards = userRewards.get(userId);
      if (rewards?.punches === 9) {
        rewards.punches = 0;
        userRewards.set(userId, rewards);
        resolve(rewards);
      } else {
        reject(new Error('Not enough punches'));
      }
    }, 300);
  });
};