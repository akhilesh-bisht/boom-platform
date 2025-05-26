import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoute from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(bodyParser.json());
// Parse incoming JSON with size limit
app.use(
  express.json({
    limit: "20kb",
  })
);

// Parse URL-encoded payloads
app.use(
  express.urlencoded({
    extended: true,
    limit: "15kb",
  })
);

// Serve static files from /public
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

// routes declarations

app.use("/api/v1/users", userRoute);

export { app };
