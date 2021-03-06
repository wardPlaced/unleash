import React, { Component, PropTypes } from 'react';
import { red300 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import toggleHOC from '../hocs/toggleHOC';
import MilestoneImg from '../assets/milestone.png';
import Loading from './Loading';
import GoalsModal from './GoalsModal';

const DIALOG_TOGGLE = 'dialog';
const NOTIFY_ON_SLACK = 'notify-on-slack';

let styles = {};

const propTypes = {
  loading: PropTypes.bool,
  actions: PropTypes.object,
  goal: PropTypes.object.isRequired,
  path: PropTypes.shape({
    id: PropTypes.string,
  }),
  profile: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    picture: PropTypes.string,
  }),
  getToggleState: PropTypes.func.isRequired,
  toggleOn: PropTypes.func.isRequired,
  toggleOff: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  paths: PropTypes.array,
  editable: PropTypes.bool,
  usersGoal: PropTypes.bool,
};

class GoalCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      slackAdditionalMessage: '',
      path: props.path,
      goal: props.goal,
    };
  }

  /**
   * Calculate days left for Due Date.
   * @param {String} date - Date from API.
   * @returns {number} days left.
   */
  daysLeft = (date) => {
    const due = new Date(date).getTime();
    const now = Date.now();

    return Math.round(Math.max(0, (due - now) / (24 * 3600 * 1000)));
  };

  toggleAchievement() {
    const { goal, profile, path } = this.props;
    const achieved = !goal.achieved;
    // const notifyOnSlack = this.props.getToggleState(NOTIFY_ON_SLACK);
    const notifyOnSlack = true;
    const slackOptions = {
      notifyOnSlack,
      additionalMessage: this.state.slackAdditionalMessage,
      profile,
    };

    this.props.actions.pathsUpdateGoal(path, goal, { achieved }, slackOptions)
      .then(() => this.closeDialog());
  }

  handleRemove() {
    const { actions, goal, path, profile } = this.props;

    actions.removeGoalFromPath(goal, path, profile.id);
  }

  updateField(field, value) {
    const { goal, path } = this.props;

    if (field === 'path') {
      this.setState({ path: { id: value } });
    } else {
      this.setState(prevState => ({
        ...prevState,
        goal: {
          ...prevState.goal,
          [field]: value,
        },
      }));
      this.props.actions.pathsUpdateGoal(path, goal, { [field]: value });
    }
  }

  handleSlackMessageChange(event) {
    this.setState({
      slackAdditionalMessage: event.target.value,
    });
  }

  closeDialog() {
    const { profile, path, goal, toggleOff, usersGoal } = this.props;
    const { path: statePath } = this.state;
    toggleOff(NOTIFY_ON_SLACK);
    toggleOff(DIALOG_TOGGLE);

    if (usersGoal && path.id !== statePath.id) {
      this.props.actions.moveGoalToPath(goal, path, profile.id, statePath);
    }
  }

  generateModalActions() {
    const { goal, editable } = this.props;
    const modalActions = [
      <FlatButton
        label="Close"
        onTouchTap={() => this.closeDialog()}
      />,
    ];

    if (editable) {
      modalActions.unshift(
        <FlatButton
          label="Remove"
          secondary
          onTouchTap={() => this.handleRemove()}
        />,
      );
      modalActions.unshift(
        <FlatButton
          label={goal.achieved ? 'Mark as unachieved' : 'Mark as achieved'}
          primary
          onTouchTap={() => this.toggleAchievement()}
        />);
    }

    return modalActions;
  }

  generateExtraFields() {
    const { goal: { achieved }, getToggleState, toggle, usersGoal } = this.props;
    const notifySlackValue = getToggleState(NOTIFY_ON_SLACK);
    const extraFields = [];

    if (usersGoal) {
      extraFields.unshift(({ key }) => (
        <div key={key}>
          {!achieved && (
            <div>
              <Checkbox
                style={styles.notifySlackCheckbox}
                checked={notifySlackValue}
                onCheck={() => toggle(NOTIFY_ON_SLACK)}
                label="Notify on Slack"
              />
              {notifySlackValue && (
                <TextField
                  onChange={event => this.handleSlackMessageChange(event)}
                  style={styles.additionalMessageInput}
                  hintText="Additional message (optional)"
                  value={this.state.slackAdditionalMessage}
                />
              )}
            </div>
          )}
        </div>
      ));
    }

    return extraFields;
  }

  renderGoalModal() {
    const { paths, editable, usersGoal } = this.props;
    const { path, goal } = this.state;
    const open = this.props.getToggleState(DIALOG_TOGGLE);
    const modalActions = this.generateModalActions();
    const extraFields = this.generateExtraFields();

    let modalParams = {
      ...goal,
      showModal: open,
    };

    if (usersGoal) {
      modalParams = {
        ...modalParams,
        paths,
        path: path.id,
      };
    }

    return (
      <GoalsModal
        parameters={modalParams}
        onFieldChange={(field, value) => this.updateField(field, value)}
        modalActions={modalActions}
        extraFields={extraFields}
        usersGoal={usersGoal}
        title={goal.name}
        editable={editable}
      />
    );
  }

  render() {
    const { goal, loading } = this.props;
    const achieved = goal.achieved;
    const dueDays = goal.dueDate ? this.daysLeft(goal.dueDate) : 0;
    const inProgress = !goal.achieved && goal.dueDate;
    const goalStyle = Object.assign(
      {},
      styles.goal,
      achieved && styles.achieved,
      inProgress && styles.inProgress,
    );
    // @TODO: (Kelvin De Moya) - Just for testing. Update once goal type is implemented in the api.
    const isMilestone = dueDays >= 10 || goal.level === 4;

    return (
      <Loading loading={loading}>
        <Paper style={goalStyle} zDepth={2} onTouchTap={() => this.props.toggleOn(DIALOG_TOGGLE)} >
          {isMilestone && <img src={MilestoneImg} style={styles.milestone} alt="milestone" />}
          <i className={goal.icon} style={styles.icon} />
          <span style={styles.title}>{goal.name}</span>
          <div style={styles.details}>
            <span style={styles.level}>Lvl {goal.level}</span>
            <div style={Object.assign({}, styles.status, achieved && styles.achieved)}>
              <i className={achieved ? 'icon-checkmark' : 'icon-hour-glass'} />
            </div>
            <span style={styles.dueDate}><i className="icon-history" /> {dueDays}</span>
          </div>
          {this.renderGoalModal()}
        </Paper>
      </Loading>
    );
  }
}

GoalCard.propTypes = propTypes;

GoalCard.defaultProps = {
  loading: false,
};

styles = {
  goal: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
    height: '240px',
    margin: '20px 20px 50px',
    padding: '20px',
    textAlign: 'center',
    color: '#5f5f5f',
  },
  milestone: {
    position: 'absolute',
    right: '-8px',
    top: '-8px',
    width: '150px',
  },
  icon: {
    display: 'block',
    fontSize: '100px',
    marginTop: '20px',
  },
  title: {
    display: 'flex',
    flexGrow: '1',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: '22px',
    fontWeight: '200',
    padding: '5px',
    marginTop: '10px',
  },
  details: {
    color: '#ffffff',
    position: 'absolute',
    bottom: '-15px',
    left: '25%',
    height: '30px',
    width: '50%',
    backgroundColor: '#5f5f5f',
    borderRadius: '50px',
  },
  level: {
    float: 'left',
    lineHeight: '30px',
    width: '50px',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  status: {
    position: 'absolute',
    left: '33%',
    width: '40px',
    height: '40px',
    lineHeight: '43px',
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '18px',
    borderRadius: '50px',
    backgroundColor: '#909090',
    borderColor: '#ffffff',
    margin: '-8px auto 0',
    borderWidth: '4px',
    borderStyle: 'solid',
  },
  dueDate: {
    float: 'right',
    lineHeight: '30px',
    width: '50px',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  achieved: {
    backgroundColor: '#8FD694',
    color: '#ffffff',
  },
  inProgress: {
    backgroundColor: red300,
    color: '#ffffff',
  },
  dueDatePicker: {
    marginTop: '15px',
    width: '100%',
  },
  notifySlackCheckbox: {
    marginTop: '15px',
  },
  additionalMessageInput: {
    width: '100%',
  },
};

export default toggleHOC(GoalCard);
