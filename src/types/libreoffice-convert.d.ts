declare module 'libreoffice-convert' {
  export function convert(
    file: Buffer,
    format: string,
    filter: string | undefined,
    callback: (err: Error | null, result: Buffer) => void
  ): void;

  export function convertAsync(
    file: Buffer,
    format: string,
    filter?: string
  ): Promise<Buffer>;
}
