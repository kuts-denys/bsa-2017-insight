import React from 'react';
import { List, ListItem } from 'material-ui/List';
import propTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import MyThemeProvider from 'material-ui/styles/MuiThemeProvider';

const SingleConversation = (props) => {
  const messages = props.conversation.messages;
  const author = !!messages.length && messages[messages.length - 1].author ?
    messages[messages.length - 1].author : null;
  const userName = author ? author.item.username : null;
  const userAvatar = author ? author.item.avatar : null;

  return (<div>
    <MyThemeProvider>
      <List>
        {!messages.length ? <ListItem
          primaryText={'No messages in conversation'}
          leftAvatar={<Avatar src={`avatars/${userAvatar}`} />}
        /> : <ListItem
          onClick={() => {
            props.handler();
            props.setStatistic(props.conversation);
          }}
          leftAvatar={<Avatar src={`avatars/${userAvatar}`} />}
          primaryText={typeof messages[messages.length - 1].body === 'object' ?
            `${messages[messages.length - 1].body.fileName}.${messages[messages.length - 1].body.fileType}` :
            messages[messages.length - 1].body}
          secondaryText={userName}
          secondaryTextLines={2}
        />}
        <Divider inset={true} />
      </List>
    </MyThemeProvider>
  </div>);
};

SingleConversation.propTypes = {
  setStatistic: propTypes.func,
  conversation: propTypes.shape({
    _id: propTypes.string.isRequired,
    participants: propTypes.arrayOf(propTypes.shape({
      userType: propTypes.string,
      user: propTypes.any
    })).isRequired,
    messages: propTypes.arrayOf(propTypes.any).isRequired,
    open: propTypes.bool,
    createdAt: propTypes.oneOfType([propTypes.number, propTypes.string])
  }),
  handler: propTypes.func
};
export default SingleConversation;
