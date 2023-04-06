import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Constants from "../../Constants";
import HandymanIcon from "@mui/icons-material/Handyman";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import { AuthContext } from "../../context/AuthContext";
import { ContractContext } from "../../context/ContractContext";
import "./TimelineFeedItem.css";

const TimelineFeedItem = ({ product, stage }) => {
  const { Services } = React.useContext(ContractContext);
  const { account, role } = React.useContext(AuthContext);
  const [coalproducedDate, setCoalProducedDate] = React.useState("");
  const [railway_confirmedDate, setRailwayConfirmedDate] = React.useState("");
  const [coaltransferredDate, setCoalTransferredDate] = React.useState("");

  const getHistory = async () => {
    if (!account) return;

    const response = await Services.getProductHistory(product.details.id);
    let date1 = new Date(
      parseInt(response.data.history[0].returnValues._time)
    ).toLocaleString("hi");
    setCoalProducedDate(date1);
    if (stage != Constants.STAGE[0]) {
      let date2 = new Date(
        parseInt(response.data.history[1].returnValues._time)
      ).toLocaleString("hi");
      setRailwayConfirmedDate(date2);
    }
    if (stage == Constants.STAGE[2]) {
      let date3 = new Date(
        parseInt(response.data.history[2].returnValues._time)
      ).toLocaleString("hi");
      setCoalTransferredDate(date3);
    }
    console.log({ response });
  };

  React.useEffect(() => {
    getHistory();
  }, [account, Services]);

  return (
    <div>
      <VerticalTimeline lineColor="black">
        {/* CoalProducer  */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#ff7043", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #ff7043" }}
          date={coalproducedDate}
          iconStyle={{ background: "#ff7043", color: "#fff" }}
          icon={<HandymanIcon />}
        >
          <h1 className="vertical-timeline-element-title">
            Product CoalProduced
          </h1>
          <h3 className="vertical-timeline-element-subtitle">
            {product.coal_producer.name}
          </h3>
          <p
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              width: "fit-content",
              padding: "3px 6px",
            }}
            className="vertical-timeline-element-subtitle"
          >
            CoalProducer
          </p>
          <p>
            <b>Address:</b> {product.coal_producer.id}
          </p>
        </VerticalTimelineElement>
        {/* Railway  */}
        {stage == Constants.STAGE[1] || stage == Constants.STAGE[2]
          ? product.railways.map((railway, index) => (
              <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date={railway_confirmedDate}
                iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                contentStyle={{
                  background: "rgb(33, 150, 243)",
                  color: "#fff",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid  rgb(33, 150, 243)",
                }}
                icon={<StorefrontIcon />}
              >
                <h1 className="vertical-timeline-element-title">
                  Product RailwayConfirmed
                </h1>
                <h4 className="vertical-timeline-element-subtitle">
                  {railway.name}
                </h4>
                <p
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "10px",
                    width: "fit-content",
                    padding: "3px 6px",
                  }}
                  className="vertical-timeline-element-subtitle"
                >
                  Railway
                </p>
                <p>
                  <b>Address:</b> {railway.id}
                </p>
              </VerticalTimelineElement>
            ))
          : ""}

        {/* ElecProducer  */}
        {stage == Constants.STAGE[2] ? (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date={coaltransferredDate}
            contentArrowStyle={{ borderRight: "7px solid  rgb(16, 204, 82)" }}
            contentStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
            iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
            icon={<PersonIcon />}
          >
            <h1 className="vertical-timeline-element-title">
              Product CoalTransferred
            </h1>
            <h3 className="vertical-timeline-element-subtitle">
              {product.elec_producer.name}
            </h3>
            <p
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "10px",
                width: "fit-content",
                padding: "3px 6px",
              }}
              className="vertical-timeline-element-subtitle"
            >
              ElecProducer
            </p>
            <p>
              <b>Address:</b> {product.elec_producer.id}
            </p>
          </VerticalTimelineElement>
        ) : (
          ""
        )}
      </VerticalTimeline>
    </div>
  );
};

export default TimelineFeedItem;
