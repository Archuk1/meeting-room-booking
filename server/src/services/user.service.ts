import prisma from "../db/prisma.js";

export async function searchByEmail(email: string) {
  return prisma.user.findMany({
    where: { email: { contains: email, mode: "insensitive" } },
    select: { id: true, name: true, email: true },
    take: 10,
  });
}
