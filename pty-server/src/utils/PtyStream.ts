import { IDisposable, IPty } from 'node-pty';
import { Duplex } from 'stream';

export class PtyStream extends Duplex {
  private dataEventEmitter: IDisposable;
  private killEventEmitter: IDisposable;

  constructor(
    private term: IPty,
    options = {}
  ) {
    super({
      ...options,
      decodeStrings: false,
    });
    this.term = term;
    this.dataEventEmitter = this.term.onData(this.handleData.bind(this));
    this.killEventEmitter = this.term.onExit(() => this.end());
  }

  private handleData(data: string) {
    if (!this.push(data)) {
      this.term.pause(); // pause if backpressure
    }
  }

  private cleanup() {
    this.dataEventEmitter.dispose();
    this.killEventEmitter.dispose();
    this.term.kill();
  }

  _read(size: number) {
    // Resume terminal if it was paused
    this.term.resume();
  }

  _write(
    chunk: string,
    encoding: BufferEncoding,
    callback: (args?: Error | null | undefined) => void
  ) {
    try {
      this.term.write(chunk);
      callback();
    } catch (err: unknown) {
      callback(err as Error);
    }
  }

  // cleanup when the other stream is pipe exits.
  _final(callback: () => void) {
    this.cleanup();
    callback();
  }

  _destroy(err: Error | null, callback: (err: Error | null) => void) {
    this.cleanup();
    callback(err);
  }
}
