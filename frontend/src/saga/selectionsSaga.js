import { takeEvery, put } from 'redux-saga/effects';

const fetchSelectionAPI = {
  allSelections: () => {
    return fetch('/api/selections', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(selections => selections)
      .catch(err => console.log(`Can't load the list of selections: ${err}`));
  },
  singleSelection: (id) => {
    return fetch(`/api/selections/${id}`)
      .then(res => res.json())
      .then(selection => selection)
      .catch(err => console.log(`Can't load a single conversation: ${err}`));
  },
  addSelection: (body) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return fetch('/api/selections', {
      method: 'post',
      headers,
      body,
    })
      .then(res => res.json())
      .then(selection => selection)
      .catch(err => console.log(`Houston, we'we got a problem: ${err}`));
  },
  deleteSelection: (id) => {
    return fetch(`/api/selections/${id}`, {
      method: 'delete',
    })
      .then(res => res.json())
      .then(selection => selection)
      .catch(err => console.log(`Houston, we'we got a problem: ${err}`));
  },
};

function* getAllSelections() {
  const result = yield fetchSelectionAPI.allSelections();
  yield put({ type: 'GET_ALL_SELECTIONS_SUCCESS', payload: result });
}

function* getSingleSelection(action) {
  const result = yield fetchSelectionAPI.singleSelection(action.payload.id);
  yield put({ type: 'GET_SINGLE_SELECTION_SUCCESS', payload: result });
}

function* addSelection(action) {
  const result = yield fetchSelectionAPI.addSelection(action.payload.body);
  yield put({ type: 'ADD_SELECTION_SUCCESS', payload: result });
}

function* deleteSelection(action) {
  const result = yield fetchSelectionAPI.deleteSelection(action.payload.id);
  yield put({ type: 'DELETE_SELECTION_SUCCESS', payload: result });
}

export default function* selectionsSaga() {
  yield takeEvery('GET_ALL_SELECTIONS', getAllSelections);
  yield takeEvery('GET_SINGLE_SELECTION', getSingleSelection);
  yield takeEvery('ADD_SELECTION', addSelection);
  yield takeEvery('DELETE_SELECTION', deleteSelection);
}
