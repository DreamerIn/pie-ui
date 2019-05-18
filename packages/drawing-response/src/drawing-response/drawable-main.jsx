import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';

import ImageBackground from './drawable-image';

import FreePathDrawable from './drawable-free-path';
import LineDrawable from './drawable-line';
import RectangleDrawable from './drawable-rectangle';
import CircleDrawable from './drawable-circle';
import EraserDrawable from './drawable-eraser';

class DrawableMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawables: [],
      newDrawable: []
    }
  }

  getNewDrawableBasedOnType = (x, y, type) => {
    const drawableClasses = {
      FreePathDrawable,
      LineDrawable,
      RectangleDrawable,
      CircleDrawable,
      EraserDrawable
    };
    return new drawableClasses[type](x, y);
  };

  handleMouseDown = e => {
    const { newDrawable } = this.state;
    const { toolActive } = this.props;
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newDrawable = this.getNewDrawableBasedOnType(
        x,
        y,
        toolActive.type
      );
      this.setState({
        newDrawable: [newDrawable]
      });
    }
  };

  handleMouseUp = e => {
    const { newDrawable, drawables } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newDrawable[0];
      drawableToAdd.registerMovement(x, y);
      drawables.push(drawableToAdd);
      this.setState({
        newDrawable: [],
        drawables
      });
    }
  };

  handleMouseMove = e => {
    const { newDrawable } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      this.setState({
        newDrawable: [updatedNewDrawable]
      });
    }
  };

  render() {
    const {
      classes,
      drawableDimensions,
      fillColor,
      imageDimensions,
      imageUrl,
      outlineColor,
      paintColor,
      toolActive: { type }
    } = this.props;

    const draggable = type === 'Select';
    const paint = type === 'PaintBucket';
    const drawables = [...this.state.drawables, ...this.state.newDrawable];

    const drawableProps = {
      draggable,
      paint,
      paintColor,
      fillColor,
      forceUpdate: () => this.setState({ updatedAt: new Date() }),
      outlineColor
    };

    return (
      <div className={classes.base}>
        {imageUrl && (
          <ImageBackground
            dimensions={imageDimensions}
            url={imageUrl}
          />
        )}

        <Stage
          className={classes.stage}
          height={drawableDimensions.height}
          width={drawableDimensions.width}
          {...draggable ? {} : {
            onMouseDown: this.handleMouseDown,
            onMouseUp: this.handleMouseUp,
            onMouseMove: this.handleMouseMove
          }}
        >
          <Layer>
            {drawables.map(drawable => drawable.render(drawableProps))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

const styles = theme => ({
  base: {
    position: 'relative',
    width: '100%',
  },
  stage: {
    left: 0,
    top: 0,
    position: 'absolute'
  },
});

DrawableMain.propTypes = {
  classes: PropTypes.object.isRequired,
  drawableDimensions: PropTypes.object.isRequired,
  fillColor: PropTypes.string.isRequired,
  paintColor: PropTypes.string.isRequired,
  outlineColor: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  session: PropTypes.object.isRequired,
  toolActive: PropTypes.object.isRequired
};

export default withStyles(styles)(DrawableMain);
