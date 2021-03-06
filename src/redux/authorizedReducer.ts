import {UserProfileType} from "./profileReducer";
import {api} from "../api/api";
import {AppThunk} from "./store";

export type AuthorizedUserType = {
    id: null | number
    email: null | string
    login: null | string

}
type InitialStateType = typeof initialState
export type ActionAuthorizedReducerType =
    ReturnType<typeof setIsLoading>
    | ReturnType<typeof setAuthorizedUser>
    | ReturnType<typeof setAuthorizedStatus>
    | ReturnType<typeof setAuthorizedProfileUser>


let initialState = {
    isLoading: false,
    authorizedStatus: 'initialization' as StatusAuthorizedType,
    authorizedUser: {
        id: null,
        email: null,
        login: null
    } as AuthorizedUserType,
    authorizedProfileUser: {
        photos: {small: null}
    } as UserProfileType,
}

const IS_LOADING = 'IS_LOADING'
const SET_AUTHORIZED_USER = 'SET_AUTHORIZED_USER'
const SET_AUTHORIZED_CODE = 'SET_AUTHORIZED_CODE'
const SET_AUTHORIZED_PROFILE_USER = 'SET_AUTHORIZED_PROFILE_USER'

export const authorizedReducer = (state = initialState, action: ActionAuthorizedReducerType): InitialStateType => {
    switch (action.type) {
        case IS_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case SET_AUTHORIZED_USER:
            return {
                ...state,
                authorizedUser: {...action.user},
            }
        case SET_AUTHORIZED_PROFILE_USER:
            return {
                ...state,
                authorizedProfileUser: action.payload
            }
        case SET_AUTHORIZED_CODE:
            return {
                ...state,
                authorizedStatus: action.payload
            }
        default:
            return state
    }
}

export type StatusAuthorizedType = 'successfully' | 'initialization' | 'fail'


export const setIsLoading = (payload: boolean) => ({type: IS_LOADING, payload}) as const
export const setAuthorizedUser = (user: AuthorizedUserType) => ({type: SET_AUTHORIZED_USER, user}) as const
export const setAuthorizedStatus = (payload: StatusAuthorizedType) => ({type: SET_AUTHORIZED_CODE, payload}) as const
export const setAuthorizedProfileUser = (payload: UserProfileType) => ({
    type: SET_AUTHORIZED_PROFILE_USER,
    payload
}) as const


export const fetchAuthorizedData = (): AppThunk => async dispatch => {
    try {
        dispatch(setIsLoading(true))
        let response = await api.authorizedMe()
        if (response.resultCode === 0) {
            dispatch(setAuthorizedUser(response.data))
            dispatch(setAuthorizedStatus('successfully'))
            let responseUser = await api.getUserProfile(response.data.id)
            dispatch(setAuthorizedProfileUser(responseUser))
        } else {
            dispatch(setAuthorizedStatus('fail'))
        }
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const fetchAuthorization = (email: string, password: string, setStatus: any): AppThunk => async dispatch => {
    try {
        dispatch(setIsLoading(true))
        let response = await api.authorize(email, password)
        if (response.resultCode === 0) {
            dispatch(fetchAuthorizedData())
        } else if (response.resultCode !== 0) {
            setStatus(response.messages[0])
        }
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setIsLoading(false))
    }
}
export const fetchLogout = (): AppThunk => async dispatch => {
    try {
        dispatch(setIsLoading(true))
        let response = await api.logout()
        if (response.resultCode === 0) {
            dispatch(fetchAuthorizedData())
        }
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setIsLoading(false))
    }
}
