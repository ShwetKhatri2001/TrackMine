// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TrackMine {
    enum Role {
        coal_producer,
        railway,
        elec_producer,
        not_registered
    }

    enum Stage {
        coalproduced,
        railway_confirmed,
        coaltransferred
    }

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        string ipfs_hash;
        Stage stage;
        address coal_producer;
        uint256 total_railways;
        address elec_producer;
        address currentOwner;
    }

    struct CoalProducer {
        address id;
        string name;
        uint256 total_products;
    }

    struct Railway {
        address id;
        string name;
        uint256 total_products;
    }

    struct ElecProducer {
        address id;
        string name;
        uint256 total_orders;
    }

    uint256 public total_products;
    Product[] public products;
    mapping(address => CoalProducer) public coal_producers;
    mapping(address => Railway) public railways;
    mapping(address => ElecProducer) public elec_producers;
    mapping(uint256 => address[]) public Product_Railways;

    mapping(address => uint256[]) public coal_producer_inventory;
    mapping(address => uint256[]) public railway_inventory;
    mapping(address => uint256[]) public elec_producer_orders;

    address[] address_array;

    event TrackMine_deployed(string _message);
    event Product_Added(
        uint256 _productId,
        address _coalProducerAddress,
        uint256 _time
    );
    event Product_RailwayConfirmed(
        uint256 _productId,
        address _coalProducerAddress,
        address _railwayAddress,
        uint256 _time
    );
    event Product_CoalTransferred(
        uint256 _productId,
        address _railwayAddress,
        address _elecProducerAddress,
        uint256 _time
    );

    constructor() {
        total_products = 0;
        emit TrackMine_deployed("TrackMine has been deployed");
    }

    modifier isCoalProducer(address _coalProducerAddress) {
        require(
            coal_producers[_coalProducerAddress].id != address(0x0),
            "Only coal producers can perform this action"
        );
        _;
    }

    modifier isRailway(address _railwayAddress) {
        require(
            railways[_railwayAddress].id != address(0x0),
            "Only railways can perform this action"
        );
        _;
    }

    modifier isElecProducer(address _elecProducerAddress) {
        require(
            elec_producers[_elecProducerAddress].id != address(0x0),
            "Only electricity producer can perform this action"
        );
        _;
    }

    function removeElement(uint256 index, uint256[] storage array)
        internal
        returns (uint256[] storage)
    {
        for (uint256 i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        array.pop();
        return array;
    }

    function getProducts() public view returns (Product[] memory) {
        return products;
    }

    function addCoalProducer(string memory _name)
        public
        payable
        returns (CoalProducer memory)
    {
        require(
            bytes(coal_producers[msg.sender].name).length == 0,
            "This address is already registered as coal producer"
        );

        CoalProducer memory _coal_producer;
        _coal_producer.id = msg.sender;
        _coal_producer.name = _name;
        _coal_producer.total_products = 0;

        coal_producers[msg.sender] = _coal_producer;

        return _coal_producer;
    }

    function addRailway(string memory _name)
        public
        payable
        returns (Railway memory)
    {
        require(
            bytes(railways[msg.sender].name).length == 0,
            "This address is already registered as railway"
        );

        Railway memory _railway;
        _railway.id = msg.sender;
        _railway.name = _name;
        _railway.total_products = 0;

        railways[msg.sender] = _railway;

        return _railway;
    }

    function addElecProducer(string memory _name)
        public
        payable
        returns (ElecProducer memory)
    {
        require(
            bytes(elec_producers[msg.sender].name).length == 0,
            "This address is already registered as railway"
        );

        ElecProducer memory _elec_producer;
        _elec_producer.id = msg.sender;
        _elec_producer.name = _name;

        elec_producers[msg.sender] = _elec_producer;

        return _elec_producer;
    }

    function addProduct(
        string memory _name,
        uint256 _price,
        string memory _ipfs_hash,
        uint256 _time
    ) public payable isCoalProducer(msg.sender) returns (Product memory) {
        require(
            coal_producers[msg.sender].id != address(0),
            "Only coal_producers can add product"
        );

        //get the coal producer
        CoalProducer memory _coal_producer = coal_producers[msg.sender];

        //create the product
        Product memory _product;
        _product.id = total_products;
        _product.name = _name;
        _product.price = _price;
        _product.ipfs_hash = _ipfs_hash;
        _product.coal_producer = _coal_producer.id;
        _product.stage = Stage.coalproduced;
        _product.total_railways = 0;
        _product.currentOwner = msg.sender;

        //add the product to records
        products.push(_product);
        total_products += 1;

        //add the product to the coal producer inventory records
        coal_producer_inventory[msg.sender].push(_product.id);
        _coal_producer.total_products += 1;
        coal_producers[msg.sender] = _coal_producer;

        //Add into proper mappings
        Product_Railways[_product.id] = address_array;

        emit Product_Added(_product.id, msg.sender, _time);

        return _product;
    }

    function releaseProduct(uint256 _productId, uint256 _time)
        public
        payable
        isRailway(msg.sender)
        returns (Product memory)
    {
        require(_productId < total_products, "Product does not exist");

        //Get the product
        Product memory _product = products[_productId];

        //check if the product has already been railway_confirmed or coalproduced
        require(
            _product.stage == Stage.coalproduced,
            "Product has been railway_confirmed or coaltransferred"
        );

        //Shift ownership from coal producer to Railway
        Product_Railways[_productId].push(msg.sender);
        _product.total_railways++;
        _product.stage = Stage.railway_confirmed;
        _product.currentOwner = msg.sender;

        //Remove the element from the inventory of coal producer and update count
        CoalProducer memory _coal_producer = coal_producers[
            _product.coal_producer
        ];
        for (uint256 i = 0; i < _coal_producer.total_products; i++) {
            if (
                coal_producer_inventory[_product.coal_producer][i] == _productId
            ) {
                coal_producer_inventory[_product.coal_producer] = removeElement(
                    i,
                    coal_producer_inventory[_product.coal_producer]
                );
                // delete coal_producer_inventory[_product.coal_producer][i];
                break;
            }
        }
        _coal_producer.total_products -= 1;
        coal_producers[_product.coal_producer] = _coal_producer;

        //Add the product to railway's inventory and update count
        railway_inventory[msg.sender].push(_product.id);
        Railway memory _railway = railways[msg.sender];
        _railway.total_products += 1;
        railways[msg.sender] = _railway;

        //save the updated product details
        products[_productId] = _product;

        emit Product_RailwayConfirmed(
            _productId,
            _product.coal_producer,
            msg.sender,
            _time
        );

        return _product;
    }

    function buyProduct(uint256 _productId, uint256 _time)
        public
        payable
        isElecProducer(msg.sender)
        returns (Product memory)
    {
        require(_productId < total_products, "Product does not exist");

        //Get the product
        Product memory _product = products[_productId];

        //check if the product has already been railway_confirmed or coalproduced
        require(
            _product.stage == Stage.railway_confirmed,
            "Product has not been railway_confirmed or has been already coaltransferred"
        );

        //Get the details of the railway who is selling
        address _railwayId = Product_Railways[_product.id][
            _product.total_railways - 1
        ];
        Railway memory _railway = railways[_railwayId];

        //Get the details of the electricity producer
        ElecProducer memory _elec_producer = elec_producers[msg.sender];

        //Shift ownership from railway to electricity producer
        _product.stage = Stage.coaltransferred;
        _product.elec_producer = _elec_producer.id;
        _product.currentOwner = msg.sender;

        //Remove the element from the inventory of railway and update count
        address _current_railway_address = Product_Railways[_productId][
            Product_Railways[_productId].length - 1
        ];
        Railway memory _current_railway = railways[
            _current_railway_address
        ];
        for (uint256 i = 0; i < _current_railway.total_products; i++) {
            if (
                railway_inventory[_current_railway_address][i] == _productId
            ) {
                railway_inventory[_current_railway_address] = removeElement(
                    i,
                    railway_inventory[_current_railway_address]
                );
                // delete railway_inventory[_current_railway_address][i];
                break;
            }
        }
        _current_railway.total_products -= 1;
        railways[_current_railway_address] = _current_railway;

        //Add the product to electricity producer's orders and update count
        elec_producer_orders[msg.sender].push(_product.id);
        _elec_producer.total_orders += 1;
        elec_producers[msg.sender] = _elec_producer;

        //save the updated product details
        products[_productId] = _product;

        emit Product_CoalTransferred(_productId, _railway.id, msg.sender, _time);

        return _product;
    }

    function getCoalProducerDetails(address _coal_producerId)
        public
        view
        returns (CoalProducer memory)
    {
        CoalProducer memory _coal_producer = coal_producers[_coal_producerId];
        return _coal_producer;
    }

    function getCoalProducerInventory(address _coal_producerId)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory _product_ids = coal_producer_inventory[_coal_producerId];
        return _product_ids;
    }

    function getRailwayDetails(address _railwayId)
        public
        view
        returns (Railway memory)
    {
        Railway memory _railway = railways[_railwayId];
        return _railway;
    }

    function getRailwayInventory(address _railwayId)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory _product_ids = railway_inventory[_railwayId];
        return _product_ids;
    }

    function getElecProducerDetails(address _elecProducerId)
        public
        view
        returns (ElecProducer memory)
    {
        ElecProducer memory _elec_producer = elec_producers[_elecProducerId];
        return _elec_producer;
    }

    function getElecProducerOrders(address _elecProducerId)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory _product_ids = elec_producer_orders[_elecProducerId];
        return _product_ids;
    }

    function getProductDetails(uint256 _productId)
        public
        view
        returns (
            Product memory,
            Railway[] memory,
            CoalProducer memory,
            ElecProducer memory
        )
    {
        //Get the product
        Product memory _product = products[_productId];

        //Get all the railways addresses
        address[] memory _railway_addresses = Product_Railways[_productId];

        //Initialize an empty reailters array
        Railway[] memory _railways = new Railway[](_product.total_railways);

        //Get the CoalProducer
        CoalProducer memory _coal_producer = getCoalProducerDetails(
            _product.coal_producer
        );

        //Get the electricity Producer
        ElecProducer memory _elec_producer = getElecProducerDetails(_product.elec_producer);

        //Push all the railways in the _railways array
        for (uint256 i = 0; i < _railway_addresses.length; i++) {
            _railways[i] = getRailwayDetails(_railway_addresses[i]);
        }
        return (_product, _railways, _coal_producer, _elec_producer);
    }

    function getCurrentStatus(uint256 _productId)
        public
        view
        returns (
            Stage,
            address,
            CoalProducer memory,
            ElecProducer memory,
            Railway memory
        )
    {
        //Initilize an empty address for owner
        address _owner_address;

        //Get product details
        Product memory _product = products[_productId];

        //Get product stage
        Stage _stage = _product.stage;

        //Instantiate each user
        CoalProducer memory _coal_producer;
        ElecProducer memory _elec_producer;
        Railway memory _railway;

        //Check for each stage
        if (_stage == Stage.coalproduced) {
            _owner_address = _product.coal_producer;
            _coal_producer = getCoalProducerDetails(_owner_address);
        } else if (_stage == Stage.coaltransferred) {
            _owner_address = _product.elec_producer;
            _elec_producer = getElecProducerDetails(_owner_address);
        } else {
            _owner_address = Product_Railways[_productId][
                _product.total_railways - 1
            ];
            _railway = getRailwayDetails(_owner_address);
        }
        return (_stage, _owner_address, _coal_producer, _elec_producer, _railway);
    }

    function getUserType(address _user) public view returns (Role) {
        if (coal_producers[_user].id != address(0x0)) return Role.coal_producer;

        if (railways[_user].id != address(0x0)) return Role.railway;

        if (elec_producers[_user].id != address(0x0)) return Role.elec_producer;

        return Role.not_registered;
    }
}
