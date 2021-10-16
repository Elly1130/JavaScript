'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elavationGain) {
    super(coords, distance, duration);
    this.elavationGain = elavationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this;
  }
}

///////////////////////////////////////////////////////////////////////////////

// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    // Get user position
    this._getPosition();

    // Get local storage data
    this._getLocalStorage();

    // Attach event handler
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElavationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // sucess to get location
        this._loadMap.bind(this),
        // fail to get location
        function () {
          alert(`Could not get your position`);
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElavationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const allPositive = (...inputs) => inputs.every(input => input > 0);
    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert(`Inputs have to be positive numbers`);

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If cycling, create cycling object
    if (type === 'cycling') {
      const elavation = +inputElevation.value;
      // Check data is valid
      if (
        !validInputs(distance, duration, elavation) ||
        !allPositive(distance, duration)
      )
        return alert(`Inputs have to be positive numbers`);

      workout = new Cycling([lat, lng], distance, duration, elavation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render the workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render the workout on list
    this._renderWorkout(workout);

    // Hide form + Clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? `🏃‍♂️` : `🚴‍♀️`} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    const workoutType = workout.type;
    let workoutDiv = `
      <li class="workout workout--${workoutType}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workoutType === 'running' ? `🏃‍♂️` : `🚴‍♀️`
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${
            workoutType === 'running'
              ? `${workout?.pace.toFixed(2)}`
              : `${workout?.speed.toFixed(2)}`
          }</span>
          <span class="workout__unit">${
            workoutType === 'running' ? `min/km` : `km/h`
          }</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">${
            workoutType === 'running' ? `🦶🏼` : `⛰`
          }</span>
          <span class="workout__value">${
            workoutType === 'running'
              ? `${workout?.cadence}`
              : `${workout?.elavationGain}`
          }</span>
          <span class="workout__unit">${
            workoutType === 'running' ? `spm` : `m`
          }</span>
        </div>
      </li>
    `;

    form.insertAdjacentHTML('afterend', workoutDiv);
  }

  _moveToPopup(e) {
    if (e.target.closest('.workout')) {
      const targetId = e.target.closest('.workout').dataset.id;
      const targetWorkout = this.#workouts.find(work => targetId === work.id);
      const [lat, lng] = targetWorkout.coords;
      this.#map.setView([lat, lng], 15, {
        animate: true,
        pan: {
          duration: 1,
        },
      });
    }
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const [...data] = JSON.parse(localStorage.getItem('workouts'));

    // Rebuild running and cycling objects
    const updatedData = data.map(work =>
      work.type === 'running'
        ? new Running(
            [...work.coords],
            work.distance,
            work.duration,
            work.cadence
          )
        : new Cycling(
            [...work.coords],
            work.distance,
            work.duration,
            work.elavationGain
          )
    );

    if (!updatedData) return;

    this.#workouts = updatedData;

    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  _editWorkout() {}

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
