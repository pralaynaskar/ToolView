import { useState, useCallback, useMemo } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useHistory = <T>(initialState: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = useMemo(() => state.past.length > 0, [state.past]);
  const canRedo = useMemo(() => state.future.length > 0, [state.future]);

  const set = useCallback((newPresent: T) => {
    setState(currentState => {
      const { past, present } = currentState;
      if (newPresent === present) {
        return currentState;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (past.length === 0) {
        return currentState;
      }
      const newPresent = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: newPresent,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (future.length === 0) {
        return currentState;
      }
      const newPresent = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);
  
  const reset = useCallback((newInitialState: T) => {
      setState({
          past: [],
          present: newInitialState,
          future: [],
      })
  }, [])

  return { state: state.present, set, undo, redo, reset, canUndo, canRedo };
};
