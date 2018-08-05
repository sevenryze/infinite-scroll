import * as React from "react";

/**********************************************************************************************************************/

export class InfiniteScroll extends React.PureComponent<{
  /**
   * 是否正在加载
   */
  isFetching: boolean;

  /**
   * 调用此函数加载更多列表项
   */
  loadMore: () => void;

  /**
   * 距离底部多少像素触发加载行为
   */
  threshold: number;
}> {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = e => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - this.props.threshold &&
      !this.props.isFetching
    ) {
      this.props.loadMore();
    }
  };

  render() {
    return <>{this.props.children}</>;
  }
}
