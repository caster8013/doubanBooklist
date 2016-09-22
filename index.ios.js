/*
doubanBooklist
*/

import React, { Component } from 'react';
import { AppRegistry, Navigator, StyleSheet,TouchableHighlight,Text,Platform } from 'react-native';
import MainPage from './MainPage';
import BookScreen from './BookScreen';

class filterableBookList extends Component {
  render() {
    return (
      <Navigator
        style={styles.MainContainer}
        initialRoute={{title: 'Main page'}}
        renderScene={
          (route, navigator) =>{
            console.log(navigator.getCurrentRoutes());
            if(route.title != "Main page")
              return <BookScreen book={route.book} navigator={navigator} title={route.title}/>;
            else
              return route.tag ? <MainPage navigator={navigator} tag={route.tag}/> : <MainPage navigator={navigator}/>;
          }
        }
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton:(route,navigator,index,navState)=>{
                if (navigator.getCurrentRoutes().length == 1) return null;
                else {
                  return (
                    <TouchableHighlight onPress={() => navigator.pop()}
                      underlayColor='transparent'>
                      <Text style={styles.navLeftButton}>&lt;Go Back</Text>
                    </TouchableHighlight>
                  )
                }
              },
              RightButton: (route, navigator, index, navState) =>{ return null; },
              Title:(route,navigator,index,navState)=><Text style={styles.navTitle}>{route.title}</Text>
            }}
            style={styles.navBar}
          />
        }
      />
    );
  }
}

var styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    backgroundColor: '#eaffea',
    height:50
  },
  navTitle: {
    fontWeight:'bold',
    paddingTop:(Platform.OS === 'ios') ? 5 : 20,
  },
  navLeftButton:{
    color:'blue',
    paddingTop:(Platform.OS === 'ios') ? 5 : 13,
    paddingLeft:(Platform.OS === 'ios') ? 5 : 0,
    fontWeight:'bold',
    height:50
  }
});

 // 注意，这里用引号括起来的'HelloWorldApp'必须和你init创建的项目名一致
AppRegistry.registerComponent('doubanBooklist', () => filterableBookList);
