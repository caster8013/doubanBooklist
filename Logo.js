import React,{Component} from 'react';
import {Image,StyleSheet} from 'react-native';

export default class Logo extends Component {
  render() {
    let pic = {
      uri: 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png'
    };
    return (<Image source={pic} style={[styles.logo, {overflow: 'visible'}]}/>);
  }
}

var styles = StyleSheet.create({
  logo:{
    width:153,
    height:30,
  }
});
