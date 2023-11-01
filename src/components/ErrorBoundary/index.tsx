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
      return <h1>页面出现了错误，请刷新页面。</h1>;
    }

    return this.props.children;
  }
}
