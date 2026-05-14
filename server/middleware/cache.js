import redisClient from "../config/redis.js";

export const cache = (keyGenerator, expiry = 300) => {
  return async (req, res, next) => {
    try {

      const key =
        typeof keyGenerator === "function"
          ? keyGenerator(req)
          : keyGenerator;

      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("Cache HIT");

        return res
          .status(200)
          .json(JSON.parse(cachedData));
      }

      console.log("Cache MISS");

      const originalJson = res.json;

      res.json = async (body) => {

        await redisClient.setEx(
          key,
          expiry,
          JSON.stringify(body)
        );

        originalJson.call(res, body);
      };

      next();

    } catch (err) {
      console.log(err);
      next();
    }
  };
};