import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

type ZipEntry = {
  readonly name: string;
  readonly data: Buffer;
  readonly crc: number;
  readonly localHeaderOffset: number;
};

export async function createZipFromDirectory(directory: string): Promise<Buffer> {
  const filePaths = await listFiles(directory);
  const entries: ZipEntry[] = [];
  const localParts: Buffer[] = [];
  let offset = 0;

  for (const path of filePaths) {
    const data = await readFile(path);
    const name = normalizeZipPath(relative(directory, path));
    const nameBuffer = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const localHeader = createLocalHeader(nameBuffer, data, crc);
    localParts.push(localHeader, data);
    entries.push({ name, data, crc, localHeaderOffset: offset });
    offset += localHeader.length + data.length;
  }

  const centralParts = entries.map((entry) => createCentralDirectoryHeader(entry));
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = createEndOfCentralDirectory(entries.length, centralSize, offset);

  return Buffer.concat([...localParts, ...centralParts, end]);
}

async function listFiles(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return listFiles(path);
      }
      if (entry.isFile()) {
        return [path];
      }
      return [];
    })
  );

  return nested.flat().sort((left, right) => left.localeCompare(right));
}

function createLocalHeader(name: Buffer, data: Buffer, crc: number): Buffer {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(0, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(data.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(name.length, 26);
  header.writeUInt16LE(0, 28);
  return Buffer.concat([header, name]);
}

function createCentralDirectoryHeader(entry: ZipEntry): Buffer {
  const name = Buffer.from(entry.name, "utf8");
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(0, 12);
  header.writeUInt16LE(0, 14);
  header.writeUInt32LE(entry.crc, 16);
  header.writeUInt32LE(entry.data.length, 20);
  header.writeUInt32LE(entry.data.length, 24);
  header.writeUInt16LE(name.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(entry.localHeaderOffset, 42);
  return Buffer.concat([header, name]);
}

function createEndOfCentralDirectory(entryCount: number, centralSize: number, centralOffset: number): Buffer {
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entryCount, 8);
  end.writeUInt16LE(entryCount, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(0, 20);
  return end;
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function normalizeZipPath(path: string): string {
  return path.split("\\").join("/");
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});
