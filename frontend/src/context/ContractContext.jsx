import React from "react";
import Web3 from "web3";
import GetContract, { web3 } from "../utils/GetContract";
import Connect from "../utils/Connect";
import Constants from "../Constants";
import { AuthContext } from "../context/AuthContext";

export const ContractContext = React.createContext();

function ContractContextProvider(props) {
  const { account, updateAuth } = React.useContext(AuthContext);

  const [state, setState] = React.useState({
    TrackMine: null,
  });

  const updateContract = (data) => {
    setState({ ...state, ...data });
  };

  const Services = {
    registerCoalProducer: async (_name) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const coal_producerRegistrationResponse = await state.TrackMine.methods
          .addCoalProducer(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return {
          success: true,
          data: { coal_producer: coal_producerRegistrationResponse },
        };
      } catch (err) {
        console.log("Error in registering coal_producer: ", err);
        return { success: false, message: err.message };
      }
    },

    registerRailway: async (_name) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const railwayRegistrationResponse = await state.TrackMine.methods
          .addRailway(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return {
          success: true,
          data: { railway: railwayRegistrationResponse },
        };
      } catch (err) {
        console.log("Error in registering railway: ", err);
        return { success: false, message: err.message };
      }
    },

    registerElecProducer: async (_name) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const elecProducerRegistrationResponse = await state.TrackMine.methods
          .addElecProducer(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return {
          success: true,
          data: { elec_producer: elecProducerRegistrationResponse },
        };
      } catch (err) {
        console.log("Error in registering elec_producer: ", err);
        return { success: false, message: err.message };
      }
    },

    getCoalProducer: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const coal_producer = await state.TrackMine.methods
          .getCoalProducerDetails(_address)
          .call();
        return { success: true, data: { coal_producer } };
      } catch (err) {
        console.log("Error in getting coal_producer: ", err);
        return { success: false, message: err.message };
      }
    },

    getRailway: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const railway = await state.TrackMine.methods
          .getRailwayDetails(_address)
          .call();
        return { success: true, data: { railway } };
      } catch (err) {
        console.log("Error in getting railway: ", err);
        return { success: false, message: err.message };
      }
    },

    getElecProducer: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const elec_producer = await state.TrackMine.methods
          .getElecProducerDetails(_address)
          .call();
        return { success: true, data: { elec_producer } };
      } catch (err) {
        console.log("Error in getting elec_producer: ", err);
        return { success: false, message: err.message };
      }
    },

    getCoalProducerInventory: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const productIDList = await state.TrackMine.methods
          .getCoalProducerInventory(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.TrackMine.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting coal_producer inventory: ", err);
        return { success: false, message: err.message };
      }
    },

    getRailwayInventory: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const productIDList = await state.TrackMine.methods
          .getRailwayInventory(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.TrackMine.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting railway inventory: ", err);
        return { success: false, message: err.message };
      }
    },

    getElecProducerOrders: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const productIDList = await state.TrackMine.methods
          .getElecProducerOrders(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.TrackMine.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting elec_producer inventory: ", err);
        return { success: false, message: err.message };
      }
    },

    addProduct: async (_name, _price, _ipfs_hash) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const date = Date.now();
        const addProductResponse = await state.TrackMine.methods
          .addProduct(_name, _price, _ipfs_hash, date)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return { success: true, data: { product: addProductResponse } };
      } catch (err) {
        console.log("Error in adding product: ", err);
        return { success: false, message: err.message };
      }
    },

    getProduct: async (_productId) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const productResponse = await state.TrackMine.methods
          .getProductDetails(_productId)
          .call();

        return {
          success: true,
          data: {
            details: productResponse[0],
            railways: productResponse[1],
            coal_producer: productResponse[2],
            elec_producer: productResponse[3],
          },
        };
      } catch (err) {
        console.log("Error in getting product: ", err);
        return { success: false, message: err.message };
      }
    },

    getCurrentStatus: async (_productId) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const currentStatusResponse = await state.TrackMine.methods
          .getCurrentStatus(_productId)
          .call();
        return {
          success: true,
          data: {
            stage: currentStatusResponse[0],
            owner: currentStatusResponse[1],
            coal_producer: currentStatusResponse[2],
            elec_producer: currentStatusResponse[3],
            railway: currentStatusResponse[4],
          },
        };
      } catch (err) {
        console.log("Error in getting product status: ", err);
        return { success: false, message: err.message };
      }
    },

    getUserType: async (_address) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const userType = await state.TrackMine.methods
          .getUserType(_address)
          .call();
        return { success: true, data: { type: Constants.ROLE[userType] } };
      } catch (err) {
        console.log("Error in getting user type: ", err);
        return { success: false, message: err.message };
      }
    },

    getProductHistory: async (_productId) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };

        const allEvents = await state.TrackMine.getPastEvents("allEvents", {
          fromBlock: 0,
          toBlock: "latest",
        });
        console.log({ allEvents });
        console.log(_productId);

        const history = allEvents.filter(
          (event) => event.returnValues._productId == _productId
        );

        return { success: true, data: { history } };
      } catch (err) {
        console.log("Error in getting product history: ", err);
        return { success: false, message: err.message };
      }
    },

    getAllProducts: async () => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const allProducts = await state.TrackMine.methods.getProducts().call();
        const products = allProducts.filter(
          (product) =>
            product.currentOwner.toLowerCase() != account.toLowerCase()
        );
        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting all products: ", err);
        return { success: false, message: err.message };
      }
    },

    getProductsOfStage: async (_stage) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const allProducts = await state.TrackMine.methods.getProducts().call();

        const products = allProducts.filter(
          (product) => product.stage == _stage
        );
        return { success: true, data: { products } };
      } catch (err) {
        console.log(`Error in getting products of stage ${_stage}: `, err);
        return { success: false, message: err.message };
      }
    },

    getProductsOfName: async (_name) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const allProducts = await state.TrackMine.methods.getProducts().call();

        const products = allProducts.filter((product) => product.name == _name);
        return { success: true, data: { products } };
      } catch (err) {
        console.log(`Error in getting products of name ${_name}: `, err);
        return { success: false, message: err.message };
      }
    },

    releaseProduct: async (_productId) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const date = Date.now();
        const product = await state.TrackMine.methods
          .products(_productId)
          .call();

        const releaseProductResponse = await state.TrackMine.methods
          .releaseProduct(_productId, date)
          .send({
            from: account,
            gas: Constants.GAS,
          });

        const transactionResponse = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: product.coal_producer,
              value: Web3.utils.toWei(product.price, "finney").toString(),
            },
          ],
        });

        return {
          success: true,
          data: { releaseProductResponse, transactionResponse },
        };
      } catch (err) {
        console.log(`Error in releasing product :`, err);
        return { success: false, message: err.message };
      }
    },

    buyProduct: async (_productId) => {
      try {
        if (!state.TrackMine) return { success: true, data: {} };
        const date = Date.now();

        const product = await state.TrackMine.methods
          .products(_productId)
          .call();
        const currentRailwayAddress = await state.TrackMine.methods
          .Product_Railways(_productId, product.total_railways - 1)
          .call();
        // const currentRailwayAddress = railways[railways.length - 1]

        const buyProductResponse = await state.TrackMine.methods
          .buyProduct(_productId, date)
          .send({
            from: account,
            gas: Constants.GAS,
          });

        const transactionResponse = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: currentRailwayAddress,
              value: Web3.utils.toWei(product.price, "finney").toString(),
            },
          ],
        });

        return {
          success: true,
          data: { buyProductResponse, transactionResponse },
        };
      } catch (err) {
        console.log(`Error in buying product :`, err);
        return { success: false, message: err.message };
      }
    },
  };

  React.useEffect(() => {
    (async () => {
      //Get the info from the contracts
      const contractResult = GetContract();
      updateContract(contractResult.data);

      // Get the account of the user
      const accountResponse = await Connect();
      updateAuth({ account: accountResponse.data.account });
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!account) return;
      const userTypeResponse = await Services.getUserType(account);
      if (
        userTypeResponse.success &&
        userTypeResponse.data.type != Constants.ROLE[3]
      ) {
        let userResponse;
        switch (userTypeResponse.data.type) {
          case Constants.ROLE[0]:
            userResponse = await Services.getCoalProducer(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.coal_producer.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          case Constants.ROLE[1]:
            userResponse = await Services.getRailway(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.railway.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          case Constants.ROLE[2]:
            userResponse = await Services.getElecProducer(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.elec_producer.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          default:
            if (window.location.pathname !== "/") window.location.href = "/";
        }
      } else {
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    })();
  }, [account]);

  return (
    <ContractContext.Provider
      value={{
        ...state,
        ...{
          updateContract,
          Services,
        },
      }}
    >
      {props.children}
    </ContractContext.Provider>
  );
}

export default ContractContextProvider;
