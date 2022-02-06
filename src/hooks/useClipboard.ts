import { copyToClipboard } from 'quasar';
import { notifyError, notifySuccess } from 'src/common/notify';
import { useI18n } from 'vue-i18n';

export const useClipboard = () => {
  const i18n = useI18n();

  const onCopy = async (link: string) => {
    try {
      await copyToClipboard(link);
      notifySuccess(i18n.t('success.copy'));
    } catch (error) {
      console.error(error);
      notifyError(i18n.t('errors.general'));
    }
  };

  return { onCopy };
}
