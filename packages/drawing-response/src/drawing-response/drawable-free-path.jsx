import React from 'react';
import { Line } from 'react-konva';

import DrawableHelper from './drawable-helper';

export default class FreePathDrawable extends DrawableHelper {
  constructor(startx, starty) {
    super(startx, starty);
    this.points = [startx, starty];
  }

  registerMovement(x, y) {
    this.points = [...this.points, x, y];
  }

  handleOnClick(props) {
    const { paint, paintColor, forceUpdate } = props;

    if (paint) {
      this.paintColor = paintColor;
      forceUpdate();
    }
  }

  render(props) {
    const { draggable, fillColor, outlineColor } = props;

    return (
      <Line
        draggable={draggable}
        tension={0}
        bezier={true}
        points={this.points}
        fill={this.paintColor || fillColor}
        onClick={() => this.handleOnClick(props)}
        stroke={this.paintColor || outlineColor}
      />
    );
  }
}
