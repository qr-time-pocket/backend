import cors from "cors";
import express from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { GreetingService } from "./services/GreetingService";

// Import domain controllers
import cookieParser from "cookie-parser";
import academyRouter from "./controllers/academy";
import authRouter from "./controllers/auth";
import groupRouter from "./controllers/group";
import { authMiddleware } from "./middlewares/auth";
// import userRouter from "./controllers/user";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());

// 커스텀 미들웨어 추가
app.use(authMiddleware);

// Mount domain routers with base URLs
app.use("/auth", authRouter);
app.use("/group", groupRouter);
app.use("/academy", academyRouter);
// app.use("/user", userRouter);

app.get("/hello/:name", (req, res) => {
  const greetingService = container.resolve(GreetingService);
  const message = greetingService.sayHello(req.params.name);
  res.send({ message });
});

app.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
  console.log("📋 Available endpoints:");
  console.log("  Auth: /auth/*");
  console.log("  Group: /group/*");
  console.log("  User: /user/*");
  console.log("  Greeting: /hello/:name");
});
