// prisma에서 generate된 파일을 다시 도메인 객체로 바꿀 것인가?
// prisma generated Object <-> Domain Object

import { AcademyCreateDto } from "../types/dto";
import { AcademyManager } from "./academyManager";
import { Brand } from "./brand";
import { Exercise } from "./exercise";

export class AcademyEntity {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  academyManagers: AcademyManager[];
  exercises: Exercise[];
  logoUrl: string | null;
  brand: Brand | null;
  deletedAt: Date | null;

  constructor({
    id,
    name,
    description,
    createdAt,
    updatedAt,
    academyManagers,
    exercises,
    logoUrl,
    brand,
    deletedAt,
  }: {
    id?: string;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    academyManagers: AcademyManager[];
    exercises: Exercise[];
    logoUrl: string | null;
    brand: Brand | null;
    deletedAt: Date | null;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.logoUrl = logoUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.academyManagers = academyManagers;
    this.exercises = exercises;
    this.brand = brand;
  }

  static create(data: AcademyCreateDto) {
    return new AcademyEntity({
      name: data.name,
      description: data.description,
      academyManagers: [],
      exercises: [],
      logoUrl: data.logoUrl,
      brand: data.brandId ? { id: data.brandId } : null,
      deletedAt: null,
    });
  }
}
