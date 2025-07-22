import { injectable } from "tsyringe";
import { Academy } from "../../generated/prisma";
import { DatabaseService } from "./DatabaseService";

@injectable()
export class AcademyService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAcademy(userId: string | undefined, academy: Academy) {
    try {
      const prisma = this.databaseService.getPrisma();

      await prisma.academy.create({
        data: {
          ...academy,
          ownerId: userId,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAcademy(academyId: string) {
    const prisma = this.databaseService.getPrisma();
    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
    });
    return academy;
  }

  async getAcademies(userId: string) {
    console.log(userId);
    const prisma = this.databaseService.getPrisma();
    const academies = await prisma.academy.findMany({
      where: {
        ownerId: userId,
      },
    });

    console.log(academies);
    return academies;
  }

  async updateAcademy(academyId: string, academy: Academy) {
    const prisma = this.databaseService.getPrisma();
    await prisma.academy.update({
      where: { id: academyId },
      data: academy,
    });
  }

  async deleteAcademy(academyId: string) {
    const prisma = this.databaseService.getPrisma();
    await prisma.academy.delete({
      where: { id: academyId },
    });
  }
}
