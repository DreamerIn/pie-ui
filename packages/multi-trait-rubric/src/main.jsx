import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  table: {
    border: '1px solid lightgrey',
    borderSpacing: 0,
    marginBottom: '16px',

    '& th': {
      border: '1px solid lightgrey',
      padding: '8px',
      textAlign: 'start'
    },

    '& td': {
      border: '1px solid lightgrey',
      padding: '8px',

      '&:last-child': {
        textAlign: 'center'
      }
    }
  },
  scorePointHeader: {
    '& td': {
      border: 0,
      padding: 0
    }
  }
})

class Main extends React.Component {
  render() {
    const { classes, model } = this.props;
    const { scales } = model || {};

    if (!scales) {
      return <div/>;
    }

    return (
      <div>
        {scales.map((scale, scaleIndex) => {
          const { maxPoints, traitLabel, scorePointsLabels, traits, excludeZero } = scale || {};
          let showStandards;
          let showDescription;
          let showPointsLabels;
          let showWeighting;
          let scorePointsValues = [];

          try {
            for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue--) {
              scorePointsValues.push(pointValue);
            }

            const { traitStandards, traitDescriptions } = traits.reduce(
              (tcc, trait) => ({
                traitStandards: [...tcc.traitStandards, ...(trait.standards || [])],
                traitDescriptions: [...tcc.traitDescriptions, ...(trait.description || [])],
              }),
              {
                traitStandards: [],
                traitDescriptions: [],
              }
            );

            showStandards = traitStandards.length;
            showDescription = traitDescriptions.length;
            showPointsLabels = scorePointsLabels.length === scorePointsValues.length;
            showWeighting = traits.map(trait => trait.weighting).filter(weight => weight).length;
          } catch (e) {
            showPointsLabels = false;
            showWeighting = false;
          }

          return (
            <table
              className={classes.table}
              key={`scale-${scaleIndex}`}
            >
              <thead>
              <tr>
                <th>{traitLabel}</th>
                {showStandards ? <th>Standard(s)</th> : null}
                {showDescription ? <th>Description</th> : null}
                {
                  scorePointsValues.map((scorePointValue, index) => (
                    <th key={`table-header-${index}`}>
                      <table className={classes.scorePointHeader}>
                        <thead>
                        <tr>
                          <td>{scorePointValue}</td>
                        </tr>
                        </thead>

                        <tbody>
                        {showPointsLabels
                          ? (
                            <tr>
                              <td>{scorePointsLabels[scorePointsLabels.length - index - 1]}</td>
                            </tr>
                          )
                          : null
                        }
                        </tbody>
                      </table>
                    </th>
                  ))
                }
                {showWeighting ? <th>Weight</th> : null}
              </tr>
              </thead>

              <tbody>
              {
                traits.map((trait, traitIndex) => {
                  const { label, standards, scorePointsDescriptors, weighting } = trait || {};

                  return (
                    <tr key={`scale-${scaleIndex}-trait-${traitIndex}`}>
                      <td>{label}</td>
                      {showStandards ? <td>{standards.join(',')}</td> : null}
                      {showDescription ? <td>the main message</td> : null}
                      {
                        scorePointsValues.map((scorePointValue, index) => (
                          <td key={`table-cell-${index}`}>
                            {scorePointsDescriptors[scorePointsDescriptors.length - index - 1]}
                          </td>
                        ))
                      }
                      {showWeighting ? <td>{weighting ? `x${weighting}` : ''}</td> : null}
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          )
        })}
      </div>
    );
  }
}

Main.propTypes = {};

export default withStyles(styles)(Main);
