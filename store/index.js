// store/index.js
export const state = () => ({
    errorMessage: '',
    animeSearch: '',
    animeExist: true,
    isFetching: false,
    userNickname: 'User',
    resetPassword: false,
    isAnimePageError: false,
});

export const mutations = {
    SET_ANIME_PAGE_ERROR(state, value) {
        state.isAnimePageError = value
    },

    SET_ERROR_MESSAGE(state, value) {
        state.errorMessage = value;
    },
    SET_ANIME_SEARCH(state, value) {
        state.animeSearch = value
    },
    SET_ANIME_EXIST(state, value) {
        state.animeExist = value
    },
    SET_FETCHING(state, value) {
        state.isFetching = value
    },
    SET_NICKNAME(state, value) {
        state.userNickname = value
    },
    SET_RESET_PASSWROD(state, value) {
        state.resetPassword = value
    },
};

export const actions = {
    animePageError({ commit }, isError) {
        commit('SET_ANIME_PAGE_ERROR', isError)
    },

    sendErrorMessage({ commit }, message) {
        commit('SET_ERROR_MESSAGE', message)
    },

    animeSearched({ commit }, anime) {
        commit('SET_ANIME_SEARCH', anime)
    },

    animeExist({ commit }, isExist) {
        commit('SET_ANIME_EXIST', isExist)
    },

    animeFetch({ commit }, isFetch) {
        commit('SET_FETCHING', isFetch)
    },

    setUserNickname({ commit }, nickname) {
        commit('SET_NICKNAME', nickname)
    },

    isResetPassword({ commit }, isReset) {
        if (!state.resetPassword) {
            commit('SET_RESET_PASSWROD', isReset)
        }
        return commit('SET_RESET_PASSWROD', isReset)
    }
}