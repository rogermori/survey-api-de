export function env(variable: string): string {
  if (variable === null || variable === undefined) {
    throw new Error("Calling env with null or undefined argument");
  }
  const value: string = process.env[variable] as string;
  if (!value) {
    throw new Error("Configuration variable " + variable + " is not defined");
  }
  return value;
}

export function envN(variable: string): number {
  return Number(env(variable));
}
