FROM ubuntu:20.04

RUN apt-get update && apt-get install -y git build-essential wget
RUN wget https://github.com/mikefarah/yq/releases/download/v4.9.3/yq_linux_amd64 -O /usr/bin/yq && chmod +x /usr/bin/yq

COPY install-golang.sh install-golang.sh

RUN sh install-golang.sh

ENV GOROOT /usr/local/go
ENV GOPATH /go
ENV GOBIN /go/bin
ENV PATH $GOBIN:$GOROOT/bin:$PATH

RUN git clone https://github.com/bitsongofficial/go-bitsong

WORKDIR /go-bitsong

# Change the commit hash if you want.
RUN git fetch && git checkout testnet

# Build daemon.
RUN make build

WORKDIR /go-bitsong/build

RUN ./bitsongd init localnet --chain-id localnet-1

# configurations
RUN sed -i 's#tcp://127.0.0.1:26657#tcp://0.0.0.0:26657#g' ~/.bitsongd/config/config.toml
RUN sed -i 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["*"\]/g' ~/.bitsongd/config/config.toml
RUN sed -i 's/timeout_commit = "5s"/timeout_commit = "1s"/g' ~/.bitsongd/config/config.toml
RUN sed -i 's/seeds = ".*"/seeds = ""/g' ~/.bitsongd/config/config.toml
RUN sed -i 's/"stake"/"ubtsg"/g' ~/.bitsongd/config/genesis.json
RUN sed -i 's/pruning = "default"/pruning = "nothing"/g' ~/.bitsongd/config/app.toml
RUN sed -i 's/enable = false/enable = true/g' ~/.bitsongd/config/app.toml
RUN sed -i 's/swagger = false/swagger = true/g' ~/.bitsongd/config/app.toml
RUN sed -i 's/enabled-unsafe-cors = false/enabled-unsafe-cors = true/g' ~/.bitsongd/config/app.toml
RUN sed -i 's/"voting_period": "172800s"/"voting_period": "300s"/g' ~/.bitsongd/config/genesis.json

RUN echo "memory fault antenna oppose warfare mutual clap fossil earth solution matrix feel alley tired mix oppose melt plug marriage fiber pride hint cheap hand" | ./bitsongd keys add validator --recover --keyring-backend test
RUN echo "silk cricket salt museum voice unable unaware piece excess blue crawl juice soda during learn arrange amused pony excess float grit manage notice dinner" | ./bitsongd keys add user1 --recover --keyring-backend test
RUN echo "expose drastic inhale gain match pause alter drift across cluster sorry oven capital river wolf used soccer slim twelve wheel notice focus put dad" | ./bitsongd keys add user2 --recover --keyring-backend test
RUN echo "gap wave quantum merge online sausage process grow upset fossil capital high alcohol cost mansion oak truck like ask cancel random bachelor odor rich" | ./bitsongd keys add user3 --recover --keyring-backend test

RUN ./bitsongd add-genesis-account $(./bitsongd keys show validator -a --keyring-backend test) 1000000000000ubtsg
RUN ./bitsongd add-genesis-account $(./bitsongd keys show user1 -a --keyring-backend test) 1000000000000ubtsg
RUN ./bitsongd add-genesis-account $(./bitsongd keys show user2 -a --keyring-backend test) 1000000000000ubtsg
RUN ./bitsongd add-genesis-account $(./bitsongd keys show user3 -a --keyring-backend test) 1000000000000ubtsg

RUN ./bitsongd gentx validator 10000000000ubtsg --chain-id localnet-1 --keyring-backend test
RUN ./bitsongd collect-gentxs

EXPOSE 26657
EXPOSE 1317
EXPOSE 9090
CMD ./bitsongd start --trace