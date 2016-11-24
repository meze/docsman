export default () => {
  const history = [];

  return {
    history,
    lastUrl: () => history[history.length - 1],
    push: (url) => { history.push(url); }
  };
};
