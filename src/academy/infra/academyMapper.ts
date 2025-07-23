import {
  Academy,
  AcademyManager,
  Brand,
  Exercise,
} from "../../../generated/prisma";
import { AcademyEntity } from "../entities/academy";

interface AcademyRelations {
  academyManagers: AcademyManager[];
  exercises: Exercise[];
  brand: Brand;
}

export class AcademyMapper {
  public static toDomain(academy: Academy): AcademyEntity {
    return new AcademyEntity({
      id: academy.id,
      name: academy.name,
      description: academy.description || "",
      createdAt: academy.createdAt,
      updatedAt: academy.updatedAt,
      academyManagers: [],
      exercises: [],
      brand: academy.brandId,
      deletedAt: academy.deletedAt || null,
      logoUrl: academy.logoUrl || null,
    });
  }
}
