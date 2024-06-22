import express, { Request, Response, NextFunction } from "express";
import { Counter, register } from "prom-client";

const app = express();

app.use(express.json());

let counter = new Counter({
  name: "http_number_of_requests",
  help: "Number of Http req made",
  labelNames: ["route", "method", "status_code"],
});

const requestCountMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  counter.inc({
    route: req.path,
    method: req.method,
    status_code: res.statusCode,
  });
  next();
};

app.use(requestCountMiddleware);

app.get("/user", (req, res) => {
  // We can create a middleware instead of doing this in every route

  // counter.inc({
  //   route: "/user",
  // });

  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.get("/todo", (req, res) => {
  // counter.inc({
  //   route: "/todo",
  // });

  res.send({
    name: "Koka Bura",
    age: 29,
  });
});

app.get("/metrics", async (req, res) => {
  const metrics = await register.metrics();
  res.set("Content-Type", register.contentType);
  res.end(metrics);
});

app.listen(3000, () => {
  console.log("Server is running at post 3000");
});
