import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 50 },
    { duration: "3m", target: 50 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Test recommendations API (public endpoint)
  const recRes = http.post(
    `${BASE_URL}/api/recommendations`,
    JSON.stringify({
      strategy: "trending",
      limit: 5,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(recRes, {
    "recommendations 200": (r) => r.status === 200,
    "recommendations p95<500ms": (r) => r.timings.duration < 500,
  });

  sleep(0.5);

  // Test browsing strategy
  const browsingRes = http.post(
    `${BASE_URL}/api/recommendations`,
    JSON.stringify({
      strategy: "browsing",
      limit: 3,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(browsingRes, {
    "browsing 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
