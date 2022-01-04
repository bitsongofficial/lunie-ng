export interface ClientState {
  chain_id: string;
}

export interface IdentifiedClientState {
  client_state: ClientState;
}

export interface ClientStateResponse {
  identified_client_state: IdentifiedClientState;
}
