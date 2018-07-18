import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { Feedback } from '@pie-lib/render-ui';
import AnswerGrid from './answer-grid';
import { withStyles } from '@material-ui/core/styles';

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      session: {
        ...props.session,
        answers: this.generateAnswers(props.model)
      },
      // initially it'll be the same as the actual rows
      shuffledRows: props.model.config.rows,
      showCorrect: false
    };

    this.callOnSessionChange();
  }

  generateAnswers = model => {
    const { config } = model;
    const answers = {};

    config.rows.forEach(row => {
      answers[row.id] = new Array(config.layout - 1).fill(false);
    });

    return answers;
  };

  isAnswerRegenerationRequired = nextProps => {
    let isRequired = false;

    if (
      this.props.model.config.responseType !==
      nextProps.model.config.responseType
    ) {
      isRequired = true;
    }

    if (this.props.model.config.layout !== nextProps.model.config.layout) {
      isRequired = true;
    }

    if (
      this.props.model.config.rows.length !==
        nextProps.model.config.rows.length ||
      (nextProps.session.answers &&
        nextProps.model.config.rows.length !==
          Object.keys(nextProps.session.answers).length)
    ) {
      isRequired = true;
    }

    return isRequired || !nextProps.session.answers;
  };

  isShuffleRowsRequired = nextProps =>
    this.props.model.config.shuffled === false &&
    nextProps.model.config.shuffled === true;

  isResetRowsRequired = nextProps =>
    (this.props.model.config.shuffled === true &&
      nextProps.model.config.shuffled === false) ||
    this.props.model.config.rows.length !==
      nextProps.model.config.rows.length ||
    (nextProps.session.answers &&
      nextProps.model.config.rows.length !==
        Object.keys(nextProps.session.answers).length);

  componentWillReceiveProps(nextProps) {
    const regenAnswers = this.isAnswerRegenerationRequired(nextProps);
    const shuffleRows = this.isShuffleRowsRequired(nextProps);
    const resetRows = this.isResetRowsRequired(nextProps);

    this.setState(
      state => ({
        session: {
          ...nextProps.session,
          // regenerate answers if layout or responseType change
          answers: regenAnswers
            ? this.generateAnswers(nextProps.model)
            : nextProps.session.answers
        },
        // shuffle if needed
        shuffledRows: shuffleRows
          ? shuffle([...nextProps.model.config.rows])
          : resetRows
            ? nextProps.model.config.rows
            : state.shuffledRows,
        showCorrect:
          this.props.model.disabled &&
          !nextProps.model.disabled &&
          state.showCorrect
            ? false
            : state.showCorrect
      }),
      () => {
        if (regenAnswers) this.callOnSessionChange();
      }
    );
  }

  callOnSessionChange = () => {
    const { onSessionChange } = this.props;

    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  toggleShowCorrect = show => {
    this.setState({ showCorrect: show });
  };

  onAnswerChange = newAnswers => {
    this.setState(
      state => ({
        session: {
          ...state.session,
          answers: newAnswers
        }
      }),
      this.callOnSessionChange
    );
  };

  render() {
    const { model, classes } = this.props;
    const { showCorrect, shuffledRows, session } = this.state;

    return (
      <div className={classes.mainContainer}>
        <div className={classes.main}>
          {model.correctness && <div>Score: {model.correctness.score}</div>}
          <CorrectAnswerToggle
            className={classes.toggle}
            show={
              model.correctness && model.correctness.correctness !== 'correct'
            }
            toggled={showCorrect}
            onToggle={this.toggleShowCorrect}
          />
          <AnswerGrid
            showCorrect={showCorrect}
            correctAnswers={model.correctResponse}
            disabled={model.disabled}
            view={model.view}
            onAnswerChange={this.onAnswerChange}
            responseType={model.config.responseType}
            answers={showCorrect ? model.correctResponse : session.answers}
            headers={model.config.headers}
            rows={shuffledRows}
          />
        </div>
        {model.feedback && (
          <Feedback
            correctness={model.correctness.correctness}
            feedback={model.feedback}
          />
        )}
      </div>
    );
  }
}

const styles = theme => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  main: {
    width: '100%'
  },
  toggle: {
    paddingBottom: theme.spacing.unit * 3
  }
});

export default withStyles(styles)(Main);