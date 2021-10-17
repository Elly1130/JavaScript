'use strict';
/*
In this challenge you will build a function 'whereAmI' which renders a country only based on GPS coordinates. For that, you will use a second API to geocode coordinates. So in this challenge, you’ll use an API on your own for the first time
Your tasks:
PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat') and a longitude value ('lng') (these are GPS coordinates, examples are in test data below).
2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do not use the 'getJSON' function we created, that is cheating
3. Once you have the data, take a look at it in the console to see all the attributes that you received about the provided location. Then, using this data, log a message like this to the console: “You are in Berlin, Germany”
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does not reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message
PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474
*/
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const { population, name, languages, flags, region, currencies } = data;

  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${flags.png}" />
  <div class="country__data">
  <h3 class="country__name">${name.common}</h3>
  <h4 class="country__region">${region.toUpperCase()}</h4>
  <p class="country__row"><span>👫</span>${
    (population / 1000000).toFixed(1) + 'M people'
  }</p>
      <p class="country__row"><span>🗣️</span>${
        languages[Object.keys(languages)[0]]
      }</p>
      <p class="country__row"><span>💰</span>${
        currencies[Object.keys(currencies)[0]].name
      }</p>
      </div>
      </article>
      `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};

const whereAmI = function (lat, lng) {
  // const api = fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  // console.log(api);
  getJSON(
    `https://geocode.xyz/${lat},${lng}?geoit=json`,
    `You reloaded too fast`
  )
    .then(res => {
      console.log(`You are in ${res.city}, ${res.country}`);
      return getJSON(
        `https://restcountries.com/v3.1/name/${res.country}`,
        `Country not found`
      );
    })
    .then(res => {
      renderCountry(res[0]);
      const hasNeighbour = res[0]?.borders;
      // const neighbour = 'asdasd';

      if (!hasNeighbour) throw new Error(`No neighbour found!`);
      const neighbour = hasNeighbour[0];
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Neighbour country not found'
      );
    })
    .then(res => renderCountry(res[0], 'neighbour'))
    .catch(err => console.log(err.message))
    .finally(() => (countriesContainer.style.opacity = 1));
};

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);
