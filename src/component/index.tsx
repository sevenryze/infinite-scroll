import React from "react";
import styled from "styled-components";
import { easing } from "./easing";
import throttle from "lodash.throttle";

enum Status {
  normal,
  appendLoading,
  refreshing,
  pulling,
  pullingEnsured
}

interface IState {
  status: Status;
  /**
   * We use this flag to indicate whether there are more list items.
   * When we see this flag to false, the footer should show something like `There is no list item any more!`.
   */
  hasMore: boolean;

  pullTransformDistance: number;
}

export class InfiniteScroll extends React.PureComponent<{
  /**
   * We will call this method to load more items appended to the origin list, on the time we scrolling cross the `appendMoreThreshold`.
   *
   * This method should return a counter promise to resolve or reject on single loading action.
   *
   * @returns How many new items have been appended?
   */
  appendMore: () => Promise<number>;

  /**
   * We will call this method to load items prefixed to the origin list or refresh page, according to your cases,
   * on the time we pulling cross the `pullingEnsureThreshold`.
   *
   * This method must return a promise to resolve or reject on single refresh action.
   *
   * @returns How many new items have been refresh?
   */
  refresher: () => Promise<number>;

  /**
   * How many pixels to the bottom of list we should trigger to load more.
   */
  appendMoreThreshold: number;

  /**
   * How many pixels when we pulling the list to take the refresh action.
   */
  pullingEnsureThreshold: number;
}> {
  state: IState = {
    status: Status.normal,
    hasMore: true,
    pullTransformDistance: 0
  };

  private isMount = false;
  private loadingIndicatorRef = React.createRef<HTMLDivElement>();
  private wrapperRef = React.createRef<HTMLDivElement>();
  private initialTouchClientY = 0;

  componentDidMount() {
    this.isMount = true;

    window.addEventListener("scroll", this.throttledScrollHandler);
    this.wrapperRef.current!.addEventListener("touchstart", this.touchStart, {
      passive: false
    });
    this.wrapperRef.current!.addEventListener("touchmove", this.touchMove, {
      passive: false
    });
    this.wrapperRef.current!.addEventListener("touchend", this.touchEnd);
  }

  componentWillUnmount() {
    this.isMount = false;

    window.removeEventListener("scroll", this.throttledScrollHandler);
    this.wrapperRef.current!.removeEventListener("touchstart", this.touchStart);
    this.wrapperRef.current!.removeEventListener("touchmove", this.touchMove);
    this.wrapperRef.current!.removeEventListener("touchend", this.touchEnd);
  }

  render() {
    return (
      <MainWrapper>
        <div
          ref={this.wrapperRef}
          style={{
            transform: `translateY(${this.state.pullTransformDistance - 32}px)`,
            transitionDuration: `${
              this.state.status === Status.refreshing ? "200ms" : "0s"
            }`
          }}
        >
          <div className="refreshing-indicator">
            {this.state.status === Status.refreshing && "正在刷新..."}
            {this.state.status === Status.pulling && "再使点劲！"}
            {this.state.status === Status.pullingEnsured &&
              "好啦好啦，松手吧..."}
          </div>

          {this.props.children}

          <div
            ref={this.loadingIndicatorRef}
            className="append-loading-indicator"
          >
            {this.state.status === Status.appendLoading && "正在加载..."}
            {!this.state.hasMore && "已经到最底啦！"}
          </div>
        </div>
      </MainWrapper>
    );
  }

  private handleScroll = () => {
    // Both of them are related to client viewpoort origin.
    const anchor =
      this.isMount &&
      this.loadingIndicatorRef.current!.getBoundingClientRect().top;
    const baseline = window.innerHeight - this.props.appendMoreThreshold;

    if (
      this.state.hasMore &&
      this.state.status === Status.normal &&
      anchor <= baseline
    ) {
      this.loadMore();
    }
  };

  private throttledScrollHandler = throttle(this.handleScroll, 200, {
    trailing: true,
    leading: false
  });

  private loadMore = async () => {
    this.isMount &&
      this.setState({
        status: Status.appendLoading
      });

    let loadedCount = 0;
    try {
      loadedCount = await this.props.appendMore();
    } catch {
      this.isMount &&
        this.setState({
          status: Status.normal
        });
    }

    this.isMount &&
      this.setState({
        status: Status.normal,
        hasMore: loadedCount > 0 ? true : false
      });
  };

  private prefixMore = async () => {
    // refreshing
    this.isMount &&
      this.setState({
        status: Status.refreshing
      });

    //TODO: How should we use this?
    let addNewCount = 0;
    try {
      addNewCount = await this.props.refresher();
    } catch {
      this.isMount &&
        this.setState({
          status: Status.normal,
          pullTransformDistance: 0
        });
    }

    this.setState({
      status: Status.normal,
      pullTransformDistance: 0
    });
  };

  private touchStart = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    if (e.touches.length === 1 && window.scrollY <= 0) {
      if (this.state.pullTransformDistance > 0) {
        e.preventDefault();
      }

      this.initialTouchClientY = e.touches[0].clientY;
    }
  };

  private touchMove = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    // Bypss multi-figure and normal scroll cases
    if (e.touches.length !== 1 || window.scrollY > 0) {
      return;
    }

    const distance = e.touches[0].clientY - this.initialTouchClientY;

    if (distance > 0) {
      // Prevent from scrolling wechat webview!
      e.cancelable && e.preventDefault();

      const pullHeight = easing(distance);

      this.setState({
        status:
          pullHeight > this.props.pullingEnsureThreshold
            ? Status.pullingEnsured
            : Status.pulling,
        pullTransformDistance: pullHeight
      });
    }
  };

  private touchEnd = (e: TouchEvent) => {
    if (!this.isRefreshAvaible()) return;

    if (this.state.status === Status.pullingEnsured) {
      this.prefixMore();

      this.setState({
        pullTransformDistance: 32 // Ensure the refreshing icon is visible.
      });
    } else {
      this.setState({
        status: Status.normal,
        pullTransformDistance: 0
      });
    }
  };

  private isRefreshAvaible = () => {
    return (
      this.props.refresher &&
      ![Status.refreshing, Status.appendLoading].includes(this.state.status)
    );
  };
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .append-loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 15vh;

    font-size: 16px;
  }

  .refreshing-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 32px;

    font-size: 16px;
  }
`;
