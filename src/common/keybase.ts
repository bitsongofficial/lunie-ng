import { uniqBy, chunk, keyBy, reduce } from 'lodash';
import { Validator, ValidatorImagesChunk, KeybaseMap, Keybase } from 'src/models';
import { queryKeybaseImage } from 'src/services';

const UPDATE_THROTTLE_PERIOD = 1000 * 60 * 60 * 24 * 2; // 2 days
const CHUNK_SIZE = 50; // chunks of parallel requests against keybase API
const CHUNK_THROTTLE = 3000; // time between chunks to not get locked out of keybase
const LOCALSTORAGE_KEY = 'keybase';

const loadKeybaseImages = () => {
  const keybase = localStorage.getItem(LOCALSTORAGE_KEY);
  const keybaseImages = JSON.parse(keybase !== null ? keybase : '{}') as KeybaseMap;

  return keybaseImages;
}

const saveKeybaseImages = (keybaseImages: KeybaseMap) => {
  const oldKeybaseImages = loadKeybaseImages();

  const mergedKeybaseImages = {
    ...oldKeybaseImages,
    ...keybaseImages,
  };

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(mergedKeybaseImages));
}

// get not yet loaded validators and outdated validators
const getUpdateableKeybaseEntries = (currentValidators: Validator[]) => {
  const keybaseImages = loadKeybaseImages();

  const updateableKeybaseImages = Object.values(keybaseImages).filter(
    ({ updated }) => !updated || Date.now() - new Date(updated).getTime() > UPDATE_THROTTLE_PERIOD
  ); // update every 2 days

  const validators = currentValidators.filter(({ identity }) => !!identity && !keybaseImages[identity])
    .filter(({ identity }) => identity.length === 16)
    .map(({ identity }) => ({ keybaseHash: identity }));

  return uniqBy(
    // add hashes we don't know yet
    updateableKeybaseImages.concat(validators),
    'keybaseHash'
  );
}

const queryKeybaseImages = (keybaseImageRecords: Keybase[], onChunkReady: (keybaseMap: KeybaseMap) => void) => {
  const chunks = chunk(keybaseImageRecords, CHUNK_SIZE);

  return reduce(chunks, async (all, keybaseImageRecords, index) => {
    const previous = await Promise.resolve(all);

    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, CHUNK_THROTTLE));
    }

    const updatedKeybaseImages = await Promise.all(
      keybaseImageRecords.map(async (record) => {
        try {
          return await queryKeybaseImage(record)
        } catch (error) {
          return {
            keybaseHash: record.keybaseHash,
          }
        }
      })
    );

    const updatedKeybaseImagesDictionary = keyBy(updatedKeybaseImages, 'keybaseHash');

    onChunkReady(updatedKeybaseImagesDictionary); // allow to react to chunks

    return {
      ...previous,
      ...keyBy(updatedKeybaseImages, 'keybaseHash'),
    }
  }, {});
}

export const updateValidatorImages = async (currentValidators: Validator[], update = true, onChunkReady: ValidatorImagesChunk) => {
  const updateableKeybaseHashes = getUpdateableKeybaseEntries(currentValidators);

  const nonUpdateableValidators = currentValidators.filter(
    ({ identity }) =>!updateableKeybaseHashes.find(
      ({ keybaseHash }) => identity === keybaseHash
    )
  );

  onChunkReady(enrichedValidatorsWithPicture(nonUpdateableValidators));

  if (update) {
    await Promise.resolve(
      queryKeybaseImages(
        updateableKeybaseHashes,
        // callback on every chunk
        (updatedKeybaseHashes) => {
          saveKeybaseImages(updatedKeybaseHashes)
          onChunkReady(
            enrichedValidatorsWithPicture(
              currentValidators.filter(
                ({ identity }) => updatedKeybaseHashes[identity]
              )
            )
          )
        }
      )
    );
  }

  return enrichedValidatorsWithPicture(currentValidators);
}

export function enrichedValidatorsWithPicture(validators: Validator[]): Validator[] {
  const validatorImageRecords = loadKeybaseImages();

  return validators.map((validator) => {
    const imageRecord = validatorImageRecords[validator.identity];

    return {
      ...validator,
      picture: imageRecord ? imageRecord.picture : undefined,
    }
  });
}
