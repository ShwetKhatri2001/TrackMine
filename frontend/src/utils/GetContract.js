import Constants from "../Constants";
import Web3 from "web3";
const TrackMine_CONTRACT_BUILD = require("../build/TrackMine.json");
const NETWORK_ID = "5777";

export const web3 = new Web3(Constants.RPC_PROVIDER);

const GetContract = () => {
  const CONTRACT_ADDRESS =
    TrackMine_CONTRACT_BUILD.networks[NETWORK_ID].address;

  const TrackMine = new web3.eth.Contract(
    TrackMine_CONTRACT_BUILD.abi,
    CONTRACT_ADDRESS
  );
  return { success: true, data: { TrackMine } };
};

export default GetContract;
