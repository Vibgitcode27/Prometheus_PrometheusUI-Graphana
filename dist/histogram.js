"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const prom_client_1 = __importStar(require("prom-client"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const requestTimeHistogram = new prom_client_1.Histogram({
    name: "request_time",
    help: "Time the endpoint to respond to the query",
    labelNames: ["route", "method", "code"],
    buckets: [0.1, 0.5, 1, 5, 10, 100, 1000, 3000],
});
const requestCurrentTCPGaugeMiddleware = (req, res, next) => {
    const startTime = Date.now();
    requestTimeHistogram.labels({ route: req.path });
    res.on("finish", () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        requestTimeHistogram.observe({
            route: req.route ? req.route.path : req.path,
            method: req.method,
            code: res.statusCode,
        }, responseTime);
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
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const metrics = yield prom_client_1.default.register.metrics();
    res.set("Content-Type", prom_client_1.default.register.contentType);
    res.end(metrics);
}));
app.listen(3000);
