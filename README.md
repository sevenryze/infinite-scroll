# Install

The only component exposed to external is `InfiniteScroll`. And use install script like below:

```bash
npm install --save @sevenryze/infinite-scroll
```

# Usage

## Use the `window` object as the global scroller

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
          <LoadingIndicator>Loading...</LoadingIndicator>
        )}
      </MainWrapper>
    );
  }

  renderItem = (item, index) => {
    return (
      <div
        className="item"
        style={{
          ...(index % 2 !== 0 ? { backgroundColor: "#ccc" } : {})
        }}
        js-index={index}
        key={index}
      >
        {index + ` ----------- ` + "Great work!".repeat(item.height + 100)}
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

## Use the specific dom element as local scroller

TODO for implement.

# API

This component exposes one public class.

## `InfiniteScroll`

```JavaScript
<InfiniteScroll
  isFetching={this.state.isFetchingData}
  loadMore={this.getMoreCards}
  threshold={10}
/>
```
