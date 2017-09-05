import React, { Component } from 'react';

class TeamTooltip extends Component {
  renderContent() {
    const tooltipObj = this.props.tooltip;
    if (tooltipObj) {
      return 'text';
    }
  }

  render() {
    return <div className="team-tooltip">{this.renderContent()}</div>;
  }
}

export default TeamTooltip;
