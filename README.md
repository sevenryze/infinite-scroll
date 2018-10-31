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
  appendMore={this.getMoreCards}
  prefixMore={this.refresh}
  isOnAppendLoading={this.state.isOnAppendLoading}
  isOnPrefixLoading={this.state.isOnPrefixLoading}
  isCloseAppendMore={this.state.isNoMore}
  appendMoreThreshold={20}
  pullingEnsureThreshold={80}
>
  {this.state.cardList.map(this.renderItem)}
</InfiniteScroll>
```

## Use the specific dom element as local scroller

TODO for implement.

# API

This lib exposes only one public class: `InfiniteScroll`.

## `InfiniteScroll`

```JavaScript
<InfiniteScroll
  appendMore={this.getMoreCards}
  prefixMore={this.refresh}
  isOnAppendLoading={this.state.isOnAppendLoading}
  isOnPrefixLoading={this.state.isOnPrefixLoading}
  isCloseAppendMore={this.state.isNoMore}
  appendMoreThreshold={20}
  pullingEnsureThreshold={80}
>
```

- `appendMore: () => void`: The scroller will invoke this method when scrolled cross the threshold.
- `prefixMore: () => void`: The same usage as `loadMore` but to prefix items to list.
- `isOnAppendLoading: boolean`: Indicate whether on append loading.
- `isOnPrefixLoading: boolean`: The same as append.
- `isCloseAppendMore: boolean`: Useful to close the load call when there is no more item to load.
- `appendMoreThreshold: number`: The threshold to the bottom of rendered list.
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
