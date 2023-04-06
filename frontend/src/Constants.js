const Constants = {
  RPC_PROVIDER: "http://localhost:7545",
  GAS: 3000000,
  ROLE: {
    0: "coal_producer",
    1: "railway",
    2: "elec_producer",
    3: "not_registered",
  },
  STAGE: {
    0: "coalproduced",
    1: "railway_confirmed",
    2: "coaltransferred",
  },
};

export default Constants;
