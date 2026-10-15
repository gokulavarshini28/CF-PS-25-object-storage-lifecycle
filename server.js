
require("dotenv").config();

const express = require("express");
const {
  S3Client,
  ListObjectsV2Command,
  GetBucketLifecycleConfigurationCommand
} = require("@aws-sdk/client-s3");

const app = express();
const PORT = process.env.PORT || 3000;
const BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION || "ap-southeast-2";

if (!BUCKET) {
  throw new Error("S3_BUCKET_NAME is missing from .env");
}

// CORS configuration for VS Code Live Server
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:5500"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// AWS S3 connection
const s3 = new S3Client({ region: REGION });

// Serve frontend files
app.use(express.static(__dirname, { index: "index.html" }));

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    bucket: BUCKET,
    region: REGION,
    mode: "read-only"
  });
});

// Fetch S3 objects
app.get("/api/objects", async (req, res) => {
  try {
    const objects = [];
    let continuationToken;

    do {
      const result = await s3.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          ContinuationToken: continuationToken
        })
      );

      for (const obj of result.Contents || []) {
        objects.push({
          name: obj.Key.split("/").pop(),
          key: obj.Key,
          prefix: obj.Key.includes("/")
            ? obj.Key.slice(0, obj.Key.lastIndexOf("/") + 1)
            : "",
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? null
        });
      }

      continuationToken = result.IsTruncated
        ? result.NextContinuationToken
        : undefined;
    } while (continuationToken);

    res.set("Cache-Control", "no-store");
    res.json({
      bucket: BUCKET,
      count: objects.length,
      objects
    });
  } catch (error) {
    console.error("S3 object listing failed:", error.name);
    res.status(500).json({
      error:
        "Could not list S3 objects. Check AWS credentials and permissions."
    });
  }
});

// Fetch S3 lifecycle configuration
app.get("/api/lifecycle", async (req, res) => {
  try {
    const result = await s3.send(
      new GetBucketLifecycleConfigurationCommand({
        Bucket: BUCKET
      })
    );

    res.set("Cache-Control", "no-store");
    res.json({ rules: result.Rules || [] });
  } catch (error) {
    if (error.name === "NoSuchLifecycleConfiguration") {
      return res.json({ rules: [] });
    }

    console.error("S3 lifecycle read failed:", error.name);
    res.status(500).json({
      error:
        "Could not read lifecycle configuration. Check AWS permissions."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`Bucket: ${BUCKET} (${REGION})`);
});
