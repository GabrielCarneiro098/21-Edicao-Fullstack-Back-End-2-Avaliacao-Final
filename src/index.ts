import express from "express";
import cors from "cors";
import { envs } from "./envs";
import { UsuariosRoutes } from "./routes/usuarios.routes";
import { TweetsRoutes } from "./routes/tweets.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { FollowRoutes } from "./routes/follow.routes";
import { LikesRoutes } from "./routes/likes.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API is running",
  });
});

app.use(UsuariosRoutes.bind());
app.use(TweetsRoutes.bind());
app.use(AuthRoutes.bind());
app.use(FollowRoutes.bind());
app.use(LikesRoutes.bind());

app.listen(envs.PORT, () => console.log("Server is running"));
