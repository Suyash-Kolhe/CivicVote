import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Feedback
  app.post("/api/feedback", (req, res) => {
    const { name, email, feedback, type } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ error: "Feedback content is required" });
    }

    const feedbackEntry = {
      id: Date.now(),
      name: name || "Anonymous",
      email: email || "N/A",
      feedback,
      type: type || "suggestion",
      timestamp: new Date().toISOString()
    };

    // Storing in a local JSON file
    const feedbackPath = path.join(process.cwd(), "feedback.json");
    let feedbacks = [];
    
    if (fs.existsSync(feedbackPath)) {
      const data = fs.readFileSync(feedbackPath, "utf-8");
      feedbacks = JSON.parse(data);
    }
    
    feedbacks.push(feedbackEntry);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbacks, null, 2));

    console.log("Feedback received:", feedbackEntry);
    res.json({ success: true, message: "Thank you for your feedback!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
