import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

export default class SegmentLoader extends React.PureComponent {
  render() {
    return (
      <Segment style={{ minHeight: "200px" }} {...this.props}>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </Segment>
    );
  }
}
