import { computed, onMounted } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { notifyError } from 'src/common/notify';
import { SessionType } from 'src/models';

const hidFeatureLink = 'chrome://flags/#enable-experimental-web-platform-features';
const linuxLedgerConnectionLink = 'https://support.ledger.com/hc/en-us/articles/360019301813-Fix-USB-issues';
const chromeError = `Please copy the following link into a new tab and set the "Experimental Web Platform features" flag to "Enabled": ${hidFeatureLink}`;
const linuxError = `Since we switched to WebUSB Linux users may experience connection issues with their devices.\nPlease visit the following site to learn more about how to fix them: ${linuxLedgerConnectionLink}`;

export const useLedger = () => {
  const store = useStore();
  const quasar = useQuasar();
  const router = useRouter();
  const route = useRoute();

  const error = computed(() => store.state.ledger.error);
  const loading = computed(() => store.state.ledger.loading)
  const accounts = computed(() => store.state.ledger.accounts);
  const account = computed(() => accounts.value.length > 0 ? accounts.value[0] : undefined);

  const userAgent = navigator.userAgent.toLowerCase();
  const isWindows = window.navigator.platform.includes('Win');
  const isChrome = /chrome|crios/.test(userAgent) && !/edge|opr\//.test(userAgent);
  const isLinux = window.navigator.platform.includes('Lin');
  const hasHIDEnabled = !!window.navigator.hid;
  const isChromiumBrowser = !!window.chrome;

  onMounted(async () => {
    try {
      await store.dispatch('ledger/init');
    } catch (error) {
      console.error(error);
    }
  });

  const signIn = async () => {
    if (account.value) {
      try {
        quasar.loading.show();
        await store.dispatch('authentication/signIn', {
          address: account.value.address,
          sessionType: SessionType.LEDGER
        });

        const path = (route.query.r as string) || { name: 'wallet' };
        await router.replace(path);
      } catch (error) {
        console.error(error);
        notifyError('Login Failed');
      } finally {
        quasar.loading.hide();
      }
    }
  };

  return {
    error,
    loading,
    accounts,
    account,
    isWindows,
    isChrome,
    isLinux,
    hasHIDEnabled,
    isChromiumBrowser,
    hidFeatureLink,
    linuxLedgerConnectionLink,
    chromeError,
    linuxError,
    signIn
  }
};
