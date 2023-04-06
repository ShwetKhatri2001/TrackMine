import * as React from "react";
import ProductListTemplate from "../ProductListTemplate/ProductListTemplate";
import { ContractContext } from "../../context/ContractContext";
import { AuthContext } from "../../context/AuthContext";
import EmptyInventoryList from "../EmptyListText/EmptyInventoryList/EmptyInventoryList";

const InventoryList = () => {
  const [products, setProducts] = React.useState([]);
  const { account, role } = React.useContext(AuthContext);
  const { Services } = React.useContext(ContractContext);

  const getProducts = async () => {
    if (!account) return;

    let response;
    switch (role) {
      case "coal_producer":
        response = await Services.getCoalProducerInventory(account);
        if (!response.success) console.log(response.message);

        setProducts(response.data.products);
        break;
      case "railway":
        response = await Services.getRailwayInventory(account);
        if (!response.success) console.log(response.message);

        setProducts(response.data.products);
        break;
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [account, Services]);

  return products.length ? (
    <ProductListTemplate title={"Inventory"} productList={products} />
  ) : (
    <EmptyInventoryList></EmptyInventoryList>
  );
};

export default InventoryList;
