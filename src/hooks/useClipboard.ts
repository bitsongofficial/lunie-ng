import { copyToClipboard } from 'quasar';
import { notifyError, notifySuccess } from 'src/common/notify';

export const useClipboard = () => {
  const onCopy = async (link: string) => {
    try {
      await copyToClipboard(link);
      notifySuccess('Link copied to the clipboard');
    } catch (error) {
      console.error(error);
      notifyError('Something went wrong');
    }
  };

  return { onCopy };
}
