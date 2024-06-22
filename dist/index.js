"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = require("prom-client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
let counter = new prom_client_1.Counter({
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
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const metrics = yield prom_client_1.register.metrics();
    res.set("Content-Type", prom_client_1.register.contentType);
    res.end(metrics);
}));
app.listen(3000, () => {
    console.log("Server is running at post 3000");
});
