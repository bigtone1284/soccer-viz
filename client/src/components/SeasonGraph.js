import '../styles/bar_chart.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { axisLeft, axisBottom } from 'd3-axis';
import { event as currentEvent } from 'd3';
import { fetchSeason } from '../actions';
import TeamTooltip from './TeamTooltip';

class SeasonGraph extends Component {
  componentDidMount() {
    this.props.fetchSeason();
    window.addEventListener('resize', this.createBarChart.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.createBarChart.bind(this));
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    const season = this.props.season;

    if (season) {
      const seasonTeams = this.props.season.seasonTeams,
        teamCount = seasonTeams.length,
        node = this.node,
        width = node.width.animVal.value,
        chartHeight = node.height.animVal.value - 50,
        rowHeight = chartHeight / teamCount,
        tickCount = width < 600 ? 5 : 10,
        xScale = scaleLinear()
          .domain([-1, 100])
          .range([0, width]),
        yScale = scaleBand()
          .domain(
            seasonTeams.map(({ team }) => {
              return team.abbreviation;
            })
          )
          .range([0, chartHeight]),
        yAxis = axisLeft(yScale).tickSize(0),
        xAxis = axisBottom(xScale)
          .tickSize(-chartHeight)
          .ticks(tickCount);

      select(node)
        .selectAll('*')
        .remove();

      select(node)
        .selectAll('rect')
        .data(seasonTeams)
        .enter()
        .append('rect');

      select(node)
        .selectAll('rect')
        .data(seasonTeams)
        .exit()
        .remove();

      select(node)
        .selectAll('rect')
        .data(seasonTeams)
        .attr('y', (seasonTeam, i) => i * rowHeight)
        .attr('x', 0)
        .attr('width', ({ results }) => {
          return xScale(results.points);
        })
        .attr('height', rowHeight - 2)
        .attr('fill', ({ team }) => {
          return team.primaryColor;
        })
        .on('mouseover', ({ team }) => {
          debugger;
          console.log('over: ', team.name);
        })
        .on('mouseout', ({ team }) => {
          console.log('exit: ', team.name);
        });

      select(node)
        .selectAll('text')
        .data(seasonTeams)
        .enter()
        .append('text')
        .text(({ results }) => {
          return results.points;
        })
        .attr('x', ({ results }) => {
          const baseX = xScale(results.points);
          if (baseX > 30) {
            return baseX - 15;
          }
          return baseX + 5;
        })
        .attr('y', (seasonTeam, i) => (i + 1) * rowHeight - 7)
        .attr('class', 'bar-label')
        .attr('fill', ({ team, results }) => {
          const baseX = xScale(results.points);
          if (baseX > 30) {
            return team.secondaryColor;
          }
          return team.primaryColor;
        });

      select(node)
        .append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr('class', 'no-axis axis-labels')
        .call(xAxis);

      select(node)
        .append('g')
        .attr('class', 'no-axis axis-labels')
        .call(yAxis);
    }
  }

  render() {
    return (
      <div className="svg-container">
        <svg ref={node => (this.node = node)} width={'100%'} height={500} />
        <TeamTooltip tooltipObj={this.tooltipObj} />
      </div>
    );
  }
}

function mapStateToProps({ season }) {
  return { season };
}

export default connect(mapStateToProps, { fetchSeason })(SeasonGraph);
