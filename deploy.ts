import "dotenv/config";

import { createNosanaClient, NosanaNetwork } from "@nosana/kit";

const apiKey = process.env.NOSANA_API_KEY;
if (!apiKey) {
  console.error("Missing NOSANA_API_KEY (.env or .env.local)");
  process.exit(1);
}

const client = createNosanaClient(NosanaNetwork.MAINNET, {
  api: { apiKey },
});

async function deploySolscreener() {
  console.log("Creating SolScreener deployment...");

  const deployment = await client.api.deployments.create({
    name: "solscreener-agent",
    market: "7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq",
    timeout: 120,
    replicas: 1,
    strategy: "SIMPLE",
    job_definition: {
      version: "0.1",
      type: "container",
      meta: {
        trigger: "api",
      },
      ops: [
        {
          type: "container/run",
          id: "solscreener-app",
          args: {
            cmd: [
              "sh",
              "-c",
              "npm install && npm run build && HOSTNAME=0.0.0.0 npm run start",
            ],
            image: "node:20-alpine",
            env: {
              PORT: "3000",
              HOSTNAME: "0.0.0.0",
              NODE_ENV: "production",
              NOSANA_JOB_ID: "$NOSANA_JOB_ID",
            },
            expose: 3000,
            gpu: false,
          },
        },
      ],
    },
  });

  console.log("Deployment created:", deployment.id);
  console.log(
    "Dashboard:",
    `https://dashboard.nosana.com/deployments/${deployment.id}`,
  );

  await deployment.start();
  console.log("Start requested.");

  const updated = await client.api.deployments.get(deployment.id);
  const url = updated.endpoints?.[0]?.url;
  if (url) {
    console.log("Service URL:", url);
  } else {
    console.log(
      "Endpoints not ready yet — open the dashboard or poll deployments.get() until status is RUNNING.",
    );
  }

  return updated;
}

deploySolscreener().catch((err) => {
  console.error(err);
  process.exit(1);
});
