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
  return products.slice().sort(function (a, b) {
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
    
    if (product.rating === undefined || product.rating === null) {
      return true; 
    }
    
    return product.rating >= ratingRange.min && product.rating <= ratingRange.max;
  });
}

function filterProductsByColor(products, selectedColors) {
  if (!selectedColors || selectedColors.length === 0) {
    return products; 
  }
  return products.filter(function (product) {
    return selectedColors.includes(product.color.toLowerCase());
  });
}

function filterProductsBySize(products, selectedSizes) {
  if (!selectedSizes || selectedSizes.length === 0) {
    return products; 
  }
  return products.filter(function (product) {
    
    return selectedSizes.includes(product.size);
  });
}


function filterProductsByManufacturer(products, selectedManufacturers) {
  if (!selectedManufacturers || selectedManufacturers.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedManufacturers.includes(product.manufacturer);
  });
}


function filterProductsByMaterial(products, selectedMaterials) {
  if (!selectedMaterials || selectedMaterials.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedMaterials.includes(product.material);
  });
}


function filterProductsByEnergyEfficiency(products, selectedEfficiency) {
  if (!selectedEfficiency || selectedEfficiency.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedEfficiency.includes(product.energyEfficiency);
  });
}


function filterProductsByStockStatus(products, selectedStatuses) {
  if (!selectedStatuses || selectedStatuses.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedStatuses.includes(product.stockStatus);
  });
}


function filterProductsByNumberOfReviews(products, reviewRange) {
  if (!reviewRange) {
    return products;
  }
  return products.filter(function (product) {
    return product.reviews >= reviewRange.min && product.reviews <= reviewRange.max;
  });
}


function filterProductsByCondition(products, selectedConditions) {
  if (!selectedConditions || selectedConditions.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedConditions.includes(product.condition);
  });
}


function filterProductsByWeight(products, weightRange) {
  if (!weightRange) {
    return products;
  }
  return products.filter(function (product) {
    return product.weight >= weightRange.min && product.weight <= weightRange.max;
  });
}


function filterProductsByUsageType(products, selectedUsageTypes) {
  if (!selectedUsageTypes || selectedUsageTypes.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedUsageTypes.includes(product.usageType);
  });
}


function filterProductsBySeasonalTrends(products, selectedTrends) {
  if (!selectedTrends || selectedTrends.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return selectedTrends.includes(product.seasonalTrend);
  });
}


function filterProductsByWarranty(products, warrantyRange) {
  if (!warrantyRange) {
    return products;
  }
  return products.filter(function (product) {
    
    return product.warranty >= warrantyRange.min && product.warranty <= warrantyRange.max;
  });
}


function filterProductsByDiscount(products, discountRange) {
  if (!discountRange) {
    return products;
  }
  return products.filter(function (product) {
    
    return product.discount >= discountRange.min && product.discount <= discountRange.max;
  });
}

function filterProductsByDateAdded(products, dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) {
    return products; 
  }
  return products.filter(function (product) {
    const productDate = new Date(product.dateAdded); 
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    
    if (startDate && productDate < startDate) {
      return false;
    }
    if (endDate && productDate > endDate) {
      return false;
    }
    return true;
  });
}


function filterProductsByFreeShipping(products, freeShipping) {
  if (freeShipping === undefined || freeShipping === null) {
    return products; 
  }
  return products.filter(function (product) {
    return product.freeShipping === freeShipping; 
  });
}


function filterProductsByEcoFriendly(products, ecoFriendly) {
  if (ecoFriendly === undefined || ecoFriendly === null) {
    return products; 
  }
  return products.filter(function (product) {
    return product.ecoFriendly === ecoFriendly; 
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

function searchProducts(
  query,
  userId,
  priceRange,
  ratingRange,
  selectedColors,
  selectedSizes,
  selectedManufacturers,
  selectedMaterials,
  selectedEfficiency,
  selectedStatuses,
  reviewRange,
  selectedConditions,
  weightRange,
  selectedUsageTypes,
  selectedTrends,
  warrantyRange,
  discountRange,
  dateRange,
  freeShipping, 
  ecoFriendly 
) {
  console.log('Starting product search...');
  console.log('Query:', query);

  return fetch('https://search-module-chi.vercel.app/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: query })
  })
    .then(function (response) {
      if (!response.ok) {
        console.error('Response error:', response.status, response.statusText);
      }
      return response.json();
    })
    .then(function (products) {
      var filteredByPrice = filterProductsByPrice(products, priceRange);
      var filteredByRating = filterProductsByRating(filteredByPrice, ratingRange);
      var filteredByColor = filterProductsByColor(filteredByRating, selectedColors);
      var filteredBySize = filterProductsBySize(filteredByColor, selectedSizes);
      var filteredByManufacturer = filterProductsByManufacturer(filteredBySize, selectedManufacturers);
      var filteredByMaterial = filterProductsByMaterial(filteredByManufacturer, selectedMaterials);
      var filteredByEfficiency = filterProductsByEnergyEfficiency(filteredByMaterial, selectedEfficiency);
      var filteredByStockStatus = filterProductsByStockStatus(filteredByEfficiency, selectedStatuses);
      var filteredByReviews = filterProductsByNumberOfReviews(filteredByStockStatus, reviewRange);
      var filteredByCondition = filterProductsByCondition(filteredByReviews, selectedConditions);
      var filteredByWeight = filterProductsByWeight(filteredByCondition, weightRange);
      var filteredByUsageType = filterProductsByUsageType(filteredByWeight, selectedUsageTypes);
      var filteredBySeasonalTrends = filterProductsBySeasonalTrends(filteredByUsageType, selectedTrends);
      var filteredByWarranty = filterProductsByWarranty(filteredBySeasonalTrends, warrantyRange);
      var filteredByDiscount = filterProductsByDiscount(filteredByWarranty, discountRange);
      var filteredByDateAdded = filterProductsByDateAdded(filteredByDiscount, dateRange);
      var filteredByFreeShipping = filterProductsByFreeShipping(filteredByDateAdded, freeShipping);
      var filteredByEcoFriendly = filterProductsByEcoFriendly(filteredByFreeShipping, ecoFriendly);

      console.log('Products after filtering:', filteredByEcoFriendly);

      return filteredByEcoFriendly;
    })
    .catch(function (error) {
      console.error('Error searching products:', error);
      return [];
    });
}