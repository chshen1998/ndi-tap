import redis from 'redis'

let redisClient = redis.createClient();
redisClient.on("error", (error) => console.error(`Error : ${error}`));
redisClient.connect();

export async function addToCache(irCode, requesterData) {
  try {
    await redisClient.set(irCode, JSON.stringify(requesterData))
  } catch (err) {
    console.log(err)
  }
}

export async function getFromCache(irCode) {
  try {
    const requester = await redisClient.get(irCode)
    return JSON.parse(requester)
  } catch (err) {
    return null
  }
}

export async function deleteFromCache(irCode) {
  await redisClient.del(irCode)
}