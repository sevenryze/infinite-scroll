import * as React from "react";

type Status = "loading" | "refreshing" | "pulling" | "pulling-ensure" | "init";

export class InfiniteScroll extends React.PureComponent<
  {
    /**
     * We will call this method to load more on the time we scroll cross the threshold.
     * This method must return a promise to resolve or reject on single loading action.
     *
     * @returns How many new items have been loaded?
     */
    loadMore: () => Promise<number>;

    loadMoreIndicator: () => React.ReactElement<HTMLElement>;
    noMoreItemIndicator: () => React.ReactElement<HTMLElement>;

    /**
     * How many pixels to the bottom of list we should trigger to load more.
     */
    loadMoreThreshold: number;
  },
  {
    status: Status;
    /**
     * We use this flag to indicate whether there are more list items.
     * When we see this flag to false, the footer should show something like `There is no list item any more!`.
     */
    hasMore: boolean;
  }
> {
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
        document.body.offsetHeight - this.props.loadMoreThreshold &&
      !this.props.isFetching
    ) {
      this.props.loadMore();
    }
  };
}
