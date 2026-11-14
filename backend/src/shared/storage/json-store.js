import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class JsonStore {
  constructor(filePath, initialData) {
    this.filePath = filePath;
    this.initialData = initialData;
    this.writeQueue = Promise.resolve();
  }

  async initialize() {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      await readFile(this.filePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await this.persist(this.initialData);
    }
  }

  async read() {
    await this.writeQueue;
    return JSON.parse(await readFile(this.filePath, "utf8"));
  }

  async update(mutator) {
    const operation = this.writeQueue.then(async () => {
      const data = JSON.parse(await readFile(this.filePath, "utf8"));
      const result = await mutator(data);
      data.meta = { ...(data.meta ?? {}), updatedAt: new Date().toISOString() };
      await this.persist(data);
      return result;
    });
    this.writeQueue = operation.then(() => undefined, () => undefined);
    return operation;
  }

  async persist(data) {
    await writeFile(this.filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }
}
