declare module "aplayer" {
  interface APlayerOptions {
    container: HTMLElement;
    autoplay?: boolean;
    mini?: boolean;
    audio: Array<{
      name: string;
      artist: string;
      url: string;
      cover?: string;
    }>;
  }

  export default class APlayer {
    constructor(options: APlayerOptions);
    destroy(): void;
  }
}

declare module "aplayer/dist/APlayer.min.css";
