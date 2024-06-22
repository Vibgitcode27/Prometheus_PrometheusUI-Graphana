import express from "express";
import { Counter, register } from "prom-client";

const app = express();

app.use(express.json());

let counter = new Counter({
  name: "http_number_of_requests",
  help: "Number of Http req made",
  labelNames: ["route", "statusbar"],
});

app.get("/user", (req, res) => {
  counter.inc({
    route: "/user",
    statusbar: "5",
  });

  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.get("/todo", (req, res) => {
  counter.inc({
    route: "/todo",
    statusbar: "3",
  });

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
