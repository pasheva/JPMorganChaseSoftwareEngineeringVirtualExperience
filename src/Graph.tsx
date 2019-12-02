import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      ratio: 'float', //Getting the ration between two stocks. 
      lower_bound: 'float',
      upper_bound: 'float',
      timestamp: 'date',
      price_abc: 'float',
      price_def: 'float',
      trigger_alert: 'float', //When the upper_bound and lower_bound cross. 
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line'); //The type of graph we want to vizualize the data as. 
      elem.setAttribute('row-pivots', '["timestamp"]'); //x-axis
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]'); 
      //Handling duplicated data.
      elem.setAttribute('aggregates', JSON.stringify({ 
        ratio: 'avg',
        lower_bound: 'abg',
        upper_bound: 'avg',
        timestamp: 'distinct count',
        price_abc: 'avg',
        price_def: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ]); //array param
    }
  }
}

export default Graph;
