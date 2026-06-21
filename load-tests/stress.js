import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 200 },
    { duration: "2m", target: 300 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(99)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Stress test on recommendations (most computationally intensive)
  const recRes = http.post(
    `${BASE_URL}/api/recommendations`,
    JSON.stringify({
      strategy: "trending",
      limit: 10,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(recRes, {
    "recommendations 200": (r) => r.status === 200,
    "recommendations complete": (r) => r.json()?.success === true,
  });

  sleep(0.2);
}
