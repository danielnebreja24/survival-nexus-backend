import { Item, PrismaClient, SurvivorItem } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createItem = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const item: Item = await prisma.item.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({ message: "Item created successfully", data: item });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items: Item[] = await prisma.item.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(items);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const averageItemPerSurvivor = async (req: Request, res: Response) => {
  try {
    const survivorsWithItems: SurvivorItem[] =
      await prisma.survivorItem.findMany({
        include: { item: true, survivor: true },
      });

    const resourceMap = survivorsWithItems.reduce((acc: any, cur: any) => {
      acc[cur.item.name] = (acc[cur.item.name] || 0) + cur.quantity;
      return acc;
    }, {});

    const survivorIdsWithItems = new Set(
      survivorsWithItems.map((si) => si.survivorId)
    );
    const totalSurvivorsWithItems = survivorIdsWithItems.size;

    const averageResources = Object.keys(resourceMap).map((resourceName) => ({
      resource: resourceName,
      average: Math.round(resourceMap[resourceName] / totalSurvivorsWithItems),
    }));

    res.status(200).json(averageResources);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
