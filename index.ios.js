/*
doubanBooklist
*/

import React, { Component } from 'react';
import { AppRegistry, NavigatorIOS, StyleSheet } from 'react-native';
import MainPage from './MainPage';

class filterableBookList extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.MainContainer}
        initialRoute={{title: 'Main page',component: MainPage,}}
      />
    );
  }
}

var styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  }
});

 // 注意，这里用引号括起来的'HelloWorldApp'必须和你init创建的项目名一致
AppRegistry.registerComponent('doubanBooklist', () => filterableBookList);
