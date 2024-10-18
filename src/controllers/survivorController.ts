import { PrismaClient, Survivor } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createSurvivor = async (req: Request, res: Response) => {
  const { name, age, gender, lastLocation, infected } = req.body;

  if (!name || !age || !gender || !lastLocation || infected === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const survivor: Survivor = await prisma.survivor.create({
      data: {
        name,
        age,
        gender,
        lastLocation,
        infected,
      },
    });

    res
      .status(201)
      .json({ message: "Survivor created successfully", data: survivor });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSurvivors = async (req: Request, res: Response) => {
  try {
    const survivors: Survivor[] = await prisma.survivor.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });

    res.status(200).json(survivors);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateSurvivor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { name, age, gender, lastLocation, infected } = req.body;

  const existingSurvivor = await prisma.survivor.findUnique({
    where: {
      id: +id,
    },
  });

  if (!existingSurvivor) {
    res.status(404).json({ error: "Survivor not found!" });
    return;
  }

  try {
    const survivor: Survivor = await prisma.survivor.update({
      where: {
        id: +id,
      },
      data: {
        name: name || existingSurvivor.name,
        age: age || existingSurvivor.age,
        gender: gender || existingSurvivor.gender,
        lastLocation: lastLocation || existingSurvivor.lastLocation,
        infected:
          infected !== undefined || infected !== null
            ? infected
            : existingSurvivor.infected,
      },
    });

    res
      .status(200)
      .json({ message: "Survivor updated successfully", data: survivor });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addSurvivorItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { survivorId, itemId, quantity } = req.body;

  if (!survivorId || !itemId || quantity === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const [existingSurvivor, existingItem] = await Promise.all([
      prisma.survivor.findUnique({ where: { id: survivorId } }),
      prisma.item.findUnique({ where: { id: itemId } }),
    ]);

    if (!existingSurvivor) {
      res.status(404).json({ error: "Survivor not found!" });
      return;
    }

    if (!existingItem) {
      res.status(404).json({ error: "Item not found!" });
      return;
    }

    await prisma.survivorItem.upsert({
      where: {
        survivorId_itemId: {
          survivorId,
          itemId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        survivorId,
        itemId,
        quantity,
      },
    });

    res.status(201).json({ message: "Item added to survivor successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getSurvivorItems = async (req: Request, res: Response) => {
//   try {
//     const survivorsWithItems = await prisma.survivor.findMany({
//       include: {
//         inventory: {
//           include: {
//             item: true,
//           },
//         },
//       },
//     });

//     res.status(200).json(survivorsWithItems);
//   } catch (error: unknown) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
