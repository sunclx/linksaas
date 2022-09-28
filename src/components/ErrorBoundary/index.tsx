import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactElement },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactElement }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {
  //   console.error(error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
