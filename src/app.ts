import express from "express";
import cors from "cors";
import {
  createSurvivor,
  getSurvivors,
  updateSurvivor,
  addSurvivorItem,
} from "./controllers/survivorController";
import { tradeItems } from "./controllers/tradeController";
import {
  createItem,
  getItems,
  averageItemPerSurvivor,
} from "./controllers/itemsController";

const app = express();

const PORT = process.env.API_PORT || 5000;

app.use(express.json());
app.use(cors());

// SURVIVORS ROUTES
app.post("/api/survivors", createSurvivor);
app.get("/api/survivors", getSurvivors);
app.put("/api/survivors/:id", updateSurvivor);
app.post("/api/survivorItem", addSurvivorItem);

// INVENTORY ROUTES
app.post("/api/items", createItem);
app.get("/api/items", getItems);
app.get("/api/averageItemSurvivor", averageItemPerSurvivor);

// TRADE ROUTES
app.post("/api/trade", tradeItems);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
