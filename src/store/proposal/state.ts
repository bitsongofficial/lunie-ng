import { ProposalSubmitRequest } from 'src/models';

export interface ProposalStateInterface {
  drafts: ProposalSubmitRequest[];
}

function state (): ProposalStateInterface {
  return {
    drafts: []
  };
}

export default state;
