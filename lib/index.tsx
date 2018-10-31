import throttle from "lodash.throttle";
import React from "react";
import styled from "styled-components";
import { easing } from "./easing";
import { Status } from "./interface";

type IProps = Readonly<{
  /**
   * We will call this method to load more items appended to the origin list, on the time we scrolling cross the `appendMoreThreshold`.
   */
  appendMore: () => void;

  /**
   * We will call this method to load items prefixed to the origin list or refresh page, according to your cases,
   * on the time we pulling cross the `pullingEnsureThreshold`.
   */
  prefixMore: () => void;

  /**
   * How many pixels to the bottom of list we should trigger to load more.
   */
  appendMoreThreshold: number;

  /**
   * How many pixels when we pulling the list to take the refresh action.
   */
  pullingEnsureThreshold: number;

  /**
   * Indicate whether we are currently on loading more append items.
   */
  isOnAppendLoading: boolean;

  /**
   * Indicate whether we are currently on loading more prefix items.
   */
  isOnPrefixLoading: boolean;

  /**
   * Do not actually call the append loading function.
   *
   * Useful to prevent infinite call loading function at the bottom of list,
   * when there is no more list item to append.
   */
  isCloseAppendMore: boolean;
}>;

type IState = Readonly<{
  status: Status;
  pullTransformDistance: number;
}>;

export class InfiniteScroll extends React.PureComponent<IProps, IState> {
  public state: IState = {
    pullTransformDistance: 0,
    status: Status.reset,
  };

  public componentDidMount() {
    this.isMount = true;

    const target = this.wrapperRef.current!;

    window.addEventListener("scroll", this.throttledScrollHandler);
    target.addEventListener("touchstart", this.touchStart, {
      passive: false,
    });
    target.addEventListener("touchmove", this.touchMove, {
      passive: false,
    });
    target.addEventListener("touchend", this.touchEnd);
  }

  public componentWillUnmount() {
    this.isMount = false;

    const target = this.wrapperRef.current!;

    window.removeEventListener("scroll", this.throttledScrollHandler);
    target.removeEventListener("touchstart", this.touchStart);
    target.removeEventListener("touchmove", this.touchMove);
    target.removeEventListener("touchend", this.touchEnd);
  }

  public render() {
    const transformY = this.state.pullTransformDistance - (this.props.isOnPrefixLoading ? 0 : 32);

    return (
      <MainWrapper>
        <div
          ref={this.wrapperRef}
          style={{
            transform: `translateY(${transformY}px)`,
            transitionDuration: `${this.props.isOnPrefixLoading ? "200ms" : "0s"}`,
          }}
        >
          <div className="prefix-loading-indicator">
            {this.props.isOnPrefixLoading && "正在刷新..."}
            {this.state.status === Status.pulling && "再使点劲！"}
            {this.state.status === Status.pullingEnsured && "好啦好啦，松手吧..."}
          </div>

          {this.props.children}

          <div ref={this.loadingIndicatorRef} className="append-loading-indicator">
            {this.props.isOnAppendLoading && "正在加载..."}
            {this.props.isCloseAppendMore && "已经到最底啦！"}
          </div>
        </div>
      </MainWrapper>
    );
  }

  private isMount = false;
  private loadingIndicatorRef = React.createRef<HTMLDivElement>();
  private wrapperRef = React.createRef<HTMLDivElement>();
  private initialTouchClientY = 0;

  private throttledScrollHandler = throttle(
    () => {
      if (this.props.isCloseAppendMore || this.props.isOnAppendLoading) {
        return;
      }

      // Both of them are related to client viewpoort origin.
      const anchor = this.isMount && this.loadingIndicatorRef.current!.getBoundingClientRect().top;
      const baseline = window.innerHeight - this.props.appendMoreThreshold;

      if (this.state.status === Status.reset && anchor <= baseline) {
        this.props.appendMore();
      }
    },
    200,
    {
      leading: false,
      trailing: true,
    }
  );

  private touchStart = (e: TouchEvent) => {
    if (!this.isPrefixLoadAvaible()) {
      return;
    }

    if (e.touches.length === 1 && window.scrollY <= 0) {
      if (this.state.pullTransformDistance > 0) {
        e.preventDefault();
      }

      this.initialTouchClientY = e.touches[0].clientY;
    }
  };

  private touchMove = (e: TouchEvent) => {
    if (!this.isPrefixLoadAvaible()) {
      return;
    }

    // Bypss multi-figure and normal scroll cases
    if (e.touches.length !== 1 || window.scrollY > 0) {
      return;
    }

    const distance = e.touches[0].clientY - this.initialTouchClientY;

    if (distance > 0) {
      // Prevent from scrolling wechat webview!
      e.cancelable && e.preventDefault();

      const pullHeight = easing(distance, window.screen.availHeight);

      this.setState({
        pullTransformDistance: pullHeight,
        status: pullHeight > this.props.pullingEnsureThreshold ? Status.pullingEnsured : Status.pulling,
      });
    }
  };

  private touchEnd = (e: TouchEvent) => {
    if (!this.isPrefixLoadAvaible()) {
      return;
    }

    if (this.state.status === Status.pullingEnsured) {
      this.props.prefixMore();
    }

    this.setState({
      pullTransformDistance: 0,
      status: Status.reset,
    });
  };

  private isPrefixLoadAvaible = () => {
    return this.props.prefixMore && !this.props.isOnAppendLoading;
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

  .prefix-loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 16px;

    height: 32px;
  }
`;
