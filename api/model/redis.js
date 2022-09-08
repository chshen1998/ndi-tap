import redis from 'redis'

let redisClient = redis.createClient();
redisClient.on("error", (error) => console.error(`Error : ${error}`));
redisClient.connect();

export async function addPendingInfoRequest(requester, irCode) {
  await redisClient.set(irCode, requester)
}

export async function getPendingInfoRequest(irCode) {
  const results = await redisClient.get(irCode)
  return results
}

export async function deletePendingInfoRequest(irCode) {
  await redisClient.del(irCode)
}