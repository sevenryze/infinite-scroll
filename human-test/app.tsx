import React from "react";
// tslint:disable-next-line:no-implicit-dependencies
import { hot } from "react-hot-loader";
import styled from "styled-components";
import { InfiniteScroll } from "../lib";

type IState = Readonly<{
  cardList: Array<{
    id: number;
    height: number;
  }>;
}>;

export class App extends React.PureComponent<{}> {
  public state: IState = {
    cardList: []
  };

  public async componentDidMount() {
    await this.getMoreCards();
  }

  public render() {
    return (
      <MainWrapper>
        <div className="header">I'm header</div>

        <InfiniteScroll
          appendMore={this.getMoreCards}
          refresher={this.refresh}
          appendMoreThreshold={20}
          pullingEnsureThreshold={80}
        >
          {this.state.cardList.map(this.itemRenderer)}
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

    const newData = getData(5);

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

    const newData = getData(5);

    this.setState({
      cardList: this.state.cardList.concat(newData)
    });

    return newData.length;
  };

  private itemRenderer = (item: any, index: number) => {
    return (
      <div
        className="item"
        style={{
          ...(index % 2 !== 0 ? { backgroundColor: "red" } : { backgroundColor: "#ccc" })
        }}
        js-index={index}
        key={index}
      >
        {`index: ${index}, id: ${item.id}` + ` ----------- ` + "tower edu is awesome, ".repeat(item.height + 10)}
      </div>
    );
  };
}

function getData(num: number, from = 0) {
  return new Array(num).fill(1).map((_, index) => ({
    height: Math.ceil(Math.random() * 50) + 50,
    id: from + index
  }));
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .header {
    background: rgba(32, 255, 255, 0.3);
    min-height: 5rem;
    color: red;
    font-size: 2rem;
  }
`;

export default hot(module)(App);
