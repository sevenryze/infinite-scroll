# Table of Content

<!-- prettier-ignore-start -->

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

* [Table of Content](#table-of-content)
* [Install](#install)
* [Usage](#usage)
	* [Use the `window` object as the global scroller](#use-the-window-object-as-the-global-scroller)
	* [Use the specific dom element as local scroller](#use-the-specific-dom-element-as-local-scroller)
* [API](#api)
	* [`InfiniteScroll`](#infinitescroll)
* [Build and Test](#build-and-test)

<!-- /code_chunk_output -->

<!-- prettier-ignore-end -->

# Install

The only component exposed to external is `InfiniteScroll`. And use install script like below:

```bash
npm install --save @sevenryze/infinite-scroll
```

# Usage

## Use the `window` object as the global scroller

```JavaScript
<InfiniteScroll
  loadMore={this.getMoreCards}
  refresh={this.refresh}
  loadMoreThreshold={20}
  pullingEnsureThreshold={80}
>
  {this.state.cardList.map(this.renderItem)}
</InfiniteScroll>

refresh = async () => {
  let newData = getData(5);

  this.setState({
    cardList: newData
  });

  return newData.length;
};

getMoreCards = async () => {
  let newData = getData(5);

  this.setState({
    cardList: this.state.cardList.concat(newData)
  });

  return newData.length;
};

renderItem = (item, index) => {
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
```

## Use the specific dom element as local scroller

TODO for implement.

# API

This lib exposes only one public class: `InfiniteScroll`.

## `InfiniteScroll`

```JavaScript
<InfiniteScroll
  loadMore={this.getMoreCards}
  refresh={this.refresh}
  loadMoreThreshold={20}
  pullingEnsureThreshold={80}
/>
```

- `loadMore: () => Promise<number>`: The scroller will invoke this method when scrolled cross the threshold. You should return the count of loaded items.
- `refresh: () => Promise<number>`: The refresher, the same usage as `loadMore`.
- `loadMoreThreshold: number`: The threshold to the bottom of rendered list.
- `pullingEnsureThreshold: number`: The threshold pulling to refresh.

# Build and Test

Build? you shall use this one and forget other hand-tired works.

---

<h2 align="center">Maintainer</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/sevenryze?v=3">
        <a href="https://github.com/sevenryze">Seven Ryze</a>
      </td>
    </tr>
  </tbody>
</table>
