import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import LiveChat, { LiveChatProps } from 'react-native-livechat';

const LivChat = () => {
  const webViewRef = useRef(null);
  const liveChatProps: LiveChatProps = {
    license: 'YOUR_LIVECHAT_LICENSE', // Replace with your actual LiveChat license
  };

  const sendMessageToWebView = (message) => {
    webViewRef.current.injectJavaScript(`
      LiveChatWidget.call('sendMessage', { text: "${message}" });
      true; // note: this is required, or you'll sometimes get silent failures
    `);
  };

  const liveChatHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LiveChat</title>
      </head>
      <body>
        <script>
          window.__lc = window.__lc || {};
          window.__lc.license = 18088392;
          window.__lc.integration_name = "manual_onboarding";
          window.__lc.product_name = "livechat";
          ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice));

          window.addEventListener('message', function(event) {
            const message = event.data;
            if (message.type === 'incoming_message') {
              window.ReactNativeWebView.postMessage(JSON.stringify(message));
            }
          });

          LiveChatWidget.on('new_message', function(data) {
            window.postMessage({ type: 'incoming_message', data });
          });
        </script>
        <noscript>
          <a href="https://www.livechat.com/chat-with/18088392/" rel="nofollow">Chat with us</a>, powered by 
          <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>
        </noscript>
      </body>
    </html>
  `;

  const onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === 'incoming_message') {
      console.log('Received message:', message.data);
    }
  };

  return (
    <View style={styles.container}>
    <LiveChat {...liveChatProps} />  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LivChat;
