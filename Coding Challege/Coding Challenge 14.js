'use strict';

const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// 🔴Delayed Departure from FAO to TXL (11h25)
//              Arrival from BRU to FAO (11h45)
//   🔴Delayed Arrival from HEL to FAO (11h25)
//            Departure from FAO to LIS (12h30)

const flight = flights.split('+');
for (const each of flight) {
  const [label, departure, arrival, time] = each.split(';');
  const output = `${label.startsWith('_Delayed') ? '🔴' : ''}${label
    .replaceAll('_', ' ')
    .trim()} from ${departure.slice(0, 3).toUpperCase()} to ${arrival
    .slice(0, 3)
    .toUpperCase()} (${time.replace(':', 'h')})`.padStart(43);
  console.log(output);
}

// const flight = flights.split('+');
// for (const each of flight) {
//   let [label, departure, arrival, time] = each.split(';');
//   label = label.split('_').join(' ').trim();
//   label = (label.startsWith('Delayed') ? '🔴' : '') + label;
//   departure = departure.slice(0, 3).toUpperCase();
//   arrival = arrival.slice(0, 3).toUpperCase();
//   time = time.split(':').join('h');
//   const message = [label, 'from', departure, 'to', arrival, `(${time})`].join(
//     ' '
//   );
//   console.log(message.padStart(45));
// }
