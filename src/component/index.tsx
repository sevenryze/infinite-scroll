import * as React from "react";
import styled from "styled-components";
import { easing } from "./easing";

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

    /**
     * How many pixels when we pulling the list to take the refresh action.
     */
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
  private loadingIndicatorRef = React.createRef<HTMLDivElement>();
  private wrapperRef = React.createRef<HTMLDivElement>();
  private initialTouchClientY: number;

  componentDidMount() {
    this.isMount = true;

    window.addEventListener("scroll", this.handleScroll);
    this.wrapperRef.current.addEventListener("touchstart", this.touchStart, {
      passive: false
    });
    this.wrapperRef.current.addEventListener("touchmove", this.touchMove, {
      passive: false
    });
    this.wrapperRef.current.addEventListener("touchend", this.touchEnd);
  }

  componentWillUnmount() {
    this.isMount = false;

    window.removeEventListener("scroll", this.handleScroll);
    this.wrapperRef.current.removeEventListener("touchstart", this.touchStart);
    this.wrapperRef.current.removeEventListener("touchmove", this.touchMove);
    this.wrapperRef.current.removeEventListener("touchend", this.touchEnd);
  }

  render() {
    return (
      <MainWrapper>
        <div
          ref={this.wrapperRef}
          style={{
            transform: `translateY(${this.state.pullHeight - 32}px)`,
            transitionDuration: `${
              this.state.status === "refreshing" ? "200ms" : "0s"
            }`
          }}
        >
          <div className="pull-to-refresh-indicator">
            {this.state.status === "refreshing" && "正在刷新..."}
            {this.state.status === "pulling" && "再使点劲！"}
            {this.state.status === "pulling-ensure" && "好啦好啦，松手吧..."}
          </div>

          {this.props.children}

          <div ref={this.loadingIndicatorRef} className="loading-indicator">
            {this.state.status === "loading" && "正在加载..."}
            {!this.state.hasMore && "已经到最底啦！"}
          </div>
        </div>
      </MainWrapper>
    );
  }

  private handleScroll = () => {
    // Both of them are related to client viewpoort origin.
    const anchor = this.loadingIndicatorRef.current.getBoundingClientRect().top;
    const baseline = window.innerHeight - this.props.loadMoreThreshold;

    if (
      this.state.hasMore &&
      this.state.status === "init" &&
      anchor <= baseline
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

  private touchStart = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    if (e.touches.length === 1 && window.scrollY <= 0) {
      if (this.state.pullHeight > 0) {
        e.preventDefault();
      }

      this.initialTouchClientY = e.touches[0].clientY;
    }
  };

  private touchMove = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    // multi or y >= 0
    if (e.touches.length !== 1 || window.scrollY > 0) {
      return;
    }

    let distance = e.touches[0].clientY - this.initialTouchClientY;

    if (distance > 0) {
      const pullHeight = easing(distance);

      if (distance) {
        // Prevent to scroll wechat webview!
        e.cancelable && e.preventDefault();
      }

      this.setState({
        status:
          pullHeight > this.props.pullingEnsureThreshold
            ? "pulling-ensure"
            : "pulling",
        pullHeight: pullHeight
      });
    }
  };

  private touchEnd = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    if (this.state.status === "pulling-ensure") {
      this.refresh();

      this.setState({
        pullHeight: 32 // Ensure the refreshing icon is visible.
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
      status: "init",
      pullHeight: 0
    });
  };

  private isRefreshAvaible = () => {
    return (
      this.props.refresh &&
      !["refreshing", "loading"].includes(this.state.status)
    );
  };
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 15vh;

    font-size: 16px;
  }

  .pull-to-refresh-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 32px;

    font-size: 16px;
  }
`;
