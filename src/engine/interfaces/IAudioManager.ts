import { IBasicConfig } from "../types";

export interface IAudioManager {
  config: IBasicConfig;
  sounds: Record<string, Howl>;
  songs: Record<string, Howl>;
  registerSound: (name: string, options: IHowlProperties) => void;
  unRegisterSound: (name: string) => void;
  registerSong: (name: string, options: IHowlProperties) => void;
  unRegisterSong: (name: string) => void;
  playSound: (name: string, sprite?: string | number) => void;
  stopSound: (name: string, id?: number) => void;
  playSong: (name: string, sprite?: string | number) => void;
  stopSong: (name: string, id?: number) => void;
  changeVolume: (volume: number) => void;
  registerListener: (name: string, event: string, callback: (soundId: number) => void) => void;
  registerOnceListener: (name: string, event: string, callback: (soundId: number) => void) => void;
  unRegisterListener: (name: string, event: string, callback: (soundId: number) => void) => void;
}
