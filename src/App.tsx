import React from "react";
import { hot } from "react-hot-loader";
import styled from "styled-components";
import { InfiniteScroll } from "./component";

export class App extends React.Component<
  {},
  {
    cardList: {
      id: number;
      height: number;
    }[];
  }
> {
  constructor(props: object) {
    super(props);

    this.state = {
      cardList: []
    };
  }

  async componentDidMount() {
    await this.getMoreCards();
  }

  render() {
    return (
      <MainWrapper>
        <div className="header" />

        <InfiniteScroll
          appendMore={this.getMoreCards}
          refresher={this.refresh}
          appendMoreThreshold={20}
          pullingEnsureThreshold={80}
        >
          {this.state.cardList.map(this.renderItem)}
        </InfiniteScroll>
      </MainWrapper>
    );
  }

  private refresh = async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    let newData = getData(5);

    this.setState({
      cardList: newData.concat(this.state.cardList)
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

  private renderItem = (item: any, index: number) => {
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
        {`index: ${index}, id: ${item.id}` +
          ` ----------- ` +
          "tower edu is awesome, ".repeat(item.height + 10)}
      </div>
    );
  };
}

function getData(num: number, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    id: from + index,
    height: Math.ceil(Math.random() * 50) + 50
  }));
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .header {
    background: rgba(0, 0, 0, 0.3);
    min-height: 5rem;
  }
`;

export default hot(module)(App);
