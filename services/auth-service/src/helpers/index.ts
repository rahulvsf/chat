class Exclusions {
  private readonly exclusions: string[] = [
    'deleted',
    'deletedBy',
    'deletedOn',
    'createdOn',
    'createdBy',
    'modifiedOn',
    'modifiedBy',
    'createdBy',
  ];

  private static _instance: Exclusions;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  genericExclusion = <T>(): (keyof T)[] => {
    return this.exclusions as (keyof T)[];
  };
}

const ExclusionsInstance = Exclusions.Instance;

export const genericExclusions = ExclusionsInstance.genericExclusion;
