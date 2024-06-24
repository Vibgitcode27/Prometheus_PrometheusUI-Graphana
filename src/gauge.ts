import express, { Request, Response, NextFunction } from "express";
import client, { Gauge } from "prom-client";
const app = express();

app.use(express.json());

const activeUserGauge = new Gauge({
  name: "active_users",
  help: "Number of actiive users",
  labelNames: ["route", "method", "status_code"],
});

const requestCurrentTCPGaugeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  activeUserGauge.inc({
    route: req.path,
    method: req.method,
    status_code: res.statusCode,
  });
  res.on("finish", () => {
    activeUserGauge.dec({
      route: req.path,
      method: req.method,
      status_code: res.statusCode,
    });
  });
  next();
};

app.use(requestCurrentTCPGaugeMiddleware);
// gauge based on curret users

app.get("/user", (req, res) => {
  setTimeout(() => {
    res.send({
      name: "John Doe",
      age: 25,
    });
  }, 10000);
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000);
