import express, { Request, Response, NextFunction, Router } from "express";
import client, { Histogram } from "prom-client";
const app = express();

app.use(express.json());

const requestTimeHistogram = new Histogram({
  name: "request_time",
  help: "Time the endpoint to respond to the query",
  labelNames: ["route", "method", "code"],
  buckets: [0.1, 0.5, 1, 5, 10, 100, 1000, 3000],
});

const requestCurrentTCPGaugeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  requestTimeHistogram.labels({ route: req.path });
  res.on("finish", () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    requestTimeHistogram.observe(
      {
        route: req.route ? req.route.path : req.path,
        method: req.method,
        code: res.statusCode,
      },
      responseTime
    );
  });
  next();
};

app.use(requestCurrentTCPGaugeMiddleware);

app.get("/user", (req, res) => {
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000);
