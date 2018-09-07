import * as React from "react";
import { hot } from "react-hot-loader";
import styled from "styled-components";
import { InfiniteScroll } from "./component";

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

  private getMoreCards = async () => {
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

  private renderItem = (item, index) => {
    return (
      <div
        className="item"
        style={{
          ...(index % 2 !== 0 ? { backgroundColor: "#ccc" } : {})
        }}
        js-index={index}
        key={index}
      >
        {item.id +
          ` ----------- ` +
          "tower edu is awesome, ".repeat(item.height + 100)}
      </div>
    );
  };
}

function getData(num, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    id: from + index,
    height: Math.ceil(Math.random() * 1000) + 50
  }));
}

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

export default hot(module)(App);
