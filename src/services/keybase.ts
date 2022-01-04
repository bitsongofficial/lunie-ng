import { api } from 'src/boot/axios';
import { Keybase, KeybaseResponse } from 'src/models';

export const queryKeybaseImage = async ({ keybaseHash }: Keybase): Promise<Keybase> => {
  const query = `https://keybase.io/_/api/1.0/user/user_search.json?q=${keybaseHash}&num_wanted=1`;
  const { data: result } = await api.get<KeybaseResponse>(query, { baseURL: '' });

  if (result.list.length > 0) {
    return {
      keybaseHash,
      picture: result.list[0].keybase.picture_url
        ? result.list[0].keybase.picture_url.replace('http://', 'https://')
        : undefined,
      updated: new Date(),
    };
  }

  // no profile found
  return {
    keybaseHash,
    updated: new Date(),
  };
}
