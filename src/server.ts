import fastify from "fastify";
import { env } from "./env";
import { userRoute } from "./routes/userRoute";
import { snakRoute } from "./routes/snakRoute";

const app = fastify()

app.get('/hello', () => {
  return 'hello'
})

app.register(userRoute, {
  prefix: '/user'
})

app.register(snakRoute, {
  prefix: '/snak'
})

app.listen({
  port: env.PORT
}).then(() => {
  console.log('HTTP Server running in http://localhost:' + env.PORT);
})