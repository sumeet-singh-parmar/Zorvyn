import { Paths, File, Directory } from 'expo-file-system';
import type { IFileStorage } from './interfaces';

const STORAGE_DIR_NAME = 'zorvyn';

function getStorageDir(): Directory {
  return new Directory(Paths.document, STORAGE_DIR_NAME);
}

export class LocalFileStorage implements IFileStorage {
  private ensureDir(): void {
    const dir = getStorageDir();
    if (!dir.exists) {
      dir.create();
    }
  }

  async upload(localPath: string, remotePath: string): Promise<string> {
    this.ensureDir();
    const source = new File(localPath);
    const destination = new File(getStorageDir(), remotePath);
    source.copy(destination);
    return destination.uri;
  }

  async download(remotePath: string): Promise<string> {
    const file = new File(getStorageDir(), remotePath);
    return file.uri;
  }

  async delete(path: string): Promise<void> {
    const file = path.startsWith('file://') ? new File(path) : new File(getStorageDir(), path);
    if (file.exists) {
      file.delete();
    }
  }

  getUrl(path: string): string {
    if (path.startsWith('file://')) return path;
    const file = new File(getStorageDir(), path);
    return file.uri;
  }
}

export const fileStorage: IFileStorage = new LocalFileStorage();
