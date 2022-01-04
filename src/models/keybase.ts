import { Dictionary } from 'lodash';
import { Validator } from './validators';

export interface Keybase {
  keybaseHash: string;
  picture?: string;
  updated?: string | Date;
}

export interface KeybaseResponseStatus {
  code: number;
  name: string;
}

export interface KeybaseUser {
  full_name: string | null;
  is_followee: boolean;
  picture_url: string;
  raw_score: number;
  stellar: string | null;
  uid: string;
  username: string;
}

export interface KeybaseService {
  service_name: string;
  username?: string;
}

export interface KeybaseItem {
  keybase: KeybaseUser;
  score: number;
  services_summary: KeybaseServicesSummary;
}

export interface KeybaseResponse {
  list: KeybaseItem[];
  status: KeybaseResponseStatus;
}

export type KeybaseMap = Dictionary<Keybase>;
export type ValidatorImagesChunk = (validator: Validator[]) => void;
export type KeybaseImagesChunk = (keybaseMap: KeybaseMap) => Promise<KeybaseMap>;
export type KeybaseServicesSummary = { [key: string]: KeybaseService };
