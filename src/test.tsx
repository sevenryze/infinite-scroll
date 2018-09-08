import * as React from "react";
import { hot } from "react-hot-loader";
import styled from "styled-components";
import { InfiniteScroll } from "./component/scroll";

export class App extends React.Component<
  {},
  {
    cardList: any[];
  }
> {
  state = {
    cardList: []
  };

  async componentDidMount() {
    await this.getMoreCards();
  }

  render() {
    return (
      <MainWrapper>
        <div className="monitor" id="monitor" />

        <InfiniteScroll
          loadMore={this.getMoreCards}
          loadMoreThreshold={10}
          loadMoreIndicator={() => (
            <LoadingIndicator>正 在 加 载...</LoadingIndicator>
          )}
          noMoreItemIndicator={() => (
            <LoadingIndicator>已经到最底端啦！</LoadingIndicator>
          )}
          refresh={this.refresh}
          pullingEnsureThreshold={70}
          pullingIndicator={this.getPullingIndicator}
        >
          {this.state.cardList.map(this.renderItem)}
        </InfiniteScroll>
      </MainWrapper>
    );
  }

  private getPullingIndicator = (isPullingEnsure: boolean) => {
    return (
      <div className="pulling-indicator">
        {isPullingEnsure ? "松开手刷新" : "下拉刷新"}
      </div>
    );
  };

  private refresh = async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    let newData = getData(5);

    this.setState({
      cardList: newData
    });

    return newData.length;
  };

  private getMoreCards = async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    let newData = getData(5);

    this.setState({
      cardList: this.state.cardList.concat(newData)
    });

    return newData.length;
  };

  private renderItem = (item, index) => {
    return (
      <div
        className="item"
        style={{
          ...(index % 2 !== 0
            ? { backgroundColor: "red" }
            : { backgroundColor: "#ccc" })
        }}
        js-index={index}
        key={index}
      >
        {item.id +
          ` ----------- ` +
          "tower edu is awesome, ".repeat(item.height + 10)}
      </div>
    );
  };
}

function getData(num, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    id: from + index,
    height: Math.ceil(Math.random() * 50) + 50
  }));
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;

  .monitor {
    background: rgba(0, 0, 0, 0.5);
    min-height: 5rem;

    font-size: 1.5rem;
    color: red;
  }

  .pulling-indicator {
    position: fixed;
    top: 0;

    font-size: 2rem;
    width: 100%;
    text-align: center;
  }
`;

const LoadingIndicator = styled.div`
  height: 3rem;

  text-align: center;

  font-size: larger;
`;

export default hot(module)(App);
