/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Reward, ValidatorWithReward } from 'src/models';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Transport from '@ledgerhq/hw-transport';
import { getHDPath } from './hdpath';
import { Dictionary, reduce } from 'lodash';
import Store from 'src/store';

export async function getLedger(ledgerTransport: Transport | undefined) {
  const interactiveTimeout = 120_000;
  const isWindows = navigator.platform.includes('Win');
  // @ts-ignore
  const hasHIDEnabled = !!navigator.hid;

  let transport;

  if (isWindows) {
    if (!hasHIDEnabled) {
      throw new Error(
        'Your browser doesn\'t have HID enabled. Please enable this feature by visiting: chrome://flags/#enable-experimental-web-platform-features'
      );
    }

    if (!ledgerTransport) {
      transport = await TransportWebHID.create(
        interactiveTimeout,
        interactiveTimeout
      );
    }
  } else {
    transport = await TransportWebUSB.create(
      interactiveTimeout,
      interactiveTimeout
    )
  }

  if (!transport) {
    transport = ledgerTransport;
  }

  if (transport) {
    const ledger = new LedgerSigner(transport, {
      // @ts-ignore
      ledgerAppName: 'BitSong',
      testModeAllowed: true,
      hdPaths: [getHDPath(Store.state.authentication.network.HDPath)],
      prefix: Store.state.authentication.network.addressPrefix,
    });

    return { ledger, transport };
  }
}

// limitation of the Ledger Nano S: if top5 is true, we pick the top 5 rewards and inform the user.
export function getRewardsValidators(rewards: Reward[], top5: boolean) {
  const rewardsPerValidatorObject = reduce<Reward, Dictionary<number>>(rewards, (all, reward) => {
    return {
      ...all,
      [reward.validator.operatorAddress]:
        Number(reward.amount) +
        (Number(all[reward.validator.operatorAddress]) || 0),
    }
  }, {});

  const rewardsPerValidatorAddresses = Object.keys(rewardsPerValidatorObject);
  const rewardsPerValidatorArray: ValidatorWithReward[] = [];

  rewardsPerValidatorAddresses.forEach((validatorAddress, index) => {
    rewardsPerValidatorArray.push({
      validator: validatorAddress,
      totalRewardAmount: Object.values(rewardsPerValidatorObject)[index],
    })
  });

  const rewardsValidators = rewardsPerValidatorArray
    .sort((a, b) => b.totalRewardAmount - a.totalRewardAmount)
    .map((rewardPerValidator) => rewardPerValidator.validator);

  return top5 ? rewardsValidators.slice(0, 5) : rewardsValidators;
}
