import * as React from "react";

export class InfiniteScroll extends React.PureComponent<{
  /**
   * indicate if it's on loading status.
   */
  isFetching: boolean;

  /**
   * We will call this method to load more by the time we scroll cross the threshold.
   */
  loadMore: () => void;

  /**
   * How many pixels to the bottom of list we should trigger to load more.
   */
  threshold: number;
}> {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return <>{this.props.children}</>;
  }

  private handleScroll = e => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - this.props.threshold &&
      !this.props.isFetching
    ) {
      this.props.loadMore();
    }
  };
}
