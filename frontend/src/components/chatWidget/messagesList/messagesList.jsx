import React from 'react';
import propTypes from 'prop-types';
import Message from './../Message/Message';
import styles from './styles.scss';

const MessagesList = (props) => {
  return (
    <ul className={styles.messagesList}>
      {/*{props.messages.map((message, i) => {*/}
        {/*return (*/}
          {/*<Message key={message.id} body={message.body} />*/}
        {/*);*/}
      {/*})}*/}
    </ul>
  );
};

MessagesList.propTypes = {
  messages: propTypes.array,
};

export default MessagesList;
