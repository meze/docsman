// @flow
import type { DocumentStateType } from '../modules/Document/actions/state';
import type { ProjectStateType } from '../modules/Project/actions/state';

export type TypedActionType<P> = {
  error?: false,
  type: string,
  payload: P
}

export type ActionType = TypedActionType<any>

export type StateType = {
  projects: ProjectStateType,
  documents: DocumentStateType
}

export type CallableStateType = () => StateType

// eslint-disable-next-line no-use-before-define
export type AsyncActionType = (dispatch: DispatchAsyncType, getState: CallableStateType) => ?Promise<*>
export type DispatchAsyncType = (action: AsyncActionType | ActionType) => ?Promise<*>

export type TypedAsyncActionType<A> = (dispatch: TypedDispatchType<A>, getState: CallableStateType) => ?Promise<*>
export type TypedDispatchType<-A> = (action: TypedAsyncActionType<A> | A) => ?Promise<*>
