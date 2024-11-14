var privateMap = new WeakMap();

function MyClass() {
  privateMap.set(this, {});
}

MyClass.prototype.map = function () {
  return privateMap.get(this);
};


if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, fromIndex) {
    if (this == null) throw new TypeError('"this" is null or not defined');
    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) return false;
    var k = Math.max(fromIndex | 0, 0);
    while (k < len) {
      if (o[k] === searchElement) return true;
      k++;
    }
    return false;
  };
}

if (!window.Promise) {
  window.Promise = function (fn) {
    var callbacks = [];
    fn(this._resolve.bind(this), this._reject.bind(this));
    this.then = function (onResolve) {
      callbacks.push(onResolve);
    };
    this._resolve = function (value) {
      callbacks.forEach(function (cb) { cb(value); });
    };
  };
}

if (!Array.from) {
  Array.from = function (iterable) {
    return [].slice.call(iterable);
  };
}

if (!window.Map) {
  window.Map = function () {
    this._map = {};
  };
  window.Map.prototype.set = function (key, value) {
    this._map[key] = value;
    return this;
  };
  window.Map.prototype.get = function (key) {
    return this._map[key];
  };
  window.Map.prototype.values = function () {
    var values = [];
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        values.push(this._map[key]);
      }
    }
    return values;
  };
}


var query = '';
var inputClass = '';
var timeoutId;

function correctWord(word) { 

  
  return fetch('https://search-module-chi.vercel.app/api/correct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: word })
  }).then(function (response) {

    return response.json();
  }).then(function (data) {
 
    
    if (data.incorrectWord && data.correctWord) {

      
      query = query.split(' ').map(function (w) {
        return w.toLowerCase() === data.incorrectWord.toLowerCase() ? data.correctWord : w;
      }).join(' ');

 
      
   
      document.getElementById('search-input').value = query;
      
      applyBlinkEffect();
    } else {
      console.log("Исправление не найдено или данные пусты.");
    }
  }).catch(function (error) {
    console.error("Ошибка при проверке слова:", error);
  });
}



function handleKeyDown(event) {
  if (event.key === ' ') {
    var words = query.trim().split(' ');
    var lastWord = words[words.length - 1];
    if (lastWord) {
      correctWord(lastWord);
    }
  }
}

function sortProducts(products, field, direction) {
  return products.slice().sort(function(a, b) {
    var valueA = a[field];
    var valueB = b[field];
    return direction === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
  });
}

function applyBlinkEffect() {
  inputClass = 'blinkInput';
  updateInputClass();
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    inputClass = '';
    updateInputClass();
  }, 2000);
}


function updateInputClass() {
  var inputElement = document.getElementById('search-input');
  if (inputElement) {
    inputElement.className = inputClass;
  }
}


function handleInputChange(event) {
  query = event.target.value;
}


document.getElementById('search-input').addEventListener('keydown', handleKeyDown);
document.getElementById('search-input').addEventListener('input', handleInputChange);


function filterProductsByPrice(products, priceRange) {
  return products.filter(function (product) {
    return product.price >= priceRange.min && product.price <= priceRange.max;
  });
}

function filterProductsByRating(products, ratingRange) {
  return products.filter(function (product) {
    return product.rating >= ratingRange.min && product.rating <= ratingRange.max;
  });
}


function fetchSuggestions(input) {
  return fetch('https://search-module-chi.vercel.app/api/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputWord: input })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    return data.suggestions || [];
  }).catch(function (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  });
}

function saveSearchQueryAndWords(query, userId) {
  if (!userId) return;
  var words = query.split(' ').filter(function (word) {
    return word.length >= 3;
  });
  fetch('https://search-module-chi.vercel.app/api/addSearchQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: userId, query: query })
  }).catch(function (error) {
    console.error('Error saving search query:', error);
  });
  fetch('https://search-module-chi.vercel.app/api/save-words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words: words })
  }).catch(function (error) {
    console.error('Error saving words:', error);
  });
}

function fetchSearchHistory(userId) {
  if (!userId) return Promise.resolve([]);
  return fetch('https://search-module-chi.vercel.app/api/get-user-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: userId })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    var history = data.history || [];
    return Array.from(new Map(history.map(function (item) {
      return [item.query, item];
    })).values()).slice(-5);
  }).catch(function (error) {
    console.error('Error fetching search history:', error);
    return [];
  });
}

function searchProducts(query, userId, priceRange, ratingRange) { 
  console.log('Starting product search...');
  console.log('Query:', query);
  console.log('User ID:', userId);
  console.log('Price Range:', priceRange);
  console.log('Rating Range:', ratingRange);

  return fetch('https://search-module-chi.vercel.app/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: query })
  })
  .then(function (response) {
    console.log('Response received from API:', response);
    if (!response.ok) {
      console.error('Response error:', response.status, response.statusText);
    }
    return response.json();
  })
  .then(function (products) {
    console.log('Products received from API:', products);

    var filteredByPrice = filterProductsByPrice(products, priceRange);
    console.log('Products after price filtering:', filteredByPrice);

    var filteredByRating = filterProductsByRating(filteredByPrice, ratingRange);
    console.log('Products after rating filtering:', filteredByRating);

    return filteredByPrice;
  })
  .catch(function (error) {
    console.error('Error searching products:', error);
    return [];
  });
}

