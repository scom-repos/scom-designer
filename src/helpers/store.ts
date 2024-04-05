interface IState {
  breakpoint: number|undefined;
}

const state: IState = {
  breakpoint: undefined
}

const setBreakpoint = (breakpoint: number) => {
  state.breakpoint = breakpoint;
}

const getBreakpoint = () => {
  return state.breakpoint;
}

export {
  setBreakpoint,
  getBreakpoint
}
