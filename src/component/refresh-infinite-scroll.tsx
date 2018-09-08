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

    /**
     * We will call this method to refresh list on the time we pulling cross the threshold.
     * This method must return a promise to resolve or reject on single refresh action.
     *
     * @returns How many new items have been refresh?
     */
    refresh: () => Promise<number>;

    /**
     * How many pixels to the bottom of list we should trigger to load more.
     */
    loadMoreThreshold: number;

    loadMoreIndicator: () => React.ReactElement<HTMLElement>;
    noMoreItemIndicator: () => React.ReactElement<HTMLElement>;

    /**
     * We use this method to render the indicator element for pulling action.
     *
     * @param isPullEnsure indicate if the pulling distance is bigger than `pullingEnsureThreshold` parameter.
     */
    pullingIndicator: (
      isPullEnsure: boolean
    ) => React.ReactElement<HTMLElement>;

    pullingEnsureThreshold: number;
  },
  {
    status: Status;
    /**
     * We use this flag to indicate whether there are more list items.
     * When we see this flag to false, the footer should show something like `There is no list item any more!`.
     */
    hasMore: boolean;

    pullHeight: number;
  }
> {
  state = {
    status: "init" as Status,
    hasMore: true,
    pullHeight: 0
  };

  private isMount: boolean;
  private loadingWatermarkRef = React.createRef<HTMLDivElement>();
  private wrapperRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.isMount = true;

    /*    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("touchmove", this.touchMove, {
      passive: false
    });
    window.addEventListener("touchend", this.touchEnd); */
  }

  componentWillUnmount() {
    this.isMount = false;

    // window.removeEventListener("scroll", this.handleScroll);
    // window.removeEventListener("touchmove", this.touchMove);
    // window.removeEventListener("touchend", this.touchEnd);
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        style={{
          transform: `translate3d(0, ${this.state.pullHeight}px, 0)`
        }}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
        onScroll={this.handleScroll}
      >
        {this.state.status === "loading" && this.props.loadMoreIndicator()}
        {this.state.status === "refreshing" && this.props.loadMoreIndicator()}
        {this.state.status === "pulling" && this.props.pullingIndicator(false)}
        {this.state.status === "pulling-ensure" &&
          this.props.pullingIndicator(true)}

        {this.props.children}

        {this.state.status === "loading" && this.props.loadMoreIndicator()}

        {!this.state.hasMore && this.props.noMoreItemIndicator()}

        <div
          ref={this.loadingWatermarkRef}
          style={{
            width: "100%",
            height: "50px"
          }}
        />
      </div>
    );
  }

  // TODO: we need throttle this method.
  private handleScroll = () => {
    let loadingWatermarkClientRect = this.loadingWatermarkRef.current.getBoundingClientRect();

    /* console.log(
      `toBottom: ${Math.abs(
        window.innerHeight - loadingWatermarkClientRect.bottom
      )}`
    ); */

    /* let delta = Math.abs(
      window.innerHeight - loadingWatermarkClientRect.bottom
    ); */

    let delta =
      loadingWatermarkClientRect.bottom -
      this.wrapperRef.current.getBoundingClientRect().bottom;

    if (
      this.state.hasMore &&
      this.state.status === "init" &&
      delta < this.props.loadMoreThreshold
    ) {
      this.loadMore();
    }
  };

  private loadMore = async () => {
    this.isMount &&
      this.setState({
        status: "loading"
      });

    let loadedCount;
    try {
      loadedCount = await this.props.loadMore();
    } catch {
      this.isMount &&
        this.setState({
          status: "init"
        });
    }

    this.isMount &&
      this.setState({
        status: "init",
        hasMore: loadedCount > 0 ? true : false
      });
  };

  private initialTouchClientY: number;

  private touchMove = (e: React.TouchEvent) => {
    e.stopPropagation();

    if (!this.isRefreshAvaible()) return;

    if (this.wrapperRef.current.scrollTop > 0) {
      return;
    }

    if (!this.initialTouchClientY) {
      this.initialTouchClientY = e.touches[0].clientY;
    }

    const pulledDistance = e.touches[0].clientY - this.initialTouchClientY;
    //console.log(`pullDistance: ${pulledDistance}`);

    if (pulledDistance <= 0) {
      return;
    }

    const pullHeight = easing(pulledDistance);
    console.log(`pullHeight: ${pullHeight}`);

    this.setState({
      status:
        pullHeight > this.props.pullingEnsureThreshold
          ? "pulling-ensure"
          : "pulling",
      pullHeight: pullHeight
    });
  };

  touchEnd = () => {
    if (!this.isRefreshAvaible()) return;

    if (this.state.status === "pulling-ensure") {
      this.refresh();
      this.setState({
        pullHeight: 0
      });
    } else {
      this.setState({
        status: "init",
        pullHeight: 0
      });
    }
  };

  private refresh = async () => {
    // refreshing
    this.setState({
      status: "refreshing"
    });

    await this.props.refresh();

    this.setState({
      status: "init"
    });
  };

  private isRefreshAvaible = () => {
    return (
      this.props.refresh &&
      !["refreshing", "loading"].includes(this.state.status)
    );
  };
}

// easeOutSine
function easing(distance) {
  // t: current time, b: beginning value, c: change in value, d: duration
  const t = distance;
  const b = 0;
  const d = window.screen.availHeight; // 允许拖拽的最大距离
  const c = d / 2.5; // 提示标签最大有效拖拽距离

  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}
