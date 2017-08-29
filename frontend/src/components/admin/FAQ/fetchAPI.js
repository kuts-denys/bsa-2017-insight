function getFAQ() {
  const url = 'http://localhost:3000/api/faq';
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: null,
    method: 'GET'
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

function getFAQById(id) {
  const url = 'http://localhost:3000/api/faq/' + id;
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: null,
    method: 'GET'
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

function addFAQ(Body) {
  const url = 'http://localhost:3000/api/faq';
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Body),
    method: 'POST'
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

function modifyFAQ(id, Body) {
  const url = 'http://localhost:3000/api/faq/' + id;
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    path: 'http://localhost:3000/api/faq/' + id,
    body: JSON.stringify(Body),
    method: 'PUT'
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("MODIFY FAQ");
      console.log(data);
      return data;
    });
}

function deleteFAQ(id) {
  const url = 'http://localhost:3000/api/faq/' + id;
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: null,
    method: 'DELETE'
  };
  return fetch(url, requestOptions)
    .then((response) => {
      return response.json();
    });
}

export { getFAQ, addFAQ, deleteFAQ, getFAQById, modifyFAQ };
