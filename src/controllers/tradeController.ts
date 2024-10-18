import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const checkSurvivorExists = async (id: number) => {
  const survivor = await prisma.survivor.findUnique({
    where: {
      id,
    },
  });

  return survivor;
};

const checkSurvivorItemExists = async (survivorID: number, itemID: number) => {
  const item = await prisma.survivorItem.findFirst({
    where: {
      survivorId: survivorID,
      itemId: itemID,
    },
  });

  return item;
};

export const tradeItems = async (req: Request, res: Response) => {
  const {
    traderId,
    receiverId,
    traderItemId,
    receiverItemId,
    traderItemQty,
    receiverItemQty,
  } = req.body;

  if (
    !traderId ||
    !receiverId ||
    !traderItemId ||
    !receiverItemId ||
    !traderItemQty ||
    !receiverItemQty
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const isExistSurvivor1 = await checkSurvivorExists(traderId);

    const isExistSurvivor2 = await checkSurvivorExists(receiverId);

    if (!isExistSurvivor1 || !isExistSurvivor2) {
      res.status(404).json({ error: "Survivor not found!" });
      return;
    }

    const isExistSurvivor1Item = await checkSurvivorItemExists(
      traderId,
      traderItemId
    );

    const isExistSurvivor2Item = await checkSurvivorItemExists(
      receiverId,
      receiverItemId
    );

    if (!isExistSurvivor1Item || !isExistSurvivor2Item) {
      res.status(404).json({ error: "Items not found!" });
      return;
    }

    if (
      isExistSurvivor1Item.quantity < traderItemQty ||
      isExistSurvivor2Item.quantity < receiverItemQty
    ) {
      res.status(404).json({ error: "Items quantity not enough!" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.survivorItem.update({
        where: { id: isExistSurvivor1Item.id },
        data: { quantity: { decrement: traderItemQty } },
      });

      await tx.survivorItem.update({
        where: { id: isExistSurvivor2Item.id },
        data: { quantity: { decrement: receiverItemQty } },
      });

      const survivor1ReceiverItem = await tx.survivorItem.findFirst({
        where: { survivorId: traderId, itemId: receiverItemId },
      });

      if (survivor1ReceiverItem) {
        await tx.survivorItem.update({
          where: { id: survivor1ReceiverItem.id },
          data: { quantity: { increment: receiverItemQty } },
        });
      } else {
        await tx.survivorItem.create({
          data: {
            survivorId: traderId,
            itemId: receiverItemId,
            quantity: receiverItemQty,
          },
        });
      }

      const survivor2TraderItem = await tx.survivorItem.findFirst({
        where: { survivorId: receiverId, itemId: traderItemId },
      });

      if (survivor2TraderItem) {
        await tx.survivorItem.update({
          where: { id: survivor2TraderItem.id },
          data: { quantity: { increment: traderItemQty } },
        });
      } else {
        await tx.survivorItem.create({
          data: {
            survivorId: receiverId,
            itemId: traderItemId,
            quantity: traderItemQty,
          },
        });
      }
    });

    res.status(200).json({ message: "Trade completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
