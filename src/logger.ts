export type Logger = {
  readonly info: (message: string) => void;
  readonly warn: (message: string) => void;
  readonly error: (message: string) => void;
};

export const logger: Logger = {
  info: (message) => {
    process.stdout.write(`${message}\n`);
  },
  warn: (message) => {
    process.stderr.write(`${message}\n`);
  },
  error: (message) => {
    process.stderr.write(`${message}\n`);
  }
};
