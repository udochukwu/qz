import { css } from 'styled-system/css';
import Player from 'lottie-react';

const MessageLoading = () => {
  return (
    <div
      className={css({
        display: 'inline-block',
        width: '30px',
        height: '30px',
        marginLeft: '-5px',
      })}>
      <Player
        autoplay
        loop
        animationData={require('@assets/lottie/chat_loading.json')}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default MessageLoading;
