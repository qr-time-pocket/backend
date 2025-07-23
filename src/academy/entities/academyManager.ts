enum AcademyManagerRole {
  OWNER,
  MANAGER,
  COACH,
}

export class AcademyManager {
  public id?: string;
  public userId: string;
  public academyId: string;
  public role: AcademyManagerRole;

  constructor({ id, userId, academyId, role }: AcademyManager) {
    this.id = id;
    this.userId = userId;
    this.academyId = academyId;
    this.role = role;
  }

  static create({
    userId,
    academyId,
    role,
  }: {
    userId: string;
    academyId: string;
    role: AcademyManagerRole;
  }) {
    return new AcademyManager({
      userId,
      academyId,
      role,
    });
  }
}
