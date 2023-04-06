import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import DashboardTextImage from "../../static/assets/DashboardText.jpg";

function DashboardText() {
  return (
    <Container fullWidth>
      <Grid container>
        <Grid item md={9}>
          <Typography fontSize="large">
            <b>TrackMine</b> is a decentralized supply chain management system
            that allows you to efficiently manage the coal distribution chain
            efficiently yet easily.
            <br />
            It begins where the coal producer registers his firm, coal type,
            capacity with the system. Then There will be electricity producers
            that can choose any coal provider and can raise a request for coal
            to generate electricity. When the coal is ready by the producer, It
            has to go through Government approval to transport via railway. Then
            the coal will be transfered from coal producer to electricity
            producer via train while tracking each and every station the train
            go through. All of these transactions are recorded in the blockchain
            and this makes the coal transport flow more transparent.
            <br />
            The entire history of a coal is also displayed to all the parties,
            where they can see how the coal has been handed to electricity
            producer along since the coal was produced. This can be especially
            useful to make the transportation of coal more quicker and
            uncorrupted by any middle man.
          </Typography>
        </Grid>
        <Grid md={3}>
          <img src={DashboardTextImage} alt="" style={{ width: "400px" }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardText;
