import { ProposalSubmitRequest } from 'src/models';
import { MutationTree } from 'vuex'
import { ProposalStateInterface } from './state'

const mutation: MutationTree<ProposalStateInterface> = {
  setProposal(state, proposal: ProposalSubmitRequest) {
    const drafts = [...state.drafts];
    const lastDraft = drafts.pop();
    let id = 0;

    if (lastDraft && lastDraft.id !== undefined) {
      id = lastDraft.id;
    }

    state.drafts = [...state.drafts, {
      ...proposal,
      id
    }];
  },
  editProposal(state, proposal: ProposalSubmitRequest) {
    const updated = { ...proposal };
    const index = state.drafts.findIndex(({ id }) => id === id);

    state.drafts[index] = {
      ...state.drafts[index],
      ...updated,
    };
  },
  deleteProposal(state, id: number) {
    const drafts = [...state.drafts];

    state.drafts = drafts.filter(el => el.id !== id);
  },
}

export default mutation;
