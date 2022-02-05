import { MutationTree } from 'vuex'
import { SettingsStateInterface } from './state'

const mutation: MutationTree<SettingsStateInterface> = {
  setLanguage(state, language: string) {
    state.language = language;
  },
  setCurrency(state, currency: string) {
    state.currency = currency;
  },
}

export default mutation;
