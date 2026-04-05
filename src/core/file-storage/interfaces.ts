export interface IFileStorage {
  upload(localPath: string, remotePath: string): Promise<string>;
  download(remotePath: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}
