import {Howl, Howler} from 'howler';
import { IBasicConfig, IAudioManager, IAudioCollection } from "../types";

const configDefaults = {
  name: 'AudioManager',
  debug: true,
  logging: true,
  version: '1',
}

class AudioManager implements IAudioManager {
  public config:            IBasicConfig;
  public sounds:            IAudioCollection;

  private soundFactory:     HowlStatic;
  private audioEngine:      HowlerGlobal;

  constructor(config: IBasicConfig) {
    this.config       = { ...configDefaults, ...config };
    this.sounds       = {};

    this.soundFactory = Howl;
    this.audioEngine  = Howler;
  }

  public init = (config?: IBasicConfig) => null;

  public registerSound(name: string, options: IHowlProperties) {
    this.sounds[name] = new this.soundFactory(options);
  }

  public unRegisterSound(name: string) {
    this.sounds[name].unload();
    delete this.sounds[name];
  }

  public playSound(name: string, sprite?: string | number) {
    try {
      this.sounds[name].play(sprite);
    } catch (e) {
      throw new Error(`[AudioManager:ERROR]: Sound: "${name}" not found..`)
    }
  }

  public registerListener(name: string, event: string, callback: (soundId: number) => void) {
    this.sounds[name].on(event, callback);
  }

  public registerOnceListener(name: string, event: string, callback: (soundId: number) => void) {
    this.sounds[name].once(event, callback);
  }

  public unRegisterListener(name: string, event: string, callback: (soundId: number) => void) {
    this.sounds[name].off(event, callback);
  }

  public changeVolume(volume: number): void {
    this.audioEngine.volume(volume);
  }

  public toString = (): string => {
    return JSON.stringify({
      config:   this.config,
    }, null, '  ')
  };
}

export default AudioManager;
