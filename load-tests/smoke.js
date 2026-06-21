import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.1"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Test public /api/recommendations endpoint
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
    "recommendations has products": (r) => r.json()?.products?.length > 0,
  });

  sleep(1);
}
