import React,{Component} from 'react';
import {
  Platform,TouchableHighlight,TouchableNativeFeedback,
  Image,Text,TextInput,
  ActivityIndicator,Switch,ListView,
  ScrollView,StyleSheet,View,
} from 'react-native';
import Logo from './Logo';
import BookScreen from './BookScreen';

var cache = {
  totalForQuery:{},
  dataForQuery:{},
};
var LOADING = {};

class BookCell extends Component{
  render(){
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.BookCellPadding}>
        <TouchableElement onPress={this.props.onSelect}>
          <View style={styles.container}>
            <Image source={{uri:this.props.book.image}} style={[styles.base, {overflow: 'hidden'}]}/>
            <View style={styles.rightContainer}>
              <Text>{this.props.book.title}</Text>
              <Text>{this.props.book.author}</Text>
              <Text>{this.props.book.rating.average}</Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
}

export default class MainPage extends Component {

  constructor(props){
    super(props);
    this.timeoutID = null;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isLoading:false,
      isLoadingTail:false,
      text:"life",
      flag:false,
      dataSource: this.ds.cloneWithRows([])
    };
  }

  _getUrlForQuery(tag,start){
      return !start ? "https://api.douban.com/v2/book/search?q="+tag :
        "https://api.douban.com/v2/book/search?q="+tag+"&start="+start;
  }

  componentDidMount(){
    this.textChange("life");
  }

  textChange(input){
    let key = input.trim().toLowerCase();
    this.timeoutID && clearTimeout(this.timeoutID);
    if(key){
      this.setState({text:key});
      //console.log("mark");
      this.timeoutID = setTimeout(() => this.getData(key), 500);
      //console.log("moo");
    } else {
      this.setState({text:"",dataSource: this.ds.cloneWithRows([])});
    }
  }

  switchChange(switchButton){
    this.setState({flag:switchButton});
    this.getData(this.state.text,switchButton);
  }

  getData(keyWord,switchStatus){
      if(!cache.dataForQuery[keyWord]){ //New keywords.

        //console.log(this._getUrlForQuery(keyWord));
        this.setState({isLoading:true});
        fetch(this._getUrlForQuery(keyWord))
        .then((response) => response.json())
        .then((data)=>{
          //console.log(data);
          cache.totalForQuery[keyWord] = data.total;
          cache.dataForQuery[keyWord] = data.books;
          //console.log(data.books);
          let _books = data.books.filter(
            (book)=>{ if(!this.state.flag || book.rating.average >= 8.0) return true; else return false;}
          );
          if (this.state.text !== keyWord) {
            return;// do not update state if the query is stale(过时的)
          }
          this.setState({dataSource:this.ds.cloneWithRows(_books),isLoading:false});
        })
        .catch((error) => {
          this.setState({dataSource:this.ds.cloneWithRows([]),isLoading:false})
          //console.log("get data function error: "+error);
        });

      } else {  //keywords have been queried.query data for keywords are cached.
        let _books = cache.dataForQuery[keyWord].filter(
          (book)=>{ if(!switchStatus || book.rating.average >= 8.0) return true; else return false;}
        );
        this.setState({dataSource:this.ds.cloneWithRows(_books)});
      }

  }

  selectBook(book){
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: book.title,
        component: BookScreen,
        passProps: {book},
      });
    }
  }

  onEndReached(){
    console.log("listviewEndReached");

    let keyWord = this.state.text;
    let flag = this.state.flag;
    if(this.state.isLoadingTail || LOADING[keyWord])return;

    if(cache.dataForQuery[keyWord]){
      this.setState({isLoadingTail:true});
      LOADING[keyWord] = true;
      fetch(this._getUrlForQuery(keyWord,cache.dataForQuery[keyWord].length+1))
      .then((response) => response.json())
      .then((data)=>{
        console.log(this._getUrlForQuery(keyWord,cache.dataForQuery[keyWord].length+1),data);
        let dataForBooks = cache.dataForQuery[keyWord].slice();
        for(let i in data.books){dataForBooks.push(data.books[i]);}
        cache.dataForQuery[keyWord] = dataForBooks;
        let _books = dataForBooks.filter(
          (book)=>{ if(!flag || book.rating.average >= 8.0) return true; else return false;}
        );
        if (this.state.text !== keyWord || this.state.flag != flag) { return; } // do not update state if the query is stale(过时的)
        this.setState({dataSource:this.ds.cloneWithRows(_books),isLoadingTail:false});
        LOADING[keyWord] = false;
        console.log(cache.dataForQuery[keyWord]);
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoadingTail:false});
        LOADING[keyWord] = false;
      });
    }
  }

  renderFooter(){
    console.log("renderFooter");
    if (!this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <ActivityIndicator style={styles.scrollSpinner} />;
  }

  render() {
    console.log('----------render---------');
    return (
      <ScrollView style={[styles.MainContainer,{padding:5}]}>
        <Logo style={styles.MainContainer}/>
        <View style={styles.searchBar}>
        <TextInput
          style={styles.searchBarInput}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.text}
          placeholder="Type here some key words!"
          onChangeText={this.textChange.bind(this)}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        />
        <ActivityIndicator animating={this.state.isLoading} style={styles.spinner}/>
        </View>
        <View style={styles.switchWrapper}>
          <Switch
            value={this.state.flag}
            onValueChange={this.switchChange.bind(this)}
          />
          <Text style={{fontSize:20,padding:8}}>8星以上</Text>
        </View>
        <View style={{paddingTop: 5}}>
          <ListView
            ref="listview"
            initialListSize={20}
            pageSize={20}
            enableEmptySections={true}
            renderSeparator={(sectionID,rowID,adjacentRowHighlighted)=>
              <View key={'sep'+rowID} style={styles.rowSeparator}></View>
              }
            renderFooter={this.renderFooter.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            dataSource={this.state.dataSource}
            renderRow={(book)=><BookCell key={book.id} onSelect={()=>this.selectBook(book)} book={book}/>}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  BookCellPadding:{
    padding:5
  },
  base: {
    width: 108,
    height: 137,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 3,
    padding:5,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  switchWrapper:{
    flexDirection:'row',
    //marginBottom:15,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  searchBar: {
    //marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});
