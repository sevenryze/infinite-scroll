# 目录

# 使用方法

本组件对外暴露`InfiniteScroll`组件。

# 用法

## 使用 window 作为全局列表

```JavaScript
import * as React from "react";
import styled from "styled-components";
import { InfiniteScroll } from "./component";
import { hot } from "react-hot-loader";

/**********************************************************************************************************************/
const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const LoadingIndicator = styled.div`
  margin: 2rem auto;
  height: 3rem;

  text-align: center;

  font-size: larger;
`;

export class App extends React.Component<
  {},
  {
    isFetchingData: boolean;
    cardList: any[];
  }
> {
  state = {
    isFetchingData: true,
    cardList: []
  };

  getMoreCards = async () => {
    this.setState({
      isFetchingData: true
    });

    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    let newData = getData(5);

    this.setState({
      isFetchingData: false,
      cardList: this.state.cardList.concat(newData)
    });
  };

  async componentDidMount() {
    await this.getMoreCards();
  }

  render() {
    return (
      <MainWrapper>
        <InfiniteScroll
          isFetching={this.state.isFetchingData}
          loadMore={this.getMoreCards}
          threshold={10}
        />

        {this.state.cardList.map(this.renderItem)}

        {this.state.isFetchingData && (
          <LoadingIndicator>正 在 加 载...</LoadingIndicator>
        )}
      </MainWrapper>
    );
  }

  renderItem = (item, index) => {
    return (
      <div
        className="item"
        style={{
          //minHeight: item.height,
          ...(index % 2 !== 0 ? { backgroundColor: "#ccc" } : {})
        }}
        js-index={index}
        key={index}
      >
        {index + ` ----------- ` + "好".repeat(item.height + 100)}
      </div>
    );
  };
}

function getData(num, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    content: {
      id: from + index,
      height: Math.ceil(Math.random() * 1000) + 50
    },
    height: Math.ceil(Math.random() * 1000) + 50
  }));
}

export default hot(module)(App);
```

# API

This component exposes one public component.

## `InfiniteScroll`
